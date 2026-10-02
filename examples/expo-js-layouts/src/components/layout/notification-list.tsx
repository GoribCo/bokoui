import { Badge, Button, EmptyState, Tab, TabList, Tabs, Text, useTheme } from "bokoui/expo";
import { Bell, CalendarClock, CircleCheck, ClipboardCheck, MailPlus, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { usePrimaryTone } from "@/hooks/use-primary-tone";
import type { Notification } from "@/lib/types";

export type NotificationTab = "all" | "urgent" | "invitations";

const tabs: NotificationTab[] = ["all", "urgent", "invitations"];

const matches: Record<NotificationTab, (item: Notification) => boolean> = {
  all: () => true,
  urgent: (item) => Boolean(item.urgent),
  invitations: (item) => item.kind === "invitation",
};

export interface NotificationListLabels {
  empty: string;
  /** Text for "N unread". */
  unread: (count: number) => string;
  markAllRead: string;
  tabs: Record<NotificationTab, string>;
}

export interface NotificationListProps {
  items: Notification[];
  labels: NotificationListLabels;
  /** Marks the given notifications read; all of them when `ids` is omitted. */
  onMarkRead: (ids?: string[]) => void;
  /** Called with the notification's `href` after it was marked read. */
  onOpen?: (href: string) => void;
}

const kindIcon: Record<Notification["kind"], LucideIcon> = {
  action: ClipboardCheck,
  info: CalendarClock,
  success: CircleCheck,
  invitation: MailPlus,
};

function NotificationRow({ item, onPress }: { item: Notification; onPress: () => void }) {
  const { tokens } = useTheme();
  const tone = usePrimaryTone();
  const Icon = kindIcon[item.kind] ?? Bell;
  return (
    <Pressable
      accessibilityRole={item.href ? "link" : "button"}
      accessibilityLabel={`${item.title}. ${item.body}`}
      accessibilityState={{ selected: item.unread }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 56,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderLeftWidth: 3,
        borderLeftColor: item.unread ? tone.base : "transparent",
        backgroundColor: pressed ? tokens.muted : "transparent",
      })}
    >
      <View style={{ width: 32, height: 32, borderRadius: tokens.radiusControl, alignItems: "center", justifyContent: "center", backgroundColor: tokens.muted }}>
        <Icon size={16} color={tokens.mutedFg} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
          <Text numberOfLines={2} style={{ flex: 1, fontSize: 14, fontWeight: item.unread ? "600" : "500" }}>
            {item.title}
          </Text>
          <Text variant="caption" muted>
            {item.time}
          </Text>
        </View>
        {item.body ? (
          <Text variant="caption" muted>
            {item.body}
          </Text>
        ) : null}
        {item.urgent ? (
          <Badge action="danger" size="sm" style={{ marginTop: 4 }}>
            !
          </Badge>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Notifications with tabs (all, urgent, invitations), unread ones marked by an accent edge, a mark-all-read
 * button and an empty state. It does not scroll by itself: the host decides (the panel, a screen).
 */
export function NotificationList({ items, labels, onMarkRead, onOpen }: NotificationListProps) {
  const { tokens } = useTheme();
  const [tab, setTab] = useState<NotificationTab>("all");
  const unread = items.filter((item) => item.unread).length;
  const visible = items.filter(matches[tab]);

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Text variant="small" muted>
          {labels.unread(unread)}
        </Text>
        <Button size="sm" variant="ghost" disabled={unread === 0} onPress={() => onMarkRead(undefined)}>
          {labels.markAllRead}
        </Button>
      </View>
      <Tabs value={tab} onValueChange={(value) => setTab(value as NotificationTab)}>
        <TabList>
          {tabs.map((id) => (
            <Tab key={id} value={id}>
              {labels.tabs[id]}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      {visible.length === 0 ? (
        <EmptyState icon={<Bell size={24} color={tokens.mutedFg} />} title={labels.empty} style={{ paddingVertical: 24 }} />
      ) : (
        <View>
          {visible.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              onPress={() => {
                if (item.unread) onMarkRead([item.id]);
                if (item.href) onOpen?.(item.href);
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
