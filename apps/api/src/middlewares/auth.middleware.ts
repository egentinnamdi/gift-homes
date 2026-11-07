import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/token.js";
import { UserModel } from "../models/user.model.js";
import type { User } from "@gift-homes/shared";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Authentication required"));
  }
  try {
    const payload = verifyToken(header.slice(7));
    const user = await UserModel.findById(payload.sub);
    if (!user) return next(AppError.unauthorized("Account no longer exists"));
    req.user = user;
    next();
  } catch {
    next(AppError.unauthorized("Invalid or expired session"));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== "admin") {
    return next(AppError.forbidden("Administrator access required"));
  }
  next();
}
