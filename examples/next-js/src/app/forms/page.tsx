import type { Metadata } from "next";
import { Button, Checkbox, FormField, Input, Radio, RadioGroup, Switch, Textarea, sizes } from "bokoui/react";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { SelectDemo } from "./select-demo";
import { ComboboxDemo, DateDemo, RatingDemo, SliderDemo, TagsDemo, UploadDemo } from "./form-extras";

export const metadata: Metadata = { title: "Forms · UI Framework" };

export default function FormsPage() {
  return (
    <Page>
      <PageHeader
        title="Forms"
        description="FormField wires the label, hint and error to any control through id and aria-describedby."
      />

      <Section title="FormField" note="Pass invalid state with `error`. Tab through to check focus and screen reader descriptions.">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Email" hint="We never share it">
            <Input type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Username" required error="That name is taken">
            <Input defaultValue="ada" />
          </FormField>
          <FormField label="Bio" hint="A short sentence">
            <Textarea placeholder="Tell us about yourself" />
          </FormField>
          <FormField label="Locked" disabled>
            <Input defaultValue="Read only for now" />
          </FormField>
        </div>
      </Section>

      <Section title="Textarea">
        <div className="grid gap-4 sm:grid-cols-3">
          <Textarea variant="outline" placeholder="Outline" aria-label="Outline" />
          <Textarea variant="filled" placeholder="Filled" aria-label="Filled" />
          <Textarea variant="flushed" placeholder="Flushed" aria-label="Flushed" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {sizes.map((size) => (
            <Textarea key={size} size={size} rows={2} placeholder={`Size ${size}`} aria-label={`Size ${size}`} />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Textarea invalid defaultValue="Invalid" aria-label="Invalid" />
          <Textarea disabled placeholder="Disabled" aria-label="Disabled" />
          <Textarea resize="none" placeholder="Resize: none" aria-label="No resize" />
        </div>
      </Section>

      <Section title="Select" note="Custom listbox: arrows, Home/End, typeahead, Enter/Space, Escape.">
        <SelectDemo />
      </Section>

      <Section title="Combobox" note="Type to filter. Arrows move, Enter chooses, Escape restores the chosen text.">
        <ComboboxDemo />
      </Section>

      <Section title="Date picker" note="Calendar in a popover. Locale and week start are props; min, max and a predicate disable days.">
        <DateDemo />
      </Section>

      <Section title="Slider" note="A native range input: keyboard and touch work with no extra code.">
        <SliderDemo />
      </Section>

      <Section title="Rating">
        <RatingDemo />
      </Section>

      <Section title="Tags" note="Removable chips, and toggle chips for filters.">
        <TagsDemo />
      </Section>

      <Section title="File upload" note="Drag files in or click. Wrong type, size or count is rejected with a message.">
        <UploadDemo />
      </Section>

      <Section title="Checkbox">
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox label="Default" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Accent" color="accent" defaultChecked />
          <Checkbox label="Success" action="success" defaultChecked />
          <Checkbox label="Invalid" invalid />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {sizes.map((size) => (
            <Checkbox key={size} size={size} label={`Size ${size}`} defaultChecked />
          ))}
        </div>
      </Section>

      <Section title="Radio">
        <RadioGroup aria-label="Plan">
          <Radio name="plan" value="free" label="Free" defaultChecked />
          <Radio name="plan" value="pro" label="Pro" />
          <Radio name="plan" value="team" label="Team" />
          <Radio name="plan" value="legacy" label="Legacy (disabled)" disabled />
        </RadioGroup>
        <RadioGroup aria-label="Size" orientation="horizontal">
          {sizes.map((size) => (
            <Radio key={size} name="radio-size" size={size} value={size} label={size} defaultChecked={size === "md"} />
          ))}
        </RadioGroup>
      </Section>

      <Section title="Switch">
        <div className="flex flex-wrap items-center gap-6">
          <Switch label="Wi-Fi" />
          <Switch label="On" defaultChecked />
          <Switch label="Success" action="success" defaultChecked />
          <Switch label="Danger" action="danger" defaultChecked />
          <Switch label="Disabled" disabled />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {sizes.map((size) => (
            <Switch key={size} size={size} label={`Size ${size}`} defaultChecked />
          ))}
        </div>
      </Section>

      <Section title="Putting it together">
        <form className="flex max-w-md flex-col gap-4">
          <FormField label="Name" required>
            <Input name="name" placeholder="Ada Lovelace" />
          </FormField>
          <FormField label="Message">
            <Textarea name="message" />
          </FormField>
          <Checkbox name="terms" label="I accept the terms" />
          <Switch name="news" label="Send me the newsletter" />
          <div className="flex gap-2">
            <Button type="submit">Send</Button>
            <Button type="reset" variant="ghost" color="neutral">
              Reset
            </Button>
          </div>
        </form>
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["FormField", "Label", "Input", "Textarea", "Select", "Combobox", "DatePicker", "Calendar", "Slider", "Checkbox", "Radio", "RadioGroup", "Switch", "Rating", "FileUpload"]} />
      </Section>
    </Page>
  );
}
