import { Badge, Card, CardHeader, Grid, Heading, Skeleton, Text } from "bokoui/expo";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { QueryError } from "@/components/layout/query-error";
import { useOrganizations } from "@/hooks/use-organizations";
import { organizationTypes } from "@/lib/config/organization-types";

/** The signed-in user's organizations with their roles, read through `useOrganizations`. */
export function OrganizationList() {
  const { t } = useTranslation();
  const organizations = useOrganizations();

  if (organizations.isPending) {
    return (
      <Grid accessibilityState={{ busy: true }}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} shape="rect" height={112} />
        ))}
      </Grid>
    );
  }
  if (organizations.isError) return <QueryError error={organizations.error} onRetry={() => void organizations.refetch()} />;

  return (
    <Grid>
      {organizations.data.map((organization) => (
        <Card key={organization.id}>
          <CardHeader>
            <Heading as="h2" size="md">
              {organization.name}
            </Heading>
            <Text muted>{t(`organizationType.${organization.type}`, { defaultValue: organizationTypes[organization.type].label })}</Text>
          </CardHeader>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {organization.roles.map((role) => (
              <Badge key={role} color="neutral">
                {role}
              </Badge>
            ))}
          </View>
        </Card>
      ))}
    </Grid>
  );
}
