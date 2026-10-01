"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatusView } from "./status-view";

export interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Content of error boundaries: a message and a retry button. The error is logged for the host's monitoring. */
export function ErrorView({ error, reset }: ErrorViewProps) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusView
      title={t("errorTitle")}
      description={t("errorBody")}
      actions={<Button onClick={reset}>{t("retry")}</Button>}
    />
  );
}
