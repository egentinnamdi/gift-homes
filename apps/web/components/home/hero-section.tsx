import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Home, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#262626] bg-[#141414] py-12 lg:py-20">
      {/* Background glow and subtle dots */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="pointer-events-none absolute top-1/3 -left-24 size-96 rounded-full bg-[#703BF7]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-10 size-96 rounded-full bg-[#703BF7]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline, Description & Stats */}
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
              <ShieldCheck className="size-3.5 text-[#703BF7]" />
              Akulueuno • Premier Real Estate in Enugu, Nigeria
            </div>

            <h1 className="font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Your Dream Property in Enugu with{" "}
              <span className="bg-gradient-to-r from-white via-[#EDE7FE] to-[#946CF9] bg-clip-text text-transparent">
                GiftHomes
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#999999] sm:text-lg">
              Your trusted partner for certified duplexes in GRA, serviced
              apartments in Independence Layout, and golf view terraces.
              Verified titles, standby solar power, dedicated boreholes, and
              seamless virtual tours for our diaspora community.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/properties"
                className="flex items-center gap-2 rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 transition-all hover:bg-[#8254F8]"
              >
                Explore Properties
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#333333] hover:bg-[#202020]"
              >
                Schedule an Inspection
              </Link>
            </div>

            {/* Quick Stat Counters */}
            <div className="mt-12 grid grid-cols-3 gap-3 border-t border-[#262626] pt-8 sm:gap-6">
              <div className="rounded-xl border border-[#262626] bg-[#1A1A1A] p-4 text-center sm:text-left">
                <p className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  200+
                </p>
                <p className="mt-1 text-xs text-[#999999]">
                  Happy Clients (Local & Diaspora)
                </p>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#1A1A1A] p-4 text-center sm:text-left">
                <p className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  100+
                </p>
                <p className="mt-1 text-xs text-[#999999]">
                  Verified Enugu Properties
                </p>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#1A1A1A] p-4 text-center sm:text-left">
                <p className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  16+
                </p>
                <p className="mt-1 text-xs text-[#999999]">
                  Years Market Experience
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Circular Badge */}
          <div className="relative lg:col-span-5 lg:mt-16">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer Decorative Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#262626] bg-[#1A1A1A] p-3 shadow-2xl">
                <div className="relative size-full overflow-hidden rounded-2xl bg-[#262626]">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80"
                    alt="Luxury Estate in GRA Enugu"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Floating Circular Badge Overlay */}
              <div className="absolute -bottom-6 -left-6 hidden size-32 items-center justify-center rounded-full border border-[#262626] bg-[#1A1A1A]/95 p-2 shadow-2xl backdrop-blur-md sm:flex">
                <div className="flex size-full flex-col items-center justify-center rounded-full border border-dashed border-[#703BF7]/50 p-2 text-center">
                  <ShieldCheck className="size-5 text-[#703BF7]" />
                  <span className="mt-1 text-[10px] leading-tight font-bold tracking-wider text-white uppercase">
                    Verified
                  </span>
                  <span className="text-[9px] text-[#999999]">
                    C of O Titles
                  </span>
                </div>
              </div>

              {/* Top-Right Floating Feature Pill */}
              <div className="absolute -top-4 -right-4 hidden items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A]/95 px-4 py-2 shadow-xl backdrop-blur-md sm:flex">
                <span className="flex size-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-white">
                  Active Inspections in Enugu
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
