import { Button, Sidebar, SidebarItem, SidebarSection } from 'bokoui/expo';
import { usePathname, useRouter } from 'expo-router';
import { View } from 'react-native';

import { pages } from '@/components/pages';

/** Width from which the pages move into a sidebar, like the `md` breakpoint of the web demos. */
export const SIDEBAR_BREAKPOINT = 768;

/** Narrow screens: every page as a wrapping button, so none is hidden off-screen. */
export function PageNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <View accessibilityRole="menu" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {pages.map((page) => (
        <Button
          key={page.href}
          size="sm"
          color="neutral"
          variant={pathname === page.href ? 'solid' : 'outline'}
          onPress={() => router.navigate(page.href)}>
          {page.label}
        </Button>
      ))}
    </View>
  );
}

/** Wide screens: bokoui `Sidebar` with one item per page. */
export function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Sidebar label="Pages">
      <SidebarSection title="Components">
        {pages.map((page) => (
          <SidebarItem key={page.href} active={pathname === page.href} onPress={() => router.navigate(page.href)}>
            {page.label}
          </SidebarItem>
        ))}
      </SidebarSection>
    </Sidebar>
  );
}
