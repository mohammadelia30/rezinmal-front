import type { NextConfig } from "next";

const apiInternalUrl =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
  "http://rozinmall_web:8000";

const nextConfig: NextConfig = {
  output: "standalone",

  /**
   * درخواست‌های /api/* از فرانت به کانتینر بک‌اند Rozinweb پروکسی می‌شوند.
   * روی شبکه داکر: http://rozinmall_web:8000
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
