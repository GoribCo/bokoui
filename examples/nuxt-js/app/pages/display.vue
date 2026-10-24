<script setup lang="ts">
import {
  Avatar, Badge, Button, Card, CardFooter, CardHeader, Divider, Heading, Image, Text, actions, colors, sizes,
} from 'bokoui/vue'

useHead({ title: 'Data display · UI Framework (Nuxt)' })

/** Inline SVG so the demo needs no network or asset files. */
const art = (from: string, to: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="640" height="480" fill="url(#g)"/></svg>`,
  )}`

const people = [
  { name: 'Ada Lovelace', color: 'primary' },
  { name: 'Grace Hopper', color: 'secondary' },
  { name: 'Alan Turing', color: 'accent' },
  { name: 'Katherine Johnson', color: 'neutral' },
] as const
const badgeVariants = ['soft', 'solid', 'outline'] as const
const cardVariants = ['outline', 'elevated', 'filled'] as const
const paddings = ['sm', 'md', 'lg'] as const
const aspects = ['auto', 'square', 'video', 'portrait'] as const
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader
      title="Data display"
      description="Badge, Avatar, Card, Divider and Image share the same tones and radii as the rest of the kit."
    />

    <DemoSection title="Badge: variant x color">
      <div v-for="variant in badgeVariants" :key="variant" class="flex flex-wrap items-center gap-3">
        <span class="w-16 text-sm text-muted-foreground">{{ variant }}</span>
        <Badge v-for="color in colors" :key="color" :variant="variant" :color="color">{{ color }}</Badge>
        <Badge v-for="action in actions" :key="action" :variant="variant" :action="action">{{ action }}</Badge>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Badge v-for="size in sizes" :key="size" :size="size">Size {{ size }}</Badge>
      </div>
    </DemoSection>

    <DemoSection title="Avatar" note="Initials show behind the image, so a slow or missing photo still looks right.">
      <div class="flex flex-wrap items-center gap-4">
        <Avatar v-for="p in people" :key="p.name" :name="p.name" :color="p.color" />
        <Avatar name="Grace Hopper" :src="art('#6366f1', '#ec4899')" />
        <Avatar name="Alan Turing" :src="art('#10b981', '#0ea5e9')" shape="square" />
        <Avatar name="Online" status />
        <Avatar name="Away" status status-action="warning" />
        <Avatar name="Busy" status status-action="danger" />
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Avatar v-for="size in sizes" :key="size" :size="size" name="Ada Lovelace" />
      </div>
    </DemoSection>

    <DemoSection title="Divider">
      <div class="flex flex-col gap-4">
        <Text>Above</Text>
        <Divider />
        <Text>Below</Text>
        <Divider label="or continue with" />
        <div class="flex h-8 items-center gap-4">
          <Text>Docs</Text>
          <Divider orientation="vertical" />
          <Text>Blog</Text>
          <Divider orientation="vertical" />
          <Text>Contact</Text>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Card">
      <div class="grid gap-4 sm:grid-cols-3">
        <Card v-for="variant in cardVariants" :key="variant" :variant="variant">
          <CardHeader>
            <Heading as="h3" size="md">{{ variant }}</Heading>
            <Text variant="small" muted>A short description of the card.</Text>
          </CardHeader>
          <Text variant="small">Body content sits between header and footer.</Text>
          <CardFooter>
            <Button size="sm">Action</Button>
            <Button size="sm" variant="ghost" color="neutral">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Card v-for="padding in paddings" :key="padding" :padding="padding">
          <Text variant="small">padding: {{ padding }}</Text>
        </Card>
      </div>
      <Card interactive tabindex="0" role="button" aria-label="Interactive card" class="max-w-sm">
        <Heading as="h3" size="md">Interactive card</Heading>
        <Text variant="small" muted>Hovers and shifts using the style's hover tokens.</Text>
      </Card>
      <Card padding="none" class="max-w-sm">
        <Image :src="art('#f59e0b', '#ef4444')" alt="Sunset gradient" aspect="video" class="rounded-none" />
        <div class="flex flex-col gap-1 p-4">
          <Heading as="h3" size="md">Media card</Heading>
          <Text variant="small" muted>Padding none lets the image reach the edge.</Text>
        </div>
      </Card>
    </DemoSection>

    <DemoSection title="Image">
      <div class="grid gap-4 sm:grid-cols-4">
        <div v-for="aspect in aspects" :key="aspect" class="flex flex-col gap-2">
          <Image :src="art('#8b5cf6', '#06b6d4')" :alt="`${aspect} aspect`" :aspect="aspect" rounded />
          <Text variant="caption" muted>aspect: {{ aspect }}</Text>
        </div>
      </div>
    </DemoSection>
  </main>
</template>
