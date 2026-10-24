"use client";

import { useTranslations } from "next-intl";
import { Alert, Button } from "bokoui/react";
import { isApiError } from "@/lib/api/errors";

export interface QueryErrorProps {
  error: Error;
  /** Retries the failed query (`query.refetch`). */
  onRetry: () => void;
  /** Smaller layout for the sidebar. */
  compact?: boolean;
}

/**
 * A failed query shown in place: a defined message and a retry button. A 403 says the user lacks access
 * and offers no retry; a 401 never gets here because `ApiClient` signs the user out first.
 */
export function QueryError({ error, onRetry, compact = false }: QueryErrorProps) {
  const t = useTranslations("errors");
  const forbidden = isApiError(error, 403);

  return (
    <Alert action="danger" role="alert" className={compact ? "text-caption" : undefined}>
      <div className="flex flex-col items-start gap-2">
        <span>{forbidden ? t("forbiddenBody") : t("loadFailed")}</span>
        {forbidden ? null : (
          <Button size="sm" variant="outline" onClick={onRetry}>
            {t("retry")}
          </Button>
        )}
      </div>
    </Alert>
  );
}
