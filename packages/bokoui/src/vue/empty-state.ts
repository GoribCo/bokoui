import { defineComponent, h } from "vue";
import {
  emptyStateActionsClass,
  emptyStateClass,
  emptyStateDescriptionClass,
  emptyStateIconClass,
  emptyStateTitleClass,
} from "../core";

/** What to show when a list or search has nothing in it. Slots: `icon`, `actions`; props `title`, `description` (or slots of the same name). */
export const EmptyState = defineComponent({
  name: "BokoEmptyState",
  inheritAttrs: false,
  props: { title: String, description: String },
  setup(props, { attrs, slots }) {
    return () => {
      const icon = slots.icon?.();
      const title = slots.title?.() ?? props.title;
      const description = slots.description?.() ?? props.description;
      const actions = slots.actions?.();
      return h("div", { ...attrs, class: emptyStateClass(attrs.class as string) }, [
        icon && h("div", { class: emptyStateIconClass }, icon),
        h("p", { class: emptyStateTitleClass }, title),
        description && h("p", { class: emptyStateDescriptionClass }, description),
        actions && h("div", { class: emptyStateActionsClass }, actions),
      ]);
    };
  },
});
