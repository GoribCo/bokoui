import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "How personal data is handled.",
  path: "/legal/privacy",
});

export default function Page() {
  return (
    <StaticPage
      size="md"
      title="Privacy"
      description="How personal data is handled."
    >
      Placeholder privacy policy.
    </StaticPage>
  );
}
