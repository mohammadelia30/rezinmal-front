import type { NextConfig } from "next";

const apiHost =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/^https?:\/\//, "").replace(
    /\/$/,
    "",
  ) || "127.0.0.1:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `http://${apiHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
