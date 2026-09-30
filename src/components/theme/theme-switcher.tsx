"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useTheme } from "./theme-provider";
import { modes } from "./themes";

const modeLabels = { light: "Light", dark: "Dark", system: "System" } as const;

export function ThemeSwitcher({ className }: { className?: string }) {
  const { style, mode, themes, setStyle, setMode } = useTheme();

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Style</span>
        <select
          value={style}
          onChange={(event) => setStyle(event.target.value)}
          className="focus-ring h-8 rounded-control border-[length:var(--ui-border-width)] border-field-border bg-field px-2 text-sm text-foreground"
        >
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.label}
            </option>
          ))}
        </select>
      </label>
      <div role="group" aria-label="Color mode" className="flex gap-1">
        {modes.map((m) => (
          <Button
            key={m}
            size="sm"
            color="neutral"
            variant={mode === m ? "solid" : "outline"}
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
          >
            {modeLabels[m]}
          </Button>
        ))}
      </div>
    </div>
  );
}
