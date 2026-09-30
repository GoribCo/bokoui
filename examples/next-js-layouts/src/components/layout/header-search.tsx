"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "bokoui/react";
import { Popover } from "bokoui/react/client";

export interface HeaderSearchProps {
  label: string;
  placeholder: string;
  /** Called with the trimmed query when the user submits. */
  onSearch?: (query: string) => void;
}

function SearchForm({ label, placeholder, onSearch, autoFocus }: HeaderSearchProps & { autoFocus?: boolean }) {
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
      <Input
        type="search"
        size="sm"
        value={query}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={label}
        startAdornment={<Search aria-hidden="true" />}
        onChange={(event) => setQuery(event.target.value)}
      />
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
        <Popover
          placement="bottom-end"
          aria-label={props.label}
          className="w-[min(20rem,calc(100vw-1.5rem))]"
          trigger={
            <Button variant="ghost" color="neutral" iconOnly aria-label={props.label}>
              <Search aria-hidden="true" />
            </Button>
          }
        >
          <SearchForm {...props} />
        </Popover>
      </div>
    </>
  );
}
