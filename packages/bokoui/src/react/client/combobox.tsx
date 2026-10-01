import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { cn, getNextIndex, icons, inputClass, menuItemClass, popoverPanelClass, resolveTone, type Action, type Color, type InputStyleProps } from "@/core";
import { Icon } from "../ui/icon";
import { useFloating, useTopLayer } from "./floating";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size" | "type">,
    Pick<InputStyleProps, "variant" | "size"> {
  options: readonly ComboboxOption[];
  /** Selected option value (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown when the typed text matches nothing. */
  emptyText?: string;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  /** Submitted with a surrounding `<form>` through a hidden input. */
  name?: string;
}

const matches = (option: ComboboxOption, query: string) => option.label.toLowerCase().includes(query.trim().toLowerCase());

/**
 * Select with type-to-filter (editable combobox with list autocomplete). Focus stays in the
 * input; the active option is announced through `aria-activedescendant`. Arrows move, Enter
 * chooses, Escape closes; leaving the field restores the chosen option's text.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value, defaultValue, onValueChange, emptyText = "No results", variant, size, color = "primary", action, invalid = false, name, className, disabled, id, placeholder, onKeyDown, onBlur, onFocus, ...props },
  ref,
) {
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);
  const [text, setText] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);
  useTopLayer(panel, open);
  const pos = useFloating(input, panel, open, "bottom-start", 4);

  // When the text still equals the chosen label, show everything (like a select), else filter.
  const filtering = text !== (selected?.label ?? "");
  const visible = useMemo(() => (filtering && text ? options.filter((o) => matches(o, text)) : options), [options, text, filtering]);
  const enabled = visible.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  // Keep the field's text in step with a controlled value.
  useEffect(() => {
    setText(selected?.label ?? "");
  }, [selected?.label]);

  const choose = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;
      if (value === undefined) setInner(option.value);
      setText(option.label);
      setOpen(false);
      onValueChange?.(option.value);
    },
    [value, onValueChange],
  );

  useEffect(() => {
    if (open && active >= 0) document.getElementById(optionId(active))?.scrollIntoView?.({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  function openList(startAtSelected = true) {
    const idx = startAtSelected ? visible.findIndex((o) => o.value === current && !o.disabled) : -1;
    setActive(idx >= 0 ? idx : (enabled[0] ?? -1));
    setOpen(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openList();
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setText(selected?.label ?? "");
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = visible[active];
      if (option) choose(option);
    } else {
      const next = getNextIndex(enabled.indexOf(active), enabled.length, event.key, { orientation: "vertical" });
      if (next !== undefined && event.key !== "Home" && event.key !== "End") {
        event.preventDefault();
        setActive(enabled[next]);
      }
    }
  }

  const tone = invalid ? "danger" : resolveTone(color, action);
  const hasPanel = open;

  return (
    <div className="relative w-full" data-tone={tone}>
      <input
        ref={input}
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={hasPanel ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        data-tone={tone}
        disabled={disabled}
        placeholder={placeholder}
        value={text}
        className={cn(inputClass({ variant, size, endAdornment: true }, className))}
        onChange={(event) => {
          setText(event.target.value);
          setOpen(true);
          // Put the cursor on the first enabled match as the list narrows.
          setActive(options.filter((o) => matches(o, event.target.value)).findIndex((o) => !o.disabled));
        }}
        onFocus={(event) => {
          onFocus?.(event);
          event.currentTarget.select();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setOpen(false);
          // Discard half-typed text that never became a choice.
          setText(selected?.label ?? "");
        }}
        onKeyDown={handleKeyDown}
        onClick={() => !open && !disabled && openList()}
        {...props}
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground [&>svg]:size-4">
        <Icon node={icons.chevronDown} />
      </span>
      {name && <input type="hidden" name={name} value={current ?? ""} />}
      {open && (
        <div
          ref={panel}
          id={listId}
          role="listbox"
          aria-label={props["aria-label"]}
          popover="manual"
          className={popoverPanelClass()}
          style={{ inset: "auto", top: pos.top, left: pos.left, minWidth: input.current?.offsetWidth, opacity: pos.ready ? 1 : 0 }}
        >
          {visible.length === 0 ? (
            <div role="presentation" className="px-2.5 py-2 text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            visible.map((option, index) => (
              <div
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === current}
                aria-disabled={option.disabled || undefined}
                data-highlighted={index === active ? "" : undefined}
                data-tone="primary"
                className={menuItemClass(false, "justify-between")}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => !option.disabled && setActive(index)}
                onClick={() => choose(option)}
              >
                <span className="truncate">{option.label}</span>
                {option.value === current && <Icon node={icons.check} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});
