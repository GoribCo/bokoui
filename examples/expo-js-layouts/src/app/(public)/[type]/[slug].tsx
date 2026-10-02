import { Skeleton } from "bokoui/expo/ui";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { NotFoundView } from "@/components/layout/not-found-view";
import { PageContainer } from "@/components/layout/page-container";
import { QueryError } from "@/components/layout/query-error";
import { useScreenTitle } from "@/components/layout/screen-title";
import { PublicProfile } from "@/components/organization/public-profile";
import { usePublicOrganization } from "@/hooks/use-public-organizations";
import { organizationTypeFromSegment } from "@/lib/organization/organization-types";

/** `/{segment}/{slug}`: the public profile of one organization, for every type of the registry. */
export default function PublicProfileScreen() {
  const { type: segment, slug } = useLocalSearchParams<{ type: string; slug: string }>();
  const type = organizationTypeFromSegment(segment);
  // An unknown type never asks the API: the segment is not an organization type at all.
  return type ? <Profile type={type} slug={slug} /> : <NotFoundView />;
}

function Profile({ type, slug }: { type: NonNullable<ReturnType<typeof organizationTypeFromSegment>>; slug: string }) {
  const query = usePublicOrganization(type, slug);
  useScreenTitle(query.data?.name ?? "");

  if (query.isPending) {
    return (
      <PageContainer>
        <View accessibilityState={{ busy: true }} style={{ gap: 16 }}>
          <Skeleton height={56} />
          <Skeleton shape="rect" height={120} />
          <Skeleton shape="rect" height={120} />
        </View>
      </PageContainer>
    );
  }
  if (query.isError) {
    return (
      <PageContainer>
        <QueryError error={query.error} onRetry={() => void query.refetch()} />
      </PageContainer>
    );
  }
  return query.data ? <PublicProfile organization={query.data} /> : <NotFoundView />;
}
