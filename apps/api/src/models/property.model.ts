import { Property } from "@gift-homes/shared";
import { collection } from "../utils/store.js";
import { SEED_PROPERTIES } from "./property.seed.js";

const properties = collection<Property>("properties", {
  order: "desc",
  seed: () => [...SEED_PROPERTIES],
});

export class PropertyModel {
  static findAll(): Promise<Property[]> {
    return properties.list();
  }

  static findById(id: string): Promise<Property | undefined> {
    return properties.get(id);
  }

  static async findBySlug(slug: string): Promise<Property | undefined> {
    return (await properties.list()).find((p) => p.slug === slug);
  }

  static async findFeatured(): Promise<Property[]> {
    return (await properties.list()).filter((p) => p.featured);
  }

  static async findSimilar(slug: string, limit = 3): Promise<Property[]> {
    const all = await properties.list();
    const target = all.find((p) => p.slug === slug);
    if (!target) return all.slice(0, limit);

    return all
      .filter(
        (p) =>
          p.slug !== slug &&
          (p.location.neighborhood === target.location.neighborhood ||
            p.propertyType === target.propertyType ||
            p.listingType === target.listingType)
      )
      .slice(0, limit);
  }

  static async insert(property: Property): Promise<Property> {
    await properties.insert(property);
    return property;
  }

  static async update(id: string, next: Property): Promise<Property | undefined> {
    if (!(await properties.get(id))) return undefined;
    await properties.replace({ ...next, id });
    return next;
  }

  static remove(id: string): Promise<boolean> {
    return properties.remove(id);
  }
}
