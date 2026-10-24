import { Skeleton, SkeletonText } from "bokoui/react";
import { PageContainer } from "@/components/layout/page-container";

/** Placeholder while a page in the shell loads; the shell itself stays in place. */
export default function DashboardLoading() {
  return (
    <div aria-busy="true">
      <PageContainer>
        <Skeleton className="h-8 w-56" />
        <SkeletonText lines={3} />
        <Skeleton className="h-40 w-full" />
      </PageContainer>
    </div>
  );
}
