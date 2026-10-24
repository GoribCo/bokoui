import { Text } from "@/components/layout/primitives";
import { StaticPage } from "@/components/layout/static-page";
import { buildMetadata } from "@/lib/seo";

const humanize = (segment: string) => segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export async function generateMetadata({ params }: PageProps<"/departments/[...path]">) {
  const { path } = await params;
  return buildMetadata({
    title: humanize(path[path.length - 1]),
    description: "Department resource.",
    path: `/departments/${path.join("/")}`,
  });
}

/** Target of the generated departments tree: any depth resolves to this placeholder. */
export default async function DepartmentPage({ params }: PageProps<"/departments/[...path]">) {
  const { path } = await params;
  return (
    <StaticPage title={humanize(path[path.length - 1])} description={path.map(humanize).join(" / ")}>
      <Text>Placeholder for a department resource, {path.length} levels deep.</Text>
    </StaticPage>
  );
}
