import { defineComponent, h, nextTick, ref, type PropType } from "vue";
import { cn, icons, ratingClass, ratingEmptyClass, ratingStarClass, resolveTone, type Action, type Color, type RatingStyleProps } from "../core";
import { Icon } from "./icon";

/**
 * Star rating, `v-model` is the number of stars (0 = none). Interactive it is a radio group
 * (arrows move and select, Home/End jump); `readOnly` renders one image: "3 out of 5".
 */
export const Rating = defineComponent({
  name: "BokoRating",
  inheritAttrs: false,
  props: {
    modelValue: Number,
    defaultValue: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    readOnly: { type: Boolean, default: false },
    size: String as PropType<RatingStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    label: { type: String, default: "Rating" },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    const inner = ref(props.defaultValue);
    const hover = ref<number | null>(null);
    const group = ref<HTMLElement | null>(null);
    const current = () => props.modelValue ?? inner.value;
    const set = (next: number) => {
      if (props.modelValue === undefined) inner.value = next;
      emit("update:modelValue", next);
    };
    const star = (n: number, shown: number) =>
      h(Icon, { key: n, node: icons.star, class: n <= shown ? undefined : ratingEmptyClass, fill: n <= shown ? "currentColor" : "none" });

    function onKeydown(event: KeyboardEvent) {
      const value = current();
      let next: number | undefined;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(props.max, (value || 0) + 1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(1, (value || 1) - 1);
      else if (event.key === "Home") next = 1;
      else if (event.key === "End") next = props.max;
      else if (event.key === "0" || event.key === "Delete" || event.key === "Backspace") next = 0;
      if (next === undefined) return;
      event.preventDefault();
      set(next);
      // Move DOM focus with the selection so the roving tabindex follows.
      nextTick(() => group.value?.querySelector<HTMLElement>('[tabindex="0"]')?.focus());
    }

    return () => {
      const value = current();
      const stars = Array.from({ length: props.max }, (_, i) => i + 1);
      const tone = resolveTone(props.color, props.action);
      const cls = ratingClass({ size: props.size }, attrs.class as string);
      if (props.readOnly) {
        return h("div", { ...attrs, role: "img", "aria-label": `${props.label}: ${value} out of ${props.max}`, "data-tone": tone, class: cls }, stars.map((n) => star(n, value)));
      }
      const shown = hover.value ?? value;
      return h(
        "div",
        { ...attrs, ref: group, role: "radiogroup", "aria-label": props.label, "data-tone": tone, class: cls, onKeydown, onMouseleave: () => (hover.value = null) },
        stars.map((n) =>
          h(
            "button",
            {
              key: n,
              type: "button",
              role: "radio",
              "aria-checked": n === value,
              "aria-label": `${n} ${n === 1 ? "star" : "stars"}`,
              // Roving tabindex: the selected star (or the first, when none) is the tab stop.
              tabindex: n === (value || 1) ? 0 : -1,
              class: cn(ratingStarClass),
              onClick: () => set(n === value ? 0 : n),
              onMouseenter: () => (hover.value = n),
              onFocus: () => (hover.value = null),
            },
            [star(n, shown)],
          ),
        ),
      );
    };
  },
});
