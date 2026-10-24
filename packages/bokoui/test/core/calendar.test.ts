import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  clampDate,
  compareDays,
  getMonthGrid,
  getNextDate,
  getWeekdayOrder,
  isDateDisabled,
  isSameDay,
  parseISODate,
  startOfDay,
  toISODate,
} from "@/core/calendar";

const d = (y: number, m: number, day: number) => {
  const date = new Date(2000, 0, 1);
  date.setFullYear(y, m - 1, day);
  return date;
};

describe("date arithmetic", () => {
  it("adds days across month and year boundaries without mutating", () => {
    const start = d(2026, 12, 31);
    expect(toISODate(addDays(start, 1))).toBe("2027-01-01");
    expect(toISODate(addDays(start, -365))).toBe("2025-12-31");
    expect(toISODate(start)).toBe("2026-12-31");
  });

  it("clamps the day when adding months (Jan 31 + 1 month)", () => {
    expect(toISODate(addMonths(d(2026, 1, 31), 1))).toBe("2026-02-28");
    expect(toISODate(addMonths(d(2028, 1, 31), 1))).toBe("2028-02-29");
    expect(toISODate(addMonths(d(2026, 3, 15), -3))).toBe("2025-12-15");
    expect(toISODate(addMonths(d(2026, 5, 10), 12))).toBe("2027-05-10");
  });

  it("compares whole days regardless of time", () => {
    expect(isSameDay(new Date(2026, 8, 30, 1), new Date(2026, 8, 30, 23))).toBe(true);
    expect(isSameDay(d(2026, 9, 30), d(2026, 10, 1))).toBe(false);
    expect(isSameDay(undefined, d(2026, 1, 1))).toBe(false);
    expect(compareDays(new Date(2026, 8, 30, 23), d(2026, 9, 30))).toBe(0);
    expect(compareDays(d(2026, 9, 29), d(2026, 9, 30))).toBeLessThan(0);
    expect(startOfDay(new Date(2026, 8, 30, 15, 30)).getHours()).toBe(0);
  });
});

describe("bounds", () => {
  const bounds = { min: d(2026, 9, 10), max: d(2026, 9, 20) };
  it("disables outside the range and by predicate", () => {
    expect(isDateDisabled(d(2026, 9, 9), bounds)).toBe(true);
    expect(isDateDisabled(d(2026, 9, 10), bounds)).toBe(false);
    expect(isDateDisabled(d(2026, 9, 20), bounds)).toBe(false);
    expect(isDateDisabled(d(2026, 9, 21), bounds)).toBe(true);
    expect(isDateDisabled(d(2026, 9, 12), { isDisabled: (x) => x.getDay() === 6 })).toBe(true); // a Saturday
    expect(isDateDisabled(d(2026, 9, 13), { isDisabled: (x) => x.getDay() === 6 })).toBe(false);
  });

  it("clamps into the range", () => {
    expect(toISODate(clampDate(d(2026, 1, 1), bounds))).toBe("2026-09-10");
    expect(toISODate(clampDate(d(2027, 1, 1), bounds))).toBe("2026-09-20");
    expect(toISODate(clampDate(d(2026, 9, 15), bounds))).toBe("2026-09-15");
  });
});

describe("getMonthGrid", () => {
  it("is always six weeks of seven days", () => {
    for (const m of [2, 9, 10]) {
      const grid = getMonthGrid(d(2026, m, 1));
      expect(grid).toHaveLength(6);
      grid.forEach((week) => expect(week).toHaveLength(7));
    }
  });

  it("starts on the requested weekday and includes the whole month", () => {
    // 1 Sept 2026 is a Tuesday.
    const sun = getMonthGrid(d(2026, 9, 15), 0);
    expect(toISODate(sun[0][0])).toBe("2026-08-30");
    expect(sun[0][0].getDay()).toBe(0);
    const mon = getMonthGrid(d(2026, 9, 15), 1);
    expect(toISODate(mon[0][0])).toBe("2026-08-31");
    expect(mon[0][0].getDay()).toBe(1);
    const days = sun.flat().filter((x) => x.getMonth() === 8).map((x) => x.getDate());
    expect(days).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });

  it("starts exactly on the 1st when the month begins on the first weekday", () => {
    // 1 Feb 2026 is a Sunday.
    expect(toISODate(getMonthGrid(d(2026, 2, 1), 0)[0][0])).toBe("2026-02-01");
  });

  it("orders weekdays from the week start", () => {
    expect(getWeekdayOrder(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(getWeekdayOrder(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
    expect(getWeekdayOrder(6)).toEqual([6, 0, 1, 2, 3, 4, 5]);
  });
});

describe("getNextDate (keyboard)", () => {
  const from = d(2026, 9, 30); // a Wednesday
  it("moves by day and week", () => {
    expect(toISODate(getNextDate(from, "ArrowLeft")!)).toBe("2026-09-29");
    expect(toISODate(getNextDate(from, "ArrowRight")!)).toBe("2026-10-01");
    expect(toISODate(getNextDate(from, "ArrowUp")!)).toBe("2026-09-23");
    expect(toISODate(getNextDate(from, "ArrowDown")!)).toBe("2026-10-07");
  });

  it("jumps to the start and end of the week", () => {
    expect(toISODate(getNextDate(from, "Home", { weekStartsOn: 0 })!)).toBe("2026-09-27");
    expect(toISODate(getNextDate(from, "End", { weekStartsOn: 0 })!)).toBe("2026-10-03");
    expect(toISODate(getNextDate(from, "Home", { weekStartsOn: 1 })!)).toBe("2026-09-28");
    expect(toISODate(getNextDate(from, "End", { weekStartsOn: 1 })!)).toBe("2026-10-04");
  });

  it("pages by month, and by year with Shift", () => {
    expect(toISODate(getNextDate(from, "PageDown")!)).toBe("2026-10-30");
    expect(toISODate(getNextDate(from, "PageUp")!)).toBe("2026-08-30");
    expect(toISODate(getNextDate(from, "PageDown", { shiftKey: true })!)).toBe("2027-09-30");
    expect(toISODate(getNextDate(d(2026, 3, 31), "PageUp")!)).toBe("2026-02-28");
  });

  it("ignores other keys", () => {
    expect(getNextDate(from, "a")).toBeUndefined();
    expect(getNextDate(from, "Enter")).toBeUndefined();
  });
});

describe("ISO helpers", () => {
  it("round-trips a date", () => {
    expect(toISODate(parseISODate("2026-09-30")!)).toBe("2026-09-30");
    expect(toISODate(d(5, 1, 2))).toBe("0005-01-02");
  });

  it("rejects malformed input and impossible days", () => {
    for (const bad of ["", "2026-9-30", "2026-02-30", "2026-13-01", "30/09/2026", "2026-09-31"]) expect(parseISODate(bad)).toBeUndefined();
    expect(parseISODate("2028-02-29")).toBeDefined();
    expect(parseISODate("2026-02-29")).toBeUndefined();
  });
});
