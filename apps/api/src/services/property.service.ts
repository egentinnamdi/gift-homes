import { Property, PropertyFilterParams, PropertyInputDTO } from "@gift-homes/shared";
import { PropertyModel } from "../models/property.model.js";
import { AppError } from "../utils/app-error.js";
import { PaginationMeta } from "../utils/api-response.js";

export class PropertyService {
  static async getProperties(filters: PropertyFilterParams): Promise<{
    properties: Property[];
    meta: PaginationMeta;
  }> {
    let list = await PropertyModel.findAll();

    // 1. Search text filter (title, neighborhood, description)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.propertyType.toLowerCase().includes(q)
      );
    }

    // 2. Neighborhood filter
    if (filters.neighborhood && filters.neighborhood !== "All Neighborhoods") {
      list = list.filter(
        (p) =>
          p.location.neighborhood.toLowerCase() ===
          filters.neighborhood?.toLowerCase()
      );
    }

    // 3. Property Type filter
    if (filters.type && filters.type !== "All Types") {
      list = list.filter(
        (p) => p.propertyType.toLowerCase() === filters.type?.toLowerCase()
      );
    }

    // 4. Listing Type filter (sale or rent)
    if (filters.listingType && filters.listingType !== "all") {
      list = list.filter((p) => p.listingType === filters.listingType);
    }

    // 5. Price Min & Max
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      list = list.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      list = list.filter((p) => p.price <= filters.maxPrice!);
    }

    // 6. Bedrooms
    if (filters.bedrooms !== undefined && !isNaN(filters.bedrooms)) {
      list = list.filter((p) => p.bedrooms >= filters.bedrooms!);
    }

    // 7. Sort
    if (filters.sort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "newest") {
      list.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    }

    // 8. Pagination
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(50, filters.limit || 9));
    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      properties: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static getFeaturedProperties(): Promise<Property[]> {
    return PropertyModel.findFeatured();
  }

  static async getPropertyBySlug(slug: string): Promise<Property> {
    const property = await PropertyModel.findBySlug(slug);
    if (!property) {
      throw AppError.notFound(`Property with slug '${slug}' not found`);
    }
    return property;
  }

  static getSimilarProperties(slug: string, limit = 3): Promise<Property[]> {
    return PropertyModel.findSimilar(slug, limit);
  }

  private static async build(input: PropertyInputDTO, base?: Property): Promise<Property> {
    const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const n = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : NaN);
    const list = (v: unknown) =>
      Array.isArray(v) ? v.map((x) => s(x)).filter(Boolean) : [];

    const title = s(input.title);
    const price = n(input.price);
    const loc = input.location ?? ({} as PropertyInputDTO["location"]);
    if (!title) throw AppError.badRequest("Title is required");
    if (!(price > 0)) throw AppError.badRequest("A valid price is required");
    if (!s(loc.neighborhood) || !s(loc.address)) {
      throw AppError.badRequest("Neighborhood and address are required");
    }
    const images = list(input.images);
    if (images.length === 0) throw AppError.badRequest("At least one image URL is required");

    const priceType = input.priceType === "per_year" ? "per_year" : "total";
    const listingType = input.listingType === "rent" ? "rent" : "sale";
    const formatted = `₦${price.toLocaleString("en-NG")}${priceType === "per_year" ? " / yr" : ""}`;

    let slug = base?.slug;
    if (!slug) {
      const root =
        title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "property";
      slug = root;
      let i = 2;
      while (await PropertyModel.findBySlug(slug)) slug = `${root}-${i++}`;
    }

    return {
      id: base?.id ?? `prop_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      slug,
      title,
      tagline: s(input.tagline),
      description: s(input.description),
      price,
      priceFormatted: formatted,
      priceType,
      listingType,
      propertyType: input.propertyType ?? "Apartment",
      location: {
        neighborhood: s(loc.neighborhood),
        city: "Enugu",
        state: "Enugu State",
        address: s(loc.address),
        landmark: s(loc.landmark) || undefined,
      },
      bedrooms: Math.max(0, n(input.bedrooms) || 0),
      bathrooms: Math.max(0, n(input.bathrooms) || 0),
      areaSqm: Math.max(0, n(input.areaSqm) || 0),
      titleDocument: input.titleDocument || undefined,
      featured: Boolean(input.featured),
      images,
      amenities: list(input.amenities),
      powerAndWater:
        input.powerAndWater && (s(input.powerAndWater.waterSource) || s(input.powerAndWater.powerBackup))
          ? {
              waterSource: s(input.powerAndWater.waterSource),
              powerBackup: s(input.powerAndWater.powerBackup),
            }
          : undefined,
      agent: {
        name: s(input.agent?.name) || "GiftHomes Team",
        role: s(input.agent?.role) || "Real Estate Consultant",
        phone: s(input.agent?.phone) || "+234 915 902 7226",
        email: s(input.agent?.email) || "info@gifthomes.ng",
        avatar:
          s(input.agent?.avatar) ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      },
      dateAdded: base?.dateAdded ?? new Date().toISOString().slice(0, 10),
    };
  }

  static async createProperty(input: PropertyInputDTO): Promise<Property> {
    return PropertyModel.insert(await this.build(input));
  }

  static async updateProperty(id: string, input: PropertyInputDTO): Promise<Property> {
    const existing = await PropertyModel.findById(id);
    if (!existing) throw AppError.notFound("Property not found");
    return (await PropertyModel.update(id, await this.build(input, existing)))!;
  }

  static async deleteProperty(id: string): Promise<void> {
    if (!(await PropertyModel.remove(id))) throw AppError.notFound("Property not found");
  }
}
