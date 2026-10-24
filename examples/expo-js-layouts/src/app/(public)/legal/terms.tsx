import { useTranslation } from "react-i18next";
import { LegalDocument } from "@/components/layout/legal-document";
import { termsContent } from "@/lib/content/legal";

export default function TermsScreen() {
  const { t } = useTranslation();
  return <LegalDocument content={termsContent} updatedLabel={t("pages.legalUpdated")} />;
}
