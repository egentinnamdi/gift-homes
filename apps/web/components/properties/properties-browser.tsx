"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ArrowLeft, ArrowRight, X } from "lucide-react"
import { api, type Meta } from "@/lib/api"
import type { Property } from "@/types/property"
import { PropertyCard } from "@/components/properties/property-card"
import { ENUGU_NEIGHBORHOODS, PROPERTY_TYPES } from "@gift-homes/shared"

const PRICE_RANGES: Record<string, { label: string; min?: number; max?: number }> = {
  all: { label: "Any Budget" },
  under_5m: { label: "Under ₦5M", max: 5_000_000 },
  "5m_15m": { label: "₦5M – ₦15M", min: 5_000_000, max: 15_000_000 },
  "15m_50m": { label: "₦15M – ₦50M", min: 15_000_000, max: 50_000_000 },
  "50m_150m": { label: "₦50M – ₦150M", min: 50_000_000, max: 150_000_000 },
  above_150m: { label: "Above ₦150M", min: 150_000_000 },
}

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
]

const field =
  "w-full rounded-xl border border-[#262626] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#703BF7]"

export function PropertiesBrowser() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const get = (k: string, d = "") => sp.get(k) ?? d
  const search = get("search")
  const neighborhood = get("neighborhood", "All Neighborhoods")
  const type = get("type", "All Types")
  const listingType = get("listingType", "all")
  const priceRange = get("priceRange", "all")
  const bedrooms = get("bedrooms", "any")
  const sort = get("sort", "newest")
  const page = Math.max(1, Number(get("page", "1")) || 1)

  const [draft, setDraft] = useState<string | null>(null)
  const searchDraft = draft ?? search
  const setSearchDraft = (v: string) => setDraft(v)

  const [items, setItems] = useState<Property[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const queryKey = sp.toString()
  const loading = loadedKey !== queryKey
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString())
    Object.entries(changes).forEach(([k, v]) => {
      if (v === null || v === "" || v === "all" || v === "any" || v === "All Neighborhoods" || v === "All Types") {
        next.delete(k)
      } else next.set(k, v)
    })
    if (!("page" in changes)) next.delete("page")
    const qs = next.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  useEffect(() => {
    let cancelled = false
    const range = PRICE_RANGES[priceRange] ?? PRICE_RANGES.all
    api
      .properties({
        search: search || undefined,
        neighborhood: neighborhood === "All Neighborhoods" ? undefined : neighborhood,
        type: type === "All Types" ? undefined : type,
        listingType: listingType === "all" ? undefined : (listingType as "sale" | "rent"),
        minPrice: range.min,
        maxPrice: range.max,
        bedrooms: bedrooms === "any" ? undefined : Number(bedrooms),
        sort: sort as "newest",
        page,
        limit: 9,
      })
      .then((r) => {
        if (cancelled) return
        setItems(r.items)
        setMeta(r.meta)
        setError(null)
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => !cancelled && setLoadedKey(queryKey))
    return () => {
      cancelled = true
    }
  }, [queryKey, search, neighborhood, type, listingType, priceRange, bedrooms, sort, page])

  const activeCount = [
    search,
    neighborhood !== "All Neighborhoods",
    type !== "All Types",
    listingType !== "all",
    priceRange !== "all",
    bedrooms !== "any",
  ].filter(Boolean).length

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Toolbar */}
      <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <form
            className="flex flex-1 items-center rounded-xl border border-[#262626] bg-[#141414] px-3 focus-within:border-[#703BF7]"
            onSubmit={(e) => {
              e.preventDefault()
              update({ search: searchDraft.trim() })
              setDraft(null)
            }}
          >
            <Search className="size-4 shrink-0 text-[#666666]" />
            <input
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Search by title, area or keyword"
              className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-[#666666]"
            />
          </form>
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            className={`${field} sm:w-52`}
            aria-label="Sort"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-4 py-2.5 text-sm font-medium text-white hover:border-[#333333] lg:hidden"
          >
            <SlidersHorizontal className="size-4 text-[#703BF7]" />
            Filters{activeCount > 0 && ` (${activeCount})`}
          </button>
        </div>

        <div className={`${showFilters ? "grid" : "hidden"} mt-4 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-5`}>
          <select value={listingType} onChange={(e) => update({ listingType: e.target.value })} className={field} aria-label="Listing type">
            <option value="all">For Sale &amp; Rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <select value={neighborhood} onChange={(e) => update({ neighborhood: e.target.value })} className={field} aria-label="Neighborhood">
            {ENUGU_NEIGHBORHOODS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
          <select value={type} onChange={(e) => update({ type: e.target.value })} className={field} aria-label="Property type">
            {PROPERTY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={priceRange} onChange={(e) => update({ priceRange: e.target.value })} className={field} aria-label="Budget">
            {Object.entries(PRICE_RANGES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <select value={bedrooms} onChange={(e) => update({ bedrooms: e.target.value })} className={field} aria-label="Bedrooms">
            <option value="any">Any Bedrooms</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+ Bedrooms
              </option>
            ))}
          </select>
        </div>

        {activeCount > 0 && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#946CF9] hover:text-white"
          >
            <X className="size-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-6 flex items-center justify-between text-xs text-[#999999]">
        <span>
          {loading ? "Searching…" : `${meta?.total ?? 0} propert${meta?.total === 1 ? "y" : "ies"} found`}
        </span>
        {meta && meta.totalPages > 1 && (
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-400">{error}</p>
      )}

      {!error && !loading && items.length === 0 && (
        <div className="mt-6 rounded-2xl border border-[#262626] bg-[#1A1A1A] p-12 text-center">
          <p className="font-heading text-lg font-bold text-white">No properties match your search</p>
          <p className="mt-1 text-sm text-[#999999]">Try widening your filters or clearing them.</p>
        </div>
      )}

      <div className={`mt-4 grid grid-cols-1 gap-6 transition-opacity md:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50" : ""}`}>
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            disabled={!meta.hasPrev}
            onClick={() => update({ page: String(page - 1) })}
            className="flex size-10 items-center justify-center rounded-xl border border-[#262626] bg-[#1A1A1A] text-white hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous page"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="text-xs font-medium text-[#999999]">
            {meta.page} / {meta.totalPages}
          </span>
          <button
            disabled={!meta.hasNext}
            onClick={() => update({ page: String(page + 1) })}
            className="flex size-10 items-center justify-center rounded-xl border border-[#262626] bg-[#1A1A1A] text-white hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next page"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </section>
  )
}
