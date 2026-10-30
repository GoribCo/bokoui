<script setup lang="ts">
import { LayoutGrid } from '@lucide/vue'
</script>

<template>
  <NuxtLink to="/" class="focus-ring inline-flex items-center gap-2 rounded-control px-1 font-semibold text-foreground no-underline">
    <LayoutGrid aria-hidden="true" class="size-5" />
    <span class="hidden sm:inline">Bokoui Layout</span>
  </NuxtLink>
</template>
