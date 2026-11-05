import { Router } from "express";
import { EnquiryController } from "../controllers/enquiry.controller.js";

const router = Router();

// POST /api/v1/enquiries - book an inspection
router.post("/inspections", EnquiryController.createEnquiry);

// POST /api/v1/enquiries/contact - submit contact message
router.post("/contact", EnquiryController.createContact);

// GET /api/v1/enquiries/office - get Enugu office info
router.get("/office", EnquiryController.getOfficeInfo);

export const enquiryRoutes = router;
