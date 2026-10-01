import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";

/** Placeholder while a page in the shell loads; the shell itself stays in place. */
export default function DashboardLoading() {
  return (
    <div aria-busy="true">
      <PageContainer>
        <Skeleton className="h-8 w-56" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-40 w-full" />
      </PageContainer>
    </div>
  );
}
