import { LegalDocument } from "@/components/layout/legal-document";
import { privacyContent } from "@/lib/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: privacyContent.title,
  description: privacyContent.description,
  path: "/legal/privacy",
});

export default function Page() {
  return <LegalDocument content={privacyContent} />;
}
