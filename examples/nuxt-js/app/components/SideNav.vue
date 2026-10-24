<script setup lang="ts">
import { navItems } from '~/utils/nav-items'

const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <!-- A scrolling row on small screens, a fixed column from md. -->
  <nav
    aria-label="Pages"
    class="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-4 py-2 md:sticky md:top-[57px] md:h-[calc(100dvh-57px)] md:w-60 md:flex-col md:overflow-y-auto md:border-r md:border-b-0 md:px-3 md:py-4"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      :aria-current="isActive(item.to) ? 'page' : undefined"
      data-tone="primary"
      class="focus-ring shrink-0 rounded-control px-3 py-2 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:whitespace-normal aria-[current=page]:bg-(--tone-soft) aria-[current=page]:font-medium aria-[current=page]:text-(--tone-ink)"
    >
      {{ item.label }}
      <span class="hidden text-xs font-normal text-muted-foreground md:block">{{ item.description }}</span>
    </NuxtLink>
  </nav>
</template>
