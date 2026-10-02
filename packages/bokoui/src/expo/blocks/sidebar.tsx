import { createContext, useContext, type ReactNode } from "react";
import { Pressable, ScrollView, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color } from "@/core";
import { useTheme } from "../theme";
import { tone, type Tone } from "../internal/shared";

const SidebarContext = createContext<{ collapsed: boolean; tone: Tone } | null>(null);

export interface SidebarProps {
  /** Icon-only rail; item labels stay as accessibility labels. */
  collapsed?: boolean;
  color?: Color;
  action?: Action;
  label?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Sidebar({ collapsed = false, color = "primary", action, label = "Sidebar", children, style }: SidebarProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  return (
    <SidebarContext.Provider value={{ collapsed, tone: c }}>
      <View
        accessibilityLabel={label}
        style={[{ width: collapsed ? 64 : 256, alignSelf: "stretch", borderRightWidth: tokens.borderWidth, borderColor: tokens.border, backgroundColor: tokens.surface }, style]}
      >
        <ScrollView contentContainerStyle={{ padding: collapsed ? 8 : 12, gap: 4, alignItems: collapsed ? "center" : "stretch" }}>{children}</ScrollView>
      </View>
    </SidebarContext.Provider>
  );
}

export interface SidebarSectionProps {
  title?: string;
  children?: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  const { tokens } = useTheme();
  const ctx = useContext(SidebarContext);
  return (
    <View style={{ gap: 4, marginTop: 8 }}>
      {title && !ctx?.collapsed ? (
        <RNText accessibilityRole="header" style={{ paddingHorizontal: 12, paddingVertical: 4, color: tokens.mutedFg, fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 }}>
          {title}
        </RNText>
      ) : null}
      {children}
    </View>
  );
}

export interface SidebarItemProps {
  /** Marks the current page. */
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  /** Second line under the label. */
  description?: string;
  /** Right-aligned content (a badge, a shortcut). */
  end?: ReactNode;
  onPress?: () => void;
  children?: string;
}

export function SidebarItem({ active, disabled, icon, description, end, onPress, children }: SidebarItemProps) {
  const { tokens } = useTheme();
  const ctx = useContext(SidebarContext);
  const collapsed = ctx?.collapsed ?? false;
  const c = ctx?.tone;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={children}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 12,
        paddingHorizontal: collapsed ? 0 : 12,
        width: collapsed ? 44 : undefined,
        borderRadius: tokens.radiusControl,
        backgroundColor: active ? c?.soft : pressed ? tokens.muted : "transparent",
        opacity: disabled ? tokens.disabledOpacity : 1,
      })}
    >
      {icon}
      {collapsed ? null : (
        <>
          <View style={{ flex: 1 }}>
            <RNText numberOfLines={1} style={{ color: active ? c?.ink : tokens.fg, fontSize: 14, fontWeight: active ? "600" : "500" }}>
              {children}
            </RNText>
            {description ? <RNText numberOfLines={1} style={{ color: tokens.mutedFg, fontSize: 12 }}>{description}</RNText> : null}
          </View>
          {end}
        </>
      )}
    </Pressable>
  );
}
