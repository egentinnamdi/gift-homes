import { Response } from "express";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Operation successful",
  statusCode = 200,
  meta?: PaginationMeta | Record<string, unknown>
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}
