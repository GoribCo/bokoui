<script setup lang="ts">
import { ThemeProvider, ThemeSwitcher, buildThemeScript } from 'bokoui/vue'
import { customThemes } from '~/utils/custom-themes'

// Runs while <head> is parsed, so the first paint already has the saved theme.
// Theme attributes (data-theme / data-mode) are set by this script, not by useHead,
// so hydration never overwrites them.
useHead({
  script: [{ innerHTML: buildThemeScript(customThemes), tagPosition: 'head', tagPriority: 'critical' }],
})
</script>

<template>
  <ThemeProvider :custom-themes="customThemes">
    <NuxtRouteAnnouncer />
    <header class="sticky top-0 z-10 border-b bg-background/90 px-6 py-3 backdrop-blur">
      <ThemeSwitcher />
    </header>
    <div class="flex min-h-[calc(100dvh-57px)] flex-col md:flex-row">
      <SideNav />
      <div class="min-w-0 flex-1">
        <NuxtPage />
      </div>
    </div>
  </ThemeProvider>
</template>
