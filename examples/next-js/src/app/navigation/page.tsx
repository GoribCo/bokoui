import type { Metadata } from "next";
import { Page, PageHeader, Section } from "@/components/section";
import { BreadcrumbDemo, NavbarDemo, PaginationDemo, SidebarDemo } from "./navigation-demo";

export const metadata: Metadata = { title: "Navigation · UI Framework" };

export default function NavigationPage() {
  return (
    <Page>
      <PageHeader
        title="Navigation"
        description="Navbar, Breadcrumb, Pagination and Sidebar. This site's own sidebar and mobile menu are built with them."
      />
      <Section title="Navbar" note="Links collapse behind a menu button on small screens. Escape or choosing a link closes it.">
        <NavbarDemo />
      </Section>
      <Section title="Breadcrumb" note="The last item is the current page. `as` swaps in a router link.">
        <BreadcrumbDemo />
      </Section>
      <Section title="Pagination" note="Constant width while paging; buttons or links; sizes and tones.">
        <PaginationDemo />
      </Section>
      <Section title="Sidebar" note="Collapsed state is controlled by you and drawn in CSS, so the parts render on the server.">
        <SidebarDemo />
      </Section>
    </Page>
  );
}
