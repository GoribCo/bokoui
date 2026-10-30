<script setup lang="ts">
import { Text } from 'bokoui/vue'

defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <PageTitle :title="title" :lead="description" />
    <Text v-if="$slots.default"><slot /></Text>
  </div>
</template>
