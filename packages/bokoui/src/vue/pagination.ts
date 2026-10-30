import { defineComponent, h, type Component, type PropType, type VNode } from "vue";
import {
  getPageRange,
  icons,
  pageButtonClass,
  pageEllipsisClass,
  paginationClass,
  paginationListClass,
  resolveTone,
  type Action,
  type Color,
  type PaginationStyleProps,
} from "../core";
import { el } from "./render";
import { Icon } from "./icon";

/**
 * Pages render as buttons (listen to `update:page`, or use `v-model:page`) or, with `getHref`, as links
 * (server-friendly; `linkAs` swaps in a router link and `linkProp` names its destination prop, e.g. `to`).
 */
export const Pagination = defineComponent({
  name: "BokoPagination",
  inheritAttrs: false,
  props: {
    page: { type: Number, required: true },
    pageCount: { type: Number, required: true },
    getHref: Function as PropType<(page: number) => string>,
    linkAs: [String, Object] as PropType<string | Component>,
    linkProp: { type: String, default: "href" },
    siblings: { type: Number, default: 1 },
    size: String as PropType<PaginationStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    hideEdges: { type: Boolean, default: false },
    label: { type: String, default: "Pagination" },
  },
  emits: ["update:page"],
  setup(props, { attrs, emit }) {
    function control(target: number, content: VNode | string, name: string, disabled: boolean, current = false) {
      const common = { "aria-label": name, "aria-current": current ? "page" : undefined, class: pageButtonClass({ size: props.size }) };
      if (props.getHref) {
        return el(props.linkAs ?? "a", { ...common, [props.linkProp]: disabled ? undefined : props.getHref(target), "aria-disabled": disabled || undefined }, [content]);
      }
      return h("button", { ...common, type: "button", disabled, onClick: () => emit("update:page", target) }, content);
    }

    return () => {
      const items = getPageRange(props.page, props.pageCount, props.siblings);
      return h("nav", { ...attrs, "aria-label": props.label, "data-tone": resolveTone(props.color, props.action), class: paginationClass(attrs.class as string) }, [
        h("ul", { class: paginationListClass }, [
          !props.hideEdges && h("li", control(props.page - 1, h(Icon, { node: icons.chevronLeft, class: "rtl:rotate-180" }), "Previous page", props.page <= 1)),
          ...items.map((item) =>
            typeof item === "number"
              ? h("li", { key: item }, control(item, String(item), `Page ${item}`, false, item === props.page))
              : h("li", { key: item, "aria-hidden": "true", class: pageEllipsisClass }, [h(Icon, { node: icons.ellipsis })]),
          ),
          !props.hideEdges && h("li", control(props.page + 1, h(Icon, { node: icons.chevronRight, class: "rtl:rotate-180" }), "Next page", props.page >= props.pageCount)),
        ]),
      ]);
    };
  },
});
