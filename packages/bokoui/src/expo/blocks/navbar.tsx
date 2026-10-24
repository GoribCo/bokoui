import { createContext, useContext, useState, type ReactNode } from "react";
import { Pressable, Text as RNText, View, useWindowDimensions, type StyleProp, type ViewStyle } from "react-native";
import { type Action, type Color } from "@/core";
import { useTheme } from "../theme";
import { type Tone, useTone } from "../internal/shared";

const NavContext = createContext<{ tone: Tone; stacked: boolean } | null>(null);

export interface NavbarProps {
  /** Logo or name, usually a `NavbarBrand`. */
  brand?: ReactNode;
  /** `NavbarLink`s. On narrow screens they collapse behind a menu button. */
  children?: ReactNode;
  /** Right-aligned content (buttons, a theme switcher). Always visible. */
  actions?: ReactNode;
  color?: Color;
  action?: Action;
  menuLabel?: string;
  /** Width below which the links collapse. Default 768, like the web `md` breakpoint. */
  breakpoint?: number;
  style?: StyleProp<ViewStyle>;
}

export function Navbar({ brand, children, actions, color = "primary", action, menuLabel = "Menu", breakpoint = 768, style }: NavbarProps) {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const c = useTone(color, action);
  const compact = width < breakpoint;
  return (
    <View accessibilityRole="toolbar" style={[{ alignSelf: "stretch", borderBottomWidth: tokens.borderWidth, borderColor: tokens.border, backgroundColor: tokens.surface }, style]}>
      <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 16 }}>
        {brand}
        {compact ? (
          <View style={{ flex: 1 }} />
        ) : (
          <NavContext.Provider value={{ tone: c, stacked: false }}>
            <View accessibilityRole="menu" style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>{children}</View>
          </NavContext.Provider>
        )}
        {actions}
        {compact && children ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={menuLabel}
            accessibilityState={{ expanded: open }}
            onPress={() => setOpen(!open)}
            style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
          >
            <RNText style={{ color: tokens.fg, fontSize: 22 }}>{open ? "✕" : "☰"}</RNText>
          </Pressable>
        ) : null}
      </View>
      {compact && open ? (
        <NavContext.Provider value={{ tone: c, stacked: true }}>
          <View style={{ paddingHorizontal: 12, paddingBottom: 12, gap: 4 }}>{children}</View>
        </NavContext.Provider>
      ) : null}
    </View>
  );
}

export function NavbarBrand({ onPress, children }: { onPress?: () => void; children?: ReactNode }) {
  const { tokens } = useTheme();
  const content = typeof children === "string" ? <RNText style={{ color: tokens.fg, fontSize: 18, fontWeight: "700" }}>{children}</RNText> : children;
  return onPress ? (
    <Pressable accessibilityRole="link" onPress={onPress} style={{ minHeight: 44, justifyContent: "center" }}>
      {content}
    </Pressable>
  ) : (
    <View>{content}</View>
  );
}

export interface NavbarLinkProps {
  /** Marks the current page. */
  active?: boolean;
  onPress?: () => void;
  children?: ReactNode;
}

export function NavbarLink({ active, onPress, children }: NavbarLinkProps) {
  const { tokens } = useTheme();
  const ctx = useContext(NavContext);
  const c = ctx?.tone;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: 12,
        borderRadius: tokens.radiusControl,
        backgroundColor: active ? c?.soft : pressed ? tokens.muted : "transparent",
      })}
    >
      {typeof children === "string" ? <RNText style={{ color: active ? c?.ink : tokens.fg, fontSize: 14, fontWeight: "500" }}>{children}</RNText> : children}
    </Pressable>
  );
}
