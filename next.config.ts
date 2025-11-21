import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  turbopack: {
    root: __dirname,
  } as any,
};

export default nextConfig;
