import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@sloty/ui", "@sloty/auth", "@sloty/config"],
  serverExternalPackages: ["@sloty/db"]
};

export default nextConfig;
