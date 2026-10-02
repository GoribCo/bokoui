import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Linking } from "react-native";
import { isExternalHref, toRoute } from "@/lib/menu";

/** Opens a menu `href`: a screen of the app, or an external URL in the system browser. */
export function useNavigate(): (href: string) => void {
  const router = useRouter();
  return useCallback(
    (href: string) => {
      if (isExternalHref(href)) void Linking.openURL(href);
      else router.push(toRoute(href));
    },
    [router],
  );
}
