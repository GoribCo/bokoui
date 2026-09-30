import { forwardRef, useMemo, useState, type ButtonHTMLAttributes } from "react";
import { cn, icons, inputClass, resolveTone, toISODate, type Action, type Color, type DateBounds, type InputStyleProps, type WeekStart } from "@/core";
import { Icon } from "../ui/icon";
import { Calendar } from "./calendar";
import { Popover } from "./popover";

export interface DatePickerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue" | "onChange" | "size" | "type">,
    Pick<InputStyleProps, "variant" | "size">,
    DateBounds {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  placeholder?: string;
  locale?: string;
  weekStartsOn?: WeekStart;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  required?: boolean;
  /** Submitted as `YYYY-MM-DD` through a hidden input. */
  name?: string;
}

/** A button that shows the chosen date and opens a Calendar in a popover. Choosing a day closes it. */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  { value, defaultValue = null, onValueChange, placeholder = "Pick a date", locale, weekStartsOn, min, max, isDisabled, variant, size, color = "primary", action, invalid = false, required, disabled, name, className, ...props },
  ref,
) {
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = value === undefined ? inner : value;
  const format = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "long" }), [locale]);
  const tone = invalid ? "danger" : resolveTone(color, action);

  return (
    <div className="relative w-full" data-tone={tone}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        placement="bottom-start"
        aria-label="Choose date"
        className="p-0"
        trigger={
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            data-tone={tone}
            className={cn(inputClass({ variant, size }, "cursor-pointer justify-between gap-2 text-start"), className)}
            {...props}
          >
            <span className={cn("min-w-0 flex-1 truncate", !selected && "text-muted-foreground")}>{selected ? format.format(selected) : placeholder}</span>
            <Icon node={icons.calendar} className="size-4 shrink-0 text-muted-foreground" />
          </button>
        }
      >
        <Calendar
          autoFocus
          value={selected}
          defaultMonth={selected ?? undefined}
          locale={locale}
          weekStartsOn={weekStartsOn}
          min={min}
          max={max}
          isDisabled={isDisabled}
          color={color}
          action={action}
          className="border-0"
          onValueChange={(date) => {
            if (value === undefined) setInner(date);
            onValueChange?.(date);
            setOpen(false);
          }}
        />
      </Popover>
      {name && <input type="hidden" name={name} value={selected ? toISODate(selected) : ""} />}
    </div>
  );
});
