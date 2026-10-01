/**
 * Keyboard shortcuts of the shell. `mod` is Ctrl on Windows and Linux and Cmd on macOS. They are off when
 * `features.keyboardShortcuts` is false, and never fire while the user is typing in a field.
 */
export const shortcuts = {
  search: { mod: true, key: "k", hint: "Ctrl+K", keyshortcuts: "Control+K Meta+K" },
  toggleSidebar: { mod: true, key: "b", hint: "Ctrl+B", keyshortcuts: "Control+B Meta+B" },
  notifications: { mod: false, key: "n", alt: true, hint: "Alt+N", keyshortcuts: "Alt+N" },
} as const;

export type ShortcutId = keyof typeof shortcuts;

interface Combo {
  mod: boolean;
  key: string;
  alt?: boolean;
}

/** True when the keyboard event is this shortcut. */
export function matchesShortcut(event: KeyboardEvent, combo: Combo): boolean {
  if (event.key.toLowerCase() !== combo.key) return false;
  const mod = event.ctrlKey || event.metaKey;
  return combo.mod ? mod && !event.altKey : !mod && event.altKey === Boolean(combo.alt);
}

/** True when typing: shortcuts without a modifier must not steal keys from fields. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}
