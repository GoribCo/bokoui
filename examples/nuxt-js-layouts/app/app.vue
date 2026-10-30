<script setup lang="ts">
import { ThemeProvider, ToastProvider, buildThemeScript } from 'bokoui/vue'

// Runs while <head> is parsed, so the first paint already has the saved theme.
useHead({ script: [{ innerHTML: buildThemeScript(), tagPosition: 'head', tagPriority: 'critical' }] })
</script>

<template>
  <ThemeProvider>
    <ToastProvider>
      <NuxtRouteAnnouncer />
      <NuxtLayout><NuxtPage /></NuxtLayout>
    </ToastProvider>
  </ThemeProvider>
</template>
