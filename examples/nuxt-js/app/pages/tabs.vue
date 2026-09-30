<script setup lang="ts">
import { ref } from 'vue'
import { Card, Tab, TabList, TabPanel, Tabs, Text } from 'bokoui/vue'

useHead({ title: 'Tabs · UI Framework (Nuxt)' })

const controlled = ref('activity')
const panels = [
  { value: 'overview', text: 'Overview: a summary of the project.' },
  { value: 'activity', text: 'Activity: what changed recently.' },
  { value: 'settings', text: 'Settings: configuration options.' },
]
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader
      title="Tabs"
      description="Arrow keys move and select, Home/End jump, and only the active tab is in the tab order."
    />

    <DemoSection title="Variants" note="Underline, pills, vertical and controlled. The disabled tab is skipped by the arrows.">
      <div class="flex flex-col gap-8">
        <Tabs default-value="overview">
          <TabList aria-label="Underline tabs">
            <Tab v-for="p in panels" :key="p.value" :value="p.value">{{ p.value[0]!.toUpperCase() + p.value.slice(1) }}</Tab>
            <Tab value="billing" disabled>Billing</Tab>
          </TabList>
          <TabPanel v-for="p in panels" :key="p.value" :value="p.value"><Text>{{ p.text }}</Text></TabPanel>
        </Tabs>

        <Tabs default-value="overview" variant="pills" color="accent">
          <TabList aria-label="Pill tabs">
            <Tab v-for="p in panels" :key="p.value" :value="p.value">{{ p.value[0]!.toUpperCase() + p.value.slice(1) }}</Tab>
            <Tab value="billing" disabled>Billing</Tab>
          </TabList>
          <TabPanel v-for="p in panels" :key="p.value" :value="p.value"><Text>{{ p.text }}</Text></TabPanel>
        </Tabs>

        <Tabs default-value="overview" orientation="vertical" action="success">
          <TabList aria-label="Vertical tabs">
            <Tab v-for="p in panels" :key="p.value" :value="p.value">{{ p.value[0]!.toUpperCase() + p.value.slice(1) }}</Tab>
            <Tab value="billing" disabled>Billing</Tab>
          </TabList>
          <div class="flex-1">
            <TabPanel v-for="p in panels" :key="p.value" :value="p.value"><Text>{{ p.text }}</Text></TabPanel>
          </div>
        </Tabs>

        <Card>
          <Tabs v-model="controlled" variant="pills">
            <TabList aria-label="Controlled tabs">
              <Tab v-for="p in panels" :key="p.value" :value="p.value">{{ p.value[0]!.toUpperCase() + p.value.slice(1) }}</Tab>
              <Tab value="billing" disabled>Billing</Tab>
            </TabList>
            <TabPanel v-for="p in panels" :key="p.value" :value="p.value"><Text>{{ p.text }}</Text></TabPanel>
          </Tabs>
          <Text variant="small" muted>Controlled from outside: current tab is <strong>{{ controlled }}</strong>.</Text>
        </Card>
      </div>
    </DemoSection>
  </main>
</template>
