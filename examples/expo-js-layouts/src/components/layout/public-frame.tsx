import { Button } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisplaySettings } from "@/components/appearance/display-settings";
import { useFooterLinks } from "@/hooks/use-footer-links";
import { SIGN_IN_PATH } from "@/lib/config/auth";
import { siteConfig } from "@/lib/config/site";
import { toRoute } from "@/lib/menu";
import { Branding } from "./branding";
import { Footer } from "./footer";

export interface PublicFrameProps {
  /** Show the sign-in button in the header (off on the sign-in screen itself). */
  signInButton?: boolean;
  /** Center the content vertically (sign-in). */
  centered?: boolean;
  children: ReactNode;
}

/** Frame for screens anyone can open: a light header, the content in its own scroll area, and the footer. */
export function PublicFrame({ signInButton = true, centered = false, children }: PublicFrameProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const links = useFooterLinks(siteConfig.footerLinks);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, paddingLeft: insets.left, paddingRight: insets.right }}>
      <View style={{ paddingTop: insets.top, backgroundColor: tokens.surface, borderBottomWidth: tokens.borderWidth, borderColor: tokens.border }}>
        <View accessibilityRole="header" style={{ minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, paddingHorizontal: 16 }}>
          <Branding name={siteConfig.name} onPress={() => router.replace(toRoute("/"))} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <DisplaySettings />
            {signInButton ? (
              <Button size="sm" variant="outline" onPress={() => router.push(toRoute(SIGN_IN_PATH))}>
                {t("auth.submit")}
              </Button>
            ) : null}
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexGrow: 1, justifyContent: centered ? "center" : "flex-start" }}>{children}</View>
        <Footer links={links} copyright={t("footer.copyright", { year: new Date().getFullYear(), name: siteConfig.name })} navigationLabel={t("footer.navigation")} />
        <View style={{ height: insets.bottom }} />
      </ScrollView>
    </View>
  );
}
