<script setup lang="ts">
import { ref } from 'vue'
import { Alert, Button, Spinner, actions, colors, sizes } from 'bokoui/vue'

useHead({ title: 'Feedback · UI Framework (Nuxt)' })

const variants = ['soft', 'outline', 'solid'] as const
const dismissed = ref(false)
const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1)
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader title="Feedback" description="Alert and Spinner tell people what is happening." />

    <DemoSection
      title="Alert: action x variant"
      note="Danger and warning use role=alert (announced immediately); the rest use role=status."
    >
      <div v-for="variant in variants" :key="variant" class="flex flex-col gap-3">
        <Alert
          v-for="action in actions"
          :key="action"
          :variant="variant"
          :action="action"
          :title="`${cap(action)} (${variant})`"
        >
          Something you should know about this action.
        </Alert>
      </div>
    </DemoSection>

    <DemoSection title="Alert: neutral, colors and options">
      <Alert>Neutral alert with only a description.</Alert>
      <Alert v-for="color in colors" :key="color" :color="color" :title="color">Brand color {{ color }}.</Alert>
      <Alert action="success" no-icon title="No icon">The icon can be hidden.</Alert>
      <Alert action="warning" title="With actions">
        <div class="mt-2 flex gap-2">
          <Button size="sm" action="warning">Fix it</Button>
          <Button size="sm" variant="ghost" color="neutral">Later</Button>
        </div>
      </Alert>
      <Alert v-if="!dismissed" action="info" title="Dismissible" closable @close="dismissed = true">
        Click the × to dismiss this alert.
      </Alert>
      <Button v-else variant="outline" size="sm" @click="dismissed = false">Bring the alert back</Button>
    </DemoSection>

    <DemoSection title="Spinner">
      <div class="flex flex-wrap items-center gap-6">
        <Spinner v-for="size in sizes" :key="size" :size="size" />
        <Spinner v-for="color in colors" :key="color" :color="color" />
        <Spinner v-for="action in actions" :key="action" :action="action" :label="`${action} loading`" />
      </div>
    </DemoSection>
  </main>
</template>
