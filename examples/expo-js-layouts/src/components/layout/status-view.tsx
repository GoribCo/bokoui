import { Heading, Text } from "bokoui/expo";
import type { ReactNode } from "react";
import { View } from "react-native";

export interface StatusViewProps {
  title: string;
  description: string;
  /** Short code shown above the title, e.g. "404". */
  code?: string;
  /** Buttons under the text. */
  actions?: ReactNode;
}

/** Centered message for not-found, error and not-authorized states. */
export function StatusView({ title, description, code, actions }: StatusViewProps) {
  return (
    <View style={{ flexGrow: 1, minHeight: 320, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24, paddingVertical: 48 }}>
      {code ? (
        <Text variant="caption" muted style={{ letterSpacing: 3 }}>
          {code}
        </Text>
      ) : null}
      <Heading as="h1" size="2xl" style={{ textAlign: "center" }}>
        {title}
      </Heading>
      <Text muted style={{ textAlign: "center", maxWidth: 480 }}>
        {description}
      </Text>
      {actions ? <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 8 }}>{actions}</View> : null}
    </View>
  );
}
