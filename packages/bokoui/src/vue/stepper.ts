import { defineComponent, h, type PropType, type VNodeChild } from "vue";
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
} from "../core";
import { Icon } from "./icon";

export interface Step {
  label: string;
  description?: string;
}

/** A progress trail for multi-step flows. Presentational: you own the step state and the buttons. */
export const Stepper = defineComponent({
  name: "BokoStepper",
  inheritAttrs: false,
  props: {
    steps: { type: Array as PropType<readonly Step[]>, required: true },
    /** Zero-based index of the current step. */
    current: { type: Number, required: true },
    orientation: { type: String as PropType<"horizontal" | "vertical">, default: "horizontal" },
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
  },
  setup(props, { attrs }) {
    return () =>
      h(
        "ol",
        { ...attrs, "data-tone": resolveTone(props.color, props.action), class: stepperClass(props.orientation, attrs.class as string) },
        props.steps.map((step, index) => {
          const status: StepStatus = index < props.current ? "complete" : index === props.current ? "current" : "upcoming";
          const hint = status === "complete" ? " (completed)" : status === "current" ? " (current step)" : "";
          return h("li", { key: index, "aria-current": status === "current" ? "step" : undefined, class: stepClass(props.orientation) }, [
            index < props.steps.length - 1 && h("span", { "aria-hidden": "true", class: stepConnectorClass(status, props.orientation) }),
            h("span", { class: stepIndicatorClass(status) }, [status === "complete" ? h(Icon, { node: icons.check, "stroke-width": 3 }) : (index + 1) as VNodeChild]),
            h("span", { class: "flex min-w-0 flex-col gap-0.5 pt-1" }, [
              h("span", { class: stepLabelClass(status) }, [step.label, h("span", { class: "sr-only" }, hint)]),
              step.description && h("span", { class: stepDescriptionClass }, step.description),
            ]),
          ]);
        }),
      );
  },
});
