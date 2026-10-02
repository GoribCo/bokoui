import { Button, Card, CardHeader, Grid, Heading, Surface, Text } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { Redirect, useRouter } from "expo-router";
import { Building2, Languages, LayoutPanelLeft, ShieldCheck, type LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { PageContainer } from "@/components/layout/page-container";
import { useScreenTitle } from "@/components/layout/screen-title";
import { usePublicOrganizations } from "@/hooks/use-public-organizations";
import { DASHBOARD_PATH, SIGN_IN_PATH } from "@/lib/config/auth";
import { organizationTypes } from "@/lib/config/organization-types";
import { siteConfig } from "@/lib/config/site";
import { toRoute } from "@/lib/menu";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { useSessionStatus } from "@/providers/session-provider";

const features: { key: "f1" | "f2" | "f3" | "f4"; icon: LucideIcon }[] = [
  { key: "f1", icon: Building2 },
  { key: "f2", icon: ShieldCheck },
  { key: "f3", icon: Languages },
  { key: "f4", icon: LayoutPanelLeft },
];

/** Landing screen for visitors who are not signed in; signed-in users go straight to the dashboard. */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const router = useRouter();
  const status = useSessionStatus();
  const organizations = usePublicOrganizations();
  useScreenTitle(siteConfig.name);

  if (status === "signedIn") return <Redirect href={toRoute(DASHBOARD_PATH)} />;

  const signIn = () => router.push(toRoute(SIGN_IN_PATH));

  return (
    <>
      <Surface kind="card" style={{ backgroundColor: tokens.surface, borderBottomWidth: tokens.borderWidth, borderColor: tokens.border }} overrideStyle={{ borderRadius: 0, borderWidth: 0, borderBottomWidth: tokens.borderWidth }}>
        <PageContainer>
          <View style={{ gap: 20, paddingVertical: 16, maxWidth: 672 }}>
            <Text style={{ color: tokens.primary, fontWeight: "600" }}>{t("home.eyebrow")}</Text>
            <Heading as="h1" size="3xl">
              {t("home.title")}
            </Heading>
            <Text muted>{t("home.description")}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
              <Button onPress={signIn}>{t("home.signIn")}</Button>
            </View>
          </View>
        </PageContainer>
      </Surface>

      <PageContainer>
        <View accessibilityRole="summary" style={{ gap: 20 }}>
          <Heading as="h2" size="xl">
            {t("home.featuresTitle")}
          </Heading>
          <Grid cols={4}>
            {features.map(({ key, icon: Icon }) => (
              <Card key={key}>
                <CardHeader>
                  <Icon size={24} color={tokens.primary} />
                  <Heading as="h3" size="md">
                    {t(`home.${key}t`)}
                  </Heading>
                  <Text muted>{t(`home.${key}d`)}</Text>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </View>

        <View style={{ gap: 20 }}>
          <View style={{ gap: 4 }}>
            <Heading as="h2" size="xl">
              {t("home.orgsTitle")}
            </Heading>
            <Text muted>{t("home.orgsDescription")}</Text>
          </View>
          <Grid cols={3}>
            {(organizations.data ?? []).map((org) => (
              <Pressable
                key={org.id}
                accessibilityRole="link"
                accessibilityLabel={org.name}
                onPress={() => router.push(toRoute(publicOrganizationPath(org)))}
              >
                <Card>
                  <CardHeader>
                    <Text muted>{t(`organizationType.${org.type}`, { defaultValue: organizationTypes[org.type].label })}</Text>
                    <Heading as="h3" size="md">
                      {org.name}
                    </Heading>
                    <Text muted>{org.city}</Text>
                  </CardHeader>
                </Card>
              </Pressable>
            ))}
          </Grid>
        </View>

        <View style={{ gap: 12, alignItems: "flex-start", paddingTop: 16, borderTopWidth: tokens.borderWidth, borderColor: tokens.border }}>
          <Heading as="h2" size="xl">
            {t("home.ctaTitle")}
          </Heading>
          <Text muted>{t("home.ctaDescription")}</Text>
          <Button onPress={signIn}>{t("home.signIn")}</Button>
        </View>
      </PageContainer>
    </>
  );
}
