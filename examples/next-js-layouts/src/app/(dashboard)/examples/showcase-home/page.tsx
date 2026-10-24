import { ShowcaseHome } from "@/components/examples/showcase/showcase-home";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Sample: home", description: "Sample screen that shows a design style.", path: "/examples/showcase-home" });

export default function Page() {
  return <ShowcaseHome />;
}
