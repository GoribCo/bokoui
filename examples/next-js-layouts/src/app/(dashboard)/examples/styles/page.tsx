import { StyleGallery } from "@/components/examples/showcase/style-gallery";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Style gallery", description: "Sample screen that shows a design style.", path: "/examples/styles" });

export default function Page() {
  return <StyleGallery />;
}
