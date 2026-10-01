import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Privacy settings", path: "/settings/privacy" });

export default function PrivacySettingsPage() {
  return (
    <StaticPage title="Privacy settings" description="Consent and data controls belong to the host project.">
      Placeholder page for privacy preferences.
    </StaticPage>
  );
}
