import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
