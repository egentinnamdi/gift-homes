"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Send, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="border-t border-[#262626] bg-[#141414] text-white">
      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#703BF7] text-white shadow-lg shadow-[#703BF7]/20">
                <Building2 className="size-5" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                GiftHomes
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm text-[#999999] leading-relaxed">
              Your premier gateway to verified residential, commercial, and diaspora
              real estate in Enugu, Nigeria. Discover duplexes in GRA, serviced flats
              in Independence Layout, and golf view residences.
            </p>

            {/* Newsletter Input */}
            <div className="mt-6">
              <form onSubmit={handleSubscribe} className="relative max-w-md">
                <div className="flex items-center rounded-xl border border-[#262626] bg-[#1A1A1A] p-1.5 focus-within:border-[#703BF7] transition-colors">
                  <div className="pl-3 text-[#999999]">
                    <Mail className="size-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-[#666666] outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#703BF7] text-white hover:bg-[#8254F8] transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </form>

              {subscribed && (
                <div className="mt-2.5 flex items-center gap-2 text-xs text-green-400 animate-in fade-in">
                  <CheckCircle2 className="size-3.5" />
                  <span>Thanks! You have subscribed to Enugu property updates!</span>
                </div>
              )}
            </div>
          </div>

          {/* Nav Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Quick Links */}
            <div>
              <p className="font-heading text-sm font-semibold text-white">Platform</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#999999]">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="hover:text-white transition-colors">
                    Properties Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Client Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Enugu Neighborhoods */}
            <div>
              <p className="font-heading text-sm font-semibold text-white">Enugu Locations</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#999999]">
                <li>
                  <Link href="/properties?neighborhood=GRA" className="hover:text-white transition-colors">
                    GRA (Govt Reserved Area)
                  </Link>
                </li>
                <li>
                  <Link href="/properties?neighborhood=Independence+Layout" className="hover:text-white transition-colors">
                    Independence Layout
                  </Link>
                </li>
                <li>
                  <Link href="/properties?neighborhood=Golf+Estate" className="hover:text-white transition-colors">
                    Enugu Golf Estate
                  </Link>
                </li>
                <li>
                  <Link href="/properties?neighborhood=Trans-Ekulu" className="hover:text-white transition-colors">
                    Trans-Ekulu
                  </Link>
                </li>
                <li>
                  <Link href="/properties?neighborhood=New+Haven" className="hover:text-white transition-colors">
                    New Haven
                  </Link>
                </li>
              </ul>
            </div>

            {/* Enugu Office / Contact Info */}
            <div className="col-span-2 sm:col-span-1">
              <p className="font-heading text-sm font-semibold text-white">Enugu Office</p>
              <ul className="mt-4 space-y-3 text-xs text-[#999999]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="size-4 shrink-0 text-[#703BF7] mt-0.5" />
                  <span>Plot 14 Presidential Road, Independence Layout, Enugu, Nigeria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-[#703BF7]" />
                  <span>+234 915 902 7226</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-[#703BF7]" />
                  <span>info@gifthomes.ng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#262626] pt-8 text-xs text-[#666666] sm:flex-row">
          <p>© 2026 GiftHomes Real Estate Enugu. All demonstration rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#999999] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#999999] cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
