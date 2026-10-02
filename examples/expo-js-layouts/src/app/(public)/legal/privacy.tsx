import { useTranslation } from "react-i18next";
import { LegalDocument } from "@/components/layout/legal-document";
import { privacyContent } from "@/lib/content/legal";

export default function PrivacyScreen() {
  const { t } = useTranslation();
  return <LegalDocument content={privacyContent} updatedLabel={t("pages.legalUpdated")} />;
}
