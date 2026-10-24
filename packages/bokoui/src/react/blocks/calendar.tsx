"use client";

import { forwardRef, useEffect, useId, useMemo, useRef, useState, type HTMLAttributes } from "react";
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
} from "@/core";
import { Icon } from "../internal/icon";

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">, DateBounds {
  /** Selected day (controlled). `null` = none. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  /** Month shown first when nothing is selected. */
  defaultMonth?: Date;
  /** First day of the week, 0 = Sunday. Default 0. */
  weekStartsOn?: WeekStart;
  /** BCP 47 locale for month and weekday names. Default: the browser's. */
  locale?: string;
  color?: Color;
  action?: Action;
  /** Move keyboard focus to the focused day when it first renders (used by DatePicker). */
  autoFocus?: boolean;
}

/**
 * Month calendar. Arrow keys move by day and week, Home/End to the week's ends, PageUp/PageDown
 * by month (with Shift, by year); Enter or Space selects. One day is a tab stop at a time.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { value, defaultValue = null, onValueChange, defaultMonth, weekStartsOn = 0, locale, min, max, isDisabled, color = "primary", action, autoFocus = false, className, ...props },
  ref,
) {
  const titleId = useId();
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const selected = value === undefined ? inner : value;
  const bounds = useMemo<DateBounds>(() => ({ min, max, isDisabled }), [min, max, isDisabled]);

  // "Today" is only known in the browser, and its timezone can differ from the server's, so it
  // is filled in after mount. Until then the grid needs an explicit date to avoid a mismatch.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(startOfDay(new Date())), []);
  const anchor = selected ?? defaultMonth ?? today;

  const [focused, setFocused] = useState<Date | null>(null);
  const focusDate = focused ?? (anchor ? clampDate(anchor, bounds) : null);
  const [month, setMonth] = useState<Date | null>(null);
  const shownMonth = month ?? (focusDate ? startOfMonth(focusDate) : null);
  const grid = useRef<HTMLTableElement>(null);
  const shouldFocus = useRef(autoFocus);

  // Move DOM focus to the focused day after keyboard navigation (or on first render for autoFocus).
  useEffect(() => {
    if (!shouldFocus.current || !focusDate) return;
    grid.current?.querySelector<HTMLElement>('button[tabindex="0"]')?.focus();
    shouldFocus.current = false;
  });

  const monthFormat = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const dayFormat = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);
  const weekdayShort = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const weekdayLong = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long" }), [locale]);

  const select = (date: Date) => {
    if (isDateDisabled(date, bounds)) return;
    if (value === undefined) setInner(date);
    setFocused(date);
    onValueChange?.(date);
  };

  if (!shownMonth || !focusDate) {
    // Not mounted yet: reserve the space so the page does not jump.
    return <div ref={ref} aria-busy="true" className={calendarClass(["min-h-80", className])} {...props} />;
  }

  const weeks = getMonthGrid(shownMonth, weekStartsOn);
  // Any known Sunday works as a base for weekday names.
  const weekdays = getWeekdayOrder(weekStartsOn).map((d) => new Date(2023, 0, 1 + d));
  const prevMonth = addMonths(shownMonth, -1);
  const nextMonth = addMonths(shownMonth, 1);
  const prevDisabled = min ? startOfMonth(prevMonth).getTime() < startOfMonth(min).getTime() : false;
  const nextDisabled = max ? startOfMonth(nextMonth).getTime() > startOfMonth(max).getTime() : false;

  function onKeyDown(event: React.KeyboardEvent<HTMLTableElement>) {
    const next = getNextDate(focusDate!, event.key, { shiftKey: event.shiftKey, weekStartsOn });
    if (!next) return;
    event.preventDefault();
    const target = clampDate(next, bounds);
    shouldFocus.current = true;
    setFocused(target);
    if (!isSameMonth(target, shownMonth!)) setMonth(startOfMonth(target));
  }

  return (
    <div ref={ref} data-tone={resolveTone(color, action)} className={calendarClass(className)} {...props}>
      <div className={calendarHeaderClass}>
        <button type="button" aria-label="Previous month" disabled={prevDisabled} className={calendarNavClass} onClick={() => setMonth(prevMonth)}>
          <Icon node={icons.chevronLeft} className="rtl:rotate-180" />
        </button>
        <div id={titleId} aria-live="polite" className={calendarTitleClass}>
          {monthFormat.format(shownMonth)}
        </div>
        <button type="button" aria-label="Next month" disabled={nextDisabled} className={calendarNavClass} onClick={() => setMonth(nextMonth)}>
          <Icon node={icons.chevronRight} className="rtl:rotate-180" />
        </button>
      </div>
      <table ref={grid} aria-labelledby={titleId} className={calendarGridClass} onKeyDown={onKeyDown}>
        <thead>
          <tr>
            {weekdays.map((d) => (
              <th key={d.getDay()} scope="col" abbr={weekdayLong.format(d)} className={calendarWeekdayClass}>
                {weekdayShort.format(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].getTime()}>
              {week.map((date) => {
                const outside = !isSameMonth(date, shownMonth);
                const disabled = isDateDisabled(date, bounds);
                return (
                  <td key={date.getTime()}>
                    <button
                      type="button"
                      tabIndex={isSameDay(date, focusDate) ? 0 : -1}
                      aria-label={dayFormat.format(date)}
                      aria-pressed={isSameDay(date, selected)}
                      aria-current={isSameDay(date, today) ? "date" : undefined}
                      aria-disabled={disabled || undefined}
                      data-today={isSameDay(date, today) ? "" : undefined}
                      data-outside={outside ? "" : undefined}
                      data-disabled={disabled ? "" : undefined}
                      className={calendarDayClass}
                      onClick={() => select(date)}
                      onFocus={() => setFocused(date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
