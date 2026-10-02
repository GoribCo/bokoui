import { Select, Text } from "bokoui/expo";
import { useMemo } from "react";
import { View } from "react-native";

export interface RoleSwitcherProps {
  /** Every role the user holds in the active organization. */
  roles: string[];
  /** The chosen role, or `null` for all. */
  activeRole: string | null;
  onChange: (role: string | null) => void;
  labels: { role: string; allRoles: string };
}

/** Value standing for "all my roles"; a real role id is never empty. */
const ALL = "";

/**
 * Lets a user with several roles in an organization act as one of them: menus and access checks follow
 * the choice. Renders nothing for a user with a single role.
 */
export function RoleSwitcher({ roles, activeRole, onChange, labels }: RoleSwitcherProps) {
  const options = useMemo(() => [{ value: ALL, label: labels.allRoles }, ...roles.map((role) => ({ value: role, label: role }))], [roles, labels.allRoles]);
  if (roles.length < 2) return null;
  return (
    <View style={{ gap: 4 }}>
      <Text variant="caption" muted>
        {labels.role}
      </Text>
      <Select size="sm" options={options} value={activeRole ?? ALL} onValueChange={(value) => onChange(value === ALL ? null : value)} accessibilityLabel={labels.role} />
    </View>
  );
}
