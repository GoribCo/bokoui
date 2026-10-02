import { cloneElement, createContext, useContext, useState, type ReactElement, type ReactNode } from "react";
import { Pressable, Text as RNText, View } from "react-native";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";
import { AnchoredLayer, useAnchor } from "../internal/anchored";
import type { TriggerProps } from "../internal/trigger";

const MenuContext = createContext<{ close: () => void } | null>(null);

export interface MenuProps {
  /** The element that opens the menu (usually a Button). It must accept `onPress`. */
  trigger: ReactElement<TriggerProps>;
  /** `MenuItem`, `MenuSeparator` and `MenuLabel` children. */
  children: ReactNode;
  placement?: "top" | "bottom";
  align?: "start" | "end";
  label?: string;
}

/** A list of actions anchored to its trigger. Picking an item closes it. */
export function Menu({ trigger, children, placement = "bottom", align = "start", label }: MenuProps) {
  const [open, setOpen] = useState(false);
  const { ref, rect, measure } = useAnchor();
  const close = () => setOpen(false);
  return (
    <>
      <View ref={ref} collapsable={false} style={{ alignSelf: "flex-start" }}>
        {cloneElement(trigger, {
          onPress: () => {
            trigger.props.onPress?.();
            measure(() => setOpen(true));
          },
          accessibilityState: { expanded: open },
        })}
      </View>
      <AnchoredLayer visible={open} rect={rect} placement={placement} align={align} onClose={close} accessibilityLabel={label} style={{ minWidth: 200, paddingVertical: 4 }}>
        <MenuContext.Provider value={{ close }}>{children}</MenuContext.Provider>
      </AnchoredLayer>
    </>
  );
}

export interface MenuItemProps {
  /** Called on press; the menu closes afterwards. */
  onSelect?: () => void;
  /** Destructive styling (danger tone). */
  danger?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export function MenuItem({ onSelect, danger, disabled, children }: MenuItemProps) {
  const { tokens } = useTheme();
  const ctx = useContext(MenuContext);
  const d = tone(tokens, "danger");
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        ctx?.close();
        onSelect?.();
      }}
      style={({ pressed }) => ({
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: 12,
        backgroundColor: pressed ? (danger ? d.soft : tokens.muted) : "transparent",
        opacity: disabled ? tokens.disabledOpacity : 1,
      })}
    >
      {typeof children === "string" ? <RNText style={{ color: danger ? d.ink : tokens.fg, fontSize: 14 }}>{children}</RNText> : children}
    </Pressable>
  );
}

export function MenuSeparator() {
  const { tokens } = useTheme();
  return <View accessibilityRole="none" style={{ height: tokens.borderWidth, marginVertical: 4, backgroundColor: tokens.border }} />;
}

export function MenuLabel({ children }: { children?: ReactNode }) {
  const { tokens } = useTheme();
  return <RNText style={{ paddingHorizontal: 12, paddingVertical: 6, color: tokens.mutedFg, fontSize: 12, fontWeight: "600" }}>{children}</RNText>;
}
