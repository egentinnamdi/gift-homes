"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export function TopBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative border-b border-[#262626] bg-[#141414] px-4 py-2.5 text-xs text-white sm:text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex flex-1 items-center justify-center gap-2 text-center">
          <span className="font-medium text-[#999999]">
            Discover Your Dream Property in Enugu with GiftHomes
          </span>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4 hover:text-[#703BF7] transition-colors"
          >
            Learn More
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-[#999999] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
