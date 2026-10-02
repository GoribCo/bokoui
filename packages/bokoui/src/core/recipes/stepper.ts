import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";
import { toneSolidClass } from "./shared";

export type StepStatus = "complete" | "current" | "upcoming";

export const stepperClass = (orientation: "horizontal" | "vertical" = "horizontal", className?: ClassValue) =>
  cn("flex font-ui", orientation === "horizontal" ? "flex-row items-start" : "flex-col", className);

export const stepClass = (orientation: "horizontal" | "vertical" = "horizontal") =>
  cn(
    "group/step relative flex min-w-0 gap-3",
    orientation === "horizontal" ? "flex-1 flex-col items-start pe-4 last:flex-none last:pe-0" : "pb-8 last:pb-0",
  );

/** The numbered/checked circle. Status decides color, so it stays a single component. */
export const stepIndicatorVariants = cva(
  [
    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-[length:var(--bokoui-border-width)] text-sm font-medium",
    "transition-colors duration-(--bokoui-duration) ease-ui [&_svg]:size-4",
  ],
  {
    variants: {
      status: {
        complete: toneSolidClass,
        current: "border-(--tone-ink) bg-(--tone-soft) text-(--tone-ink)",
        upcoming: "border-border bg-surface text-muted-foreground",
      },
    },
    defaultVariants: { status: "upcoming" },
  },
);

export const stepIndicatorClass = (status: StepStatus) => stepIndicatorVariants({ status });

/** Connector from one indicator to the next; filled once the step is complete. */
export const stepConnectorClass = (status: StepStatus, orientation: "horizontal" | "vertical" = "horizontal") =>
  cn(
    "absolute rounded-full",
    status === "complete" ? "bg-(--tone)" : "bg-border",
    orientation === "horizontal"
      ? "start-10 top-4 h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2 pe-0 group-last/step:hidden"
      : "start-4 top-9 h-[calc(100%-2.25rem)] w-0.5 -translate-x-1/2 group-last/step:hidden",
  );

export const stepLabelClass = (status: StepStatus) =>
  cn("text-sm font-medium", status === "upcoming" ? "text-muted-foreground" : "text-foreground");
export const stepDescriptionClass = "text-xs text-muted-foreground";
