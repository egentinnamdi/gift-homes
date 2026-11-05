import { Request, Response, NextFunction } from "express";
import { PropertyService } from "../services/property.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { ENUGU_NEIGHBORHOODS, PROPERTY_TYPES } from "@gift-homes/shared";

export class PropertyController {
  static getProperties = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        neighborhood,
        type,
        listingType,
        minPrice,
        maxPrice,
        bedrooms,
        search,
        sort,
        page,
        limit,
      } = req.query;

      const result = PropertyService.getProperties({
        neighborhood: neighborhood as string,
        type: type as string,
        listingType: listingType as any,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        search: search as string,
        sort: sort as any,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      sendSuccess(
        res,
        result.properties,
        "Properties fetched successfully",
        200,
        result.meta
      );
    } catch (error) {
      next(error);
    }
  };

  static getFeatured = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const properties = PropertyService.getFeaturedProperties();
      sendSuccess(res, properties, "Featured properties fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  static getBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const property = PropertyService.getPropertyBySlug(slug);
      sendSuccess(res, property, "Property details fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  static getSimilar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : 3;
      const properties = PropertyService.getSimilarProperties(slug, limit);
      sendSuccess(res, properties, "Similar properties fetched successfully");
    } catch (error) {
      next(error);
    }
  };

  static getFilterMeta = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      sendSuccess(
        res,
        {
          neighborhoods: ENUGU_NEIGHBORHOODS,
          propertyTypes: PROPERTY_TYPES,
        },
        "Filter metadata fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  };
}
