import { LegalDocument } from "@/components/layout/legal-document";
import { termsContent } from "@/lib/content/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: termsContent.title,
  description: termsContent.description,
  path: "/legal/terms",
});

export default function Page() {
  return <LegalDocument content={termsContent} />;
}
