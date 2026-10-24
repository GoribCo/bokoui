"use client";

import { useState } from "react";
import { Text } from "bokoui/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "bokoui/react/client";

const faq = [
  { value: "what", q: "What is bokoui?", a: "Themeable components for Tailwind CSS with eight design styles and light and dark modes." },
  { value: "frameworks", q: "Which frameworks does it support?", a: "React (including Next.js), Vue (including Nuxt) and React Native through Expo." },
  { value: "theme", q: "How do I change the style?", a: "Set data-theme on the html element, or use the ThemeSwitcher. Tokens change; components do not." },
  { value: "soon", q: "Can I open this one?", a: "No, it is disabled." },
];

function Items() {
  return faq.map((item) => (
    <AccordionItem key={item.value} value={item.value} disabled={item.value === "soon"}>
      <AccordionTrigger>{item.q}</AccordionTrigger>
      <AccordionContent>{item.a}</AccordionContent>
    </AccordionItem>
  ));
}

export function AccordionDemo() {
  const [value, setValue] = useState("frameworks");
  const [many, setMany] = useState<string[]>(["what", "theme"]);
  return (
    <div className="flex flex-col gap-10">
      <div>
        <Accordion type="single" defaultValue="what">
          <Items />
        </Accordion>
      </div>
      <div className="flex flex-col gap-2">
        <Accordion type="single" collapsible={false} value={value} onValueChange={setValue} color="accent">
          <Items />
        </Accordion>
        <Text variant="small" muted>
          Controlled and not collapsible: open item is <strong>{value}</strong>.
        </Text>
      </div>
      <div className="flex flex-col gap-2">
        <Accordion type="multiple" value={many} onValueChange={setMany} action="success">
          <Items />
        </Accordion>
        <Text variant="small" muted>
          Multiple: open items are <strong>{many.join(", ") || "none"}</strong>.
        </Text>
      </div>
    </div>
  );
}
