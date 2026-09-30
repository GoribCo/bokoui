import { Text, useTheme } from 'bokoui/expo';
import { Platform, Pressable, View } from 'react-native';

// URLs come from run.sh (fixed ports); the defaults match it, so `npm run dev` alone still works.
// Metro inlines EXPO_PUBLIC_* at bundle time.
const platforms = [
  { id: 'react', label: 'React', url: process.env.EXPO_PUBLIC_BOKOUI_URL_REACT ?? 'http://localhost:3001' },
  { id: 'vue', label: 'Vue', url: process.env.EXPO_PUBLIC_BOKOUI_URL_VUE ?? 'http://localhost:3002' },
  { id: 'expo', label: 'Expo', url: process.env.EXPO_PUBLIC_BOKOUI_URL_EXPO ?? 'http://localhost:3000' },
] as const;

const CURRENT = 'expo';

/**
 * Jump to the React, Vue and Expo demos. This demo has one screen, so the others open on their
 * home page. Web only: a link to localhost is meaningless inside a native app.
 */
export function PlatformSwitcher() {
  const { tokens } = useTheme();
  if (Platform.OS !== 'web') return null;

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Platform"
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        gap: 4,
        padding: 2,
        borderWidth: tokens.borderWidth,
        borderColor: tokens.border,
        borderRadius: tokens.radiusControl,
      }}>
      {platforms.map((p) => {
        const current = p.id === CURRENT;
        return (
          <Pressable
            key={p.id}
            accessibilityRole="link"
            accessibilityState={{ selected: current }}
            accessibilityLabel={current ? `${p.label} demo (current)` : `Open the ${p.label} demo`}
            disabled={current}
            onPress={() => {
              // Same tab, like the links in the web demos.
              window.location.assign(p.url);
            }}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: Math.max(tokens.radiusControl - 2, 0),
              backgroundColor: current ? tokens.primary : pressed ? tokens.muted : 'transparent',
            })}>
            <Text variant="small" style={{ color: current ? tokens.primaryFg : tokens.mutedFg }}>
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
