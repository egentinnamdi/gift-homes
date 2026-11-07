import { Request, Response, NextFunction } from "express";
import { EnquiryService } from "../services/enquiry.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { ENUGU_OFFICE_DETAILS } from "@gift-homes/shared";

export class EnquiryController {
  static createEnquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await EnquiryService.createEnquiry(req.body), "Inspection request received", 201);
    } catch (e) {
      next(e);
    }
  };

  static createContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await EnquiryService.createContactMessage(req.body), "Message received", 201);
    } catch (e) {
      next(e);
    }
  };

  static getOfficeInfo = (_req: Request, res: Response): void => {
    sendSuccess(res, ENUGU_OFFICE_DETAILS, "Enugu office information retrieved successfully");
  };
}
