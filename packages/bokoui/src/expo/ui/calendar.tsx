import { useState } from "react";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { addMonths, getMonthGrid, getWeekdayOrder, isDateDisabled, isSameDay, isSameMonth, resolveTone, startOfDay, startOfMonth, type Action, type Color, type DateBounds, type WeekStart } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";
import { useControllable } from "../internal/use-controllable";

/** Intl can be missing on some JS engines; fall back to English-ish output instead of crashing. */
function format(date: Date, locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toDateString();
  }
}

export interface CalendarProps extends DateBounds {
  /** Selected day (controlled). `null` = none. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  /** Month shown first when nothing is selected. */
  defaultMonth?: Date;
  /** First day of the week, 0 = Sunday. Default 0. */
  weekStartsOn?: WeekStart;
  /** BCP 47 locale for month and weekday names. Default: the device's. */
  locale?: string;
  color?: Color;
  action?: Action;
  style?: StyleProp<ViewStyle>;
}

/** A month grid with previous/next buttons. Date logic is shared with the web version through core. */
export function Calendar({ value, defaultValue = null, onValueChange, defaultMonth, weekStartsOn = 0, locale, color = "primary", action, min, max, isDisabled, style }: CalendarProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const [selected, select] = useControllable<Date | null>(value, defaultValue, onValueChange as ((v: Date | null) => void) | undefined);
  const [month, setMonth] = useState(() => startOfMonth(selected ?? defaultMonth ?? new Date()));
  const today = startOfDay(new Date());
  const bounds = { min, max, isDisabled };
  const weeks = getMonthGrid(month, weekStartsOn);
  // Any week of 2024-01-07.. (a Sunday) gives a weekday name for each index.
  const weekdays = getWeekdayOrder(weekStartsOn).map((d) => format(new Date(2024, 0, 7 + d), locale, { weekday: "short" }));

  const nav = (delta: number, name: string) => (
    <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={() => setMonth(addMonths(month, delta))} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
      <RNText style={{ color: tokens.fg, fontSize: 20 }}>{delta < 0 ? "‹" : "›"}</RNText>
    </Pressable>
  );

  return (
    <View style={[{ alignSelf: "stretch" }, style]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        {nav(-1, "Previous month")}
        <RNText accessibilityRole="header" accessibilityLiveRegion="polite" style={{ color: tokens.fg, fontSize: 16, fontWeight: "600" }}>
          {format(month, locale, { month: "long", year: "numeric" })}
        </RNText>
        {nav(1, "Next month")}
      </View>
      <View style={{ flexDirection: "row" }}>
        {weekdays.map((name, i) => (
          <RNText key={i} style={{ flex: 1, textAlign: "center", paddingVertical: 6, color: tokens.mutedFg, fontSize: 12 }}>
            {name}
          </RNText>
        ))}
      </View>
      {weeks.map((week, w) => (
        <View key={w} style={{ flexDirection: "row" }}>
          {week.map((day) => {
            const disabled = isDateDisabled(day, bounds);
            const active = isSameDay(day, selected);
            const outside = !isSameMonth(day, month);
            const isToday = isSameDay(day, today);
            return (
              <Pressable
                key={day.getTime()}
                accessibilityRole="button"
                accessibilityLabel={format(day, locale, { dateStyle: "full" })}
                accessibilityState={{ selected: active, disabled }}
                disabled={disabled}
                onPress={() => select(day)}
                style={{ flex: 1, height: 44, alignItems: "center", justifyContent: "center" }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: tokens.radiusControl,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: isToday && !active ? tokens.borderWidth : 0,
                    borderColor: c.ink,
                    backgroundColor: active ? c.base : "transparent",
                    opacity: disabled ? tokens.disabledOpacity : outside ? 0.5 : 1,
                  }}
                >
                  <RNText style={{ color: active ? c.fg : tokens.fg, fontSize: 14, fontWeight: active || isToday ? "600" : "400" }}>{day.getDate()}</RNText>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
