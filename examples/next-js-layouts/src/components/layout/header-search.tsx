"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Button, Input, Popover } from "bokoui/react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSearch } from "@/hooks/use-search";
import { features } from "@/lib/config/features";
import { matchesShortcut, shortcuts } from "@/lib/config/shortcuts";
import { MIN_SEARCH_LENGTH, defaultSearchScope, isRemoteScope, searchScopes, type SearchScope } from "@/lib/config/search";
import type { SearchResult } from "@/lib/schemas";

export interface HeaderSearchLabels {
  /** Accessible name of the search box and its button. */
  search: string;
  placeholder: string;
  /** Accessible name of the content-area select. */
  scope: string;
  scopeNames: Record<SearchScope, string>;
  noResults: string;
  minChars: string;
  loading: string;
}

export interface HeaderSearchProps {
  labels: HeaderSearchLabels;
  /** Items of the loaded menu; the `menu` scope searches these in the browser. */
  menuEntries: SearchResult[];
}

interface SearchFormProps extends HeaderSearchProps {
  /** Results flow below the box instead of floating over the page (inside a popover). */
  inline?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onNavigate?: () => void;
}

const selectClass =
  "focus-ring h-8 shrink-0 rounded-control border-[length:var(--bokoui-border-width)] border-field-border bg-field px-1.5 text-caption text-foreground pointer-coarse:h-11";

function SearchForm({ labels, menuEntries, inline = false, inputRef, onNavigate }: SearchFormProps) {
  const router = useRouter();
  const listId = useId();
  const [scope, setScope] = useState<SearchScope>(defaultSearchScope);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();
  const longEnough = trimmed.length >= MIN_SEARCH_LENGTH;
  const remote = useSearch(isRemoteScope(scope) ? scope : "people", useDebouncedValue(trimmed, 250), isRemoteScope(scope));
  const local = useMemo(
    () =>
      longEnough
        ? menuEntries.filter((entry) => entry.title.toLowerCase().includes(trimmed.toLowerCase())).slice(0, 8)
        : [],
    [menuEntries, trimmed, longEnough],
  );
  const results: SearchResult[] = isRemoteScope(scope) ? (remote.data ?? []) : local;
  const loading = isRemoteScope(scope) && longEnough && remote.isFetching && results.length === 0;
  const showPanel = open && trimmed.length > 0;

  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  const choose = (result: SearchResult | undefined) => {
    if (!result?.href) return;
    close();
    setQuery("");
    onNavigate?.();
    router.push(result.href);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (results.length === 0) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + step + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[active] ?? (results.length === 1 ? results[0] : undefined));
    } else if (event.key === "Escape") {
      if (showPanel) {
        event.stopPropagation();
        close();
      } else {
        setQuery("");
      }
    }
  };

  const status = !longEnough ? labels.minChars : loading ? labels.loading : results.length === 0 ? labels.noResults : null;

  return (
    <div
      role="search"
      className="relative w-full"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <div className="flex items-center gap-1">
        <select
          aria-label={labels.scope}
          value={scope}
          onChange={(event) => {
            setScope(event.target.value as SearchScope);
            setActive(-1);
          }}
          className={selectClass}
        >
          {searchScopes.map((id) => (
            <option key={id} value={id}>
              {labels.scopeNames[id]}
            </option>
          ))}
        </select>
        <div className="min-w-0 flex-1">
          <Input
            ref={inputRef}
            type="search"
            size="sm"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            value={query}
            placeholder={labels.placeholder}
            aria-label={labels.search}
            aria-keyshortcuts={features.keyboardShortcuts ? shortcuts.search.keyshortcuts : undefined}
            title={features.keyboardShortcuts ? `${labels.search} (${shortcuts.search.hint})` : undefined}
            startAdornment={<Search aria-hidden="true" />}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      <div
        id={listId}
        hidden={!showPanel}
        className={
          inline
            ? "mt-2"
            : "absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-control border-[length:var(--bokoui-border-width)] border-border bg-surface shadow-button-hover"
        }
      >
        {status ? (
          <p role="status" className="px-3 py-3 text-nav text-muted-foreground">
            {status}
          </p>
        ) : (
          <ul role="listbox" aria-label={labels.scopeNames[scope]} className="max-h-72 overflow-y-auto py-1">
            {results.map((result, index) => {
              const row = (
                <>
                  <span className="truncate text-nav font-medium">{result.title}</span>
                  {result.subtitle ? <span className="truncate text-caption text-muted-foreground">{result.subtitle}</span> : null}
                </>
              );
              const className = `flex min-w-0 flex-col gap-0.5 px-3 py-2 text-start pointer-coarse:min-h-11 ${
                index === active ? "bg-muted" : ""
              } ${result.href ? "hover:bg-muted" : ""}`;
              return (
                <li key={result.id} role="presentation">
                  {result.href ? (
                    <Link
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === active}
                      href={result.href}
                      prefetch={false}
                      className={className}
                      onClick={() => {
                        close();
                        setQuery("");
                        onNavigate?.();
                      }}
                    >
                      {row}
                    </Link>
                  ) : (
                    <div id={`${listId}-${index}`} role="option" aria-selected={index === active} className={className}>
                      {row}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * Search from `md` up; a button opening the same box in a popover on small screens. A select picks the
 * content area (the menu, people, organizations, ...); Ctrl+K or Cmd+K focuses the box.
 */
export function HeaderSearch(props: HeaderSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!features.keyboardShortcuts) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!matchesShortcut(event, shortcuts.search)) return;
      event.preventDefault();
      // The wide box is hidden below `md`; there the button opens the popover instead.
      if (inputRef.current && inputRef.current.offsetParent !== null) inputRef.current.focus();
      else buttonRef.current?.click();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="hidden w-80 md:block lg:w-[26rem]">
        <SearchForm {...props} inputRef={inputRef} />
      </div>
      <div className="md:hidden">
        <Popover
          placement="bottom-end"
          aria-label={props.labels.search}
          className="w-[min(22rem,calc(100vw-1.5rem))]"
          trigger={
            <Button ref={buttonRef} variant="ghost" color="neutral" iconOnly aria-label={props.labels.search}>
              <Search aria-hidden="true" />
            </Button>
          }
        >
          <SearchForm {...props} inline />
        </Popover>
      </div>
    </>
  );
}
