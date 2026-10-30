import { defineComponent, h, type PropType } from "vue";
import { icons, resolveTone, tagClass, tagRemoveClass, type Action, type Color, type TagStyleProps } from "../core";
import { Icon } from "./icon";

/**
 * A chip. Pass `@click` to make the label a button (a filter chip; add `pressed` for a toggle)
 * and `@remove` to show a remove (×) button.
 */
export const Tag = defineComponent({
  name: "BokoTag",
  inheritAttrs: false,
  props: {
    variant: String as PropType<TagStyleProps["variant"]>,
    size: String as PropType<TagStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    pressed: { type: Boolean, default: undefined },
    removeLabel: { type: String, default: "Remove" },
    disabled: { type: Boolean, default: false },
  },
  // click/remove are read from attrs (not declared as emits) so their presence can switch the markup.
  setup(props, { attrs, slots }) {
    return () => {
      const { class: cls, onClick, onRemove, ...rest } = attrs as Record<string, unknown>;
      const children = slots.default?.();
      const text = children?.length === 1 && typeof children[0].children === "string" ? children[0].children : "";
      return h("span", { ...rest, "data-tone": resolveTone(props.color, props.action), class: tagClass({ variant: props.variant, size: props.size }, false, cls as string) }, [
        onClick
          ? h(
              "button",
              {
                type: "button",
                disabled: props.disabled,
                "aria-pressed": props.pressed,
                class: "min-w-0 truncate rounded-sm focus-ring cursor-pointer disabled:cursor-not-allowed disabled:opacity-(--bokoui-disabled-opacity)",
                onClick: onClick as (e: MouseEvent) => void,
              },
              children,
            )
          : h("span", { class: "min-w-0 truncate" }, children),
        onRemove
          ? h(
              "button",
              { type: "button", disabled: props.disabled, "aria-label": `${props.removeLabel} ${text}`.trim(), class: tagRemoveClass, onClick: onRemove as () => void },
              [h(Icon, { node: icons.close })],
            )
          : h("span", { class: "w-1", "aria-hidden": "true" }),
      ]);
    };
  },
});
