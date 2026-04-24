import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/kakao-ads-dashboard",
  images: { unoptimized: true },
};

export default nextConfig;
