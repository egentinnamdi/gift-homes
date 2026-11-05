import bcrypt from "bcryptjs";
import { User, LoginDTO, RegisterDTO } from "@gift-homes/shared";
import { UserModel, toPublicUser } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { signToken } from "../utils/token.js";
import { PasswordResetModel } from "../models/password-reset.model.js";
import { sendMail } from "../utils/mailer.js";
import { emails, clientUrl } from "../utils/email-template.js";
import { ENV } from "../config/env.js";

export class AuthService {
  static login(dto: LoginDTO): { user: User; token: string } {
    if (!dto.email || !dto.password) {
      throw AppError.badRequest("Email and password are required");
    }
    const stored = UserModel.findStoredByEmail(dto.email);
    if (!stored || !bcrypt.compareSync(dto.password, stored.passwordHash)) {
      throw AppError.unauthorized("Invalid email or password");
    }
    return {
      user: toPublicUser(stored),
      token: signToken({ sub: stored.id, role: stored.role }),
    };
  }

  static register(dto: RegisterDTO): { user: User; token: string } {
    if (!dto.email || !dto.name) throw AppError.badRequest("Name and email are required");
    if (!dto.password || dto.password.length < 8) {
      throw AppError.badRequest("Password must be at least 8 characters");
    }
    if (UserModel.findStoredByEmail(dto.email)) {
      throw AppError.badRequest("A user with this email already exists");
    }
    const user = UserModel.create({ ...dto, password: dto.password });
    return { user, token: signToken({ sub: user.id, role: user.role }) };
  }

  /** Always resolves silently so callers cannot discover which emails are registered. */
  static async requestPasswordReset(email: string): Promise<void> {
    if (!email) throw AppError.badRequest("Email is required");
    const stored = UserModel.findStoredByEmail(email);
    if (!stored) return;
    const token = PasswordResetModel.issue(stored.id);
    const link = clientUrl(`/reset-password?token=${token}`);
    const { html, text } = emails.passwordReset(stored.name, link, ENV.RESET_TOKEN_TTL_MINUTES);
    try {
      await sendMail({
        to: stored.email,
        subject: "Reset your GiftHomes password",
        text,
        html,
      });
    } catch (err) {
      console.error("Failed to send reset email:", err);
    }
  }

  static resetPassword(token: string, password: string): void {
    if (!token) throw AppError.badRequest("Reset token is required");
    if (!password || password.length < 8) {
      throw AppError.badRequest("Password must be at least 8 characters");
    }
    const userId = PasswordResetModel.consume(token);
    if (!userId || !UserModel.setPassword(userId, password)) {
      throw AppError.badRequest("This reset link is invalid or has expired");
    }
  }
}
