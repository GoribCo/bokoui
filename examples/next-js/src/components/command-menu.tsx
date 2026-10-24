"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Palette, Search, Sun } from "lucide-react";
import { Button } from "bokoui/react";
import { useTheme } from "bokoui/react/theme";
import { CommandPalette, type CommandGroup } from "bokoui/react/client";
import { navItems } from "./nav-items";

/** Header button plus the Cmd/Ctrl+K palette: jump to any page, switch mode or style. */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { themes, setStyle, setMode } = useTheme();

  const groups = useMemo<CommandGroup[]>(
    () => [
      {
        heading: "Go to",
        commands: navItems.map((item) => ({
          id: `go-${item.href}`,
          label: item.label,
          keywords: item.description,
          hint: item.href,
          onSelect: () => router.push(item.href),
        })),
      },
      {
        heading: "Mode",
        commands: [
          { id: "mode-light", label: "Light mode", icon: <Sun aria-hidden="true" />, onSelect: () => setMode("light") },
          { id: "mode-dark", label: "Dark mode", icon: <Moon aria-hidden="true" />, onSelect: () => setMode("dark") },
        ],
      },
      {
        heading: "Style",
        commands: themes.map((t) => ({ id: `style-${t.id}`, label: `Style: ${t.label}`, icon: <Palette aria-hidden="true" />, onSelect: () => setStyle(t.id) })),
      },
    ],
    [router, themes, setStyle, setMode],
  );

  return (
    <>
      <Button variant="outline" color="neutral" size="sm" leftIcon={<Search aria-hidden="true" />} className="max-sm:px-2" onClick={() => setOpen(true)} aria-keyshortcuts="Control+K Meta+K">
        <span className="max-sm:sr-only">Search</span>
        <kbd className="ms-2 hidden rounded border border-border px-1.5 font-sans text-xs text-muted-foreground sm:inline">⌘K</kbd>
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={groups} hotkey="k" placeholder="Jump to a page or change the style…" />
    </>
  );
}
