import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Default is 4 hours; keep generated image variants for a week so they
    // aren't re-optimized (and decoded in memory) again unnecessarily.
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
