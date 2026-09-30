import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/section";
import { MenuDemo, ModalDemo, TooltipDemo } from "./overlays-demo";

export const metadata: Metadata = { title: "Overlays · UI Framework" };

export default function OverlaysPage() {
  return (
    <Page>
      <PageHeader
        title="Overlays"
        description="Modal uses a native dialog; Tooltip and Menu use the Popover API. Focus, Escape and light dismiss come from the browser plus a little keyboard code."
      />
      <Section title="Modal" note="Try Tab (focus stays inside), Escape, and clicking the backdrop.">
        <ModalDemo />
      </Section>
      <Section title="Tooltip" note="Hover, or focus with the keyboard. Escape hides it. Near a viewport edge it flips.">
        <TooltipDemo />
      </Section>
      <Section title="Menu" note="Open with click, ArrowDown or ArrowUp. Arrows, Home/End and typeahead move; Enter selects; Escape closes.">
        <MenuDemo />
      </Section>
    </Page>
  );
}
