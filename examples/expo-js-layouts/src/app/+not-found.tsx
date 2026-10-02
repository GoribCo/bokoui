import { useTheme } from "bokoui/expo";
import { View } from "react-native";
import { NotFoundView } from "@/components/layout/not-found-view";

/** Any path no screen matches outside the signed-in area (inside it, `(app)/[...unmatched].tsx` answers). */
export default function NotFound() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg, justifyContent: "center" }}>
      <NotFoundView />
    </View>
  );
}
