<script setup lang="ts">
import { ref } from 'vue'
import {
  Button, Checkbox, FormField, Input, Radio, RadioGroup, Select, Switch, Textarea, sizes,
} from 'bokoui/vue'

useHead({ title: 'Forms · UI Framework (Nuxt)' })

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'avocado', label: 'Avocado (unavailable)', disabled: true },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
]

const fruit = ref('banana')
const picked = ref('')
const plan = ref('free')
const size = ref('md')
const on = ref(true)
const flags = ref({ checked: true, accent: true, success: true, disabledChecked: true, sm: true, md: true, lg: true })
const switches = ref({ on: true, success: true, danger: true, sm: true, md: true, lg: true })
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader
      title="Forms"
      description="FormField wires the label, hint and error to any control through id and aria-describedby."
    />

    <DemoSection title="FormField" note="The default slot is scoped: spread controlProps onto the control.">
      <div class="grid gap-6 sm:grid-cols-2">
        <FormField label="Email" hint="We never share it" v-slot="{ controlProps }">
          <Input v-bind="controlProps" type="email" placeholder="you@example.com" />
        </FormField>
        <FormField label="Username" required error="That name is taken" v-slot="{ controlProps }">
          <Input v-bind="controlProps" model-value="ada" />
        </FormField>
        <FormField label="Bio" hint="A short sentence" v-slot="{ controlProps }">
          <Textarea v-bind="controlProps" placeholder="Tell us about yourself" />
        </FormField>
        <FormField label="Locked" disabled v-slot="{ controlProps }">
          <Input v-bind="controlProps" model-value="Read only for now" />
        </FormField>
      </div>
    </DemoSection>

    <DemoSection title="Textarea">
      <div class="grid gap-4 sm:grid-cols-3">
        <Textarea variant="outline" placeholder="Outline" aria-label="Outline" />
        <Textarea variant="filled" placeholder="Filled" aria-label="Filled" />
        <Textarea variant="flushed" placeholder="Flushed" aria-label="Flushed" />
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Textarea v-for="s in sizes" :key="s" :size="s" :rows="2" :placeholder="`Size ${s}`" :aria-label="`Size ${s}`" />
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Textarea invalid model-value="Invalid" aria-label="Invalid" />
        <Textarea disabled placeholder="Disabled" aria-label="Disabled" />
        <Textarea resize="none" placeholder="Resize: none" aria-label="No resize" />
      </div>
    </DemoSection>

    <DemoSection title="Select" note="Custom listbox with v-model: arrows, Home/End, typeahead, Enter/Space, Escape.">
      <div class="grid gap-6 sm:grid-cols-2">
        <FormField label="Controlled" :hint="`Value: ${fruit}`" v-slot="{ controlProps }">
          <Select v-bind="controlProps" v-model="fruit" :options="fruits" />
        </FormField>
        <FormField label="Placeholder" v-slot="{ controlProps }">
          <Select v-bind="controlProps" :options="fruits" placeholder="Pick a fruit" />
        </FormField>
        <FormField label="With error" error="Please choose a fruit" required v-slot="{ controlProps }">
          <Select v-bind="controlProps" v-model="picked" :options="fruits" placeholder="Pick a fruit" />
        </FormField>
        <FormField label="Disabled" disabled v-slot="{ controlProps }">
          <Select v-bind="controlProps" model-value="apple" :options="fruits" />
        </FormField>
        <Select :options="fruits" variant="filled" size="sm" aria-label="Filled small" model-value="cherry" />
        <Select :options="fruits" variant="flushed" size="lg" aria-label="Flushed large" placeholder="Flushed, large" />
      </div>
    </DemoSection>

    <DemoSection title="Checkbox">
      <div class="flex flex-wrap items-center gap-6">
        <Checkbox>Default</Checkbox>
        <Checkbox v-model="flags.checked">Checked</Checkbox>
        <Checkbox v-model="flags.accent" color="accent">Accent</Checkbox>
        <Checkbox v-model="flags.success" action="success">Success</Checkbox>
        <Checkbox invalid>Invalid</Checkbox>
        <Checkbox disabled>Disabled</Checkbox>
        <Checkbox v-model="flags.disabledChecked" disabled>Disabled checked</Checkbox>
      </div>
      <div class="flex flex-wrap items-center gap-6">
        <Checkbox v-model="flags.sm" size="sm">Size sm</Checkbox>
        <Checkbox v-model="flags.md" size="md">Size md</Checkbox>
        <Checkbox v-model="flags.lg" size="lg">Size lg</Checkbox>
      </div>
    </DemoSection>

    <DemoSection title="Radio">
      <RadioGroup aria-label="Plan">
        <Radio v-model="plan" name="plan" value="free">Free</Radio>
        <Radio v-model="plan" name="plan" value="pro">Pro</Radio>
        <Radio v-model="plan" name="plan" value="team">Team</Radio>
        <Radio v-model="plan" name="plan" value="legacy" disabled>Legacy (disabled)</Radio>
      </RadioGroup>
      <RadioGroup aria-label="Size" orientation="horizontal">
        <Radio v-for="s in sizes" :key="s" v-model="size" name="radio-size" :size="s" :value="s">{{ s }}</Radio>
      </RadioGroup>
    </DemoSection>

    <DemoSection title="Switch">
      <div class="flex flex-wrap items-center gap-6">
        <Switch>Wi-Fi</Switch>
        <Switch v-model="on">On</Switch>
        <Switch v-model="switches.success" action="success">Success</Switch>
        <Switch v-model="switches.danger" action="danger">Danger</Switch>
        <Switch disabled>Disabled</Switch>
      </div>
      <div class="flex flex-wrap items-center gap-6">
        <Switch v-model="switches.sm" size="sm">Size sm</Switch>
        <Switch v-model="switches.md" size="md">Size md</Switch>
        <Switch v-model="switches.lg" size="lg">Size lg</Switch>
      </div>
    </DemoSection>

    <DemoSection title="Putting it together">
      <form class="flex max-w-md flex-col gap-4" @submit.prevent>
        <FormField label="Name" required v-slot="{ controlProps }">
          <Input v-bind="controlProps" name="name" placeholder="Ada Lovelace" />
        </FormField>
        <FormField label="Message" v-slot="{ controlProps }">
          <Textarea v-bind="controlProps" name="message" />
        </FormField>
        <Checkbox name="terms">I accept the terms</Checkbox>
        <Switch name="news">Send me the newsletter</Switch>
        <div class="flex gap-2">
          <Button type="submit">Send</Button>
          <Button type="reset" variant="ghost" color="neutral">Reset</Button>
        </div>
      </form>
    </DemoSection>
  </main>
</template>
