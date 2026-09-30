import { Button, Heading, Input, Link, Text, actions, colors, sizes, useTheme, variants } from 'bokoui/expo';
import { Search } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeSwitcher } from '@/components/theme-switcher';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 16 }}>
      <Heading as="h2" size="lg">
        {title}
      </Heading>
      {children}
    </View>
  );
}

const Row = ({ children }: { children: ReactNode }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>{children}</View>
);

export default function Home() {
  const { tokens } = useTheme();
  const icon = <Search size={16} color={tokens.mutedFg} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 40, maxWidth: 896, width: '100%', alignSelf: 'center' }}>
        <ThemeSwitcher />
        <Heading as="h1">Button, Input &amp; Typography</Heading>

        <Section title="Button: variant x color">
          {variants.map((variant) => (
            <View key={variant} style={{ gap: 6 }}>
              <Text variant="small" muted>
                {variant}
              </Text>
              <Row>
                {colors.map((color) => (
                  <Button key={color} variant={variant} color={color}>
                    {color}
                  </Button>
                ))}
              </Row>
            </View>
          ))}
        </Section>

        <Section title="Button: action (overrides color)">
          {(['solid', 'outline', 'soft'] as const).map((variant) => (
            <View key={variant} style={{ gap: 6 }}>
              <Text variant="small" muted>
                {variant}
              </Text>
              <Row>
                {actions.map((action) => (
                  <Button key={action} variant={variant} action={action}>
                    {action}
                  </Button>
                ))}
              </Row>
            </View>
          ))}
        </Section>

        <Section title="Button: sizes, icons, states">
          <Row>
            {sizes.map((size) => (
              <Button key={size} size={size}>
                Size {size}
              </Button>
            ))}
          </Row>
          <Row>
            {sizes.map((size) => (
              <Button key={size} size={size} iconOnly accessibilityLabel={`Search ${size}`}>
                <Search size={16} color={tokens.primaryFg} />
              </Button>
            ))}
          </Row>
          <Row>
            <Button leftIcon={<Search size={16} color={tokens.primaryFg} />}>Left icon</Button>
            <Button variant="outline" rightIcon={<Search size={16} color={tokens.primary} />}>
              Right icon
            </Button>
            <Button loading>Loading</Button>
            <Button variant="soft" loading>
              Saving
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
            <Button style={{ borderRadius: 9999 }}>rounded-full override</Button>
          </Row>
          <Button fullWidth variant="outline">
            Full width
          </Button>
        </Section>

        <Section title="Input: variants and sizes">
          <Input variant="outline" placeholder="Outline" accessibilityLabel="Outline" />
          <Input variant="filled" placeholder="Filled" accessibilityLabel="Filled" />
          <Input variant="flushed" placeholder="Flushed" accessibilityLabel="Flushed" />
          {sizes.map((size) => (
            <Input key={size} size={size} placeholder={`Size ${size}`} accessibilityLabel={`Size ${size}`} />
          ))}
        </Section>

        <Section title="Input: states and adornments">
          <Input placeholder="Search" accessibilityLabel="Search" startAdornment={icon} />
          <Input variant="flushed" placeholder="Search" accessibilityLabel="Search flushed" startAdornment={icon} />
          <Input invalid defaultValue="not-an-email" accessibilityLabel="Invalid" endAdornment={icon} />
          <Input color="accent" placeholder="Accent focus" accessibilityLabel="Accent" />
          <Input editable={false} placeholder="Disabled" accessibilityLabel="Disabled" />
          <Input secureTextEntry placeholder="Password" accessibilityLabel="Password" />
        </Section>

        <Section title="Typography">
          <View style={{ gap: 12 }}>
            <Heading as="h1">Heading 1</Heading>
            <Heading as="h2">Heading 2</Heading>
            <Heading as="h3">Heading 3</Heading>
            <Heading as="h4">Heading 4</Heading>
            <Heading as="h5">Heading 5</Heading>
            <Heading as="h6">Heading 6</Heading>
            <Text variant="lead" muted>
              Lead paragraph: the font, weight, tracking and case all follow the active style.
            </Text>
            <Text>
              Body text with a <Link href="https://expo.dev">link</Link> and{' '}
              <Text variant="code">inline code</Text>.
            </Text>
            <Text variant="small">Small text</Text>
            <Text variant="caption" muted>
              Caption text
            </Text>
            <Row>
              <Link href="https://expo.dev" underline="always">
                Always underlined
              </Link>
              <Link href="https://expo.dev" color="accent">
                Accent
              </Link>
              <Link href="https://expo.dev" action="danger" underline="none">
                Danger, no underline
              </Link>
            </Row>
          </View>
        </Section>

        <Section title="Form example">
          <Input placeholder="you@example.com" accessibilityLabel="Email" keyboardType="email-address" autoCapitalize="none" />
          <Row>
            <Button>Subscribe</Button>
            <Button variant="ghost" color="neutral">
              Reset
            </Button>
          </Row>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
