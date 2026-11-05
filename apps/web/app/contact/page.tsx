import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactCards } from "@/components/contact/contact-cards";
import { ContactForm } from "@/components/contact/contact-form";
import { OfficeLocation } from "@/components/contact/office-location";
import { ContactFaq } from "@/components/contact/contact-faq";
import { CtaBanner } from "@/components/layout/cta-banner";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageCircle,
  Building2,
  Globe2,
} from "lucide-react";
import { ENUGU_OFFICE_DETAILS } from "@gift-homes/shared";

export const metadata: Metadata = {
  title: "Contact Us | GiftHomes - Enugu Real Estate Listing Platform",
  description:
    "Connect with GiftHomes Enugu. Reach out for verified property rentals, duplex acquisitions, diaspora advisory, or schedule an inspection at Plot 14 Presidential Road, Independence Layout, Enugu.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full bg-[#141414]">
      {/* 1. Hero Header */}
      <ContactHero />

      {/* 2. Direct Contact Cards (4-column grid) */}
      <ContactCards />

      {/* 3. Main Inquiry & Advisory Section */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (7 cols on lg) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Supporting Advisory Sidebar (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Advisory Promise Card */}
            <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#141414] px-3.5 py-1 text-xs font-semibold text-[#946CF9] mb-4">
                <ShieldCheck className="size-3.5 text-[#703BF7]" />
                The GiftHomes Assurance
              </div>

              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Why Inquire with GiftHomes?
              </h3>
              <p className="text-xs text-[#999999] leading-relaxed mb-6">
                We are committed to delivering the most transparent, secure real estate experience in southeastern Nigeria.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#703BF7]/15 text-[#946CF9]">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Zero Unverified Listings
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#999999] leading-relaxed">
                      Every residential duplex, flat, and commercial space is physically inspected and documented by our field agents.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#703BF7]/15 text-[#946CF9]">
                    <Building2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Ministry of Lands Title Due Diligence
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#999999] leading-relaxed">
                      We cross-check C of O, Governor&apos;s Consent, and gazetted surveys with the Enugu State Government registry.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#703BF7]/15 text-[#946CF9]">
                    <Globe2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      Akulueuno Diaspora Support
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#999999] leading-relaxed">
                      Virtual live walkthroughs, escrow documentation, and dedicated legal assistance for overseas Ndi-Igbo buyers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Communication Channels Card */}
            <div className="rounded-2xl border border-[#262626] bg-[#1A1A1A] p-6">
              <h4 className="font-heading text-sm font-bold text-white mb-3">
                Need Faster Assistance?
              </h4>

              <div className="space-y-3 text-xs">
                <a
                  href={`https://wa.me/2349159027226?text=${encodeURIComponent(
                    "Hello GiftHomes, I would like to inquire about properties in Enugu."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/10 p-3.5 text-green-400 hover:bg-green-500/15 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="size-4 text-green-400" />
                    <span className="font-semibold">WhatsApp Property Desk</span>
                  </div>
                  <span className="text-[11px] font-mono">Chat Now →</span>
                </a>

                <a
                  href={`tel:${ENUGU_OFFICE_DETAILS.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-between rounded-xl border border-[#262626] bg-[#141414] p-3.5 text-white hover:border-[#333333] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="size-4 text-[#946CF9]" />
                    <span>Office Switchboard: {ENUGU_OFFICE_DETAILS.phone}</span>
                  </div>
                  <span className="text-[11px] text-[#999999]">Call</span>
                </a>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#262626] flex items-center justify-between text-[11px] text-[#666666]">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3 text-[#946CF9]" />
                  Average Response: &lt; 2 Hours
                </span>
                <span className="font-mono">Enugu, NG</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Headquarters Location & Proximity Map Preview */}
      <OfficeLocation />

      {/* 5. Frequently Asked Questions */}
      <ContactFaq />

      {/* 6. Call To Action Banner */}
      <CtaBanner
        title="Ready to Explore Available Properties in Enugu?"
        subtitle="Browse verified residential duplexes, executive serviced apartments, and prime land listings across Independence Layout, GRA, and Golf Estate."
        primaryButtonText="View Enugu Properties"
        primaryButtonLink="/properties"
      />
    </div>
  );
}
