import { Button, Text, useTheme, type ThemeMode } from 'bokoui/expo';
import { ScrollView, View } from 'react-native';

const modeLabels: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', system: 'System' };

/** Style chips (scrollable) and a mode toggle, built from the public useTheme() API. */
export function ThemeSwitcher() {
  const { style, mode, themes, setStyle, setMode } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text variant="small" muted>
        Style
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {themes.map((theme) => (
          <Button
            key={theme.id}
            size="sm"
            color="neutral"
            variant={style === theme.id ? 'solid' : 'outline'}
            onPress={() => setStyle(theme.id)}>
            {theme.label}
          </Button>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['light', 'dark', 'system'] as const).map((m) => (
          <Button
            key={m}
            size="sm"
            color="neutral"
            variant={mode === m ? 'solid' : 'outline'}
            onPress={() => setMode(m)}>
            {modeLabels[m]}
          </Button>
        ))}
      </View>
    </View>
  );
}
