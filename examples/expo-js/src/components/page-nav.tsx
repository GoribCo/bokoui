import { Button } from 'bokoui/expo';
import { usePathname, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import { pages } from '@/components/pages';

/** Links to every screen of the demo. */
export function PageNav() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} accessibilityRole="menu" contentContainerStyle={{ gap: 8 }}>
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
    </ScrollView>
  );
}
