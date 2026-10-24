import { Button, Card, CardHeader, Heading, Text } from "bokoui/expo/ui";
import { useTheme, type ThemeMode } from "bokoui/expo";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useNavigate } from "@/hooks/use-navigate";

const modes: ThemeMode[] = ["light", "dark", "system"];

const samples = [
  { href: "/examples/showcase-home", titleKey: "showcase.homeTitle" },
  { href: "/examples/showcase-settings", titleKey: "showcase.settingsTitle" },
  { href: "/examples/showcase-calculator", titleKey: "showcase.calculatorTitle" },
  { href: "/dashboard", titleKey: "pages.dashboardTitle" },
] as const;

/** Every design style as a tile that switches to it at once, a mode switch, and links to the sample screens. */
export default function StylesScreen() {
  const { t } = useTranslation();
  const { tokens, style, mode, themes, setStyle, setMode } = useTheme();
  const navigate = useNavigate();
  useScreenTitle(t("showcase.galleryTitle"));

  return (
    <PageContainer>
      <PageHeader title={t("showcase.galleryTitle")} description={t("showcase.galleryDescription")} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {modes.map((value) => (
          <Button key={value} size="sm" color="neutral" variant={mode === value ? "solid" : "soft"} onPress={() => setMode(value)}>
            {t(`appearance.${value}`)}
          </Button>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {themes.map((theme) => {
          const active = theme.id === style;
          return (
            <Pressable
              key={theme.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={theme.label}
              onPress={() => setStyle(theme.id)}
              style={{ flexGrow: 1, flexBasis: 150, minWidth: 0 }}
            >
              <Card padding="sm" style={{ gap: 8, borderWidth: active ? 2 : undefined, borderColor: active ? tokens.primary : undefined }}>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: tokens.primary }} />
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: tokens.secondary }} />
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: tokens.accent }} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <Text numberOfLines={1} style={{ fontWeight: active ? "700" : "500", flexShrink: 1 }}>
                    {theme.label}
                  </Text>
                  {active ? <Check size={16} color={tokens.primary} /> : null}
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <Card>
        <CardHeader>
          <Heading as="h2" size="md">
            {t("showcase.samples")}
          </Heading>
        </CardHeader>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {samples.map((sample) => (
            <Button key={sample.href} variant="soft" color="neutral" size="sm" onPress={() => navigate(sample.href)}>
              {t(sample.titleKey)}
            </Button>
          ))}
        </View>
      </Card>
    </PageContainer>
  );
}
