import { computed, defineComponent, h, nextTick, onMounted, ref, useId, type PropType } from "vue";
import {
  addMonths,
  calendarClass,
  calendarDayClass,
  calendarGridClass,
  calendarHeaderClass,
  calendarNavClass,
  calendarTitleClass,
  calendarWeekdayClass,
  clampDate,
  getMonthGrid,
  getNextDate,
  getWeekdayOrder,
  icons,
  isDateDisabled,
  isSameDay,
  isSameMonth,
  resolveTone,
  startOfDay,
  startOfMonth,
  type Action,
  type Color,
  type DateBounds,
  type WeekStart,
} from "../core";
import { Icon } from "./icon";

/**
 * Month calendar, `v-model` is the selected `Date` (or `null`). Arrow keys move by day and week,
 * Home/End to the week's ends, PageUp/PageDown by month (with Shift, by year); Enter or Space selects.
 */
export const Calendar = defineComponent({
  name: "BokoCalendar",
  inheritAttrs: false,
  props: {
    modelValue: { type: Object as PropType<Date | null>, default: undefined },
    defaultValue: { type: Object as PropType<Date | null>, default: null },
    /** Month shown first when nothing is selected. */
    defaultMonth: Object as PropType<Date>,
    /** First day of the week, 0 = Sunday. */
    weekStartsOn: { type: Number as PropType<WeekStart>, default: 0 },
    /** BCP 47 locale for month and weekday names. Default: the browser's. */
    locale: String,
    min: Object as PropType<DateBounds["min"]>,
    max: Object as PropType<DateBounds["max"]>,
    isDisabled: Function as PropType<DateBounds["isDisabled"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    /** Move keyboard focus to the focused day when it first renders (used by DatePicker). */
    autoFocus: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    const titleId = useId();
    const inner = ref<Date | null>(props.defaultValue);
    const selected = computed(() => (props.modelValue === undefined ? inner.value : props.modelValue));
    const bounds = computed<DateBounds>(() => ({ min: props.min, max: props.max, isDisabled: props.isDisabled }));

    // "Today" is only known in the browser, and its timezone can differ from the server's, so it
    // is filled in after mount. Until then a placeholder reserves the space.
    const today = ref<Date | null>(null);
    const focused = ref<Date | null>(null);
    const month = ref<Date | null>(null);
    const grid = ref<HTMLElement | null>(null);
    let shouldFocus = props.autoFocus;
    const focusDate = () => {
      const anchor = selected.value ?? props.defaultMonth ?? today.value;
      return focused.value ?? (anchor ? clampDate(anchor, bounds.value) : null);
    };
    const focusDay = () =>
      nextTick(() => {
        if (!shouldFocus) return;
        grid.value?.querySelector<HTMLElement>('button[tabindex="0"]')?.focus();
        shouldFocus = false;
      });
    onMounted(() => {
      today.value = startOfDay(new Date());
      focusDay();
    });

    const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(props.locale, o);

    function select(date: Date) {
      if (isDateDisabled(date, bounds.value)) return;
      if (props.modelValue === undefined) inner.value = date;
      focused.value = date;
      emit("update:modelValue", date);
    }

    return () => {
      const current = focusDate();
      const shownMonth = month.value ?? (current ? startOfMonth(current) : null);
      if (!shownMonth || !current) return h("div", { ...attrs, "aria-busy": "true", class: calendarClass(["min-h-80", attrs.class as string]) });

      const weeks = getMonthGrid(shownMonth, props.weekStartsOn);
      // Any known Sunday works as a base for weekday names.
      const weekdays = getWeekdayOrder(props.weekStartsOn).map((d) => new Date(2023, 0, 1 + d));
      const prevMonth = addMonths(shownMonth, -1);
      const nextMonth = addMonths(shownMonth, 1);
      const prevDisabled = props.min ? startOfMonth(prevMonth).getTime() < startOfMonth(props.min).getTime() : false;
      const nextDisabled = props.max ? startOfMonth(nextMonth).getTime() > startOfMonth(props.max).getTime() : false;
      const dayFormat = fmt({ dateStyle: "full" });
      const weekdayShort = fmt({ weekday: "short" });
      const weekdayLong = fmt({ weekday: "long" });

      function onKeydown(event: KeyboardEvent) {
        const next = getNextDate(current!, event.key, { shiftKey: event.shiftKey, weekStartsOn: props.weekStartsOn });
        if (!next) return;
        event.preventDefault();
        const target = clampDate(next, bounds.value);
        shouldFocus = true;
        focused.value = target;
        if (!isSameMonth(target, shownMonth!)) month.value = startOfMonth(target);
        focusDay();
      }

      return h("div", { ...attrs, "data-tone": resolveTone(props.color, props.action), class: calendarClass(attrs.class as string) }, [
        h("div", { class: calendarHeaderClass }, [
          h("button", { type: "button", "aria-label": "Previous month", disabled: prevDisabled, class: calendarNavClass, onClick: () => (month.value = prevMonth) }, [
            h(Icon, { node: icons.chevronLeft, class: "rtl:rotate-180" }),
          ]),
          h("div", { id: titleId, "aria-live": "polite", class: calendarTitleClass }, fmt({ month: "long", year: "numeric" }).format(shownMonth)),
          h("button", { type: "button", "aria-label": "Next month", disabled: nextDisabled, class: calendarNavClass, onClick: () => (month.value = nextMonth) }, [
            h(Icon, { node: icons.chevronRight, class: "rtl:rotate-180" }),
          ]),
        ]),
        h("table", { ref: grid, "aria-labelledby": titleId, class: calendarGridClass, onKeydown }, [
          h("thead", [
            h(
              "tr",
              weekdays.map((d) => h("th", { key: d.getDay(), scope: "col", abbr: weekdayLong.format(d), class: calendarWeekdayClass }, weekdayShort.format(d))),
            ),
          ]),
          h(
            "tbody",
            weeks.map((week) =>
              h(
                "tr",
                { key: week[0].getTime() },
                week.map((date) => {
                  const disabled = isDateDisabled(date, bounds.value);
                  const isToday = isSameDay(date, today.value);
                  return h("td", { key: date.getTime() }, [
                    h(
                      "button",
                      {
                        type: "button",
                        tabindex: isSameDay(date, current) ? 0 : -1,
                        "aria-label": dayFormat.format(date),
                        "aria-pressed": isSameDay(date, selected.value),
                        "aria-current": isToday ? "date" : undefined,
                        "aria-disabled": disabled || undefined,
                        "data-today": isToday ? "" : undefined,
                        "data-outside": !isSameMonth(date, shownMonth) ? "" : undefined,
                        "data-disabled": disabled ? "" : undefined,
                        class: calendarDayClass,
                        onClick: () => select(date),
                        onFocus: () => (focused.value = date),
                      },
                      String(date.getDate()),
                    ),
                  ]);
                }),
              ),
            ),
          ),
        ]),
      ]);
    };
  },
});
