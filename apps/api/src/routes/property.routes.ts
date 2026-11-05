import { Router } from "express";
import { PropertyController } from "../controllers/property.controller.js";

const router = Router();

// GET /api/v1/properties
router.get("/", PropertyController.getProperties);

// GET /api/v1/properties/featured
router.get("/featured", PropertyController.getFeatured);

// GET /api/v1/properties/filters
router.get("/filters", PropertyController.getFilterMeta);

// GET /api/v1/properties/:slug
router.get("/:slug", PropertyController.getBySlug);

// GET /api/v1/properties/:slug/similar
router.get("/:slug/similar", PropertyController.getSimilar);

export const propertyRoutes = router;
