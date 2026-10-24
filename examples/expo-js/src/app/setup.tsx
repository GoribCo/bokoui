import { Text, useTheme } from 'bokoui/expo';
import { ScrollView, View } from 'react-native';

import { Screen, Section } from '@/components/screen';

function Code({ children }: { children: string }) {
  const { tokens } = useTheme();
  return (
    <ScrollView horizontal style={{ backgroundColor: tokens.muted, borderRadius: 8 }}>
      <View style={{ padding: 12 }}>
        <Text variant="small" style={{ fontFamily: 'monospace' }} selectable>
          {children}
        </Text>
      </View>
    </ScrollView>
  );
}

export default function SetupScreen() {
  return (
    <Screen title="Setup">
      <Section title="1. Install" hint="Needs Expo SDK 54+ (React Native 0.76+). No CSS or Tailwind is needed.">
        <Code>{'npx expo install bokoui @react-native-async-storage/async-storage expo-blur'}</Code>
      </Section>

      <Section title="2. Add the provider" hint="storage is optional: without it the chosen style lasts for the session only.">
        <Code>
          {`import { ThemeProvider, Heading, Button } from 'bokoui/expo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  return (
    <ThemeProvider defaultStyle="material" storage={AsyncStorage}>
      <Heading as="h1">Hello</Heading>
      <Button color="primary" onPress={() => {}}>Save</Button>
    </ThemeProvider>
  );
}`}
        </Code>
      </Section>

      <Section title="3. Use the theme" hint="useTheme() returns the style, mode, resolved tokens and setters, for your own components.">
        <Code>{`const { style, mode, tokens, setStyle, setMode } = useTheme();`}</Code>
      </Section>

      <Section title="Good to know">
        <Text muted>
          Components are theme-aware but not pixel-identical to the web: no box shadows or hover states (a pressed state is used), and
          fonts are not applied (pass style fontFamily or load fonts with expo-font).
        </Text>
      </Section>
    </Screen>
  );
}
