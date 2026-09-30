import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import {
  icons,
  resolveTone,
  stepClass,
  stepConnectorClass,
  stepDescriptionClass,
  stepIndicatorClass,
  stepLabelClass,
  stepperClass,
  type Action,
  type Color,
  type StepStatus,
} from "@/core";
import { Icon } from "../icon";

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "children"> {
  steps: readonly Step[];
  /** Zero-based index of the current step. Earlier steps are complete, later ones upcoming. */
  current: number;
  orientation?: "horizontal" | "vertical";
  color?: Color;
  action?: Action;
}

/** A progress trail for multi-step flows. Presentational: you own the step state and the buttons. */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { steps, current, orientation = "horizontal", color = "primary", action, className, ...props },
  ref,
) {
  return (
    <ol ref={ref} data-tone={resolveTone(color, action)} className={stepperClass(orientation, className)} {...props}>
      {steps.map((step, index) => {
        const status: StepStatus = index < current ? "complete" : index === current ? "current" : "upcoming";
        return (
          <li key={index} aria-current={status === "current" ? "step" : undefined} className={stepClass(orientation)}>
            {index < steps.length - 1 && <span aria-hidden="true" className={stepConnectorClass(status, orientation)} />}
            <span className={stepIndicatorClass(status)}>
              {status === "complete" ? <Icon node={icons.check} strokeWidth={3} /> : index + 1}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5 pt-1">
              <span className={stepLabelClass(status)}>
                {step.label}
                <span className="sr-only">{status === "complete" ? " (completed)" : status === "current" ? " (current step)" : ""}</span>
              </span>
              {step.description && <span className={stepDescriptionClass}>{step.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
});
