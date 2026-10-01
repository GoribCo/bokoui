import { useCallback, useRef, useState, type ComponentRef, type ReactNode } from "react";
import { Modal as RNModal, Pressable, View, useWindowDimensions, type ViewStyle } from "react-native";
import { useTheme } from "../theme";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Measures an element in window coordinates. Put `ref` on a `View collapsable={false}` around the
 * trigger and call `measure(then)` just before opening, so the layer knows where to sit.
 */
export function useAnchor() {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const measure = useCallback((then: () => void) => {
    const node = ref.current;
    if (!node) return then();
    node.measureInWindow((x, y, width, height) => {
      setRect({ x, y, width, height });
      then();
    });
  }, []);
  return { ref, rect, measure };
}

export type LayerAlign = "start" | "end" | "center" | "stretch";

export interface AnchoredLayerProps {
  visible: boolean;
  onClose: () => void;
  rect: Rect | null;
  /** Preferred side; flips when there is clearly more room on the other. */
  placement?: "top" | "bottom";
  /** `stretch` makes the panel as wide as the trigger. */
  align?: LayerAlign;
  /** Dim the screen behind it. Tooltips do not. */
  dim?: boolean;
  /** Skip the card chrome (tooltip draws its own bubble). */
  bare?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  children: ReactNode;
}

const GAP = 6;
const MARGIN = 8;

/** A popup positioned next to a measured trigger, inside a transparent native Modal so it floats above everything. */
export function AnchoredLayer({ visible, onClose, rect, placement = "bottom", align = "start", dim = false, bare = false, accessibilityLabel, style, children }: AnchoredLayerProps) {
  const { tokens } = useTheme();
  const win = useWindowDimensions();
  if (!rect) return null;

  const below = win.height - (rect.y + rect.height) - GAP - MARGIN;
  const above = rect.y - GAP - MARGIN;
  const top = placement === "top" ? above >= 160 || above >= below : below < 160 && above > below;

  const vertical: ViewStyle = top
    ? { bottom: win.height - rect.y + GAP, maxHeight: above }
    : { top: rect.y + rect.height + GAP, maxHeight: below };
  const horizontal: ViewStyle =
    align === "end"
      ? { right: Math.max(MARGIN, win.width - (rect.x + rect.width)) }
      : align === "stretch"
        ? { left: rect.x, width: rect.width }
        : align === "center"
          ? { left: Math.max(MARGIN, rect.x + rect.width / 2 - 140), width: 280, alignItems: "center" }
          : { left: Math.max(MARGIN, rect.x) };

  return (
    <RNModal transparent visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable accessible={false} onPress={onClose} style={{ flex: 1, backgroundColor: dim ? "rgba(0,0,0,0.25)" : "transparent" }}>
        <View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          // Swallow touches so tapping the panel does not hit the backdrop.
          onStartShouldSetResponder={() => true}
          style={[
            { position: "absolute", ...vertical, ...horizontal },
            bare
              ? null
              : {
                  borderRadius: tokens.radiusCard,
                  borderWidth: tokens.borderWidth,
                  borderColor: tokens.border,
                  backgroundColor: tokens.surface,
                  overflow: "hidden",
                  elevation: 6,
                  shadowColor: "#000",
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                },
            style,
          ]}
        >
          {children}
        </View>
      </Pressable>
    </RNModal>
  );
}
