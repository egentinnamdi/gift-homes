import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    // /_next/image 404s when the app is served through Vercel services rewrites; serve images as-is.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Admins can paste image URLs from any HTTPS host
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
