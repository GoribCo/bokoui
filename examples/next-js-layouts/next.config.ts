import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Enables `forbidden()` and forbidden.tsx (a real 403 for role-restricted pages).
  experimental: { authInterrupts: true },
};

export default withNextIntl(nextConfig);
