export type InspectionType = "physical" | "virtual_video";

export interface PropertyEnquiryDTO {
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  inspectionType: InspectionType;
  message: string;
}

export interface ContactMessageDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category: "general" | "buying" | "renting" | "inspection" | "valuation";
  message: string;
}

export interface EnquiryRecord extends PropertyEnquiryDTO {
  id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export type EnquiryStatus = EnquiryRecord["status"];

export interface ContactMessageRecord extends ContactMessageDTO {
  id: string;
  read: boolean;
  replies?: ContactReply[];
  createdAt: string;
}

export interface ContactReply {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string;
}

export interface ReplyDTO {
  subject?: string;
  body: string;
}
