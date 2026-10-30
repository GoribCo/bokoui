<script setup lang="ts">
import { Check } from '@lucide/vue'
import { Button, Card, Heading, useTheme, type ThemeMode } from 'bokoui/vue'

const t = useT()
const { style, mode, themes, setStyle, setMode } = useTheme()
const modes: ThemeMode[] = ['light', 'dark', 'system']
const samples = [
  { to: '/examples/showcase-home', label: t('showcase.homeTitle') },
  { to: '/examples/showcase-settings', label: t('showcase.settingsTitle') },
  { to: '/examples/showcase-calculator', label: t('showcase.calculatorTitle') },
  { to: '/dashboard', label: t('menu.dashboard') },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageTitle :title="t('showcase.galleryTitle')" :lead="t('showcase.galleryDescription')" />
    <div role="radiogroup" :aria-label="t('appearance.mode')" class="flex flex-wrap gap-2">
      <Button v-for="m in modes" :key="m" size="sm" color="neutral" :variant="mode === m ? 'solid' : 'soft'" role="radio" :aria-checked="mode === m" @click="setMode(m)">{{ t(`appearance.${m}`) }}</Button>
    </div>
    <div role="radiogroup" :aria-label="t('appearance.style')" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <button v-for="th in themes" :key="th.id" type="button" role="radio" :aria-checked="th.id === style" class="rounded-card text-start focus-ring" @click="setStyle(th.id)">
        <Card padding="sm" class="gap-2" :class="th.id === style && 'ring-2 ring-primary'">
          <span aria-hidden="true" class="flex gap-1.5"><span class="size-5 rounded-full bg-primary" /><span class="size-5 rounded-full bg-secondary" /><span class="size-5 rounded-full bg-accent" /></span>
          <span class="flex items-center justify-between gap-2"><span class="truncate" :class="th.id === style ? 'font-bold' : 'font-medium'">{{ th.label }}</span><Check v-if="th.id === style" aria-hidden="true" class="size-4 text-primary" /></span>
        </Card>
      </button>
    </div>
    <Card>
      <Heading as="h2" size="md">{{ t('showcase.samples') }}</Heading>
      <div class="mt-3 flex flex-wrap gap-2"><NuxtLink v-for="s in samples" :key="s.to" :to="s.to" data-tone="neutral" class="focus-ring rounded-control bg-(--tone-soft) px-3 py-1.5 text-sm text-(--tone-ink) no-underline">{{ s.label }}</NuxtLink></div>
    </Card>
  </div>
</template>
