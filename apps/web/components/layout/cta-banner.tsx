import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function CtaBanner({
  title = "Start Your Real Estate Journey in Enugu Today",
  subtitle = "Whether you are seeking an executive home in Independence Layout, a prime duplex in GRA, or high-yield diaspora investments, our local team is ready to guide you.",
  primaryButtonText = "Explore Properties",
  primaryButtonLink = "/properties",
}: {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
}) {
  return (
    <section className="relative overflow-hidden border-y border-[#262626] bg-[#141414] py-16 lg:py-20">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[#703BF7]/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-[#703BF7]/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#262626] bg-[#1A1A1A] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-4 py-1.5 text-xs font-semibold text-[#946CF9] mb-4">
              <ShieldCheck className="size-3.5 text-[#703BF7]" />
              Akulueuno • Verified Enugu Properties
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-sm text-[#999999] sm:text-base leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              href={primaryButtonLink}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#703BF7] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#703BF7]/25 hover:bg-[#8254F8] transition-all"
            >
              {primaryButtonText}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1F1F1F] hover:border-[#333333] transition-all"
            >
              Speak with an Agent
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
