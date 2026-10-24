import { Surface } from "bokoui/expo/ui";
import { useTheme } from "bokoui/expo";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppShellProps {
  /** Permanent sidebar of wide screens; omit on phones. */
  sidebar?: ReactNode;
  header: ReactNode;
  /** Rendered at the end of the scrolling content, so it never sits under the bottom bar. */
  footer?: ReactNode;
  /** Phone navigation bar, below the scroll area. */
  bottomNav?: ReactNode;
  /** Drawers, sheets and other overlays. */
  overlays?: ReactNode;
  children: ReactNode;
}

/**
 * The frame of the signed-in area: header on top, the content in its own scroll area, the footer at the
 * end of that content, and either a sidebar (wide) or a bottom bar (phone). The bar is a sibling of the scroll
 * area, not an overlay, so content is never covered; safe-area insets pad the edges.
 */
export function AppShell({ sidebar, header, footer, bottomNav, overlays, children }: AppShellProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, flexDirection: "column", paddingLeft: insets.left, paddingRight: insets.right }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {sidebar ? (
          <View style={{ paddingTop: insets.top, backgroundColor: tokens.effects.card ? "transparent" : tokens.surface, borderRightWidth: tokens.borderWidth, borderColor: tokens.border }}>
            {sidebar}
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Surface
            kind="card"
            style={{ paddingTop: insets.top, backgroundColor: tokens.surface, borderBottomWidth: tokens.borderWidth, borderColor: tokens.border }}
            // A bar, not a panel: square corners and only a bottom edge.
            overrideStyle={{ borderRadius: 0, borderWidth: 0, borderBottomWidth: tokens.borderWidth }}
          >
            {header}
          </Surface>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomNav ? 0 : insets.bottom }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flexGrow: 1 }}>{children}</View>
            {footer}
          </ScrollView>
          {bottomNav}
        </View>
      </View>
      {overlays}
    </View>
  );
}
