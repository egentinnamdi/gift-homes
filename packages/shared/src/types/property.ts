export type ListingType = "sale" | "rent";

export type PropertyType =
  | "Apartment"
  | "Duplex"
  | "Villa"
  | "Bungalow"
  | "Commercial"
  | "Land";

export type TitleDocumentType =
  | "C of O"
  | "Governor's Consent"
  | "Deed of Assignment"
  | "Gazette"
  | "Registered Survey";

export interface PropertyLocation {
  neighborhood: string;
  city: "Enugu";
  state: "Enugu State";
  address: string;
  landmark?: string;
}

export interface AgentInfo {
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface PowerAndWaterSpecs {
  waterSource: string;
  powerBackup: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  priceFormatted: string;
  priceType: "total" | "per_year";
  listingType: ListingType;
  propertyType: PropertyType;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  titleDocument?: TitleDocumentType;
  featured: boolean;
  images: string[];
  amenities: string[];
  powerAndWater?: PowerAndWaterSpecs;
  agent: AgentInfo;
  dateAdded: string;
}

export interface PropertyFilterParams {
  neighborhood?: string;
  type?: PropertyType | string;
  listingType?: ListingType | "all";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "featured";
  page?: number;
  limit?: number;
}

export interface PropertyInputDTO {
  title: string;
  tagline: string;
  description: string;
  price: number;
  priceType: "total" | "per_year";
  listingType: ListingType;
  propertyType: PropertyType;
  location: PropertyLocation;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  titleDocument?: TitleDocumentType;
  featured: boolean;
  images: string[];
  amenities: string[];
  powerAndWater?: PowerAndWaterSpecs;
  agent: AgentInfo;
}
