import { ShowcaseSettings } from "@/components/examples/showcase/showcase-settings";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Sample: settings", description: "Sample screen that shows a design style.", path: "/examples/showcase-settings" });

export default function Page() {
  return <ShowcaseSettings />;
}
