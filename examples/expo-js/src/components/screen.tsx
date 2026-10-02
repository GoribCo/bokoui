import { Heading, Text } from 'bokoui/expo';
import type { ReactNode } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'bokoui/expo';

import { PageNav, SIDEBAR_BREAKPOINT, SideNav } from '@/components/page-nav';
import { PlatformSwitcher } from '@/components/platform-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';

/** Page frame shared by every demo screen: sidebar (wide) or page links (narrow), switchers, title, content. */
export function Screen({ title, children }: { title: string; children: ReactNode }) {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= SIDEBAR_BREAKPOINT;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {wide ? <SideNav /> : null}
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 24, gap: 40, maxWidth: 896, width: '100%', alignSelf: 'center' }}>
          <PlatformSwitcher />
          <ThemeSwitcher />
          {wide ? null : <PageNav />}
          <Heading as="h1">{title}</Heading>
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 16 }}>
      <Heading as="h2" size="lg">
        {title}
      </Heading>
      {hint ? (
        <Text variant="small" muted>
          {hint}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export const Row = ({ children }: { children: ReactNode }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>{children}</View>
);
