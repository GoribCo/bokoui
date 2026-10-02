import { Badge, Button, Drawer, useTheme } from "bokoui/expo";
import { Bell } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSheetHeight } from "@/hooks/use-sheet-height";
import { useNavigate } from "@/hooks/use-navigate";
import type { Notification } from "@/lib/types";
import { IconButton } from "./icon-button";
import { NotificationList, type NotificationListLabels } from "./notification-list";

export interface NotificationsButtonLabels extends NotificationListLabels {
  /** Accessible name of the button and heading of the panel. */
  title: string;
  /** Footer button that opens the full notifications screen. */
  viewAll: string;
  close: string;
}

export interface NotificationsButtonProps {
  labels: NotificationsButtonLabels;
  items?: Notification[];
  /** Marks the given notifications read; all of them when `ids` is omitted. */
  onMarkRead: (ids?: string[]) => void;
  /** Target of the footer button; hidden when unset. */
  viewAllHref?: string;
}

/** Bell with an unread badge; opens a panel with the notification list and a link to the full screen. */
export function NotificationsButton({ labels, items = [], onMarkRead, viewAllHref }: NotificationsButtonProps) {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const maxHeight = useSheetHeight(200);
  const [open, setOpen] = useState(false);
  const count = items.filter((item) => item.unread).length;

  const go = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <>
      <View>
        <IconButton
          label={count > 0 ? `${labels.title}, ${labels.unread(count)}` : labels.title}
          icon={<Bell size={20} color={tokens.fg} />}
          onPress={() => setOpen(true)}
          accessibilityState={{ expanded: open }}
        />
        {count > 0 ? (
          <Badge variant="solid" action="danger" size="sm" style={{ position: "absolute", top: 2, right: 2 }}>
            {count > 9 ? "9+" : String(count)}
          </Badge>
        ) : null}
      </View>
      <Drawer
        side="bottom"
        open={open}
        onOpenChange={setOpen}
        title={labels.title}
        closeLabel={labels.close}
        footer={
          viewAllHref ? (
            <Button variant="link" color="neutral" onPress={() => go(viewAllHref)}>
              {labels.viewAll}
            </Button>
          ) : undefined
        }
      >
        {open ? (
          <ScrollView style={{ maxHeight }}>
            <NotificationList items={items} labels={labels} onMarkRead={onMarkRead} onOpen={go} />
          </ScrollView>
        ) : null}
      </Drawer>
    </>
  );
}
