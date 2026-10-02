import { Skeleton, useTheme } from "bokoui/expo";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsWide } from "@/hooks/use-is-wide";

/**
 * What the shell looks like before its data arrives: a sidebar column (wide), a header bar and a content
 * block, in the same places as the real shell so nothing jumps when it appears.
 */
export function ShellSkeleton({ label }: { label: string }) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const wide = useIsWide();
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityState={{ busy: true }} style={{ flex: 1, flexDirection: "row", backgroundColor: tokens.bg, paddingTop: insets.top }}>
      {wide ? (
        <View style={{ width: 256, gap: 12, padding: 12, borderRightWidth: tokens.borderWidth, borderColor: tokens.border }}>
          <Skeleton height={40} />
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} height={32} />
          ))}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <View style={{ height: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, borderBottomWidth: tokens.borderWidth, borderColor: tokens.border }}>
          <Skeleton shape="rect" width={32} height={32} />
          <Skeleton width={160} height={20} />
        </View>
        <View style={{ gap: 16, padding: 16 }}>
          <Skeleton width={220} height={32} />
          <Skeleton shape="rect" height={140} />
          <Skeleton shape="rect" height={140} />
        </View>
      </View>
    </View>
  );
}
