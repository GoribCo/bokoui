import { Redirect, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SignInForm } from "@/components/auth/sign-in-form";
import { useScreenTitle } from "@/components/layout/screen-title";
import { safeReturnPath } from "@/lib/auth/paths";
import { DASHBOARD_PATH, RETURN_TO_PARAM } from "@/lib/config/auth";
import { toRoute } from "@/lib/menu";
import { useSessionStatus } from "@/providers/session-provider";

/** Sign-in. Signed-in users go to the dashboard; others return to where they were headed after signing in. */
export default function SignInScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ [RETURN_TO_PARAM]?: string }>();
  const status = useSessionStatus();
  useScreenTitle(t("auth.title"));

  const returnTo = safeReturnPath(typeof params[RETURN_TO_PARAM] === "string" ? params[RETURN_TO_PARAM] : undefined);
  if (status === "signedIn") return <Redirect href={toRoute(returnTo === "/" ? DASHBOARD_PATH : returnTo)} />;
  return <SignInForm returnTo={returnTo} />;
}
