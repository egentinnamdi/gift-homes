import { Router } from "express";
import { propertyRoutes } from "./property.routes.js";
import { authRoutes } from "./auth.routes.js";
import { enquiryRoutes } from "./enquiry.routes.js";
import { adminRoutes } from "./admin.routes.js";
import { sendSuccess } from "../utils/api-response.js";

const apiRouter = Router();

// Health check endpoint: GET /api/v1/health
apiRouter.get("/health", (_req, res) => {
  sendSuccess(res, {
    status: "healthy",
    platform: "GiftHomes Enugu API",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Resource routes
apiRouter.use("/properties", propertyRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/enquiries", enquiryRoutes);
apiRouter.use("/admin", adminRoutes);

export { apiRouter };
