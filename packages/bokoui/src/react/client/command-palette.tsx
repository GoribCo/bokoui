import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn, getNextIndex, icons, inputClass, menuItemClass } from "@/core";
import { Icon } from "../ui/icon";
import { Modal } from "./modal";

export interface Command {
  id: string;
  label: string;
  /** Extra search words, e.g. synonyms. */
  keywords?: string;
  /** Right-aligned hint, e.g. a shortcut. */
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandGroup {
  heading?: string;
  commands: readonly Command[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: readonly CommandGroup[];
  placeholder?: string;
  emptyText?: string;
  /** Letter that toggles the palette with Ctrl or Cmd (e.g. "k"). Omit to manage opening yourself. */
  hotkey?: string;
  /** Accessible name of the dialog. */
  label?: string;
}

const matches = (c: Command, q: string) => `${c.label} ${c.keywords ?? ""}`.toLowerCase().includes(q.trim().toLowerCase());

/**
 * Searchable list of actions in a dialog (Cmd/Ctrl+K). Type to filter; Up/Down move; Enter runs
 * the command and closes; Escape closes. Built on `Modal`, so focus is trapped and restored.
 */
export function CommandPalette({ open, onOpenChange, groups, placeholder = "Type a command or search…", emptyText = "No results", hotkey, label = "Command palette" }: CommandPaletteProps) {
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () => groups.map((g) => ({ ...g, commands: g.commands.filter((c) => matches(c, query)) })).filter((g) => g.commands.length > 0),
    [groups, query],
  );
  const flat = useMemo(() => visible.flatMap((g) => g.commands), [visible]);
  const enabled = flat.map((c, i) => (c.disabled ? -1 : i)).filter((i) => i >= 0);
  const optionId = (i: number) => `${listId}-opt-${i}`;

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey.toLowerCase()) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hotkey, open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView?.({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function run(command: Command | undefined) {
    if (!command || command.disabled) return;
    onOpenChange(false);
    command.onSelect();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      run(flat[active]);
      return;
    }
    const next = getNextIndex(enabled.indexOf(active), enabled.length, event.key, { orientation: "vertical" });
    if (next !== undefined && event.key !== "Home" && event.key !== "End") {
      event.preventDefault();
      setActive(enabled[next]);
    }
  }

  let index = -1;
  return (
    <Modal open={open} onOpenChange={onOpenChange} showClose={false} size="md" aria-label={label} className="mt-[10vh] mb-auto max-h-[70dvh]">
      <div className="-mx-5 -my-4 flex max-h-[70dvh] flex-col">
        <div className="relative border-b border-border p-3">
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-6 flex items-center text-muted-foreground [&>svg]:size-4">
            <Icon node={icons.search} />
          </span>
          <input
            ref={inputRef}
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flat.length ? optionId(active) : undefined}
            aria-label={label}
            placeholder={placeholder}
            value={query}
            data-tone="primary"
            className={cn(inputClass({ variant: "flushed", startAdornment: true }), "border-b-0")}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <div id={listId} role="listbox" aria-label={label} className="min-h-0 flex-1 overflow-y-auto p-2">
          {flat.length === 0 && (
            <p role="presentation" className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </p>
          )}
          {visible.map((group, g) => (
            <div key={group.heading ?? g} role="group" aria-label={group.heading}>
              {group.heading && <div className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{group.heading}</div>}
              {group.commands.map((command) => {
                const i = ++index;
                return (
                  <div
                    key={command.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === active}
                    aria-disabled={command.disabled || undefined}
                    data-highlighted={i === active ? "" : undefined}
                    data-tone="primary"
                    className={menuItemClass(false)}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseMove={() => !command.disabled && setActive(i)}
                    onClick={() => run(command)}
                  >
                    {command.icon}
                    <span className="min-w-0 flex-1 truncate">{command.label}</span>
                    {command.hint && <span className="shrink-0 text-xs text-muted-foreground">{command.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
