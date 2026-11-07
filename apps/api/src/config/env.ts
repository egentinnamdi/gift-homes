import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

const defaultDataFile = "data/db.json";
const publicSite =
  process.env.CLIENT_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const DEV_JWT = "dev-only-insecure-secret-change-me";
const DEFAULT_ADMIN_PASSWORD = "Admin@12345";

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV,
  IS_PROD: isProd,
  /** One or more comma-separated origins, e.g. https://gifthomes.ng,https://www.gifthomes.ng */
  CLIENT_URL: publicSite.split(",")[0].trim(),
  CLIENT_ORIGINS: publicSite
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean),
  API_PREFIX: process.env.API_PREFIX || "/api/v1",
  JWT_SECRET: process.env.JWT_SECRET || DEV_JWT,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  /** Postgres connection string (Neon). When unset, a local JSON file is used (development only). */
  DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
  DATA_FILE: process.env.DATA_FILE || defaultDataFile,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "giftedproperties2@gmail.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  MAIL_FROM: process.env.MAIL_FROM || "GiftHomes <giftedproperties2@gmail.com>",
  /** Where customer replies to admin emails land. Defaults to the SMTP user / sender. */
  MAIL_REPLY_TO: process.env.MAIL_REPLY_TO || "",
  /** Set to the number of reverse proxies in front of the API (e.g. 1 on most PaaS hosts). */
  TRUST_PROXY: process.env.TRUST_PROXY ? parseInt(process.env.TRUST_PROXY, 10) : isProd ? 1 : 0,
  RESET_TOKEN_TTL_MINUTES: 60,
};

if (isProd) {
  const problems: string[] = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEV_JWT || process.env.JWT_SECRET.length < 32) {
    problems.push("JWT_SECRET must be set to a random string of at least 32 characters");
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === DEFAULT_ADMIN_PASSWORD) {
    problems.push("ADMIN_PASSWORD must be set to something other than the default");
  }
  if (!ENV.DATABASE_URL) problems.push("DATABASE_URL must be set (Postgres/Neon) so data persists");
  if (!ENV.SMTP_HOST) problems.push("SMTP_HOST (and credentials) must be set so emails can be sent");
  if (ENV.CLIENT_ORIGINS.some((o) => o.startsWith("http://localhost"))) {
    problems.push("CLIENT_URL must be your public website URL, not localhost");
  }
  if (problems.length) {
    throw new Error(`Invalid production configuration:\n - ${problems.join("\n - ")}`);
  }
}
