<script setup lang="ts">
import { Badge, Card, Heading, Text } from 'bokoui/vue'

// The organization and its roles follow the switcher in the header.
const { org } = await useShell()
</script>

<template>
  <Card v-if="org">
    <Heading as="h2" size="md">{{ org.name }}</Heading>
    <Text muted class="capitalize">{{ org.type }}</Text>
    <div class="mt-3 flex flex-wrap gap-2"><Badge v-for="r in org.roles" :key="r" class="capitalize">{{ r }}</Badge></div>
  </Card>
</template>
