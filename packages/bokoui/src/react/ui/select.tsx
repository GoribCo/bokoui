"use client";

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState, type ButtonHTMLAttributes, type KeyboardEvent } from "react";
import {
  cn,
  getNextIndex,
  icons,
  inputClass,
  isTypeaheadKey,
  menuItemClass,
  popoverPanelClass,
  resolveTone,
  typeaheadIndex,
  type Action,
  type Color,
  type InputStyleProps,
} from "@/core";
import { Icon } from "../internal/icon";
import { useFloating, useTopLayer } from "../internal/floating";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "size" | "type">,
    Pick<InputStyleProps, "variant"> {
  options: readonly SelectOption[];
  /** Selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown while nothing is selected. */
  placeholder?: string;
  size?: InputStyleProps["size"];
  color?: Color;
  action?: Action;
  invalid?: boolean;
  required?: boolean;
  /** Submitted with a surrounding `<form>` through a hidden input. */
  name?: string;
  className?: string;
}

/**
 * Custom select (select-only combobox pattern). Focus stays on the trigger and the active
 * option is announced through `aria-activedescendant`. Keyboard: arrows, Home/End, typeahead,
 * Enter/Space to choose, Escape to close.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = "Select…",
    variant,
    size,
    color = "primary",
    action,
    invalid = false,
    required,
    disabled,
    name,
    className,
    id,
    onKeyDown,
    onClick,
    ...props
  },
  ref,
) {
  const listId = useId();
  const optionId = (index: number) => `${listId}-opt-${index}`;
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const selectedIndex = options.findIndex((o) => o.value === current);
  const [active, setActive] = useState(-1);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => trigger.current as HTMLButtonElement);
  const query = useRef({ text: "", timer: undefined as ReturnType<typeof setTimeout> | undefined });
  useTopLayer(panel, open);
  const pos = useFloating(trigger, panel, open, "bottom-start", 4);

  const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      if (value === undefined) setInner(option.value);
      onValueChange?.(option.value);
    },
    [options, value, onValueChange],
  );

  function openList() {
    setActive(selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : (enabled[0] ?? -1));
    setOpen(true);
  }
  function closeList() {
    setOpen(false);
    trigger.current?.focus();
  }

  // Keep the active option visible in a long list.
  useEffect(() => {
    if (open && active >= 0) document.getElementById(optionId(active))?.scrollIntoView?.({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    const { key } = event;

    if (isTypeaheadKey(event)) {
      const q = query.current;
      clearTimeout(q.timer);
      q.text += key;
      q.timer = setTimeout(() => (q.text = ""), 500);
      const labels = enabled.map((i) => options[i].label);
      const from = enabled.indexOf(open ? active : selectedIndex);
      const match = typeaheadIndex(labels, q.text, from);
      if (match >= 0) {
        const index = enabled[match];
        if (open) setActive(index);
        else commit(index);
      }
      return;
    }

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    if (key === "Escape") {
      event.preventDefault();
      closeList();
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      commit(active);
      closeList();
    } else if (key === "Tab") {
      commit(active);
      setOpen(false);
    } else {
      const next = getNextIndex(enabled.indexOf(active), enabled.length, key, { orientation: "vertical" });
      if (next !== undefined) {
        event.preventDefault();
        setActive(enabled[next]);
      }
    }
  }

  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const tone = invalid ? "danger" : resolveTone(color, action);

  return (
    <div className="relative w-full" data-tone={tone}>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        data-tone={tone}
        disabled={disabled}
        className={cn(inputClass({ variant, size }, "cursor-pointer justify-between gap-2 text-start"), className)}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (open) setOpen(false);
          else openList();
        }}
        {...props}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-muted-foreground")}>{selected?.label ?? placeholder}</span>
        <Icon node={icons.chevronDown} className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {name && <input type="hidden" name={name} value={current ?? ""} />}
      {open && (
        <div
          ref={panel}
          id={listId}
          role="listbox"
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          popover="manual"
          className={popoverPanelClass()}
          style={{ inset: "auto", top: pos.top, left: pos.left, minWidth: trigger.current?.offsetWidth, opacity: pos.ready ? 1 : 0 }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              aria-disabled={option.disabled || undefined}
              data-highlighted={index === active ? "" : undefined}
              data-tone="primary"
              className={menuItemClass(false, "justify-between")}
              // Keep focus on the trigger; the click still registers.
              onMouseDown={(event) => event.preventDefault()}
              onMouseMove={() => !option.disabled && setActive(index)}
              onClick={() => {
                if (option.disabled) return;
                commit(index);
                closeList();
              }}
            >
              <span className="truncate">{option.label}</span>
              {index === selectedIndex && <Icon node={icons.check} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
