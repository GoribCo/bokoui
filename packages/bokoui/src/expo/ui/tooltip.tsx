import { cloneElement, useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Text as RNText, View } from "react-native";
import { useTheme } from "../theme";
import { AnchoredLayer, useAnchor } from "../internal/anchored";
import type { TriggerProps } from "../internal/trigger";

export interface TooltipProps {
  /** Tooltip text. Keep it short. */
  content: string;
  /** The element the tooltip describes. It must accept `onLongPress`. */
  children: ReactElement<TriggerProps>;
  placement?: "top" | "bottom";
  /** How long the bubble stays, ms. Default 2500. */
  duration?: number;
  disabled?: boolean;
}

/**
 * There is no hover on touch screens, so a long press shows the tip. The text is also set as the
 * trigger's accessibility hint, so screen-reader users get it without the bubble.
 */
export function Tooltip({ content, children, placement = "top", duration = 2500, disabled }: TooltipProps) {
  const { tokens } = useTheme();
  const [open, setOpen] = useState(false);
  const { ref, rect, measure } = useAnchor();
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setOpen(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);
  return (
    <>
      <View ref={ref} collapsable={false} style={{ alignSelf: "flex-start" }}>
        {cloneElement(children, {
          accessibilityHint: children.props.accessibilityHint ?? content,
          onLongPress: disabled
            ? children.props.onLongPress
            : () => {
                children.props.onLongPress?.();
                measure(() => setOpen(true));
              },
        })}
      </View>
      <AnchoredLayer visible={open} rect={rect} placement={placement} align="center" bare onClose={() => setOpen(false)}>
        <View accessibilityRole="text" style={{ alignSelf: "center", maxWidth: 260, paddingHorizontal: 10, paddingVertical: 6, borderRadius: tokens.radiusControl, backgroundColor: tokens.fg }}>
          <RNText style={{ color: tokens.bg, fontSize: 13 }}>{content}</RNText>
        </View>
      </AnchoredLayer>
    </>
  );
}
