import { Router, Request, Response, NextFunction } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";
import { PropertyService } from "../services/property.service.js";
import { PropertyModel } from "../models/property.model.js";
import { EnquiryModel } from "../models/enquiry.model.js";
import { UserModel } from "../models/user.model.js";
import { sendSuccess } from "../utils/api-response.js";
import { sendMail } from "../utils/mailer.js";
import { emails } from "../utils/email-template.js";
import { ENV } from "../config/env.js";
import { ENUGU_OFFICE_DETAILS } from "@gift-homes/shared";
import { AppError } from "../utils/app-error.js";
import type { DashboardStats, EnquiryStatus, UserRole } from "@gift-homes/shared";

const router = Router();
router.use(authenticate, requireAdmin);

type Handler = (req: Request, res: Response) => unknown;
const wrap =
  (fn: Handler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve()
      .then(() => fn(req, res))
      .catch(next);
  };

const param = (req: Request, key: string) => String(req.params[key]);

// ---- Dashboard ----
router.get(
  "/stats",
  wrap(async (_req, res) => {
    const [props, enquiries, messages, users] = await Promise.all([
      PropertyModel.findAll(),
      EnquiryModel.findAllEnquiries(),
      EnquiryModel.findAllContactMessages(),
      UserModel.findAll(),
    ]);
    const stats: DashboardStats = {
      totalProperties: props.length,
      featuredProperties: props.filter((p) => p.featured).length,
      forSale: props.filter((p) => p.listingType === "sale").length,
      forRent: props.filter((p) => p.listingType === "rent").length,
      totalUsers: users.length,
      pendingEnquiries: enquiries.filter((e) => e.status === "pending").length,
      totalEnquiries: enquiries.length,
      unreadMessages: messages.filter((m) => !m.read).length,
      recentEnquiries: enquiries.slice(0, 5),
      recentMessages: messages.slice(0, 5),
    };
    sendSuccess(res, stats);
  })
);

// ---- Properties ----
router.get(
  "/properties",
  wrap(async (_req, res) => sendSuccess(res, await PropertyModel.findAll()))
);
router.post(
  "/properties",
  wrap(async (req, res) => sendSuccess(res, await PropertyService.createProperty(req.body), "Property created", 201))
);
router.put(
  "/properties/:id",
  wrap(async (req, res) => sendSuccess(res, await PropertyService.updateProperty(param(req, "id"), req.body), "Property updated"))
);
router.delete(
  "/properties/:id",
  wrap(async (req, res) => {
    await PropertyService.deleteProperty(param(req, "id"));
    sendSuccess(res, null, "Property deleted");
  })
);

// ---- Inspection enquiries ----
router.get(
  "/enquiries",
  wrap(async (_req, res) => sendSuccess(res, await EnquiryModel.findAllEnquiries()))
);
router.patch(
  "/enquiries/:id",
  wrap(async (req, res) => {
    const allowed: EnquiryStatus[] = ["pending", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(req.body?.status)) throw AppError.badRequest("Invalid status");
    const updated = await EnquiryModel.updateEnquiryStatus(param(req, "id"), req.body.status);
    if (!updated) throw AppError.notFound("Enquiry not found");
    sendSuccess(res, updated, "Enquiry updated");
  })
);
router.delete(
  "/enquiries/:id",
  wrap(async (req, res) => {
    if (!(await EnquiryModel.removeEnquiry(param(req, "id")))) throw AppError.notFound("Enquiry not found");
    sendSuccess(res, null, "Enquiry deleted");
  })
);

// ---- Contact messages ----
router.get(
  "/messages",
  wrap(async (_req, res) => sendSuccess(res, await EnquiryModel.findAllContactMessages()))
);
router.patch(
  "/messages/:id",
  wrap(async (req, res) => {
    const updated = await EnquiryModel.setMessageRead(param(req, "id"), Boolean(req.body?.read));
    if (!updated) throw AppError.notFound("Message not found");
    sendSuccess(res, updated, "Message updated");
  })
);
router.post("/messages/:id/reply", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await EnquiryModel.findMessage(param(req, "id"));
    if (!message) throw AppError.notFound("Message not found");

    const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
    if (body.length < 2) throw AppError.badRequest("Reply cannot be empty");
    if (body.length > 10_000) throw AppError.badRequest("Reply is too long");
    const subject =
      (typeof req.body?.subject === "string" ? req.body.subject.trim().slice(0, 200) : "") ||
      "Re: Your enquiry to GiftHomes";

    const { html, text } = emails.contactReply({
      name: message.firstName,
      reply: body,
      original: message.message,
    });

    try {
      await sendMail({
        to: message.email,
        subject,
        text,
        html,
        replyTo: ENV.MAIL_REPLY_TO || ENUGU_OFFICE_DETAILS.email,
      });
    } catch (err) {
      console.error("Failed to send reply email:", err);
      throw new AppError("The email could not be sent. Check the SMTP settings and try again.", 502);
    }

    const updated = await EnquiryModel.addReply(message.id, {
      subject,
      body,
      sentBy: req.user!.email,
    });
    sendSuccess(res, updated, "Reply sent");
  } catch (e) {
    next(e);
  }
});
router.delete(
  "/messages/:id",
  wrap(async (req, res) => {
    if (!(await EnquiryModel.removeMessage(param(req, "id")))) throw AppError.notFound("Message not found");
    sendSuccess(res, null, "Message deleted");
  })
);

// ---- Users ----
router.get(
  "/users",
  wrap(async (_req, res) => sendSuccess(res, await UserModel.findAll()))
);
router.patch(
  "/users/:id",
  wrap(async (req, res) => {
    const roles: UserRole[] = ["buyer", "owner", "diaspora", "admin"];
    if (!roles.includes(req.body?.role)) throw AppError.badRequest("Invalid role");
    if (param(req, "id") === req.user!.id) throw AppError.badRequest("You cannot change your own role");
    const updated = await UserModel.setRole(param(req, "id"), req.body.role);
    if (!updated) throw AppError.notFound("User not found");
    sendSuccess(res, updated, "User updated");
  })
);
router.delete(
  "/users/:id",
  wrap(async (req, res) => {
    if (param(req, "id") === req.user!.id) throw AppError.badRequest("You cannot delete your own account");
    if (!(await UserModel.remove(param(req, "id")))) throw AppError.notFound("User not found");
    sendSuccess(res, null, "User deleted");
  })
);

export const adminRoutes = router;
