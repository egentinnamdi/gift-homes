"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/property-card";
import { BadgeCheck, ArrowLeft, ArrowRight } from "lucide-react";

export function FeaturedList() {
  const [featuredProperties, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .featured()
      .then(setFeatured)
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(featuredProperties.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const currentListings = featuredProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className="border-t border-[#262626] bg-[#141414] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9] mb-3">
              <BadgeCheck className="size-3.5 text-[#703BF7]" />
              Verified Portfolio
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Featured Properties in Enugu
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#999999] leading-relaxed">
              Explore our handpicked selection of luxury duplexes in GRA, executive serviced flats in Independence Layout, and serene golf view terraces.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs text-[#999999] font-medium mr-2">
              Page {currentPage + 1} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex size-10 items-center justify-center rounded-xl border border-[#262626] bg-[#1A1A1A] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#202020] transition-colors"
              aria-label="Previous properties"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="flex size-10 items-center justify-center rounded-xl border border-[#262626] bg-[#1A1A1A] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#202020] transition-colors"
              aria-label="Next properties"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {!loading && featuredProperties.length === 0 && (
          <p className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-10 text-center text-sm text-[#999999]">
            No featured properties are available right now.
          </p>
        )}

        {/* Property Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentListings.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Action */}
        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] px-8 py-3.5 text-sm font-semibold text-white hover:border-[#703BF7] hover:bg-[#202020] transition-all"
          >
            View All Enugu Properties
            <ArrowRight className="size-4 text-[#703BF7]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
