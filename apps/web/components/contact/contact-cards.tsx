"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowUpRight, Check, Copy } from "lucide-react";
import { ENUGU_OFFICE_DETAILS } from "@gift-homes/shared";

export function ContactCards() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ENUGU_OFFICE_DETAILS.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const cards = [
    {
      title: "Email Inquiries",
      description: "Direct your property queries, diaspora requests, and listing details to our inbox.",
      primary: ENUGU_OFFICE_DETAILS.email,
      secondary: "giftedproperties2@gmail.com",
      badge: "Fast Response",
      icon: Mail,
      action: (
        <button
          onClick={handleCopyEmail}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#703BF7] hover:text-[#8254F8] transition-colors"
        >
          {copiedEmail ? (
            <>
              <Check className="size-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy Email Address
            </>
          )}
        </button>
      ),
    },
    {
      title: "Phone & WhatsApp",
      description: "Speak directly with our Enugu property consultants or reach our emergency leasing line.",
      primary: ENUGU_OFFICE_DETAILS.phone,
      secondary: `${ENUGU_OFFICE_DETAILS.mobile} (WhatsApp Available)`,
      badge: "Call or Chat",
      icon: Phone,
      action: (
        <a
          href={`tel:${ENUGU_OFFICE_DETAILS.phone.replace(/[^0-9+]/g, "")}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#703BF7] hover:text-[#8254F8] transition-colors"
        >
          Call Office
          <ArrowUpRight className="size-3" />
        </a>
      ),
    },
    {
      title: "Enugu Headquarters",
      description: "Visit our executive consultation suite located in the administrative heart of Enugu.",
      primary: "Plot 14 Presidential Road",
      secondary: "Independence Layout, Enugu, Nigeria",
      badge: "In-Person Consultation",
      icon: MapPin,
      action: (
        <a
          href="#office-map"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#703BF7] hover:text-[#8254F8] transition-colors"
        >
          View Map & Directions
          <ArrowUpRight className="size-3" />
        </a>
      ),
    },
    {
      title: "Consultation Hours",
      description: "Our Enugu advisory and inspection teams operate on standard Nigerian business hours.",
      primary: "Mon – Fri: 8:00 AM – 5:00 PM",
      secondary: "Saturday: 10:00 AM – 2:00 PM (By Appt)",
      badge: "West Africa Time (WAT)",
      icon: Clock,
      action: (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#999999]">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          Desk Active Today
        </span>
      ),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 hover:border-[#333333] transition-all hover:shadow-xl hover:shadow-[#703BF7]/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#703BF7]/15 text-[#946CF9] border border-[#703BF7]/20 group-hover:bg-[#703BF7] group-hover:text-white transition-all">
                    <Icon className="size-6" />
                  </div>
                  <span className="rounded-full border border-[#262626] bg-[#141414] px-2.5 py-1 text-[10px] font-medium text-[#999999]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-[#946CF9] transition-colors">
                  {card.title}
                </h3>

                <p className="mt-1.5 text-xs text-[#999999] leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-4 rounded-xl border border-[#262626] bg-[#141414] p-3 text-xs">
                  <p className="font-semibold text-white truncate">{card.primary}</p>
                  <p className="text-[11px] text-[#999999] mt-0.5 truncate">{card.secondary}</p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#262626] flex items-center justify-between">
                {card.action}
                
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
