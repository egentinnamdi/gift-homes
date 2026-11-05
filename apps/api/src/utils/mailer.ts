import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = ENV.SMTP_HOST
  ? nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: ENV.SMTP_PORT === 465,
      auth: ENV.SMTP_USER ? { user: ENV.SMTP_USER, pass: ENV.SMTP_PASS } : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    })
  : null;

/** Logs whether SMTP is usable at boot so misconfiguration is visible immediately. */
export async function verifyMailer(): Promise<void> {
  if (!transporter) {
    console.warn("[mail] SMTP not configured — emails will be printed to the console only.");
    return;
  }
  try {
    await transporter.verify();
    console.log(`[mail] SMTP ready (${ENV.SMTP_HOST}:${ENV.SMTP_PORT})`);
  } catch (err) {
    console.error("[mail] SMTP verification failed:", (err as Error).message);
  }
}

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  if (!transporter) {
    if (ENV.NODE_ENV === "production") {
      throw new Error("SMTP is not configured; cannot send email");
    }
    console.log(`\n[mail:dev] To: ${opts.to}\n[mail:dev] Subject: ${opts.subject}\n${opts.text}\n`);
    return;
  }
  await transporter.sendMail({ from: ENV.MAIL_FROM, ...opts });
}
