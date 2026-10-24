import { Card, Skeleton, Text } from "bokoui/expo/ui";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { UserAvatar } from "@/components/account/user-avatar";
import { NotFoundView } from "@/components/layout/not-found-view";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { QueryError } from "@/components/layout/query-error";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useLocale } from "@/hooks/use-locale";
import { useProfile } from "@/hooks/use-profile";
import { formatDate } from "@/lib/i18n/format";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const locale = useLocale();
  const profile = useProfile();
  useScreenTitle(t("pages.profileTitle"));

  if (profile.isError) {
    return (
      <PageContainer>
        <QueryError error={profile.error} onRetry={() => void profile.refetch()} />
      </PageContainer>
    );
  }
  if (!profile.isPending && !profile.data) return <NotFoundView />;

  return (
    <PageContainer>
      <PageHeader title={t("pages.profileTitle")} />
      {profile.data ? (
        <Card style={{ flexDirection: "row", alignItems: "center" }}>
          <UserAvatar user={profile.data} size="lg" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontWeight: "500" }}>{profile.data.name}</Text>
            {profile.data.jobTitle ? <Text muted>{profile.data.jobTitle}</Text> : null}
            <Text muted>{profile.data.email}</Text>
            <Text muted>{t("pages.memberSince", { date: formatDate(profile.data.joinedAt, locale) })}</Text>
          </View>
        </Card>
      ) : (
        <Skeleton shape="rect" height={112} />
      )}
    </PageContainer>
  );
}
