import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Contact", description: "How to reach the team.", path: "/contact" });

export default function Page() {
  return (
    <StaticPage title="Contact" description="How to reach the team.">
      Placeholder contact page.
    </StaticPage>
  );
}
