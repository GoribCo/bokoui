import { defineComponent, h, type PropType } from "vue";
import { cn, skeletonClass, type SkeletonShape } from "../core";

/** A pulsing placeholder, decorative (`aria-hidden`): mark the surrounding region `aria-busy` while loading. */
export const Skeleton = defineComponent({
  name: "BokoSkeleton",
  inheritAttrs: false,
  props: { shape: String as PropType<SkeletonShape> },
  setup(props, { attrs }) {
    return () => h("span", { ...attrs, "aria-hidden": "true", class: skeletonClass(props.shape, attrs.class as string) });
  },
});

/** Paragraph placeholder: full-width lines with a shorter last one. */
export const SkeletonText = defineComponent({
  name: "BokoSkeletonText",
  inheritAttrs: false,
  props: { lines: { type: Number, default: 3 } },
  setup(props, { attrs }) {
    return () =>
      h(
        "div",
        { ...attrs, "aria-hidden": "true", class: cn("flex flex-col gap-2", attrs.class as string) },
        Array.from({ length: props.lines }, (_, i) => h(Skeleton, { key: i, class: i === props.lines - 1 && props.lines > 1 ? "w-3/5" : undefined })),
      );
  },
});
