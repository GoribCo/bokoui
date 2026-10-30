<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'

// One row of a settings or list card: icon tile, title with optional subtitle, end content or a chevron.
defineProps<{ title: string; subtitle?: string; to?: string }>()
const slots = useSlots()
// Resolved in script (not in the template) so Nuxt registers the component.
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component :is="to ? NuxtLink : 'div'" :to="to" class="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-start text-foreground no-underline" :class="to && 'hover:bg-muted focus-ring'">
    <slot name="icon" />
    <span class="flex min-w-0 flex-1 flex-col"><span class="truncate font-medium">{{ title }}</span><span v-if="subtitle" class="truncate text-sm text-muted-foreground">{{ subtitle }}</span></span>
    <slot name="end" />
    <ChevronRight v-if="to && !slots.end" aria-hidden="true" class="size-4.5 shrink-0 text-muted-foreground" />
  </component>
</template>
