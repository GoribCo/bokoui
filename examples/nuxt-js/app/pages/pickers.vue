<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Combobox, DatePicker, FileUpload, FormField, Slider } from 'bokoui/vue'

useHead({ title: 'Pickers · UI Framework (Nuxt)' })

const date = ref<Date | null>(null)
const picked = ref<Date | null>(new Date(2024, 4, 15))
const fruit = ref('banana')
const volume = ref(40)
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
]
const fmt = (d: Date | null) => (d ? d.toLocaleDateString() : 'none')
const rejected = ref('')
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader title="Pickers" description="Calendar, DatePicker, Combobox, Slider and FileUpload." />

    <DemoSection title="Calendar" note="Arrow keys move by day and week; PageUp/PageDown by month.">
      <Calendar v-model="picked" class="max-w-xs" />
      <p class="text-sm text-muted-foreground">Selected: {{ fmt(picked) }}</p>
    </DemoSection>

    <DemoSection title="DatePicker">
      <div class="max-w-xs">
        <FormField label="Birthday" v-slot="{ controlProps }">
          <DatePicker v-bind="controlProps" v-model="date" name="birthday" />
        </FormField>
      </div>
    </DemoSection>

    <DemoSection title="Combobox">
      <div class="max-w-xs">
        <FormField label="Fruit" v-slot="{ controlProps }">
          <Combobox v-bind="controlProps" v-model="fruit" :options="options" name="fruit" />
        </FormField>
      </div>
    </DemoSection>

    <DemoSection title="Slider">
      <div class="max-w-xs">
        <Slider v-model="volume" aria-label="Volume" />
        <p class="text-sm text-muted-foreground">Volume: {{ volume }}</p>
      </div>
    </DemoSection>

    <DemoSection title="FileUpload" note="Images only, up to 1 MB each, at most 3.">
      <FileUpload multiple accept="image/*" :max-size="1_000_000" :max-files="3" hint="PNG or JPG" @reject="rejected = `${$event.length} rejected`" />
      <p v-if="rejected" class="text-sm text-muted-foreground">{{ rejected }}</p>
    </DemoSection>
  </main>
</template>
