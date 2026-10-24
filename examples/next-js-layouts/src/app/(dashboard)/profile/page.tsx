import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Card, Text } from "bokoui/react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { UserAvatar } from "@/components/account/user-avatar";
import { formatDate } from "@/lib/i18n/format";
import { buildMetadata } from "@/lib/seo";
import { profileService } from "@/lib/services";
import type { LocaleCode } from "@/lib/types";

export const metadata = buildMetadata({ title: "Profile", path: "/profile" });

export default async function ProfilePage() {
  const profile = await profileService.getMyProfile().catch(() => null);
  if (!profile) notFound();
  const locale = (await getLocale()) as LocaleCode;

  return (
    <PageContainer>
      <PageHeader title="Profile" />
      <Card className="flex items-center gap-4">
        <UserAvatar user={profile} size="lg" />
        <div className="flex min-w-0 flex-col">
          <Text className="font-medium">{profile.name}</Text>
          <Text muted>{profile.jobTitle}</Text>
          <Text muted>{profile.email}</Text>
          <Text muted>Member since {formatDate(profile.joinedAt, locale)}</Text>
        </div>
      </Card>
    </PageContainer>
  );
}
