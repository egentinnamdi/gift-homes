import React from "react";
import Image from "next/image";
import { ENUGU_TESTIMONIALS } from "@/lib/content";
import { MessageSquareQuote, Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="border-t border-[#262626] bg-[#141414] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-4 py-1.5 text-xs font-semibold text-[#946CF9] mb-3">
            <MessageSquareQuote className="size-3.5 text-[#703BF7]" />
            What Our Clients Say
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Trusted by Homeowners & Diaspora Investors
          </h2>
          <p className="mt-2 text-sm text-[#999999] leading-relaxed">
            Read authentic feedback from families living in Independence Layout, medical consultants in UNTH, and diaspora clients across the UK and US.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ENUGU_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 hover:border-[#333333] transition-all"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>

                <h3 className="mt-4 font-heading text-base font-bold text-white">
                  &ldquo;{item.title}&rdquo;
                </h3>

                <p className="mt-2 text-xs text-[#999999] leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 flex items-center gap-3 border-t border-[#262626] pt-4">
                <div className="relative size-10 overflow-hidden rounded-full bg-[#262626] shrink-0">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.author}</p>
                  <p className="text-[11px] text-[#999999]">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
