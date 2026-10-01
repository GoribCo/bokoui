import { type ReactNode } from "react";
import { Modal as RNModal, Pressable, Text as RNText, View } from "react-native";
import { type ModalPlacement, type ModalSize } from "@/core";
import { useTheme } from "../theme";
import { surface } from "../internal/shared";

export interface ModalProps {
  open: boolean;
  /** Called when the user dismisses it (backdrop press, Android back, close button). Set `open` to false in it. */
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  size?: ModalSize;
  /** `center` is a dialog; `left`, `right` and `bottom` anchor it to an edge (see `Drawer`). */
  placement?: ModalPlacement;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  closeLabel?: string;
}

const modalMaxWidth: Record<ModalSize, number | "100%"> = { sm: 384, md: 512, lg: 768, full: "100%" };

/** Backdrop alignment and card shape per placement; edges drop the radius and border on the screen side. */
function placementStyles(placement: ModalPlacement, radius: number) {
  switch (placement) {
    case "right":
      return { backdrop: { alignItems: "flex-end", padding: 0 }, card: { height: "100%", maxHeight: "100%", maxWidth: 384, borderRadius: 0, borderRightWidth: 0 } } as const;
    case "left":
      return { backdrop: { alignItems: "flex-start", padding: 0 }, card: { height: "100%", maxHeight: "100%", maxWidth: 384, borderRadius: 0, borderLeftWidth: 0 } } as const;
    case "bottom":
      return {
        backdrop: { justifyContent: "flex-end", padding: 0 },
        card: { maxHeight: "85%", maxWidth: "100%", borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: radius, borderTopRightRadius: radius, borderBottomWidth: 0 },
      } as const;
    default:
      return { backdrop: {}, card: {} } as const;
  }
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = "md",
  placement = "center",
  closeOnBackdrop = true,
  showClose = true,
  closeLabel = "Close",
}: ModalProps) {
  const { tokens } = useTheme();
  const edge = placementStyles(placement, tokens.radiusCard);
  return (
    <RNModal transparent animationType={placement === "center" ? "fade" : "slide"} visible={open} onRequestClose={() => onOpenChange(false)} statusBarTranslucent>
      <Pressable
        accessible={false}
        onPress={() => closeOnBackdrop && onOpenChange(false)}
        style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.5)", ...edge.backdrop }}
      >
        {/* Swallow presses so taps inside the card do not reach the backdrop. */}
        <Pressable
          accessibilityViewIsModal
          accessibilityLabel={title}
          onPress={() => {}}
          style={{
            width: "100%",
            maxWidth: modalMaxWidth[size],
            maxHeight: "90%",
            borderRadius: tokens.radiusCard,
            borderWidth: tokens.borderWidth,
            borderColor: tokens.border,
            backgroundColor: tokens.surface,
            overflow: "hidden",
            ...edge.card,
          }}
        >
          {title || showClose ? (
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: 20, paddingBottom: 8 }}>
              <View style={{ flex: 1, gap: 4 }}>
                {title ? (
                  <RNText accessibilityRole="header" style={{ color: tokens.fg, fontSize: 18, fontWeight: tokens.headingWeight }}>
                    {title}
                  </RNText>
                ) : null}
                {description ? <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{description}</RNText> : null}
              </View>
              {showClose ? (
                <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={() => onOpenChange(false)} hitSlop={12}>
                  <RNText style={{ color: tokens.mutedFg, fontSize: 22, lineHeight: 24 }}>×</RNText>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          <View style={{ padding: 20, paddingTop: 8 }}>{children}</View>
          {footer ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: 20, paddingTop: 0 }}>
              {footer}
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

export type DrawerProps = Omit<ModalProps, "placement" | "size"> & {
  /** Edge it slides from. Default `right`. */
  side?: Exclude<ModalPlacement, "center">;
};

/** A `Modal` anchored to an edge. */
export const Drawer = ({ side = "right", ...props }: DrawerProps) => <Modal placement={side} {...props} />;
