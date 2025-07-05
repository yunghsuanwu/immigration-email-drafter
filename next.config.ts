import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/re-immigration",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/re-immigration",
        permanent: true
      }
    ];
  }
  /* config options here */
};

export default nextConfig;
