import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "192.168.137.1",
      },
      {
        hostname: "192.168.5.36",
      },
      {
        hostname: "admin.narmertex.com",
      },
      {
        hostname: "192.168.1.15",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
