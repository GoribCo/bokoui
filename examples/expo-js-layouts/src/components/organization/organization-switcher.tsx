import { Avatar, Button, Drawer, Input, Text, useTheme } from "bokoui/expo";
import { Check, ChevronsUpDown, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, View } from "react-native";
import { MenuIcon } from "@/components/navigation/menu-icon";
import { useSheetHeight } from "@/hooks/use-sheet-height";
import { usePrimaryTone } from "@/hooks/use-primary-tone";
import { organizationTypes } from "@/lib/config/organization-types";
import type { Organization } from "@/lib/types";

/** Lists longer than this get a search box. */
const SEARCH_THRESHOLD = 6;
const ROW_HEIGHT = 56;

export interface OrganizationSwitcherLabels {
  /** Accessible name of the trigger and the sheet. */
  switch: string;
  search: string;
  noResults: string;
  /** Heading of the sheet ("Workspaces"). */
  workspaces: string;
  /** Footer link text ("Manage workspaces"). */
  manage: string;
  close: string;
}

export interface OrganizationSwitcherProps {
  organizations: Organization[];
  activeOrganizationId: string;
  onSelect: (organizationId: string) => void;
  /** Icon-only rail: only the logo shows. */
  collapsed?: boolean;
  /** Called by the footer link; the link is hidden when unset. */
  onManage?: () => void;
  labels: OrganizationSwitcherLabels;
}

function OrganizationSummary({ organization, hideText }: { organization: Organization; hideText?: boolean }) {
  const { t } = useTranslation();
  const type = organizationTypes[organization.type];
  return (
    <>
      <Avatar size="sm" shape="square" src={organization.logoUrl} name={organization.name} color="primary">
        <MenuIcon name={type.icon} size={18} />
      </Avatar>
      {hideText ? null : (
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ fontWeight: "500", fontSize: 14 }}>
            {organization.name}
          </Text>
          <Text variant="caption" muted numberOfLines={1}>
            {t(`organizationType.${organization.type}`, { defaultValue: type.label })}
          </Text>
        </View>
      )}
    </>
  );
}

/**
 * Shows the active organization and lets the user pick another from a searchable bottom sheet that copes
 * with dozens of organizations. With a single organization it is a plain label.
 */
export function OrganizationSwitcher({ organizations, activeOrganizationId, onSelect, collapsed = false, onManage, labels }: OrganizationSwitcherProps) {
  const { tokens } = useTheme();
  const tone = usePrimaryTone();
  const sheetHeight = useSheetHeight(220);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const active = organizations.find((org) => org.id === activeOrganizationId) ?? organizations[0];
  const showSearch = organizations.length > SEARCH_THRESHOLD;
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? organizations.filter((org) => org.name.toLowerCase().includes(needle)) : organizations;
  }, [organizations, query]);

  if (!active) return null;
  const rowStyle = { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 8, borderRadius: tokens.radiusControl } as const;

  // One organization: nothing to switch.
  if (organizations.length < 2) {
    return (
      <View accessibilityLabel={`${labels.switch}: ${active.name}`} style={[rowStyle, { justifyContent: collapsed ? "center" : "flex-start" }]}>
        <OrganizationSummary organization={active} hideText={collapsed} />
      </View>
    );
  }

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${labels.switch}: ${active.name}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          rowStyle,
          {
            justifyContent: collapsed ? "center" : "flex-start",
            borderWidth: tokens.borderWidth,
            borderColor: tokens.border,
            backgroundColor: pressed ? tokens.muted : "transparent",
          },
        ]}
      >
        <OrganizationSummary organization={active} hideText={collapsed} />
        {collapsed ? null : <ChevronsUpDown size={16} color={tokens.mutedFg} />}
      </Pressable>

      <Drawer
        side="bottom"
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : close())}
        title={labels.workspaces}
        closeLabel={labels.close}
        footer={
          onManage ? (
            <Button
              variant="link"
              color="neutral"
              onPress={() => {
                close();
                onManage();
              }}
            >
              {labels.manage}
            </Button>
          ) : undefined
        }
      >
        {open ? (
          <View style={{ gap: 8 }}>
            {showSearch ? (
              <Input
                value={query}
                onChangeText={setQuery}
                placeholder={labels.search}
                accessibilityLabel={labels.search}
                autoCapitalize="none"
                autoCorrect={false}
                startAdornment={<Search size={16} color={tokens.mutedFg} />}
              />
            ) : null}
            <FlatList
              data={filtered}
              keyExtractor={(org) => org.id}
              style={{ height: Math.min(Math.max(filtered.length, 1) * ROW_HEIGHT, sheetHeight) }}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text muted style={{ padding: 12 }}>
                  {labels.noResults}
                </Text>
              }
              renderItem={({ item }) => {
                const selected = item.id === active.id;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={item.name}
                    onPress={() => {
                      onSelect(item.id);
                      close();
                    }}
                    style={({ pressed }) => [
                      rowStyle,
                      { height: ROW_HEIGHT, backgroundColor: selected ? tone.soft : pressed ? tokens.muted : "transparent" },
                    ]}
                  >
                    <OrganizationSummary organization={item} />
                    {selected ? <Check size={18} color={tone.ink} /> : null}
                  </Pressable>
                );
              }}
            />
          </View>
        ) : null}
      </Drawer>
    </>
  );
}
