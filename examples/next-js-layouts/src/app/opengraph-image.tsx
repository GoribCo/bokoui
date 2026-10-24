import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph image for every page: the product name and description on the theme color. Replace it
 * with a designed image (`opengraph-image.png` in this folder) or set `ogImage` in `lib/config/site.ts`.
 * Pages with their own `opengraph-image` file override it.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.1 }}>{siteConfig.name}</div>
        <div style={{ marginTop: 28, fontSize: 36, color: "#a3a3a3", maxWidth: 900 }}>{siteConfig.description}</div>
      </div>
    ),
    size,
  );
}
