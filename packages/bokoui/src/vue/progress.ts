import { defineComponent, h, useId, type PropType } from "vue";
import {
  progressBarClass,
  progressHeaderClass,
  progressTrackClass,
  progressValueClass,
  resolveTone,
  type Action,
  type Color,
  type ProgressStyleProps,
} from "../core";

/** Omit `value` for an indeterminate bar. Slot `label` or prop `label` names it. */
export const Progress = defineComponent({
  name: "BokoProgress",
  inheritAttrs: false,
  props: {
    value: Number,
    max: { type: Number, default: 100 },
    size: String as PropType<ProgressStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    label: String,
    showValue: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const labelId = useId();
    return () => {
      const indeterminate = props.value === undefined;
      const clamped = indeterminate ? 0 : Math.min(Math.max(props.value!, 0), props.max);
      const percent = props.max > 0 ? Math.round((clamped / props.max) * 100) : 0;
      const label = slots.label?.() ?? props.label;
      const { class: cls, ...rest } = attrs;
      return h("div", { "data-tone": resolveTone(props.color, props.action), class: cls }, [
        (label || (props.showValue && !indeterminate)) &&
          h("div", { class: progressHeaderClass }, [
            label && h("span", { id: labelId }, label),
            props.showValue && !indeterminate && h("span", { class: progressValueClass }, `${percent}%`),
          ]),
        h(
          "div",
          {
            ...rest,
            role: "progressbar",
            "aria-labelledby": label ? labelId : undefined,
            "aria-valuemin": 0,
            "aria-valuemax": props.max,
            // No aria-valuenow tells assistive tech the progress is indeterminate.
            "aria-valuenow": indeterminate ? undefined : clamped,
            "aria-valuetext": indeterminate ? undefined : `${percent}%`,
            class: progressTrackClass({ size: props.size }),
          },
          [h("div", { class: progressBarClass(indeterminate), style: indeterminate ? undefined : { width: `${percent}%` } })],
        ),
      ]);
    };
  },
});
