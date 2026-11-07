import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      sendSuccess(res, await AuthService.login({ email, password }), "Logged in successfully");
    } catch (e) {
      next(e);
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, phone, role } = req.body;
      const r = role === "owner" || role === "diaspora" ? role : "buyer";
      sendSuccess(res, await AuthService.register({ name, email, password, phone, role: r }), "Registered successfully", 201);
    } catch (e) {
      next(e);
    }
  };

  static forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await AuthService.requestPasswordReset(String(req.body?.email ?? "").trim());
      sendSuccess(res, null, "If an account exists for that email, a reset link has been sent.");
    } catch (e) {
      next(e);
    }
  };

  static resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await AuthService.resetPassword(String(req.body?.token ?? ""), String(req.body?.password ?? ""));
      sendSuccess(res, null, "Password updated. You can now sign in.");
    } catch (e) {
      next(e);
    }
  };

  static changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await AuthService.changePassword(
        req.user!.id,
        String(req.body?.currentPassword ?? ""),
        String(req.body?.newPassword ?? "")
      );
      sendSuccess(res, null, "Password changed");
    } catch (e) {
      next(e);
    }
  };

  static me = (req: Request, res: Response): void => {
    sendSuccess(res, req.user, "Current user");
  };
}
