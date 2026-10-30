<script setup lang="ts">
import { ThemeSwitcher } from 'bokoui/vue'

const t = useT()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#content" class="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-control focus:bg-background focus:px-3 focus:py-2">{{ t('shell.skip') }}</a>
    <header class="flex h-14 items-center justify-between gap-2 border-b border-border px-4 sm:px-6">
      <Branding />
      <div class="flex items-center gap-3">
        <ThemeSwitcher class="hidden sm:flex" />
        <NuxtLink to="/dashboard" class="focus-ring rounded-control text-sm">{{ t('menu.dashboard') }}</NuxtLink>
      </div>
    </header>
    <main id="content" tabindex="-1" class="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6"><slot /></main>
    <AppFooter />
  </div>
</template>
