import { createContext, useContext, type ReactNode } from "react";
import { Pressable, ScrollView, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { type Action, type Color, type TabsStyleProps } from "@/core";
import { useTheme } from "../theme";
import { type Tone, useTone } from "../internal/shared";
import { useControllable } from "../internal/use-controllable";

interface TabsContextValue extends TabsStyleProps {
  value: string | undefined;
  select: (value: string) => void;
  tone: Tone;
}

const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab parts must be used inside <Tabs>");
  return ctx;
};

export interface TabsProps extends TabsStyleProps {
  /** Selected tab (controlled). */
  value?: string;
  /** Initially selected tab (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  color?: Color;
  action?: Action;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Compound component: `<Tabs><TabList><Tab value="a"/></TabList><TabPanel value="a"/></Tabs>`. */
export function Tabs({ value, defaultValue, onValueChange, variant = "underline", orientation = "horizontal", color = "primary", action, children, style }: TabsProps) {
  const [current, select] = useControllable<string | undefined>(value, defaultValue, onValueChange as ((v: string | undefined) => void) | undefined);
  const c = useTone(color, action);
  return (
    <TabsContext.Provider value={{ value: current, select: (v) => select(v), variant, orientation, tone: c }}>
      <View style={[{ alignSelf: "stretch", flexDirection: orientation === "vertical" ? "row" : "column", gap: 12 }, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabList({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { tokens } = useTheme();
  const { variant, orientation } = useTabs();
  const vertical = orientation === "vertical";
  return (
    <ScrollView
      horizontal={!vertical}
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      style={[{ flexGrow: 0 }, variant === "underline" && (vertical ? { borderRightWidth: tokens.borderWidth, borderColor: tokens.border } : { borderBottomWidth: tokens.borderWidth, borderColor: tokens.border }), style]}
      contentContainerStyle={{ flexDirection: vertical ? "column" : "row", gap: variant === "pills" ? 4 : 0 }}
    >
      {children}
    </ScrollView>
  );
}

export interface TabProps {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Tab({ value, disabled, children, style }: TabProps) {
  const { tokens } = useTheme();
  const { value: current, select, variant, orientation, tone: c } = useTabs();
  const active = current === value;
  const pills = variant === "pills";
  const vertical = orientation === "vertical";
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={() => select(value)}
      style={({ pressed }) => [
        {
          minHeight: 44,
          paddingHorizontal: 16,
          justifyContent: "center",
          opacity: disabled ? tokens.disabledOpacity : 1,
          backgroundColor: pills ? (active ? c.base : pressed ? c.soft : "transparent") : "transparent",
          borderRadius: pills ? tokens.radiusButton : 0,
        },
        !pills && (vertical ? { borderRightWidth: 2, marginRight: -tokens.borderWidth, borderRightColor: active ? c.base : "transparent" } : { borderBottomWidth: 2, marginBottom: -tokens.borderWidth, borderBottomColor: active ? c.base : "transparent" }),
        style,
      ]}
    >
      {typeof children === "string" ? (
        <RNText style={{ fontSize: 14, fontWeight: "500", color: pills && active ? c.fg : active ? c.ink : tokens.mutedFg }}>{children}</RNText>
      ) : (
        children
      )}
    </Pressable>
  );
}

export interface TabPanelProps {
  value: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Rendered only while its tab is selected. */
export function TabPanel({ value, children, style }: TabPanelProps) {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return <View style={[{ flex: 1 }, style]}>{children}</View>;
}
