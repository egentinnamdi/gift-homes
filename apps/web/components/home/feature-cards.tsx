import React from "react";
import Link from "next/link";
import { Home, TrendingUp, Building2, Globe2, ArrowUpRight } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      icon: Home,
      title: "Find Your Dream Home",
      description:
        "Curated duplexes and executive apartments in Enugu's safest residential zones with verified water and power infrastructure.",
      link: "/properties",
    },
    {
      icon: TrendingUp,
      title: "Unlock Property Value",
      description:
        "Professional market valuations and advisory for landowners and developers across GRA, Independence Layout, and Centenary City.",
      link: "/contact",
    },
    {
      icon: Building2,
      title: "Effortless Property Management",
      description:
        "Comprehensive tenant screening, borehole maintenance oversight, and seamless rental collection for Enugu landlords.",
      link: "/contact",
    },
    {
      icon: Globe2,
      title: "Smart Diaspora Investments",
      description:
        "Secure 'Akulueuno' land banking with transparent documentation (C of O / Governor's Consent) and live video tours.",
      link: "/properties",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
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
                  <Link
                    href={feature.link}
                    className="flex size-8 items-center justify-center rounded-full border border-[#262626] bg-[#141414] text-[#999999] hover:text-white hover:border-[#703BF7] transition-colors"
                    aria-label={`Learn more about ${feature.title}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>

                <h3 className="mt-5 font-heading text-lg font-bold text-white group-hover:text-[#946CF9] transition-colors">
                  {feature.title}
                </h3>

                <p className="mt-2 text-xs text-[#999999] leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#262626]">
                <Link
                  href={feature.link}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#703BF7] hover:text-[#8254F8] transition-colors"
                >
                  Explore Service
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
