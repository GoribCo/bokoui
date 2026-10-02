import { Badge, Card, CardHeader, Grid, Heading, Text } from 'bokoui/expo';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { PagePath } from '@/components/pages';
import { Screen, Section } from '@/components/screen';

const groups: { title: string; href: PagePath; description: string; components: string[] }[] = [
  { title: 'Basics', href: '/', description: 'Buttons, text fields and typography.', components: ['Button', 'Input', 'Heading', 'Text', 'Link'] },
  {
    title: 'Forms',
    href: '/forms',
    description: 'Everything for collecting input, with labels, hints and errors wired up.',
    components: ['FormField', 'Textarea', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Select', 'Combobox', 'DatePicker', 'Rating'],
  },
  { title: 'Data display', href: '/display', description: 'Show information: status, people, content and steps.', components: ['Badge', 'Avatar', 'Tag', 'Card', 'Divider', 'Image', 'Stepper', 'EmptyState'] },
  { title: 'Table', href: '/table', description: 'Tables with sorting and paging.', components: ['Table', 'Pagination'] },
  { title: 'Feedback', href: '/feedback', description: 'Tell people what is happening.', components: ['Alert', 'Spinner', 'Progress', 'Skeleton', 'Toast'] },
  { title: 'Overlays', href: '/overlays', description: 'Layers above the screen.', components: ['Modal', 'Tooltip', 'Popover', 'Menu'] },
  { title: 'Tabs', href: '/tabs', description: 'Show one panel at a time.', components: ['Tabs'] },
  { title: 'Accordion', href: '/accordion', description: 'Expand sections, one or many at a time.', components: ['Accordion'] },
  { title: 'Navigation', href: '/navigation', description: 'Move around: bars, trails and paging.', components: ['Navbar', 'Breadcrumb', 'Pagination', 'Sidebar'] },
  { title: 'Patterns', href: '/patterns', description: 'Layout primitives and whole-screen compositions.', components: ['Stack', 'Inline', 'Grid', 'Container'] },
];

export default function Playground() {
  const router = useRouter();
  const total = groups.reduce((n, g) => n + g.components.length, 0);
  return (
    <Screen title="Overview">
      <Text variant="lead" muted>
        {total} components, twenty design styles, light and dark. Change the style at the top; every screen updates.
      </Text>

      <Section title="Get started" hint="Components are styled by tokens, so a style is only a set of values.">
        <Text variant="small">1. Install: npm install bokoui</Text>
        <Text variant="small">2. Wrap the app in ThemeProvider (bokoui/expo)</Text>
        <Text variant="small">{"3. Import components: import { Button } from 'bokoui/expo'"}</Text>
      </Section>

      <Section title="Components" hint="Each screen shows variants and states.">
        <Grid cols={2} gap={4}>
          {groups.map((g) => (
            <Pressable key={g.title} accessibilityRole="link" accessibilityLabel={g.title} onPress={() => router.navigate(g.href)}>
              <Card style={{ height: '100%' }}>
                <CardHeader>
                  <Heading as="h3" size="md">
                    {g.title}
                  </Heading>
                  <Text variant="small" muted>
                    {g.description}
                  </Text>
                </CardHeader>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {g.components.map((c) => (
                    <Badge key={c} size="sm" color="neutral">
                      {c}
                    </Badge>
                  ))}
                </View>
              </Card>
            </Pressable>
          ))}
        </Grid>
      </Section>
    </Screen>
  );
}
