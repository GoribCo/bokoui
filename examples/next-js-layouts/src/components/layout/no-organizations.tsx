"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button, buttonClass } from "bokoui/react";
import { useLogout } from "@/hooks/use-auth";
import { siteConfig } from "@/lib/config/site";
import { AppFrame } from "./app-frame";
import { Branding } from "./branding";
import { StatusView } from "./status-view";

/** Shown instead of the shell when the signed-in user belongs to no organization: nothing to navigate yet. */
export function NoOrganizations() {
  const t = useTranslations();
  const logout = useLogout();

  return (
    <AppFrame>
      <header className="shrink-0 border-b border-border">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
          <Branding name={siteConfig.name} />
          <Button variant="outline" size="sm" loading={logout.isPending} onClick={() => logout.mutate()}>
            {t("account.logout")}
          </Button>
        </div>
      </header>
      <main id="main-content" className="flex flex-1 items-center justify-center">
        <StatusView
          title={t("organization.noneTitle")}
          description={t("organization.noneBody")}
          actions={
            <Link href="/contact" data-tone="primary" className={buttonClass({ variant: "outline" })}>
              {t("footer.contact")}
            </Link>
          }
        />
      </main>
    </AppFrame>
  );
}
