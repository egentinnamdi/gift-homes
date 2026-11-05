import {
  PropertyEnquiryDTO,
  EnquiryRecord,
  ContactMessageDTO,
  ContactMessageRecord,
} from "@gift-homes/shared";
import { EnquiryModel } from "../models/enquiry.model.js";
import { PropertyModel } from "../models/property.model.js";
import { AppError } from "../utils/app-error.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export class EnquiryService {
  static createEnquiry(body: Partial<PropertyEnquiryDTO>): EnquiryRecord {
    const property = PropertyModel.findById(String(body.propertyId ?? ""));
    if (!property) {
      throw AppError.notFound("Property not found for this inspection request");
    }
    const name = str(body.name, 120);
    const email = str(body.email, 200);
    const phone = str(body.phone, 40);
    if (!name || !EMAIL_RE.test(email) || !phone) {
      throw AppError.badRequest("Name, a valid email and phone are required");
    }
    return EnquiryModel.createEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      name,
      email,
      phone,
      preferredDate: str(body.preferredDate, 40) || undefined,
      inspectionType: body.inspectionType === "virtual_video" ? "virtual_video" : "physical",
      message: str(body.message),
    });
  }

  static createContactMessage(body: Partial<ContactMessageDTO>): ContactMessageRecord {
    const firstName = str(body.firstName, 80);
    const email = str(body.email, 200);
    const message = str(body.message);
    if (!firstName || !EMAIL_RE.test(email) || !message) {
      throw AppError.badRequest("First name, a valid email, and message are required");
    }
    const categories = ["general", "buying", "renting", "inspection", "valuation"] as const;
    return EnquiryModel.createContactMessage({
      firstName,
      lastName: str(body.lastName, 80),
      email,
      phone: str(body.phone, 40) || undefined,
      category: categories.includes(body.category as never) ? (body.category as ContactMessageDTO["category"]) : "general",
      message,
    });
  }
}
