"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { MapPin, Bed, Bath, Maximize2, ArrowUpRight } from "lucide-react";

export function PropertyCard({ property }: { property: Property }) {
  const isRent = property.listingType === "rent";

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-[#262626] bg-[#1A1A1A] p-5 hover:border-[#333333] transition-all hover:shadow-xl hover:shadow-[#703BF7]/5">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#262626]">
          <Image
            src={property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Listing Type & Featured Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-md ${
                isRent
                  ? "bg-[#703BF7]"
                  : "bg-[#141414]/90 border border-[#262626] text-white"
              }`}
            >
              {isRent ? "For Rent" : "For Sale"}
            </span>

            {property.featured && (
              <span className="rounded-full border border-[#262626] bg-[#141414]/90 px-3 py-1 text-[11px] font-medium text-[#946CF9]">
                Featured
              </span>
            )}
          </div>

          {/* Property Type Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="rounded-lg border border-[#262626] bg-[#141414]/85 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-[#999999]">
            <MapPin className="size-3.5 text-[#703BF7] shrink-0" />
            <span className="truncate">
              {property.location.neighborhood}, Enugu
            </span>
          </div>

          <h3 className="mt-2 font-heading text-lg font-bold text-white line-clamp-1 group-hover:text-[#946CF9] transition-colors">
            {property.title}
          </h3>

          <p className="mt-1.5 text-xs text-[#999999] line-clamp-2 leading-relaxed">
            {property.description}
          </p>

          {/* Specs Chips */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-y border-[#262626] py-3 text-xs text-[#999999]">
            <div className="flex items-center gap-1.5">
              <Bed className="size-3.5 text-[#703BF7]" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="size-3.5 text-[#703BF7]" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="size-3.5 text-[#703BF7]" />
              <span>{property.areaSqm} m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="mt-5 flex items-center justify-between gap-2 pt-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#666666] font-semibold">
            Price
          </span>
          <p className="font-heading text-base font-bold text-white sm:text-lg">
            {property.priceFormatted}
          </p>
        </div>

        <Link
          href={`/properties/${property.slug}`}
          className="flex items-center gap-1.5 rounded-xl bg-[#703BF7] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#703BF7]/20 hover:bg-[#8254F8] transition-all"
        >
          View Details
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
