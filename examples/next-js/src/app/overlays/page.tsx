import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { DrawerDemo, MenuDemo, ModalDemo, PopoverDemo, TooltipDemo } from "./overlays-demo";

export const metadata: Metadata = { title: "Overlays · UI Framework" };

export default function OverlaysPage() {
  return (
    <Page>
      <PageHeader
        title="Overlays"
        description="Modal and Drawer use a native dialog; Tooltip, Popover and Menu use the Popover API. Focus, Escape and light dismiss come from the browser plus a little keyboard code."
      />
      <Section title="Modal" note="Try Tab (focus stays inside), Escape, and clicking the backdrop.">
        <ModalDemo />
      </Section>
      <Section title="Tooltip" note="Hover, or focus with the keyboard. Escape hides it. Near a viewport edge it flips.">
        <TooltipDemo />
      </Section>
      <Section title="Popover" note="Holds anything (forms, text). Focus moves in; Escape or an outside click closes it.">
        <PopoverDemo />
      </Section>
      <Section title="Drawer" note="A modal anchored to an edge.">
        <DrawerDemo />
      </Section>
      <Section title="Menu" note="Open with click, ArrowDown or ArrowUp. Arrows, Home/End and typeahead move; Enter selects; Escape closes.">
        <MenuDemo />
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Modal", "Drawer", "Tooltip", "Popover", "Menu", "MenuItem", "CommandPalette"]} />
      </Section>
    </Page>
  );
}
