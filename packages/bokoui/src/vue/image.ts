import { defineComponent, h, type Component, type PropType } from "vue";
import { imageClass, type ImageAspect, type ImageFit } from "../core";

export const Image = defineComponent({
  name: "BokoImage",
  inheritAttrs: false,
  props: {
    src: { type: String, required: true },
    /** Alternative text. Pass `""` for a purely decorative image. */
    alt: { type: String, required: true },
    aspect: String as PropType<ImageAspect>,
    fit: String as PropType<ImageFit>,
    rounded: { type: Boolean, default: false },
    /** Component to render instead of `<img>`, e.g. `NuxtImg`. */
    as: [Object, Function] as PropType<Component>,
  },
  setup(props, { attrs }) {
    return () =>
      h(props.as ?? "img", {
        loading: "lazy",
        decoding: "async",
        ...attrs,
        src: props.src,
        alt: props.alt,
        class: imageClass({ aspect: props.aspect, fit: props.fit, rounded: props.rounded }, attrs.class as string),
      });
  },
});
