import { cloneElement, type ReactElement, type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";
import { AnchoredLayer, useAnchor, type LayerAlign } from "../internal/anchored";
import type { TriggerProps } from "../internal/trigger";
import { useControllable } from "../internal/use-controllable";

export type { TriggerProps };

export interface PopoverProps {
  /** The element that toggles the popover. It must accept `onPress`. */
  trigger: ReactElement<TriggerProps>;
  /** Panel content: text, a form, links. Unlike a Menu, it can hold anything. */
  children: ReactNode;
  placement?: "top" | "bottom";
  align?: LayerAlign;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the panel. */
  label?: string;
  style?: ViewStyle;
}

/** A non-modal panel anchored to its trigger; tap outside to close. */
export function Popover({ trigger, children, placement = "bottom", align = "start", open, defaultOpen = false, onOpenChange, label, style }: PopoverProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const { ref, rect, measure } = useAnchor();
  return (
    <>
      <View ref={ref} collapsable={false} style={{ alignSelf: "flex-start" }}>
        {cloneElement(trigger, {
          onPress: () => {
            trigger.props.onPress?.();
            if (isOpen) setOpen(false);
            else measure(() => setOpen(true));
          },
          accessibilityState: { expanded: isOpen },
        })}
      </View>
      <AnchoredLayer visible={isOpen} rect={rect} placement={placement} align={align} onClose={() => setOpen(false)} accessibilityLabel={label} style={{ minWidth: 200, maxWidth: 320, padding: 12, ...style }}>
        {children}
      </AnchoredLayer>
    </>
  );
}
