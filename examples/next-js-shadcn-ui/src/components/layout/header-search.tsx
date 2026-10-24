"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface HeaderSearchProps {
  label: string;
  placeholder: string;
  /** Called with the trimmed query when the user submits. */
  onSearch?: (query: string) => void;
}

function SearchForm({
  label,
  placeholder,
  onSearch,
  autoFocus,
}: HeaderSearchProps & { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  return (
    <form
      role="search"
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(query.trim());
      }}
    >
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-label={label}
          className="h-8 ps-8"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
    </form>
  );
}

/** Search box from `md` up; a button opening the same box in a popover on small screens. */
export function HeaderSearch(props: HeaderSearchProps) {
  return (
    <>
      <div className="hidden w-56 md:block lg:w-72">
        <SearchForm {...props} />
      </div>
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={props.label}>
              <Search aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" aria-label={props.label} className="w-[min(20rem,calc(100vw-1.5rem))]">
            <SearchForm {...props} />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
