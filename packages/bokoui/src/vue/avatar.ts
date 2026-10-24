import { defineComponent, h, type PropType } from "vue";
import {
  avatarClass,
  avatarImageClass,
  avatarStatusClass,
  getInitials,
  resolveTone,
  type Action,
  type AvatarShape,
  type Color,
  type Size,
} from "../core";

export const Avatar = defineComponent({
  name: "BokoAvatar",
  inheritAttrs: false,
  props: {
    size: String as PropType<Size>,
    shape: String as PropType<AvatarShape>,
    src: String,
    name: String,
    color: { type: String as PropType<Color>, default: "neutral" },
    action: String as PropType<Action>,
    status: { type: Boolean, default: false },
    statusAction: { type: String as PropType<Action>, default: "success" },
  },
  emits: ["error"],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        "span",
        {
          ...attrs,
          role: !props.src && props.name ? "img" : undefined,
          "aria-label": props.src ? undefined : props.name,
          "data-tone": resolveTone(props.color, props.action),
          class: avatarClass({ size: props.size, shape: props.shape }, attrs.class as string),
        },
        [
          slots.default?.() ?? h("span", { "aria-hidden": "true" }, getInitials(props.name)),
          props.src && h("img", { src: props.src, alt: props.name ?? "", class: avatarImageClass, onError: (e: Event) => emit("error", e) }),
          props.status && h("span", { "data-tone": props.statusAction, class: avatarStatusClass }),
        ],
      );
  },
});
