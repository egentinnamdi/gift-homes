import {
  PropertyEnquiryDTO,
  EnquiryRecord,
  EnquiryStatus,
  ContactMessageDTO,
  ContactMessageRecord,
  ContactReply,
} from "@gift-homes/shared";
import { collection } from "../utils/store.js";

const enquiries = collection<EnquiryRecord>("enquiries", { order: "desc" });
const messages = collection<ContactMessageRecord>("contact_messages", { order: "desc" });

const uid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export class EnquiryModel {
  static async createEnquiry(dto: PropertyEnquiryDTO): Promise<EnquiryRecord> {
    const record: EnquiryRecord = {
      ...dto,
      id: uid("enq"),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await enquiries.insert(record);
    return record;
  }

  static findAllEnquiries(): Promise<EnquiryRecord[]> {
    return enquiries.list();
  }

  static async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<EnquiryRecord | undefined> {
    const e = await enquiries.get(id);
    if (!e) return undefined;
    const next = { ...e, status };
    await enquiries.replace(next);
    return next;
  }

  static removeEnquiry(id: string): Promise<boolean> {
    return enquiries.remove(id);
  }

  static async createContactMessage(dto: ContactMessageDTO): Promise<ContactMessageRecord> {
    const record: ContactMessageRecord = {
      ...dto,
      id: uid("msg"),
      read: false,
      createdAt: new Date().toISOString(),
    };
    await messages.insert(record);
    return record;
  }

  static findAllContactMessages(): Promise<ContactMessageRecord[]> {
    return messages.list();
  }

  static async setMessageRead(id: string, read: boolean): Promise<ContactMessageRecord | undefined> {
    const m = await messages.get(id);
    if (!m) return undefined;
    const next = { ...m, read };
    await messages.replace(next);
    return next;
  }

  static findMessage(id: string): Promise<ContactMessageRecord | undefined> {
    return messages.get(id);
  }

  static async addReply(
    id: string,
    reply: Omit<ContactReply, "id" | "sentAt">
  ): Promise<ContactMessageRecord | undefined> {
    const m = await messages.get(id);
    if (!m) return undefined;
    const next: ContactMessageRecord = {
      ...m,
      read: true,
      replies: [...(m.replies ?? []), { ...reply, id: uid("rep"), sentAt: new Date().toISOString() }],
    };
    await messages.replace(next);
    return next;
  }

  static removeMessage(id: string): Promise<boolean> {
    return messages.remove(id);
  }
}
