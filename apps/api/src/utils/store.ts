import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { ENV } from "../config/env.js";

/**
 * Persistence layer. Every collection stores JSON documents with a string `id`.
 *  - With DATABASE_URL set (Neon / any Postgres) documents live in a Postgres table per collection.
 *  - Without it, documents live in a local JSON file (development only).
 * Items are returned in display order: for `order: "desc"` the newest item comes first.
 */
export interface Collection<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  /** Case-insensitive match on a top-level string field. */
  findBy(field: string, value: string): Promise<T | undefined>;
  insert(item: T): Promise<void>;
  replace(item: T): Promise<void>;
  remove(id: string): Promise<boolean>;
}

interface Options<T> {
  order?: "asc" | "desc";
  seed?: () => T[] | Promise<T[]>;
}

const SAFE_NAME = /^[a-z_]+$/;

// ---------------- Postgres (Neon) ----------------
const sql = ENV.DATABASE_URL ? neon(ENV.DATABASE_URL) : null;

function pgCollection<T extends { id: string }>(name: string, opts: Options<T>): Collection<T> {
  if (!SAFE_NAME.test(name)) throw new Error(`Invalid collection name: ${name}`);
  const table = `gh_${name}`;
  const desc = opts.order === "desc";
  let ready: Promise<void> | null = null;

  const q = <R = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    sql!.query(text, params) as Promise<R[]>;

  const ensure = () =>
    (ready ??= (async () => {
      await q(
        `CREATE TABLE IF NOT EXISTS ${table} (
           seq BIGSERIAL PRIMARY KEY,
           id TEXT UNIQUE NOT NULL,
           data JSONB NOT NULL,
           created_at TIMESTAMPTZ NOT NULL DEFAULT now()
         )`
      );
      if (opts.seed) {
        const [{ count }] = await q<{ count: string }>(`SELECT count(*)::text AS count FROM ${table}`);
        if (Number(count) === 0) {
          const items = await opts.seed();
          // For desc collections the first seed item should display first => insert it last.
          for (const item of desc ? [...items].reverse() : items) {
            await q(`INSERT INTO ${table} (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`, [
              item.id,
              JSON.stringify(item),
            ]);
          }
        }
      }
    })().catch((e) => {
      ready = null; // allow retry on the next request
      throw e;
    }));

  return {
    async list() {
      await ensure();
      const rows = await q<{ data: T }>(`SELECT data FROM ${table} ORDER BY seq ${desc ? "DESC" : "ASC"}`);
      return rows.map((r) => r.data);
    },
    async get(id) {
      await ensure();
      const rows = await q<{ data: T }>(`SELECT data FROM ${table} WHERE id = $1`, [id]);
      return rows[0]?.data;
    },
    async findBy(field, value) {
      await ensure();
      const rows = await q<{ data: T }>(
        `SELECT data FROM ${table} WHERE lower(data->>$1) = lower($2) LIMIT 1`,
        [field, value]
      );
      return rows[0]?.data;
    },
    async insert(item) {
      await ensure();
      await q(`INSERT INTO ${table} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
    },
    async replace(item) {
      await ensure();
      await q(`UPDATE ${table} SET data = $2 WHERE id = $1`, [item.id, JSON.stringify(item)]);
    },
    async remove(id) {
      await ensure();
      const rows = await q(`DELETE FROM ${table} WHERE id = $1 RETURNING id`, [id]);
      return rows.length > 0;
    },
  };
}

// ---------------- Local JSON file (development) ----------------
const filePath = path.resolve(process.cwd(), ENV.DATA_FILE);
let cache: Record<string, unknown[]> | null = null;

function readFile(): Record<string, unknown[]> {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    cache = {};
  }
  return cache!;
}

function flush(): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
  fs.renameSync(tmp, filePath);
}

function fileCollection<T extends { id: string }>(name: string, opts: Options<T>): Collection<T> {
  const desc = opts.order === "desc";
  let seeded: Promise<T[]> | null = null;

  const items = (): Promise<T[]> =>
    (seeded ??= (async () => {
      const db = readFile();
      if (!db[name]) {
        db[name] = opts.seed ? await opts.seed() : [];
        flush();
      }
      return db[name] as T[];
    })());

  return {
    async list() {
      return [...(await items())];
    },
    async get(id) {
      return (await items()).find((x) => x.id === id);
    },
    async findBy(field, value) {
      const v = value.toLowerCase();
      return (await items()).find((x) => String((x as Record<string, unknown>)[field] ?? "").toLowerCase() === v);
    },
    async insert(item) {
      const arr = await items();
      if (desc) arr.unshift(item);
      else arr.push(item);
      flush();
    },
    async replace(item) {
      const arr = await items();
      const i = arr.findIndex((x) => x.id === item.id);
      if (i !== -1) arr[i] = item;
      flush();
    },
    async remove(id) {
      const arr = await items();
      const i = arr.findIndex((x) => x.id === id);
      if (i === -1) return false;
      arr.splice(i, 1);
      flush();
      return true;
    },
  };
}

export function collection<T extends { id: string }>(name: string, opts: Options<T> = {}): Collection<T> {
  return sql ? pgCollection<T>(name, opts) : fileCollection<T>(name, opts);
}
