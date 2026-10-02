import { Button } from "bokoui/expo/ui";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { reportError } from "@/lib/monitoring/report-error";
import { StatusView } from "./status-view";

export interface ErrorViewProps {
  error: Error;
  /** Renders the failed route again. */
  retry: () => void;
}

/** Content of error boundaries: a message and a retry button. The error goes to `reportError`. */
export function ErrorView({ error, retry }: ErrorViewProps) {
  const { t } = useTranslation();

  useEffect(() => {
    reportError(error, { source: "error-boundary" });
  }, [error]);

  return <StatusView title={t("errors.errorTitle")} description={t("errors.errorBody")} actions={<Button onPress={retry}>{t("errors.retry")}</Button>} />;
}
