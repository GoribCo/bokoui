import type { NextConfig } from "next";

// GitHub Pages: static export under /bokoui/react (set NEXT_PUBLIC_BASE_PATH in CI; unset for local dev).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath && { output: "export", basePath, images: { unoptimized: true }, trailingSlash: true }),
};

export default nextConfig;
