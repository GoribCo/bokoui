import { getFormatter, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { initials } from "@/components/account/user-avatar";
import { Heading, Inline, Text } from "@/components/layout/primitives";
import { PageContainer } from "@/components/layout/page-container";
import { organizationTypes } from "@/lib/config/organization-types";
import type { PublicOrganization } from "@/lib/types";

function Facts({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-nav">{children}</dl>
      </CardContent>
    </Card>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 wrap-break-word">{children}</dd>
    </>
  );
}

/** Sections specific to the organization type; add a case when adding a type (FR-3.8). */
async function TypeSections({ details }: { details: PublicOrganization["details"] }) {
  const t = await getTranslations("publicProfile");
  const format = await getFormatter();
  const yesNo = (value: boolean) => (value ? t("yes") : t("no"));

  switch (details.type) {
    case "hospital":
      return (
        <Facts title={t("hospital")}>
          <Fact label={t("beds")}>{format.number(details.beds)}</Fact>
          <Fact label={t("emergency")}>{yesNo(details.emergency)}</Fact>
          <Fact label={t("departments")}>
            <Inline gap={2}>
              {details.departments.map((department) => (
                <Badge key={department} variant="secondary">
                  {department}
                </Badge>
              ))}
            </Inline>
          </Fact>
        </Facts>
      );
    case "pharmacy":
      return (
        <Facts title={t("pharmacy")}>
          <Fact label={t("licenseNo")}>{details.licenseNo}</Fact>
          <Fact label={t("open24h")}>{yesNo(details.open24h)}</Fact>
          <Fact label={t("delivery")}>{yesNo(details.delivery)}</Fact>
        </Facts>
      );
    case "company":
      return (
        <Facts title={t("company")}>
          <Fact label={t("industry")}>{details.industry}</Fact>
          <Fact label={t("employees")}>{format.number(details.employees)}</Fact>
          <Fact label={t("founded")}>{details.founded}</Fact>
        </Facts>
      );
  }
}

/** Public organization profile: visible without login, with sections per organization type (FR-3.7). */
export async function PublicProfile({ organization }: { organization: PublicOrganization }) {
  const [t, typeT] = await Promise.all([getTranslations("publicProfile"), getTranslations("organizationType")]);
  const typeLabel = typeT.has(organization.type) ? typeT(organization.type) : organizationTypes[organization.type].label;

  return (
    <PageContainer>
      <header className="flex items-center gap-4">
        <Avatar className="size-14 rounded-lg">
          {organization.logoUrl ? <AvatarImage src={organization.logoUrl} alt="" /> : null}
          <AvatarFallback className="rounded-lg text-foreground">{initials(organization.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <Heading as="h1" className="text-title wrap-break-word">
            {organization.name}
          </Heading>
          <Inline gap={2}>
            <Badge variant="secondary">{typeLabel}</Badge>
            <Text muted as="span">
              {organization.city}
            </Text>
          </Inline>
        </div>
      </header>

      <section aria-labelledby="about" className="flex flex-col gap-2">
        <Heading as="h2" size="md" id="about">
          {t("about")}
        </Heading>
        <Text>{organization.description}</Text>
      </section>

      <TypeSections details={organization.details} />

      {organization.phone || organization.website ? (
        <Facts title={t("contact")}>
          {organization.phone ? <Fact label={t("phone")}>{organization.phone}</Fact> : null}
          {organization.website ? (
            <Fact label={t("website")}>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {organization.website}
              </a>
            </Fact>
          ) : null}
        </Facts>
      ) : null}
    </PageContainer>
  );
}
