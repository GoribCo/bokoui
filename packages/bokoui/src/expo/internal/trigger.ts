/** Props the trigger element of an overlay (Popover, Menu, Tooltip) receives. Any pressable (Button, Pressable) accepts them. */
export interface TriggerProps {
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityHint?: string;
  accessibilityState?: { expanded?: boolean };
}
