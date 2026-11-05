import type { EnquiryRecord, ContactMessageRecord } from "./enquiry.js";

export interface DashboardStats {
  totalProperties: number;
  featuredProperties: number;
  forSale: number;
  forRent: number;
  totalUsers: number;
  pendingEnquiries: number;
  totalEnquiries: number;
  unreadMessages: number;
  recentEnquiries: EnquiryRecord[];
  recentMessages: ContactMessageRecord[];
}
