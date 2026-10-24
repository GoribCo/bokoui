"use client";

import { useEffect } from "react";
import { features } from "@/lib/config/features";
import { isTypingTarget, matchesShortcut, shortcuts } from "@/lib/config/shortcuts";

/** Shortcuts of the signed-in shell. `Ctrl/Cmd+K` is handled by the header search itself. */
export function useShortcuts(handlers: { toggleSidebar: () => void }) {
  const { toggleSidebar } = handlers;
  useEffect(() => {
    if (!features.keyboardShortcuts) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (matchesShortcut(event, shortcuts.toggleSidebar)) {
        event.preventDefault();
        toggleSidebar();
      } else if (matchesShortcut(event, shortcuts.notifications) && !isTypingTarget(event.target)) {
        event.preventDefault();
        document.querySelector<HTMLElement>('[data-shortcut="notifications"]')?.click();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);
}
