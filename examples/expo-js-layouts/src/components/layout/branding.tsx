import { Text, useTheme } from "bokoui/expo";
import { Image, Pressable, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { siteConfig } from "@/lib/config/site";

export interface BrandingProps {
  name: string;
  /** Defaults to the logo in `siteConfig`; without one the built-in mark is drawn. */
  logo?: { src: string; alt?: string };
  /** Hide the name and show only the mark (icon rail). */
  markOnly?: boolean;
  onPress?: () => void;
}

/** Logo and product name. Set `logo` in `lib/config/site.ts` to use the product's own image. */
export function Branding({ name, logo = siteConfig.logo, markOnly = false, onPress }: BrandingProps) {
  const { tokens } = useTheme();
  const content = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      {logo ? (
        <Image source={{ uri: logo.src }} accessibilityLabel={logo.alt ?? ""} style={{ width: 28, height: 28 }} resizeMode="contain" />
      ) : (
        <Svg width={28} height={28} viewBox="0 0 24 24" accessibilityElementsHidden>
          <Rect width={24} height={24} rx={6} fill={tokens.primary} />
          <Path d="M8 6.5h4.5a2.75 2.75 0 0 1 0 5.5H8Zm0 5.5h5.5a2.75 2.75 0 0 1 0 5.5H8Z" fill={tokens.primaryFg} />
        </Svg>
      )}
      {markOnly ? null : (
        <Text numberOfLines={1} style={{ fontWeight: "600", flexShrink: 1 }}>
          {name}
        </Text>
      )}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="link" accessibilityLabel={name} onPress={onPress} style={{ minHeight: 44, minWidth: 44, justifyContent: "center" }}>
      {content}
    </Pressable>
  ) : (
    content
  );
}
