<script setup lang="ts">
import { Alert, Button, Checkbox, FormField, Input, Textarea } from 'bokoui/vue'
import { services } from '~/services'

const blank = () => ({ name: '', email: '', notes: '', notify: true })
const values = reactive(blank())
const errors = reactive<{ name?: string; email?: string; notes?: string }>({})
const saved = ref('')
const failed = ref('')
const pending = ref(false)

function validate() {
  errors.name = values.name.trim().length < 2 ? 'Enter at least 2 characters' : undefined
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? undefined : 'Enter a valid email address'
  errors.notes = values.notes.length > 200 ? 'Keep notes under 200 characters' : undefined
  return !errors.name && !errors.email && !errors.notes
}
async function submit() {
  saved.value = failed.value = ''
  if (!validate()) return
  pending.value = true
  try {
    await services.createStaff({ ...values })
    saved.value = values.name
    Object.assign(values, blank())
  } catch (e) {
    failed.value = e instanceof Error ? e.message : 'Could not save'
  } finally {
    pending.value = false
  }
}
const reset = () => (Object.assign(values, blank()), Object.assign(errors, { name: undefined, email: undefined, notes: undefined }))
</script>

<template>
  <form novalidate class="flex max-w-xl flex-col gap-4" @submit.prevent="submit" @reset.prevent="reset">
    <Alert v-if="failed" action="danger">{{ failed }}</Alert>
    <Alert v-if="saved" action="success">Saved {{ saved }}.</Alert>
    <FormField label="Name" required :error="errors.name" v-slot="{ controlProps }"><Input v-bind="controlProps" v-model="values.name" autocomplete="name" /></FormField>
    <FormField label="Email" required :error="errors.email" v-slot="{ controlProps }"><Input v-bind="controlProps" v-model="values.email" type="email" autocomplete="email" /></FormField>
    <FormField label="Notes" hint="Optional, up to 200 characters." :error="errors.notes" v-slot="{ controlProps }"><Textarea v-bind="controlProps" v-model="values.notes" :rows="4" /></FormField>
    <Checkbox v-model="values.notify">Send a welcome email</Checkbox>
    <div class="flex gap-2"><Button type="submit" :loading="pending">Save</Button><Button type="reset" variant="ghost" color="neutral">Reset</Button></div>
  </form>
</template>
