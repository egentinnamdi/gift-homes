import crypto from "node:crypto";
import { loadCollection, saveCollection } from "../utils/store.js";
import { ENV } from "../config/env.js";

interface ResetRecord {
  userId: string;
  tokenHash: string;
  expiresAt: number;
}

const resets = loadCollection<ResetRecord>("passwordResets", () => []);
const hash = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export class PasswordResetModel {
  /** Creates a single-use token (replacing any earlier one for the user). Returns the raw token. */
  static issue(userId: string): string {
    this.purgeExpired();
    for (let i = resets.length - 1; i >= 0; i--) if (resets[i].userId === userId) resets.splice(i, 1);
    const token = crypto.randomBytes(32).toString("hex");
    resets.push({
      userId,
      tokenHash: hash(token),
      expiresAt: Date.now() + ENV.RESET_TOKEN_TTL_MINUTES * 60_000,
    });
    saveCollection();
    return token;
  }

  /** Validates and consumes a token, returning the user id. */
  static consume(token: string): string | undefined {
    this.purgeExpired();
    const h = hash(token);
    const i = resets.findIndex((r) => r.tokenHash === h);
    if (i === -1) return undefined;
    const { userId } = resets[i];
    resets.splice(i, 1);
    saveCollection();
    return userId;
  }

  private static purgeExpired() {
    const now = Date.now();
    for (let i = resets.length - 1; i >= 0; i--) if (resets[i].expiresAt < now) resets.splice(i, 1);
  }
}
