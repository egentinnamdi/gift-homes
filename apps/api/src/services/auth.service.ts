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
  static async login(dto: LoginDTO): Promise<{ user: User; token: string }> {
    if (!dto.email || !dto.password) {
      throw AppError.badRequest("Email and password are required");
    }
    const stored = await UserModel.findStoredByEmail(dto.email);
    if (!stored || !bcrypt.compareSync(dto.password, stored.passwordHash)) {
      throw AppError.unauthorized("Invalid email or password");
    }
    return {
      user: toPublicUser(stored),
      token: signToken({ sub: stored.id, role: stored.role }),
    };
  }

  static async register(dto: RegisterDTO): Promise<{ user: User; token: string }> {
    if (!dto.email || !dto.name) throw AppError.badRequest("Name and email are required");
    if (!dto.password || dto.password.length < 8) {
      throw AppError.badRequest("Password must be at least 8 characters");
    }
    if (await UserModel.findStoredByEmail(dto.email)) {
      throw AppError.badRequest("A user with this email already exists");
    }
    const user = await UserModel.create({ ...dto, password: dto.password });
    return { user, token: signToken({ sub: user.id, role: user.role }) };
  }

  /** Always resolves silently so callers cannot discover which emails are registered. */
  static async requestPasswordReset(email: string): Promise<void> {
    if (!email) throw AppError.badRequest("Email is required");
    const stored = await UserModel.findStoredByEmail(email);
    if (!stored) return;
    const token = await PasswordResetModel.issue(stored.id);
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

  static async resetPassword(token: string, password: string): Promise<void> {
    if (!token) throw AppError.badRequest("Reset token is required");
    if (!password || password.length < 8) {
      throw AppError.badRequest("Password must be at least 8 characters");
    }
    const userId = await PasswordResetModel.consume(token);
    if (!userId || !(await UserModel.setPassword(userId, password))) {
      throw AppError.badRequest("This reset link is invalid or has expired");
    }
  }

  static async changePassword(userId: string, current: string, next: string): Promise<void> {
    if (!next || next.length < 8) throw AppError.badRequest("New password must be at least 8 characters");
    const user = await UserModel.findById(userId);
    const stored = user && (await UserModel.findStoredByEmail(user.email));
    if (!stored || !bcrypt.compareSync(current ?? "", stored.passwordHash)) {
      throw AppError.unauthorized("Current password is incorrect");
    }
    await UserModel.setPassword(stored.id, next);
  }
}
