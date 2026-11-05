import cors from "cors";
import { ENV } from "./env.js";

const allowedOrigins = ENV.IS_PROD
  ? ENV.CLIENT_ORIGINS
  : [...ENV.CLIENT_ORIGINS, "http://localhost:3000", "http://127.0.0.1:3000"];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
