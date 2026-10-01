import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Help",
  description: "Where to find answers and support.",
  path: "/help",
});

export default function Page() {
  return (
    <StaticPage
      size="md"
      title="Help"
      description="Where to find answers and support."
    >
      Placeholder help page. Replace it with the help center of the host
      project.
    </StaticPage>
  );
}
