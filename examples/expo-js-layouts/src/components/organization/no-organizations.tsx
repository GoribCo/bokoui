import { EmptyState, useTheme } from "bokoui/expo";
import { Building2 } from "lucide-react-native";
import type { ReactNode } from "react";

export interface NoOrganizationsProps {
  title: string;
  body: string;
  /** Next step, e.g. a sign-out button. */
  actions?: ReactNode;
}

/** Shown instead of the shell content to a signed-in user who belongs to no organization. */
export function NoOrganizations({ title, body, actions }: NoOrganizationsProps) {
  const { tokens } = useTheme();
  return <EmptyState icon={<Building2 size={24} color={tokens.mutedFg} />} title={title} description={body} actions={actions} />;
}
