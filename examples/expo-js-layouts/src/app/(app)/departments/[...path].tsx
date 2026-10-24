import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StaticPage } from "@/components/layout/static-page";

const humanize = (segment: string) => segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Target of the generated departments tree: any depth resolves to this placeholder. */
export default function DepartmentScreen() {
  const { t } = useTranslation();
  const { path } = useLocalSearchParams<{ path: string[] }>();
  const segments = Array.isArray(path) ? path : [path];
  return (
    <StaticPage title={humanize(segments[segments.length - 1])} description={segments.map(humanize).join(" / ")}>
      {t("pages.departmentBody", { count: segments.length })}
    </StaticPage>
  );
}
