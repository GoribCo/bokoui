import { Avatar, Badge, Card, CardHeader, Heading, Link, Text } from "bokoui/expo/ui";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { MenuIcon } from "@/components/navigation/menu-icon";
import { PageContainer } from "@/components/layout/page-container";
import { useLocale } from "@/hooks/use-locale";
import { organizationTypes } from "@/lib/config/organization-types";
import { formatNumber } from "@/lib/i18n/format";
import type { PublicOrganization } from "@/lib/types";

function Facts({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {title}
        </Heading>
      </CardHeader>
      <View style={{ gap: 8 }}>{children}</View>
    </Card>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <Text muted style={{ width: 120 }}>
        {label}
      </Text>
      <View style={{ flex: 1, minWidth: 0 }}>{typeof children === "string" || typeof children === "number" ? <Text>{children}</Text> : children}</View>
    </View>
  );
}

/** Sections specific to the organization type; add a case when adding a type. */
function TypeSections({ details }: { details: PublicOrganization["details"] }) {
  const { t } = useTranslation();
  const locale = useLocale();
  const yesNo = (value: boolean) => (value ? t("publicProfile.yes") : t("publicProfile.no"));

  switch (details.type) {
    case "hospital":
      return (
        <Facts title={t("publicProfile.hospital")}>
          <Fact label={t("publicProfile.beds")}>{formatNumber(details.beds, locale)}</Fact>
          <Fact label={t("publicProfile.emergency")}>{yesNo(details.emergency)}</Fact>
          <Fact label={t("publicProfile.departments")}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {details.departments.map((department) => (
                <Badge key={department} color="neutral">
                  {department}
                </Badge>
              ))}
            </View>
          </Fact>
        </Facts>
      );
    case "pharmacy":
      return (
        <Facts title={t("publicProfile.pharmacy")}>
          <Fact label={t("publicProfile.licenseNo")}>{details.licenseNo}</Fact>
          <Fact label={t("publicProfile.open24h")}>{yesNo(details.open24h)}</Fact>
          <Fact label={t("publicProfile.delivery")}>{yesNo(details.delivery)}</Fact>
        </Facts>
      );
    case "company":
      return (
        <Facts title={t("publicProfile.company")}>
          <Fact label={t("publicProfile.industry")}>{details.industry}</Fact>
          <Fact label={t("publicProfile.employees")}>{formatNumber(details.employees, locale)}</Fact>
          <Fact label={t("publicProfile.founded")}>{String(details.founded)}</Fact>
        </Facts>
      );
  }
}

/** Public organization profile: visible without login, with sections per organization type. */
export function PublicProfile({ organization }: { organization: PublicOrganization }) {
  const { t } = useTranslation();
  const type = organizationTypes[organization.type];

  return (
    <PageContainer>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Avatar size="lg" shape="square" src={organization.logoUrl} name={organization.name} color="primary">
          <MenuIcon name={type.icon} size={24} />
        </Avatar>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Heading as="h1" size="2xl">
            {organization.name}
          </Heading>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Badge>{t(`organizationType.${organization.type}`, { defaultValue: type.label })}</Badge>
            <Text muted>{organization.city}</Text>
          </View>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Heading as="h2" size="md">
          {t("publicProfile.about")}
        </Heading>
        <Text>{organization.description}</Text>
      </View>

      <TypeSections details={organization.details} />

      {organization.phone || organization.website ? (
        <Facts title={t("publicProfile.contact")}>
          {organization.phone ? <Fact label={t("publicProfile.phone")}>{organization.phone}</Fact> : null}
          {organization.website ? (
            <Fact label={t("publicProfile.website")}>
              <Link href={organization.website}>
                {organization.website}
              </Link>
            </Fact>
          ) : null}
        </Facts>
      ) : null}
    </PageContainer>
  );
}
