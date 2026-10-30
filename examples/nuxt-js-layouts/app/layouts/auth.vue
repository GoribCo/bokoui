<script setup lang="ts">
const t = useT()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#content" class="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-control focus:bg-background focus:px-3 focus:py-2">{{ t('shell.skipToContent') }}</a>
    <header class="flex h-14 items-center px-4 sm:px-6"><Branding /></header>
    <main id="content" tabindex="-1" class="flex flex-1 items-start justify-center px-4 py-10"><slot /></main>
    <AppFooter />
  </div>
</template>
