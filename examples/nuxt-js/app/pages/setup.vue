<script setup lang="ts">
useHead({ title: 'Setup · UI Framework (Nuxt)' })

const steps = [
  { title: '1. Install', note: 'Needs Nuxt 4, Tailwind CSS 4.1+ and Vue 3.5.', label: 'Install', code: 'npm i bokoui tailwindcss @tailwindcss/vite' },
  {
    title: '2. Configure Tailwind',
    note: 'In nuxt.config.ts.',
    label: 'nuxt.config.ts',
    code: `import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
})`,
  },
  {
    title: '3. Import the stylesheet',
    note: 'In app/assets/css/main.css. It also registers the package for class scanning.',
    label: 'main.css',
    code: `@import "tailwindcss";
@import "bokoui/styles.css";`,
  },
  {
    title: '4. Add the provider',
    note: 'The script sets the saved style and mode before first paint. Do not set data-theme or data-mode through useHead; the script owns them.',
    label: 'app/app.vue',
    code: `<script setup lang="ts">
import { ThemeProvider, ThemeSwitcher, buildThemeScript } from 'bokoui/vue'

useHead({ script: [{ innerHTML: buildThemeScript(), tagPosition: 'head', tagPriority: 'critical' }] })
<\/script>

<template>
  <ThemeProvider>
    <ThemeSwitcher />
    <NuxtPage />
  </ThemeProvider>
</template>`,
  },
  {
    title: '5. Use components',
    note: 'Button has leftIcon / rightIcon slots, Input has startAdornment / endAdornment.',
    label: 'Usage',
    code: `<script setup lang="ts">
import { Button, Input } from 'bokoui/vue'
const email = ref('')
<\/script>

<template>
  <Button color="primary" variant="outline" size="lg">Save</Button>
  <Button action="danger" loading>Deleting</Button>
  <Input v-model="email" placeholder="Email" invalid />
</template>`,
  },
]
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader title="Setup" description="Install bokoui and set it up in a new Nuxt (Vue) app." />

    <DemoSection v-for="s in steps" :key="s.title" :title="s.title" :note="s.note">
      <pre
        tabindex="0"
        role="region"
        :aria-label="s.label"
        class="focus-ring overflow-x-auto rounded-control bg-muted px-3 py-2 text-xs"
      ><code>{{ s.code }}</code></pre>
    </DemoSection>
  </main>
</template>
