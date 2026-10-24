/*
 * Framework-neutral date logic for Calendar and DatePicker. Dates are local calendar days:
 * every function returns a Date at local midnight and never mutates its input.
 */

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

/** Local midnight of a calendar day. `new Date(5, 0, 2)` means 1905, so years 0-99 need setFullYear. */
function makeDay(year: number, month: number, day: number) {
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, month, day);
  return date;
}

export const startOfDay = (d: Date) => makeDay(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfMonth = (d: Date) => makeDay(d.getFullYear(), d.getMonth(), 1);
export const addDays = (d: Date, n: number) => makeDay(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Adds months, keeping the day where possible and clamping to the month's last day (Jan 31 + 1 = Feb 28/29). */
export function addMonths(d: Date, n: number) {
  const target = makeDay(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = makeDay(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return makeDay(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
}

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Whole-day comparison: negative when `a` is before `b`. */
export const compareDays = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

export interface DateBounds {
  min?: Date;
  max?: Date;
  /** Extra rule, e.g. no weekends. */
  isDisabled?: (date: Date) => boolean;
}

export function isDateDisabled(date: Date, { min, max, isDisabled }: DateBounds = {}) {
  if (min && compareDays(date, min) < 0) return true;
  if (max && compareDays(date, max) > 0) return true;
  return isDisabled?.(date) ?? false;
}

export function clampDate(date: Date, { min, max }: DateBounds = {}) {
  if (min && compareDays(date, min) < 0) return startOfDay(min);
  if (max && compareDays(date, max) > 0) return startOfDay(max);
  return startOfDay(date);
}

/** Six weeks of days covering the month of `month`, so the grid keeps a constant height. */
export function getMonthGrid(month: Date, weekStartsOn: WeekStart = 0): Date[][] {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(gridStart, week * 7 + day)));
}

/** Weekday indexes (0 = Sunday) in display order, e.g. [1,2,3,4,5,6,0] when the week starts on Monday. */
export const getWeekdayOrder = (weekStartsOn: WeekStart = 0) => Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7);

/**
 * The date to focus after `key`, following the WAI-ARIA date grid pattern, or `undefined` for
 * unrelated keys. PageUp/PageDown move a month, with Shift a year.
 */
export function getNextDate(date: Date, key: string, options: { shiftKey?: boolean; weekStartsOn?: WeekStart } = {}): Date | undefined {
  const { shiftKey = false, weekStartsOn = 0 } = options;
  switch (key) {
    case "ArrowLeft":
      return addDays(date, -1);
    case "ArrowRight":
      return addDays(date, 1);
    case "ArrowUp":
      return addDays(date, -7);
    case "ArrowDown":
      return addDays(date, 7);
    case "Home":
      return addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
    case "End":
      return addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7));
    case "PageUp":
      return addMonths(date, shiftKey ? -12 : -1);
    case "PageDown":
      return addMonths(date, shiftKey ? 12 : 1);
    default:
      return undefined;
  }
}

/** ISO calendar date (`2026-09-30`) in local time. Useful for `<input type="hidden">` values. */
export const toISODate = (d: Date) =>
  `${String(d.getFullYear()).padStart(4, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Parses `YYYY-MM-DD` as a local date; `undefined` when malformed or not a real day (2026-02-30). */
export function parseISODate(value: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return undefined;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = makeDay(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : undefined;
}
