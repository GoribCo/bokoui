import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { buttonClass } from "bokoui/react";
import { DisplaySettingsMenu } from "@/components/appearance/display-settings-menu";
import { AppFrame } from "@/components/layout/app-frame";
import { Branding } from "@/components/layout/branding";
import { Footer } from "@/components/layout/footer";
import { features } from "@/lib/config/features";
import { SIGN_IN_PATH } from "@/lib/config/auth";
import { siteConfig } from "@/lib/config/site";
import { getMenuTranslator } from "@/lib/i18n/server";
import { resolveLabel } from "@/lib/menu";

/** Layout for pages anyone can open: a light header, the content, and the footer. No sidebar, no sign-in needed. */
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [t, translate] = await Promise.all([
    getTranslations(),
    getMenuTranslator(),
  ]);
  const links = siteConfig.footerLinks.map((link) => ({
    ...link,
    label: resolveLabel(link, translate),
  }));

  return (
    <AppFrame>
      <header className="shrink-0 border-b border-border">
        <div className="flex h-14 w-full items-center justify-between gap-3 px-4 sm:px-6">
          <Branding name={siteConfig.name} />
          <div className="flex items-center gap-2">
            <DisplaySettingsMenu styleSwitcher={features.styleSwitcher} fontSwitcher={features.fontSwitcher} />
            <Link
              href={SIGN_IN_PATH}
              data-tone="primary"
              className={buttonClass({ variant: "outline", size: "sm" })}
            >
              {t("auth.submit")}
            </Link>
          </div>
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        links={links}
        copyright={t("footer.copyright", {
          year: new Date().getFullYear(),
          name: siteConfig.name,
        })}
        navigationLabel={t("footer.navigation")}
      />
    </AppFrame>
  );
}
