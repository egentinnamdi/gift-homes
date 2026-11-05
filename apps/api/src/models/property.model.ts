import { Property } from "@gift-homes/shared";
import { loadCollection, saveCollection } from "../utils/store.js";
import { SEED_PROPERTIES } from "./property.seed.js";

const properties = loadCollection<Property>("properties", () => [...SEED_PROPERTIES]);

export class PropertyModel {
  static findAll(): Property[] {
    return [...properties];
  }

  static findById(id: string): Property | undefined {
    return properties.find((p) => p.id === id);
  }

  static findBySlug(slug: string): Property | undefined {
    return properties.find((p) => p.slug === slug);
  }

  static findFeatured(): Property[] {
    return properties.filter((p) => p.featured);
  }

  static findSimilar(slug: string, limit = 3): Property[] {
    const target = this.findBySlug(slug);
    if (!target) return properties.slice(0, limit);

    return properties
      .filter(
        (p) =>
          p.slug !== slug &&
          (p.location.neighborhood === target.location.neighborhood ||
            p.propertyType === target.propertyType ||
            p.listingType === target.listingType)
      )
      .slice(0, limit);
  }

  static insert(property: Property): Property {
    properties.unshift(property);
    saveCollection();
    return property;
  }

  static update(id: string, next: Property): Property | undefined {
    const i = properties.findIndex((p) => p.id === id);
    if (i === -1) return undefined;
    properties[i] = next;
    saveCollection();
    return next;
  }

  static remove(id: string): boolean {
    const i = properties.findIndex((p) => p.id === id);
    if (i === -1) return false;
    properties.splice(i, 1);
    saveCollection();
    return true;
  }
}
