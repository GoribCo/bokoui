"use client";

import { useState } from "react";
import { FormField, Slider, Tag, Inline, Input, Button, Text } from "bokoui/react";
import { Combobox, DatePicker, FileUpload, Rating } from "bokoui/react/client";

const countries = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
  { value: "xx", label: "Atlantis (unavailable)", disabled: true },
];

export function SliderDemo() {
  const [volume, setVolume] = useState(40);
  const [temp, setTemp] = useState(21);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField label={`Volume: ${volume}`} hint="Arrow keys, Home/End, PageUp/PageDown">
        <Slider value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
      </FormField>
      <FormField label={`Temperature: ${temp}°C`}>
        <Slider min={10} max={30} step={0.5} value={temp} onChange={(e) => setTemp(Number(e.target.value))} action="warning" />
      </FormField>
      <FormField label="Small, success">
        <Slider size="sm" action="success" defaultValue={70} />
      </FormField>
      <FormField label="Large, disabled" disabled>
        <Slider size="lg" defaultValue={30} />
      </FormField>
      <FormField label="Invalid" error="Pick a value above 50">
        <Slider defaultValue={20} />
      </FormField>
    </div>
  );
}

export function ComboboxDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField label="Country" hint={value ? `Selected: ${value}` : "Type to filter"}>
        <Combobox options={countries} value={value} onValueChange={setValue} placeholder="Search countries…" />
      </FormField>
      <FormField label="Prefilled">
        <Combobox options={countries} defaultValue="in" />
      </FormField>
      <FormField label="With error" error="Country is required">
        <Combobox options={countries} placeholder="Search countries…" />
      </FormField>
      <FormField label="Disabled" disabled>
        <Combobox options={countries} defaultValue="jp" />
      </FormField>
    </div>
  );
}

export function DateDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const noWeekends = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField label="Date" hint={date ? date.toDateString() : "Arrows, PageUp/PageDown, Home/End"}>
        <DatePicker value={date} onValueChange={setDate} />
      </FormField>
      <FormField label="Weekdays from today only" hint="Weekends and past dates are disabled">
        <DatePicker min={today} isDisabled={noWeekends} weekStartsOn={1} placeholder="Choose a weekday" />
      </FormField>
      <FormField label="Invalid" error="Please choose a date">
        <DatePicker />
      </FormField>
      <FormField label="German locale">
        <DatePicker locale="de-DE" weekStartsOn={1} />
      </FormField>
    </div>
  );
}

export function RatingDemo() {
  const [value, setValue] = useState(3);
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
      <div className="flex flex-col gap-1">
        <Rating aria-label="Rate this product" value={value} onValueChange={setValue} />
        <Text variant="small" muted>
          {value ? `${value} of 5` : "Not rated"}
        </Text>
      </div>
      <Rating aria-label="Small, success" size="sm" action="success" defaultValue={4} />
      <Rating aria-label="Large, warning" size="lg" action="warning" defaultValue={2} />
      <Rating readOnly aria-label="Average rating" value={4} />
      <Rating aria-label="Ten stars" max={10} defaultValue={7} size="sm" />
    </div>
  );
}

export function TagsDemo() {
  const [tags, setTags] = useState(["design", "react", "accessibility"]);
  const [draft, setDraft] = useState("");
  const [filters, setFilters] = useState<string[]>(["open"]);
  const toggle = (f: string) => setFilters((all) => (all.includes(f) ? all.filter((x) => x !== f) : [...all, f]));
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Inline gap={2} aria-label="Tags">
          {tags.map((t) => (
            <Tag key={t} onRemove={() => setTags((all) => all.filter((x) => x !== t))}>
              {t}
            </Tag>
          ))}
          {tags.length === 0 && (
            <Text variant="small" muted>
              No tags
            </Text>
          )}
        </Inline>
        <form
          className="flex max-w-sm gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const v = draft.trim();
            if (v && !tags.includes(v)) setTags([...tags, v]);
            setDraft("");
          }}
        >
          <Input aria-label="New tag" placeholder="Add a tag" value={draft} onChange={(e) => setDraft(e.target.value)} size="sm" />
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
      </div>
      <Inline gap={2} role="group" aria-label="Filter by status">
        {["open", "closed", "blocked", "draft"].map((f) => (
          <Tag key={f} variant={filters.includes(f) ? "solid" : "outline"} pressed={filters.includes(f)} onClick={() => toggle(f)}>
            {f}
          </Tag>
        ))}
      </Inline>
    </div>
  );
}

export function UploadDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField label="Photo" hint="PNG or JPG, up to 2 MB">
        <FileUpload accept="image/png,image/jpeg" maxSize={2 * 1024 * 1024} label="Drop a photo or click to browse" />
      </FormField>
      <FormField label="Documents" hint="Up to 3 PDFs">
        <FileUpload multiple maxFiles={3} accept=".pdf,application/pdf" label="Drop PDFs here" />
      </FormField>
    </div>
  );
}
