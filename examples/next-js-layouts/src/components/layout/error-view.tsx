"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "bokoui/react";
import { reportError } from "@/lib/monitoring/report-error";
import { StatusView } from "./status-view";

export interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Content of error boundaries: a message and a retry button. The error goes to `reportError`. */
export function ErrorView({ error, reset }: ErrorViewProps) {
  const t = useTranslations("errors");

  useEffect(() => {
    reportError(error, { source: "error-boundary", digest: error.digest });
  }, [error]);

  return (
    <StatusView
      title={t("errorTitle")}
      description={t("errorBody")}
      actions={<Button onClick={reset}>{t("retry")}</Button>}
    />
  );
}
