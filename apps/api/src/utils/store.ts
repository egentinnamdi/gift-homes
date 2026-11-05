import fs from "node:fs";
import path from "node:path";
import { ENV } from "../config/env.js";

/**
 * Tiny JSON-file persistence layer. Each collection is a top-level key.
 * Writes are atomic (temp file + rename). Swap for a real DB later by
 * re-implementing `loadCollection` / `saveCollection`.
 */
const filePath = path.resolve(process.cwd(), ENV.DATA_FILE);
let cache: Record<string, unknown[]> | null = null;

function read(): Record<string, unknown[]> {
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

export function loadCollection<T>(name: string, seed: () => T[]): T[] {
  const db = read();
  if (!db[name]) {
    db[name] = seed();
    flush();
  }
  return db[name] as T[];
}

export function saveCollection(): void {
  flush();
}
