<script setup lang="ts">
import { Heading, Text } from 'bokoui/vue'

defineProps<{ title: string; description: string }>()
</script>

<template>
  <header class="flex flex-col gap-2">
    <Heading as="h1">{{ title }}</Heading>
    <Text variant="lead" muted>{{ description }}</Text>
  </header>
</template>
