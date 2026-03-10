import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.nawgati.com",
      },
    ],
  },
};

export default nextConfig;
