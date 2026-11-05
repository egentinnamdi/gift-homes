import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Admins can paste image URLs from any HTTPS host
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
