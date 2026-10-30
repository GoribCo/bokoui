<script setup lang="ts">
import { ThemeProvider, ThemeSwitcher, ToastProvider, buildThemeScript } from 'bokoui/vue'
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
    <ToastProvider>
    <NuxtRouteAnnouncer />
    <!-- Sticky only from md: on a phone the wrapped header would take a fifth of the screen. -->
    <header class="z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-background/90 px-4 py-3 backdrop-blur sm:px-6 md:sticky md:top-0 md:h-[57px] md:flex-nowrap md:py-0">
      <ThemeSwitcher />
      <PlatformSwitcher />
    </header>
    <div class="flex min-h-[calc(100dvh-57px)] flex-col md:flex-row">
      <SideNav />
      <div class="min-w-0 flex-1">
        <NuxtPage />
      </div>
    </div>
    </ToastProvider>
  </ThemeProvider>
</template>
