import { Text } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import { Pressable, View } from "react-native";
import { useNavigate } from "@/hooks/use-navigate";
import type { FooterLink } from "@/lib/types";

export interface FooterProps {
  /** Links with labels resolved. */
  links: FooterLink[];
  copyright: string;
  /** Accessible name of the link group. */
  navigationLabel: string;
}

/** Links and the copyright line, rendered at the end of the scrolling content. */
export function Footer({ links, copyright, navigationLabel }: FooterProps) {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  return (
    <View
      style={{
        gap: 4,
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: 24,
        borderTopWidth: tokens.borderWidth,
        borderColor: tokens.border,
        backgroundColor: tokens.surface,
      }}
    >
      <View accessibilityLabel={navigationLabel} style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", columnGap: 8 }}>
        {links.map((link) => (
          <Pressable
            key={link.id}
            accessibilityRole="link"
            accessibilityLabel={link.label}
            onPress={() => navigate(link.href)}
            style={{ minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }}
          >
            <Text variant="small" muted>
              {link.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text variant="caption" muted style={{ textAlign: "center" }}>
        {copyright}
      </Text>
    </View>
  );
}
