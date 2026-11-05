"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Car,
  Plane,
  Building2,
  ExternalLink,
  Copy,
  Check,
  Compass,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { ENUGU_OFFICE_DETAILS } from "@gift-homes/shared";

export function OfficeLocation() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(ENUGU_OFFICE_DETAILS.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const landmarks = [
    {
      name: "Okpara Square & Cenotaph",
      distance: "1.2 km",
      time: "3 mins drive",
      icon: Compass,
      desc: "Central civic landmark & Independence Layout hub",
    },
    {
      name: "Enugu State Govt Secretariat",
      distance: "1.8 km",
      time: "4 mins drive",
      icon: Building2,
      desc: "Administrative capital center & Ministry of Lands",
    },
    {
      name: "Polo Park Mall (Shoprite / GRA)",
      distance: "4.5 km",
      time: "10 mins drive",
      icon: Car,
      desc: "Premier retail, banking, & dining district",
    },
    {
      name: "Akanu Ibiam Int'l Airport (ENU)",
      distance: "11.5 km",
      time: "18 mins drive",
      icon: Plane,
      desc: "Direct domestic & international flight connections",
    },
  ];

  return (
    <section id="office-map" className="border-t border-[#262626] bg-[#141414] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-3.5 py-1 text-xs font-semibold text-[#946CF9]">
              <MapPin className="size-3.5 text-[#703BF7]" />
              Physical Presence in the Coal City
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Visit Our Enugu Headquarters
            </h2>
            <p className="mt-3 text-sm text-[#999999] leading-relaxed">
              Located on Presidential Road in Independence Layout, our office offers a discreet, comfortable space for client consultations, document review, and property inspections.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyAddress}
              className="inline-flex items-center gap-2 rounded-xl border border-[#262626] bg-[#1A1A1A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#333333] hover:bg-[#202020]"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-green-400" />
                  <span className="text-green-400">Address Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-[#946CF9]" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
            <a
              href="https://maps.google.com/?q=Presidential+Road+Independence+Layout+Enugu+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#703BF7] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#8254F8]"
            >
              <Navigation className="size-3.5" />
              <span>Get Directions</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        {/* Map Visual & Details Grid */}
        <div className="grid grid-cols-1  gap-8 place-items-center">
          {/* Stylized Dark Map Preview Canvas */}
          <div className=" relative min-h-[360px] sm:min-h-[440px] lg:w-4/6  rounded-2xl border border-[#262626] bg-[#1A1A1A] overflow-hidden flex flex-col justify-between p-6">
            {/* Dark Map Vector Styling Graphic */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <svg
                className="w-full h-full object-cover"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 600"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="grid-pattern"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#262626"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#141414" />
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                {/* Simulated Enugu Road Arterials */}
                {/* Ogui / Presidential Road arterial */}
                <path
                  d="M 50,450 Q 250,380 400,280 T 750,150"
                  fill="none"
                  stroke="#333333"
                  strokeWidth="8"
                />
                <path
                  d="M 50,450 Q 250,380 400,280 T 750,150"
                  fill="none"
                  stroke="#703BF7"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />

                {/* Bisalla Road / Chime Ave crossing */}
                <path
                  d="M 200,80 Q 320,240 400,280 T 580,550"
                  fill="none"
                  stroke="#2E2E2E"
                  strokeWidth="6"
                />

                {/* Independence Layout Rings */}
                <circle
                  cx="400"
                  cy="280"
                  r="90"
                  fill="none"
                  stroke="#703BF7"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <circle
                  cx="400"
                  cy="280"
                  r="160"
                  fill="none"
                  stroke="#262626"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Top Overlay Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414]/90 backdrop-blur-md px-3.5 py-1.5 text-xs text-white">
                <span className="size-2 rounded-full bg-green-500 animate-ping" />
                <span className="font-medium">Enugu Urban Center</span>
              </div>
              <span className="rounded-xl border border-[#262626] bg-[#141414]/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono text-[#999999]">
                6.4584° N, 7.5464° E
              </span>
            </div>

            {/* Central Pin Callout */}
            <div className="relative z-10 my-auto flex flex-col items-center text-center p-4">
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-[#703BF7]/25 blur-md animate-pulse" />
                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-[#703BF7] text-white shadow-xl shadow-[#703BF7]/40 border-2 border-white/20">
                  <MapPin className="size-7" />
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#262626] bg-[#141414]/95 backdrop-blur-md p-4 shadow-2xl max-w-sm">
                <h4 className="font-heading text-sm font-bold text-white">
                  GiftHomes Corporate Suite
                </h4>
                <p className="mt-1 text-xs text-[#946CF9] font-medium">
                  Plot 14 Presidential Road, Independence Layout
                </p>
                <p className="mt-1 text-[11px] text-[#999999]">
                  Enugu State, 400102, Nigeria
                </p>
              </div>
            </div>

            {/* Bottom Bar Info */}
            <div className="relative z-10 rounded-xl border border-[#262626] bg-[#141414]/90 backdrop-blur-md p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#999999]">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#703BF7]" />
                <span>Walk-ins welcome: 8:00 AM – 5:00 PM (WAT)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#EDE7FE]">
                <ShieldCheck className="size-4 text-green-400" />
                <span className="text-[11px]">Secure Gated Access</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Landmarks & Visitor Amenities */}
          {/* <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6">
              <h3 className="font-heading text-base font-bold text-white mb-1">
                Strategic Connectivity
              </h3>
              <p className="text-xs text-[#999999] mb-4">
                Our central location provides effortless access to key civic, commercial, and transport hubs across Enugu.
              </p>

              <div className="space-y-3">
                {landmarks.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-xl border border-[#262626] bg-[#141414] p-3 transition-colors hover:border-[#333333]"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#703BF7]/15 text-[#946CF9] border border-[#703BF7]/20">
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.name}
                          </p>
                          <span className="shrink-0 text-[11px] font-mono font-medium text-[#946CF9]">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-[#999999] truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}

            {/* Visitor Notes Card */}
            {/* <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#999999] mb-3">
                Visiting GiftHomes Enugu
              </h4>
              <ul className="space-y-2 text-xs text-[#999999]">
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-[#703BF7] shrink-0" />
                  <span>
                    <strong className="text-white">Parking:</strong> Free secure visitor parking available inside the compound with 24/7 security personnel.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-[#703BF7] shrink-0" />
                  <span>
                    <strong className="text-white">Diaspora Clients:</strong> High-definition video conference room available for remote virtual tours and title verifications.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-[#703BF7] shrink-0" />
                  <span>
                    <strong className="text-white">Legal Documentation:</strong> Conveyance and contract review with accredited Enugu property attorneys.
                  </span>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
