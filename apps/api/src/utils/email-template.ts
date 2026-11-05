import { ENUGU_OFFICE_DETAILS } from "@gift-homes/shared";
import { ENV } from "../config/env.js";

const BRAND = "#703BF7";

export const escapeHtml = (v: string): string =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Turns plain text into paragraphs, preserving line breaks. */
const toParagraphs = (text: string): string =>
  text
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">${escapeHtml(p.trim()).replace(/\n/g, "<br>")}</p>`
    )
    .join("");

export interface EmailContent {
  /** Hidden inbox preview text */
  preheader: string;
  title: string;
  greeting: string;
  /** Plain-text body; blank lines separate paragraphs */
  body: string;
  button?: { label: string; url: string };
  /** Optional quoted block (e.g. the customer's original message) */
  quote?: { label: string; text: string };
  /** Small print under the card */
  footnote?: string;
}

export interface RenderedEmail {
  html: string;
  text: string;
}

export function renderEmail(c: EmailContent): RenderedEmail {
  const office = ENUGU_OFFICE_DETAILS;
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(c.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
      <tr><td style="background:${BRAND};border-radius:16px 16px 0 0;padding:28px 32px;">
        <span style="font-size:22px;font-weight:700;letter-spacing:-0.3px;color:#ffffff;">GiftHomes</span>
        <span style="display:block;margin-top:2px;font-size:12px;color:#e4dbfe;">Verified real estate in Enugu, Nigeria</span>
      </td></tr>
      <tr><td style="background:#ffffff;padding:36px 32px 28px;">
        <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#111827;">${escapeHtml(c.title)}</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">${escapeHtml(c.greeting)}</p>
        ${toParagraphs(c.body)}
        ${
          c.button
            ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="background:${BRAND};border-radius:10px;">
          <a href="${escapeHtml(c.button.url)}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(c.button.label)}</a>
        </td></tr></table>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">Button not working? Copy and paste this link into your browser:<br><a href="${escapeHtml(c.button.url)}" style="color:${BRAND};word-break:break-all;">${escapeHtml(c.button.url)}</a></p>`
            : ""
        }
        ${
          c.quote
            ? `<div style="margin:28px 0 0;padding:14px 16px;background:#f9fafb;border-left:3px solid ${BRAND};border-radius:6px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#6b7280;">${escapeHtml(c.quote.label)}</p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#4b5563;">${escapeHtml(c.quote.text).replace(/\n/g, "<br>")}</p>
        </div>`
            : ""
        }
        <p style="margin:28px 0 0;font-size:15px;line-height:1.6;color:#374151;">Warm regards,<br><strong>The GiftHomes Team</strong></p>
      </td></tr>
      <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 16px 16px;padding:22px 32px;">
        ${c.footnote ? `<p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:#6b7280;">${escapeHtml(c.footnote)}</p>` : ""}
        <p style="margin:0;font-size:12px;line-height:1.7;color:#6b7280;">
          ${escapeHtml(office.name)}<br>
          ${escapeHtml(office.address)}<br>
          <a href="tel:${office.phone.replace(/[^0-9+]/g, "")}" style="color:#6b7280;">${escapeHtml(office.phone)}</a> &middot;
          <a href="mailto:${escapeHtml(office.email)}" style="color:#6b7280;">${escapeHtml(office.email)}</a>
        </p>
      </td></tr>
      <tr><td style="padding:16px 8px;text-align:center;font-size:11px;color:#9ca3af;">&copy; ${year} GiftHomes. All rights reserved.</td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    c.title,
    "",
    c.greeting,
    "",
    c.body,
    c.button ? `\n${c.button.label}: ${c.button.url}` : "",
    c.quote ? `\n--- ${c.quote.label} ---\n${c.quote.text}` : "",
    "",
    "Warm regards,",
    "The GiftHomes Team",
    "",
    c.footnote ?? "",
    "",
    `${office.name} | ${office.address}`,
    `${office.phone} | ${office.email}`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");

  return { html, text };
}

export const emails = {
  passwordReset(name: string, link: string, minutes: number): RenderedEmail {
    return renderEmail({
      preheader: "Use this link to choose a new password.",
      title: "Reset your password",
      greeting: `Hi ${name},`,
      body: `We received a request to reset the password for your GiftHomes account. Click the button below to choose a new one. This link is valid for ${minutes} minutes and can only be used once.`,
      button: { label: "Reset my password", url: link },
      footnote:
        "If you did not request a password reset, you can safely ignore this email. Your password will not change.",
    });
  },

  contactReply(opts: { name: string; reply: string; original: string }): RenderedEmail {
    return renderEmail({
      preheader: "A member of our team has replied to your enquiry.",
      title: "Thanks for contacting GiftHomes",
      greeting: `Hi ${opts.name},`,
      body: opts.reply,
      quote: { label: "Your original message", text: opts.original },
      footnote: `You can reply directly to this email, or contact us on ${ENUGU_OFFICE_DETAILS.phone}.`,
    });
  },
};

export const clientUrl = (path: string): string => `${ENV.CLIENT_URL.replace(/\/$/, "")}${path}`;
