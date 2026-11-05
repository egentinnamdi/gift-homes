import React from "react";
import { MessageSquare, ShieldCheck } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#262626] bg-[#141414] py-12 lg:py-16">
      {/* Background radial subtle accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-[#703BF7]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9]">
          <MessageSquare className="size-3.5 text-[#703BF7]" />
          Enugu Advisory & Client Services
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Get in Touch with{" "}
          <span className="bg-gradient-to-r from-white via-[#EDE7FE] to-[#946CF9] bg-clip-text text-transparent">
            GiftHomes Enugu
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#999999] sm:text-base">
          Have questions about acquiring a luxury duplex in GRA, renting an executive serviced flat in Independence Layout, or structuring a secure diaspora real estate investment? Our team on Presidential Road is ready to assist you.
        </p>
      </div>
    </section>
  );
}
