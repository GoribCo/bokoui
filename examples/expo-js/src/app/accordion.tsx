import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Text } from 'bokoui/expo';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen, Section } from '@/components/screen';

const faq = [
  { value: 'what', q: 'What is bokoui?', a: 'Themeable components with twenty design styles and light and dark modes.' },
  { value: 'frameworks', q: 'Which frameworks does it support?', a: 'React (including Next.js), Vue (including Nuxt) and React Native through Expo.' },
  { value: 'theme', q: 'How do I change the style?', a: 'Use the style switcher at the top. Tokens change; components do not.' },
  { value: 'soon', q: 'Can I open this one?', a: 'No, it is disabled.' },
];

function Items() {
  return (
    <>
      {faq.map((item) => (
        <AccordionItem key={item.value} value={item.value} disabled={item.value === 'soon'}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}

export default function AccordionScreen() {
  const [value, setValue] = useState('frameworks');
  const [many, setMany] = useState<string[]>(['what', 'theme']);
  return (
    <Screen title="Accordion">
      <Section title="Single">
        <Accordion type="single" defaultValue="what">
          <Items />
        </Accordion>
      </Section>

      <Section title="Controlled, not collapsible">
        <View style={{ gap: 8 }}>
          <Accordion type="single" collapsible={false} value={value} onValueChange={setValue} color="accent">
            <Items />
          </Accordion>
          <Text variant="small" muted>
            Open item is {value}.
          </Text>
        </View>
      </Section>

      <Section title="Multiple">
        <View style={{ gap: 8 }}>
          <Accordion type="multiple" value={many} onValueChange={setMany} action="success">
            <Items />
          </Accordion>
          <Text variant="small" muted>
            Open items: {many.join(', ') || 'none'}.
          </Text>
        </View>
      </Section>
    </Screen>
  );
}
