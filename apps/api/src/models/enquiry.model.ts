import {
  PropertyEnquiryDTO,
  EnquiryRecord,
  EnquiryStatus,
  ContactMessageDTO,
  ContactMessageRecord,
  ContactReply,
} from "@gift-homes/shared";
import { loadCollection, saveCollection } from "../utils/store.js";

const enquiries = loadCollection<EnquiryRecord>("enquiries", () => []);
const messages = loadCollection<ContactMessageRecord>("contactMessages", () => []);

const uid = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export class EnquiryModel {
  static createEnquiry(dto: PropertyEnquiryDTO): EnquiryRecord {
    const record: EnquiryRecord = {
      ...dto,
      id: uid("enq"),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(record);
    saveCollection();
    return record;
  }

  static findAllEnquiries(): EnquiryRecord[] {
    return [...enquiries];
  }

  static updateEnquiryStatus(id: string, status: EnquiryStatus): EnquiryRecord | undefined {
    const e = enquiries.find((x) => x.id === id);
    if (!e) return undefined;
    e.status = status;
    saveCollection();
    return e;
  }

  static removeEnquiry(id: string): boolean {
    const i = enquiries.findIndex((x) => x.id === id);
    if (i === -1) return false;
    enquiries.splice(i, 1);
    saveCollection();
    return true;
  }

  static createContactMessage(dto: ContactMessageDTO): ContactMessageRecord {
    const record: ContactMessageRecord = {
      ...dto,
      id: uid("msg"),
      read: false,
      createdAt: new Date().toISOString(),
    };
    messages.unshift(record);
    saveCollection();
    return record;
  }

  static findAllContactMessages(): ContactMessageRecord[] {
    return [...messages];
  }

  static setMessageRead(id: string, read: boolean): ContactMessageRecord | undefined {
    const m = messages.find((x) => x.id === id);
    if (!m) return undefined;
    m.read = read;
    saveCollection();
    return m;
  }

  static findMessage(id: string): ContactMessageRecord | undefined {
    return messages.find((x) => x.id === id);
  }

  static addReply(id: string, reply: Omit<ContactReply, "id" | "sentAt">): ContactMessageRecord | undefined {
    const m = messages.find((x) => x.id === id);
    if (!m) return undefined;
    m.replies = [...(m.replies ?? []), { ...reply, id: uid("rep"), sentAt: new Date().toISOString() }];
    m.read = true;
    saveCollection();
    return m;
  }

  static removeMessage(id: string): boolean {
    const i = messages.findIndex((x) => x.id === id);
    if (i === -1) return false;
    messages.splice(i, 1);
    saveCollection();
    return true;
  }
}
