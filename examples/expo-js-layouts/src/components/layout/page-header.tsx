import { Heading, Text } from "bokoui/expo/ui";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Buttons for the screen's main actions. */
  actions?: ReactNode;
}

/** Title, optional description and actions at the top of a screen. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <View style={{ gap: 8 }}>
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      {description ? <Text muted>{description}</Text> : null}
      {actions ? <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{actions}</View> : null}
    </View>
  );
}
