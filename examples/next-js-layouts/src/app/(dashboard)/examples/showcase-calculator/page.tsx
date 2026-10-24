import { Calculator } from "@/components/examples/showcase/calculator";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Sample: calculator", description: "Sample screen that shows a design style.", path: "/examples/showcase-calculator" });

export default function Page() {
  return <Calculator />;
}
