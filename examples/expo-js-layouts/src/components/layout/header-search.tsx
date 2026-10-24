import { Input, Spinner, Text } from "bokoui/expo/ui";
import { Drawer } from "bokoui/expo/blocks";
import { useTheme } from "bokoui/expo";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";
import { SegmentedChips } from "@/components/appearance/segmented-chips";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useNavigate } from "@/hooks/use-navigate";
import { useSearch } from "@/hooks/use-search";
import { useSheetHeight } from "@/hooks/use-sheet-height";
import { MIN_SEARCH_LENGTH, defaultSearchScope, isRemoteScope, searchScopes, type SearchScope } from "@/lib/config/search";
import { flattenMenu } from "@/lib/menu";
import type { SearchResult } from "@/lib/schemas";
import type { MenuGroup } from "@/lib/types";
import { IconButton } from "./icon-button";

export interface HeaderSearchProps {
  /** Menu the user can see, labels resolved; the `menu` scope searches it on the device. */
  menuGroups: MenuGroup[];
}

const MAX_LOCAL_RESULTS = 8;

/** Search button that opens a sheet: a text box, the content areas to look in, and the hits. */
export function HeaderSearch({ menuGroups }: HeaderSearchProps) {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const maxHeight = useSheetHeight(210);
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<SearchScope>(defaultSearchScope);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const longEnough = trimmed.length >= MIN_SEARCH_LENGTH;
  const debounced = useDebouncedValue(trimmed, 250);
  const remote = useSearch(isRemoteScope(scope) ? scope : "people", debounced, open && isRemoteScope(scope));

  const menuEntries = useMemo<SearchResult[]>(
    () => flattenMenu(menuGroups).filter(({ item }) => item.href).map(({ item, group }) => ({ id: item.id, title: item.label, subtitle: group.label || undefined, href: item.href })),
    [menuGroups],
  );
  const local = useMemo(
    () => (longEnough ? menuEntries.filter((entry) => entry.title.toLowerCase().includes(trimmed.toLowerCase())).slice(0, MAX_LOCAL_RESULTS) : []),
    [menuEntries, trimmed, longEnough],
  );

  const results = isRemoteScope(scope) ? (debounced === trimmed ? (remote.data ?? []) : []) : local;
  const loading = isRemoteScope(scope) && longEnough && (remote.isFetching || debounced !== trimmed);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <IconButton label={t("shell.search")} icon={<Search size={20} color={tokens.fg} />} accessibilityState={{ expanded: open }} onPress={() => setOpen(true)} />
      <Drawer side="bottom" open={open} onOpenChange={(next) => (next ? setOpen(true) : close())} title={t("shell.search")} closeLabel={t("shell.close")}>
        {open ? (
          <View style={{ gap: 12 }}>
            <Input
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder={t("shell.searchPlaceholder")}
              accessibilityLabel={t("shell.search")}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              startAdornment={<Search size={16} color={tokens.mutedFg} />}
            />
            <SegmentedChips
              scroll
              label={t("search.scopeLabel")}
              value={scope}
              onChange={setScope}
              options={searchScopes.map((value) => ({ value, label: t(`search.scope.${value}`) }))}
            />
            <ScrollView style={{ maxHeight }} keyboardShouldPersistTaps="handled">
              {!longEnough ? (
                <Text muted style={{ padding: 12 }}>
                  {t("search.minChars")}
                </Text>
              ) : loading ? (
                <View accessibilityLabel={t("search.loading")} style={{ padding: 12, alignItems: "flex-start" }}>
                  <Spinner />
                </View>
              ) : results.length === 0 ? (
                <Text muted style={{ padding: 12 }}>
                  {t("search.noResults")}
                </Text>
              ) : (
                results.map((result) => (
                  <Pressable
                    key={result.id}
                    accessibilityRole={result.href ? "link" : "text"}
                    accessibilityLabel={result.subtitle ? `${result.title}, ${result.subtitle}` : result.title}
                    disabled={!result.href}
                    onPress={() => {
                      const href = result.href;
                      close();
                      if (href) navigate(href);
                    }}
                    style={({ pressed }) => ({ minHeight: 52, justifyContent: "center", paddingHorizontal: 12, borderRadius: tokens.radiusControl, backgroundColor: pressed ? tokens.muted : "transparent" })}
                  >
                    <Text numberOfLines={1} style={{ fontWeight: "500", fontSize: 14 }}>
                      {result.title}
                    </Text>
                    {result.subtitle ? (
                      <Text variant="caption" muted numberOfLines={1}>
                        {result.subtitle}
                      </Text>
                    ) : null}
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        ) : null}
      </Drawer>
    </>
  );
}
