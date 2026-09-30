import { cn, type ClassValue } from "../cn";

export const emptyStateClass = (className?: ClassValue) =>
  cn("flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center font-ui", className);
export const emptyStateIconClass =
  "flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6";
export const emptyStateTitleClass = "text-base font-medium text-foreground";
export const emptyStateDescriptionClass = "max-w-sm text-sm text-muted-foreground";
export const emptyStateActionsClass = "mt-2 flex flex-wrap items-center justify-center gap-2";
