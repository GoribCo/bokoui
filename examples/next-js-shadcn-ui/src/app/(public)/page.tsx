import { Building2, Languages, LayoutPanelLeft, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, Heading, Text } from "@/components/layout/primitives";
import { PageContainer } from "@/components/layout/page-container";
import { DASHBOARD_PATH, SIGN_IN_PATH } from "@/lib/config/auth";
import { organizationTypes } from "@/lib/config/organization-types";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { buildMetadata } from "@/lib/seo";
import { getSession } from "@/lib/session/session";
import { services } from "@/lib/services";

export const metadata = buildMetadata({
  title: "Welcome",
  path: "/",
});

const features: { key: "f1" | "f2" | "f3" | "f4"; icon: LucideIcon }[] = [
  { key: "f1", icon: Building2 },
  { key: "f2", icon: ShieldCheck },
  { key: "f3", icon: Languages },
  { key: "f4", icon: LayoutPanelLeft },
];

/** Landing page for visitors who are not signed in; signed-in users go straight to the dashboard. */
export default async function HomePage() {
  const session = await getSession();
  if (session) redirect(DASHBOARD_PATH);

  const [t, tType, organizations] = await Promise.all([
    getTranslations("home"),
    getTranslations("organizationType"),
    services.organizations.listPublicOrganizations(),
  ]);

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <PageContainer size="lg">
          <div className="flex max-w-2xl flex-col gap-5 py-10 md:py-16">
            <p className="text-nav font-medium text-primary">{t("eyebrow")}</p>
            <Heading as="h1" size="3xl">
              {t("title")}
            </Heading>
            <Text muted>{t("description")}</Text>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={SIGN_IN_PATH}>{t("signIn")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#organizations">{t("browse")}</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer size="lg">
        <div className="flex flex-col gap-12 py-10 md:py-14">
          <section aria-labelledby="features-title" className="flex flex-col gap-5">
            <Heading as="h2" size="xl" id="features-title">
              {t("featuresTitle")}
            </Heading>
            <Grid cols={4}>
              {features.map(({ key, icon: Icon }) => (
                <Card key={key}>
                  <CardHeader>
                    <Icon aria-hidden="true" className="mb-2 size-6" />
                    <CardTitle>
                      <h3>{t(`${key}t`)}</h3>
                    </CardTitle>
                    <CardDescription>{t(`${key}d`)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </Grid>
          </section>

          <section id="organizations" aria-labelledby="orgs-title" className="flex scroll-mt-6 flex-col gap-5">
            <div className="flex flex-col gap-1">
              <Heading as="h2" size="xl" id="orgs-title">
                {t("orgsTitle")}
              </Heading>
              <Text muted>{t("orgsDescription")}</Text>
            </div>
            <Grid cols={3}>
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={publicOrganizationPath(org)}
                  prefetch={false}
                  className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Card className="h-full transition-colors hover:bg-muted">
                    <CardHeader>
                      <CardDescription>
                        {tType.has(org.type) ? tType(org.type) : organizationTypes[org.type].label}
                      </CardDescription>
                      <CardTitle>
                        <h3>{org.name}</h3>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Text muted>{org.city}</Text>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Grid>
          </section>

          <section className="flex flex-col items-start gap-3 border-t border-border pt-8">
            <Heading as="h2" size="xl">
              {t("ctaTitle")}
            </Heading>
            <Text muted>{t("ctaDescription")}</Text>
            <Button asChild>
              <Link href={SIGN_IN_PATH}>{t("signIn")}</Link>
            </Button>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
