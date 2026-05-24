import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output mode: bundles only what's needed to run the server.
  // This dramatically reduces Docker image size (no full node_modules copy).
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
};

export default nextConfig;
