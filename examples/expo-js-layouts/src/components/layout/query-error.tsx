import { Alert, Button } from "bokoui/expo/ui";
import { useTranslation } from "react-i18next";
import { isApiError } from "@/lib/api/errors";

export interface QueryErrorProps {
  error: Error;
  /** Retries the failed query (`query.refetch`). */
  onRetry: () => void;
}

/**
 * A failed query shown in place: a defined message and a retry button. A 403 says the user lacks access
 * and offers no retry; a 401 never gets here because `ApiClient` ends the session first.
 */
export function QueryError({ error, onRetry }: QueryErrorProps) {
  const { t } = useTranslation();
  const forbidden = isApiError(error, 403);
  return (
    <Alert action="danger" title={forbidden ? t("errors.forbiddenBody") : t("errors.loadFailed")}>
      {forbidden ? null : (
        <Button size="sm" variant="outline" onPress={onRetry}>
          {t("errors.retry")}
        </Button>
      )}
    </Alert>
  );
}
