"use client";

export interface RoleSwitcherProps {
  /** Every role the user holds in the active organization. */
  roles: string[];
  /** The chosen role, or `null` for all. */
  activeRole: string | null;
  onChange: (role: string | null) => void;
  labels: { role: string; allRoles: string };
}

/**
 * Lets a user with several roles in an organization act as one of them: menus and access checks follow
 * the choice. Renders nothing for a user with a single role.
 */
export function RoleSwitcher({ roles, activeRole, onChange, labels }: RoleSwitcherProps) {
  if (roles.length < 2) return null;

  return (
    <label className="flex flex-col gap-1 px-1 text-caption text-muted-foreground">
      {labels.role}
      <select
        value={activeRole ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="focus-ring h-8 min-w-0 rounded-control border-[length:var(--bokoui-border-width)] border-field-border bg-field px-2 text-nav text-foreground pointer-coarse:h-11"
      >
        <option value="">{labels.allRoles}</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </label>
  );
}
