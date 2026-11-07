import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { corsOptions } from "./config/cors.js";
import { ENV } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  if (ENV.TRUST_PROXY) app.set("trust proxy", ENV.TRUST_PROXY);

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  // Rate limiting (per client IP)
  const limiter = (windowMin: number, max: number, message: string) =>
    rateLimit({
      windowMs: windowMin * 60_000,
      limit: max,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { success: false, message },
      skip: () => ENV.NODE_ENV === "test",
    });
  app.use(ENV.API_PREFIX, limiter(15, 600, "Too many requests. Please slow down."));
  app.use(`${ENV.API_PREFIX}/auth/login`, limiter(15, 20, "Too many sign-in attempts. Try again in 15 minutes."));
  app.use(`${ENV.API_PREFIX}/auth/register`, limiter(60, 15, "Too many sign-ups from this network. Try again later."));
  app.use(`${ENV.API_PREFIX}/auth/forgot-password`, limiter(60, 5, "Too many reset requests. Try again in an hour."));
  app.use(`${ENV.API_PREFIX}/auth/reset-password`, limiter(60, 10, "Too many attempts. Try again in an hour."));
  app.use(`${ENV.API_PREFIX}/enquiries`, limiter(60, 15, "Too many submissions. Please try again later."));

  if (ENV.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Root Welcome route
  app.get("/", (_req, res) => {
    res.json({
      name: "GiftHomes Enugu Real Estate API",
      version: "1.0.0",
      description: "Backend service for verified real estate listings in Enugu, Nigeria",
      docs: `${ENV.API_PREFIX}/health`,
    });
  });

  // Mount API Router
  app.use(ENV.API_PREFIX, apiRouter);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
