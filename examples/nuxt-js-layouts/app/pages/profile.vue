<script setup lang="ts">
import { Card, Text } from 'bokoui/vue'

const { profile } = await useShell()
const rows = computed(() => [
  ['Name', profile.value?.name], ['Email', profile.value?.email], ['Phone', profile.value?.phone],
  ['Job title', profile.value?.jobTitle], ['Joined', profile.value?.joinedAt],
])
</script>

<template>
  <div>
    <PageTitle title="Profile" />
    <Card>
      <dl class="grid gap-3 sm:grid-cols-[10rem_1fr]">
        <template v-for="[k, v] in rows" :key="k"><dt><Text muted as="span">{{ k }}</Text></dt><dd>{{ v }}</dd></template>
      </dl>
    </Card>
  </div>
</template>
