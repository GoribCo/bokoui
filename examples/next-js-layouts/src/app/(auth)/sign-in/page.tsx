import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/components/auth/sign-in-form";
import { RETURN_TO_PARAM } from "@/config/auth";
import { safeReturnPath } from "@/lib/auth/paths";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return buildMetadata({ title: t("title"), path: "/sign-in", noindex: true });
}

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const params = await searchParams;
  const next = params[RETURN_TO_PARAM];
  return <SignInForm returnTo={safeReturnPath(typeof next === "string" ? next : undefined)} />;
}
