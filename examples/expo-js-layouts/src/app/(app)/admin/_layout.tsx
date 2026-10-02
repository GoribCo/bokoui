import { Slot } from "expo-router";
import { RequirePermission } from "@/components/layout/require-permission";

/** Everything under `/admin` needs the access-control permission; others see the forbidden view. */
export default function AdminLayout() {
  return (
    <RequirePermission permission="organization.access.view">
      <Slot />
    </RequirePermission>
  );
}
