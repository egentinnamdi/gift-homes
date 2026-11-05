import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { sendError } from "../utils/api-response.js";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    sendError(res, "Validation failed", 400, formattedErrors);
    return;
  }

  // Handle generic unknown errors
  console.error("Unhandled Error:", err);
  sendError(
    res,
    process.env.NODE_ENV === "production"
      ? "An unexpected internal server error occurred"
      : err.message,
    500
  );
}

export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
