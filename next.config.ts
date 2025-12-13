import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // cho phép tất cả hostname HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // cho phép tất cả hostname HTTP (nếu cần)
      },
    ],
  },
};

export default nextConfig;
