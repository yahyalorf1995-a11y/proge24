import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  typescript: {
    ignoreBuildErrors: false,
  },
  allowedDevOrigins: [
    "localhost:3000",
    "*.app.github.dev",
    "*.github.dev",
    "*.githubpreview.dev",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.app.github.dev",
        "*.github.dev",
        "*.githubpreview.dev",
      ],
    },
  },
};

export default nextConfig;
