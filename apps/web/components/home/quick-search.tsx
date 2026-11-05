"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign, ArrowRight } from "lucide-react";
import { ENUGU_NEIGHBORHOODS, PROPERTY_TYPES } from "@/lib/content";

export function QuickSearch() {
  const router = useRouter();

  const [location, setLocation] = useState("All Neighborhoods");
  const [propertyType, setPropertyType] = useState("All Types");
  const [listingType, setListingType] = useState<"all" | "sale" | "rent">("all");
  const [priceRange, setPriceRange] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (location !== "All Neighborhoods") {
      params.set("neighborhood", location);
    }
    if (propertyType !== "All Types") {
      params.set("type", propertyType);
    }
    if (listingType !== "all") {
      params.set("listingType", listingType);
    }
    if (priceRange !== "all") {
      params.set("priceRange", priceRange);
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
      <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-4 sm:p-6 shadow-2xl">
        {/* Listing Type Toggle Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#262626] pb-4 mb-4">
          <button
            type="button"
            onClick={() => setListingType("all")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
              listingType === "all"
                ? "bg-[#703BF7] text-white"
                : "text-[#999999] hover:text-white"
            }`}
          >
            All Listings
          </button>
          <button
            type="button"
            onClick={() => setListingType("sale")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
              listingType === "sale"
                ? "bg-[#703BF7] text-white"
                : "text-[#999999] hover:text-white"
            }`}
          >
            For Sale (Outright)
          </button>
          <button
            type="button"
            onClick={() => setListingType("rent")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
              listingType === "rent"
                ? "bg-[#703BF7] text-white"
                : "text-[#999999] hover:text-white"
            }`}
          >
            For Rent (Annual ₦/yr)
          </button>
        </div>

        {/* Search Input Controls */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 items-center">
          {/* Location Dropdown */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] px-3.5 py-2.5 focus-within:border-[#703BF7] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#666666] tracking-wider mb-0.5">
              <MapPin className="size-3 text-[#703BF7]" />
              Enugu Neighborhood
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              {ENUGU_NEIGHBORHOODS.map((item) => (
                <option key={item} value={item} className="bg-[#1A1A1A] text-white">
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type Dropdown */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] px-3.5 py-2.5 focus-within:border-[#703BF7] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#666666] tracking-wider mb-0.5">
              <Home className="size-3 text-[#703BF7]" />
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#1A1A1A] text-white">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Dropdown */}
          <div className="rounded-xl border border-[#262626] bg-[#141414] px-3.5 py-2.5 focus-within:border-[#703BF7] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#666666] tracking-wider mb-0.5">
              <DollarSign className="size-3 text-[#703BF7]" />
              Price Range (₦)
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#1A1A1A] text-white">
                Any Price
              </option>
              <option value="under_5m" className="bg-[#1A1A1A] text-white">
                Under ₦5,000,000 / yr (Rent)
              </option>
              <option value="5m_15m" className="bg-[#1A1A1A] text-white">
                ₦5M - ₦15M / yr (Executive Rent)
              </option>
              <option value="50m_150m" className="bg-[#1A1A1A] text-white">
                ₦50M - ₦150M (For Sale)
              </option>
              <option value="above_150m" className="bg-[#1A1A1A] text-white">
                ₦150M+ (Luxury GRA Duplexes)
              </option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex h-full items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#703BF7] py-3 text-xs font-bold text-white shadow-lg shadow-[#703BF7]/25 hover:bg-[#8254F8] transition-all"
            >
              <Search className="size-4" />
              Find Property in Enugu
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
