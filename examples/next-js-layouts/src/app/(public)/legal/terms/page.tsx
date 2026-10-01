import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms",
  description: "Terms of use.",
  path: "/legal/terms",
});

export default function Page() {
  return (
    <StaticPage size="md" title="Terms" description="Terms of use.">
      Placeholder terms of use.
    </StaticPage>
  );
}
