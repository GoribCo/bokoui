import { Link, Text } from "bokoui/expo/ui";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { StaticPage } from "@/components/layout/static-page";
import { siteConfig } from "@/lib/config/site";

export default function ContactScreen() {
  const { t } = useTranslation();
  return (
    <StaticPage title={t("pages.contactTitle")} description={t("pages.contactDescription")}>
      <View style={{ gap: 12 }}>
        <View>
          <Text muted>{t("pages.contactSupport")}</Text>
          <Link href={`mailto:${siteConfig.contact.support}`}>{siteConfig.contact.support}</Link>
        </View>
        <View>
          <Text muted>{t("pages.contactPrivacy")}</Text>
          <Link href={`mailto:${siteConfig.contact.privacy}`}>{siteConfig.contact.privacy}</Link>
        </View>
      </View>
    </StaticPage>
  );
}
