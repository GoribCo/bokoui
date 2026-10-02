import { Badge, Card, CardHeader, Heading, Text } from "bokoui/expo";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useActiveOrganization } from "@/hooks/use-active-organization";
import { organizationTypes } from "@/lib/config/organization-types";

/** Shows the organization context hook in action: name and effective roles follow the switcher. */
export function ActiveOrganizationCard() {
  const { t } = useTranslation();
  const { organization, roles } = useActiveOrganization();
  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {organization.name}
        </Heading>
        <Text muted>{t(`organizationType.${organization.type}`, { defaultValue: organizationTypes[organization.type].label })}</Text>
      </CardHeader>
      <View accessibilityLabel={t("pages.roles")} style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {roles.map((role) => (
          <Badge key={role}>{role}</Badge>
        ))}
      </View>
    </Card>
  );
}
