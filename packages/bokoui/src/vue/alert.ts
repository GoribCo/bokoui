import { defineComponent, h, type PropType } from "vue";
import {
  alertBodyClass,
  alertClass,
  alertCloseClass,
  alertIcon,
  alertRole,
  alertTitleClass,
  icons,
  resolveTone,
  type Action,
  type AlertVariant,
  type Color,
} from "../core";
import { Icon } from "./icon";

/** Slots: default (description), `title`, `icon` (replaces the default icon). */
export const Alert = defineComponent({
  name: "BokoAlert",
  inheritAttrs: false,
  props: {
    variant: String as PropType<AlertVariant>,
    color: { type: String as PropType<Color>, default: "neutral" },
    action: String as PropType<Action>,
    title: String,
    /** Hide the icon. */
    noIcon: { type: Boolean, default: false },
    /** Show a close button; listen to `close` and hide the alert yourself. */
    closable: { type: Boolean, default: false },
    closeLabel: { type: String, default: "Dismiss" },
  },
  emits: ["close"],
  setup(props, { attrs, slots, emit }) {
    return () => {
      const tone = resolveTone(props.color, props.action);
      const description = slots.default?.();
      return h(
        "div",
        { ...attrs, role: alertRole(tone), "data-tone": tone, class: alertClass({ variant: props.variant }, attrs.class as string) },
        [
          !props.noIcon && (slots.icon?.() ?? h(Icon, { node: alertIcon(tone) })),
          h("div", { class: alertBodyClass }, [
            (props.title || slots.title) && h("div", { class: alertTitleClass }, slots.title?.() ?? props.title),
            description && h("div", description),
          ]),
          props.closable &&
            h("button", { type: "button", "aria-label": props.closeLabel, class: alertCloseClass, onClick: () => emit("close") }, [
              h(Icon, { node: icons.close }),
            ]),
        ],
      );
    };
  },
});
