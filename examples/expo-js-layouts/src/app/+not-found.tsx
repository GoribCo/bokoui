import { View } from "react-native";
import { NotFoundView } from "@/components/layout/not-found-view";

/** Any path no screen matches outside the signed-in area (inside it, `(app)/[...unmatched].tsx` answers). */
export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <NotFoundView />
    </View>
  );
}
