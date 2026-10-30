import { defineComponent, h, type PropType } from "vue";
import {
  cn,
  icons,
  tableCaptionClass,
  tableClass,
  tableHeadClass,
  tableHeaderCellClass,
  tableNumericClass,
  tableSortButtonClass,
  tableWrapperClass,
  type TableStyleProps,
} from "../core";
import { Icon } from "./icon";

export const Table = defineComponent({
  name: "BokoTable",
  inheritAttrs: false,
  props: {
    striped: { type: Boolean, default: undefined },
    hoverable: { type: Boolean, default: undefined },
    density: String as PropType<TableStyleProps["density"]>,
    /** Class for the scroll wrapper around the table. */
    wrapperClass: String,
  },
  setup(props, { attrs, slots }) {
    return () => {
      const { class: cls, "aria-label": label, ...rest } = attrs;
      // The label names the scroll region; the table itself is named by its <caption>.
      return h("div", { class: tableWrapperClass(props.wrapperClass), tabindex: 0, role: "region", "aria-label": label }, [
        h("table", { ...rest, "data-tone": "primary", class: tableClass({ striped: props.striped, hoverable: props.hoverable, density: props.density }, cls as string) }, slots.default?.()),
      ]);
    };
  },
});

const part = (name: string, tag: string, recipe?: (cls?: string) => string) =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(tag, { ...attrs, class: recipe ? recipe(attrs.class as string) : attrs.class }, slots.default?.());
    },
  });

export const TableCaption = part("BokoTableCaption", "caption", tableCaptionClass);
export const TableHeader = part("BokoTableHeader", "thead", tableHeadClass);
export const TableBody = part("BokoTableBody", "tbody");
export const TableRow = part("BokoTableRow", "tr");

export const TableHead = defineComponent({
  name: "BokoTableHead",
  inheritAttrs: false,
  props: {
    numeric: { type: Boolean, default: false },
    /** Current sort of this column. Adds `aria-sort`; with an `@sort` listener, a sort button. */
    sort: String as PropType<"ascending" | "descending" | "none">,
  },
  setup(props, { attrs, slots }) {
    return () => {
      const { class: cls, onSort, ...rest } = attrs as Record<string, unknown>;
      return h(
        "th",
        { ...rest, scope: "col", "aria-sort": props.sort, class: cn(tableHeaderCellClass(cls as string), props.numeric && tableNumericClass) },
        onSort
          ? [
              h("button", { type: "button", class: tableSortButtonClass, onClick: onSort as () => void }, [
                slots.default?.(),
                h(Icon, { node: props.sort === "ascending" ? icons.sortAsc : props.sort === "descending" ? icons.sortDesc : icons.sortNone }),
              ]),
            ]
          : slots.default?.(),
      );
    };
  },
});

export const TableCell = defineComponent({
  name: "BokoTableCell",
  inheritAttrs: false,
  props: { numeric: { type: Boolean, default: false } },
  setup(props, { attrs, slots }) {
    return () => h("td", { ...attrs, class: cn(props.numeric && tableNumericClass, attrs.class as string) }, slots.default?.());
  },
});
