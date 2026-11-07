import crypto from "node:crypto";
import { collection } from "../utils/store.js";
import { ENV } from "../config/env.js";

interface ResetRecord {
  id: string; // sha256 of the token
  userId: string;
  expiresAt: number;
}

const resets = collection<ResetRecord>("password_resets", { order: "asc" });
const hash = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export class PasswordResetModel {
  /** Creates a single-use token (replacing any earlier one for the user). Returns the raw token. */
  static async issue(userId: string): Promise<string> {
    const now = Date.now();
    for (const r of await resets.list()) {
      if (r.userId === userId || r.expiresAt < now) await resets.remove(r.id);
    }
    const token = crypto.randomBytes(32).toString("hex");
    await resets.insert({
      id: hash(token),
      userId,
      expiresAt: now + ENV.RESET_TOKEN_TTL_MINUTES * 60_000,
    });
    return token;
  }

  /** Validates and consumes a token, returning the user id. */
  static async consume(token: string): Promise<string | undefined> {
    const rec = await resets.get(hash(token));
    if (!rec) return undefined;
    // Removing first makes the token single-use even under concurrent attempts.
    if (!(await resets.remove(rec.id))) return undefined;
    return rec.expiresAt >= Date.now() ? rec.userId : undefined;
  }
}
