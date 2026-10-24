import { Text } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

export interface ListRowProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  /** Right side: a value, a switch, or nothing (a chevron shows when `onPress` is set). */
  end?: ReactNode;
  onPress?: () => void;
}

/** One row of a settings or list card: icon tile, title with optional subtitle, end content or a chevron. */
export function ListRow({ icon, title, subtitle, end, onPress }: ListRowProps) {
  const { tokens } = useTheme();
  const content = (
    <View style={{ minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
      {icon}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontWeight: "500" }}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" muted numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {end}
      {onPress && !end ? <ChevronRight size={18} color={tokens.mutedFg} /> : null}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title} onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    content
  );
}
