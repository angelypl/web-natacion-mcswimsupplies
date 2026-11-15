import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin la insignia de Next en desarrollo: tapa la esquina al revisar el diseño.
  devIndicators: false,
  images: {
    // Default is 4 hours; keep generated image variants for a week so they
    // aren't re-optimized (and decoded in memory) again unnecessarily.
    minimumCacheTTL: 604800,
    // Obligatorio desde Next 16. Las fotos usan 60; 75 queda para el logo.
    qualities: [60, 75],
  },
};

export default nextConfig;
