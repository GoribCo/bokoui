"use client";

import { useMemo } from "react";
import { filterMenuByRoles, localizeMenu } from "@/lib/menu";
import type { MenuGroup } from "@/lib/types";
import { useActiveOrganization } from "./use-active-organization";
import { useMenuTranslator } from "./use-menu-translator";

/** Menu of the active organization, limited to the user's roles there and with translated labels (FR-4.3). */
export function useMenu(groups: MenuGroup[]): MenuGroup[] {
  const { roles, permissions } = useActiveOrganization();
  const translate = useMenuTranslator();
  return useMemo(() => localizeMenu(filterMenuByRoles(groups, { roles, permissions }), translate), [groups, roles, permissions, translate]);
}
