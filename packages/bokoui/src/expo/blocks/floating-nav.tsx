import { createContext, useContext, type ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme";
import { Surface } from "../internal/surface";

const FloatingNavContext = createContext(false);

export interface FloatingNavProps {
  /** Accessible name of the tab list. */
  label?: string;
  /**
   * Distance to keep from the screen bottom, e.g. `useSafeAreaInsets().bottom`. The bar adds its own 12 px
   * margin; the larger of the two applies.
   */
  bottomInset?: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Floating pill navigation for phones: icon buttons in a rounded, softly shadowed pill with the current one
 * filled. It is a normal view, not an overlay: place it below the scroll area so content is never covered.
 */
export function FloatingNav({ label = "Main", bottomInset = 0, children, style }: FloatingNavProps) {
  const { tokens } = useTheme();
  return (
    <FloatingNavContext.Provider value>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: Math.max(bottomInset, 12) }}>
        <Surface
          kind="card"
          accessibilityRole="tablist"
          accessibilityLabel={label}
          style={{
            flexDirection: "row",
            alignSelf: "center",
            width: "100%",
            maxWidth: 448,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: tokens.surface,
            borderWidth: tokens.borderWidth,
            borderColor: tokens.border,
            // Without a style material the pill gets a plain drop shadow.
            ...(tokens.effects.card ? null : { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 4 }),
          }}
          overrideStyle={style}
        >
          {children}
        </Surface>
      </View>
    </FloatingNavContext.Provider>
  );
}

export interface FloatingNavItemProps {
  /** Accessible name; the button shows only the icon. */
  label: string;
  /** The icon, or a function that receives the color to draw it with (it changes with `active`). */
  icon: ReactNode | ((color: string) => ReactNode);
  /** Marks the current screen and fills the button. */
  active?: boolean;
  /** For an item that opens a sheet: whether it is open. */
  expanded?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

/** One round icon button of a `FloatingNav`. */
export function FloatingNavItem({ label, icon, active = false, expanded, disabled, onPress }: FloatingNavItemProps) {
  const { tokens } = useTheme();
  if (!useContext(FloatingNavContext)) throw new Error("FloatingNavItem must be used inside <FloatingNav>");
  const color = active ? tokens.bg : tokens.mutedFg;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, expanded, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{ flex: 1, minWidth: 0, minHeight: 56, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: active ? tokens.fg : "transparent" }}>
        {typeof icon === "function" ? icon(color) : icon}
      </View>
    </Pressable>
  );
}
