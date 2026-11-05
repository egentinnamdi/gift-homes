import { HeroSection } from "@/components/home/hero-section";
import { QuickSearch } from "@/components/home/quick-search";
import { FeatureCards } from "@/components/home/feature-cards";
import { FeaturedList } from "@/components/home/featured-list";
import { Testimonials } from "@/components/home/testimonials";
import { CtaBanner } from "@/components/layout/cta-banner";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Quick Search Bar */}
      <QuickSearch />

      {/* 4 Value Proposition Cards */}
      <FeatureCards />

      {/* Curated Featured Properties */}
      <FeaturedList />

      {/* Local & Diaspora Client Testimonials */}
      <Testimonials />

      {/* Conversion Banner */}
      <CtaBanner />
    </div>
  );
}
