import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";
import { Pagination } from "./pagination";
import { Sidebar, SidebarItem, SidebarSection } from "./sidebar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table";

describe("Breadcrumb", () => {
  it("is a labelled landmark with a list, links, and the current page as text", () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
        <BreadcrumbItem current>Page</BreadcrumbItem>
      </Breadcrumb>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
    expect(within(nav).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual(["/", "/docs"]);
    const current = within(nav).getByText("Page");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).toBe("SPAN");
  });

  it("renders a custom link component through `as`", () => {
    const Custom = ({ to, children, ...rest }: { to: string; children?: React.ReactNode; className?: string }) => (
      <a data-custom href={to} {...rest}>{children}</a>
    );
    render(<Breadcrumb aria-label="Trail"><BreadcrumbItem as={Custom} to="/x">X</BreadcrumbItem></Breadcrumb>);
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute("data-custom");
  });
});

describe("Pagination", () => {
  it("marks the current page and reports page changes", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    await userEvent.setup().click(screen.getByRole("button", { name: "Page 6" }));
    expect(onPageChange).toHaveBeenCalledWith(6);
    await userEvent.setup().click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
    await userEvent.setup().click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
  });

  it("disables previous on the first page and next on the last", () => {
    const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
    rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("shows ellipses for long ranges and can hide the edges", () => {
    const { container } = render(<Pagination page={5} pageCount={20} onPageChange={() => {}} hideEdges />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByRole("button", { name: "Next page" })).toBeNull();
  });

  it("renders links with getHref", () => {
    render(<Pagination page={2} pageCount={4} getHref={(p) => `/items?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "/items?page=3");
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("disables a link edge with aria-disabled and no href", () => {
    render(<Pagination page={1} pageCount={4} getHref={(p) => `/p/${p}`} />);
    const prev = screen.getByLabelText("Previous page");
    expect(prev).toHaveAttribute("aria-disabled", "true");
    expect(prev).not.toHaveAttribute("href");
  });
});

describe("Table", () => {
  function Example(props: React.ComponentProps<typeof Table>) {
    return (
      <Table {...props}>
        <TableCaption>Team</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead numeric sort="ascending" onSort={() => {}}>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Ada</TableCell><TableCell numeric>36</TableCell></TableRow>
        </TableBody>
      </Table>
    );
  }

  it("renders semantic table markup with a caption and scoped headers", () => {
    render(<Example aria-label="Team table" />);
    expect(screen.getByRole("table", { name: "Team" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Team table" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "Ada" })).toBeInTheDocument();
  });

  it("exposes sort state and a sort button", async () => {
    render(<Example />);
    expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getByRole("button", { name: "Age" })).toBeInTheDocument();
  });

  it("applies striped, hoverable and density classes to the table", () => {
    render(<Example striped hoverable density="compact" />);
    const table = screen.getByRole("table");
    expect(table.className).toContain("nth-child(even)");
    expect(table.className).toContain("hover");
    expect(table.className).toContain("py-1.5");
  });

  it("right-aligns numeric cells and their headers (header default is start-aligned)", () => {
    render(<Example />);
    expect(screen.getByRole("cell", { name: "36" })).toHaveClass("text-end");
    const age = screen.getByRole("columnheader", { name: "Age" });
    expect(age).toHaveClass("text-end");
    expect(age).not.toHaveClass("text-start");
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveClass("text-start");
  });

  it("makes the scroll region keyboard reachable", () => {
    render(<Example aria-label="Team table" />);
    expect(screen.getByRole("region", { name: "Team table" })).toHaveAttribute("tabindex", "0");
  });
});

describe("Sidebar", () => {
  function Example({ collapsed = false }: { collapsed?: boolean }) {
    return (
      <Sidebar collapsed={collapsed} aria-label="App">
        <SidebarSection title="Main">
          <SidebarItem href="/" active icon={<svg data-testid="icon" />}>Home</SidebarItem>
          <SidebarItem href="/inbox" description="3 unread" end={<b>3</b>}>Inbox</SidebarItem>
          <SidebarItem href="/x" disabled>Locked</SidebarItem>
        </SidebarSection>
      </Sidebar>
    );
  }

  it("is a labelled landmark with grouped links and the current page marked", () => {
    render(<Example />);
    const nav = screen.getByRole("navigation", { name: "App" });
    expect(within(nav).getByRole("group", { name: "Main" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: /Home/ })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: /Inbox/ })).not.toHaveAttribute("aria-current");
  });

  it("flags the collapsed rail with data-collapsed and keeps labels in the DOM", () => {
    render(<Example collapsed />);
    expect(screen.getByRole("navigation")).toHaveAttribute("data-collapsed");
    expect(screen.getByRole("link", { name: /Home/ })).toBeInTheDocument();
    expect(screen.getByText("Home").className).toContain("sr-only");
  });

  it("does not flag an expanded sidebar", () => {
    render(<Example />);
    expect(screen.getByRole("navigation")).not.toHaveAttribute("data-collapsed");
  });

  it("marks disabled items", () => {
    render(<Example />);
    expect(screen.getByRole("link", { name: /Locked/ })).toHaveAttribute("aria-disabled", "true");
  });
});
