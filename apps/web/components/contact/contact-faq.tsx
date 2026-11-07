"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ShieldCheck, CheckCircle2 } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "How do I schedule an in-person or diaspora virtual inspection?",
      answer:
        "You can schedule an inspection by submitting an inquiry via our contact form, emailing giftedproperties2@gmail.com, or calling our desk directly. For diaspora and interstate clients, we conduct interactive live video walkthroughs via WhatsApp or Zoom, detailing every room, boundary wall, access road, and utility connection in real time.",
      category: "Inspections",
    },
    {
      question: "How are property titles and C of O documents verified in Enugu?",
      answer:
        "Every listing featured on GiftHomes undergoes rigorous preliminary title verification at the Enugu State Ministry of Lands and Survey. We cross-reference the Certificate of Occupancy (C of O), Governor's Consent, Registered Survey Plans, and Deeds of Assignment to ensure all properties have unencumbered, genuine titles.",
      category: "Due Diligence",
    },
    {
      question: "What are standard rental terms and fees in Enugu State?",
      answer:
        "Residential and executive rentals in Enugu are traditionally billed on an annual (per annum) basis. In line with Nigerian real estate standards, leases typically involve a 10% agency fee, a 10% legal/tenancy agreement fee, and a refundable caution deposit. All applicable fees are communicated with full transparency prior to payment.",
      category: "Leasing",
    },
    {
      question: "Can diaspora buyers purchase and develop property safely through GiftHomes?",
      answer:
        "Yes. We specialize in secure diaspora property acquisition across Enugu. We provide independent title search reports, handle legal conveyance through accredited Nigerian solicitors, and offer milestone video reporting so you can invest with absolute peace of mind without traveling.",
      category: "Diaspora",
    },
    {
      question: "Which neighborhoods in Enugu are best for luxury living and capital growth?",
      answer:
        "Independence Layout and GRA (Government Reserved Area) are the premier luxury neighborhoods with superior infrastructure and high capital appreciation. For serene, gated community living, Golf Estate is exceptionally popular, while Trans-Ekulu and New Haven offer high rental yields for buy-to-let investors.",
      category: "Locations",
    },
    {
      question: "How quickly does the GiftHomes team respond to inquiries?",
      answer:
        "Our Enugu advisory desk monitors inquiries continuously during Nigerian business hours (Monday – Friday, 8:00 AM – 5:00 PM WAT). You can generally expect an initial response within 2 hours. Inquiries submitted on weekends or public holidays are addressed first thing on the following business day.",
      category: "Client Support",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="border-t border-[#262626] bg-[#141414] py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#1A1A1A] px-3.5 py-1 text-xs font-semibold text-[#946CF9] mb-3">
            <HelpCircle className="size-3.5 text-[#703BF7]" />
            Frequently Asked Questions
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Everything You Need to Know About Renting & Buying in Enugu
          </h2>
          <p className="mt-3 text-sm text-[#999999] leading-relaxed">
            Clear answers to common questions regarding property inspections, title verifications, tenancy terms, and diaspora acquisition services.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[#703BF7]/40 bg-[#1A1A1A] shadow-lg shadow-[#703BF7]/5"
                    : "border-[#262626] bg-[#1A1A1A]/80 hover:border-[#333333]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#141414] border border-[#262626] text-[11px] font-mono font-bold text-[#946CF9]">
                      0{index + 1}
                    </span>
                    <span className="font-heading text-sm font-semibold text-white sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#262626] bg-[#141414] text-[#999999] transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white bg-[#703BF7]/20 border-[#703BF7]/40" : ""
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#262626] px-5 pb-6 pt-4 sm:px-6">
                    <div className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#703BF7]">
                      <CheckCircle2 className="size-3" />
                      <span>{faq.category} Details</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#999999] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Assurance Note */}
        <div className="mt-10 rounded-2xl border border-[#262626] bg-[#1A1A1A] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#703BF7]/15 text-[#946CF9] border border-[#703BF7]/20">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Have a unique requirement or question not listed here?
              </p>
              <p className="text-[11px] text-[#999999]">
                Our dedicated client desk is available on WhatsApp and phone for personalized guidance.
              </p>
            </div>
          </div>
          <a
            href="tel:+2348034567890"
            className="shrink-0 rounded-xl bg-[#703BF7] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#8254F8] transition-colors"
          >
            Call Us Directly
          </a>
        </div>
      </div>
    </section>
  );
}
