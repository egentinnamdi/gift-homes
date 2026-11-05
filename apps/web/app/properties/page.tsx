import { Suspense } from "react"
import { PropertiesBrowser } from "@/components/properties/properties-browser"

export const metadata = {
  title: "Properties for Sale & Rent in Enugu | GiftHomes",
  description:
    "Browse verified duplexes, apartments and commercial properties for sale and rent across Enugu.",
}

export default function PropertiesPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#262626] bg-[#141414] py-12 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#703BF7]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
            Verified Enugu Listings
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore{" "}
            <span className="bg-gradient-to-r from-white via-[#EDE7FE] to-[#946CF9] bg-clip-text text-transparent">
              Properties
            </span>{" "}
            in Enugu
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#999999] sm:text-base">
            Filter by neighborhood, type and budget to find a home that fits — every listing is
            reviewed by our Enugu team.
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="py-24 text-center text-sm text-[#999999]">Loading…</div>}>
        <PropertiesBrowser />
      </Suspense>
    </div>
  )
}
