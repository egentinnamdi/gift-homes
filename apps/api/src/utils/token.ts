import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import type { UserRole } from "@gift-homes/shared";

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as unknown as TokenPayload;
}
