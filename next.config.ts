import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["via.placeholder.com", "placehold.co", "localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4200",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
