<script setup lang="ts">
import { Search } from '@lucide/vue'
import { Button, Heading, Input, Link, Text, actions, colors, sizes, variants } from 'bokoui/vue'
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <Heading as="h1">Button, Input &amp; Typography</Heading>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Button: variant x color</Heading>
      <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-3">
        <span class="w-16 text-sm text-muted-foreground">{{ variant }}</span>
        <Button v-for="color in colors" :key="color" :variant="variant" :color="color">{{ color }}</Button>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Button: action (overrides color)</Heading>
      <div v-for="variant in (['solid', 'outline', 'soft'] as const)" :key="variant" class="flex flex-wrap items-center gap-3">
        <span class="w-16 text-sm text-muted-foreground">{{ variant }}</span>
        <Button v-for="action in actions" :key="action" :variant="variant" :action="action">{{ action }}</Button>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Button: sizes, icons, states</Heading>
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="size in sizes" :key="size" :size="size">Size {{ size }}</Button>
        <Button v-for="size in sizes" :key="`icon-${size}`" :size="size" icon-only :aria-label="`Search ${size}`">
          <Search aria-hidden="true" />
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Button>
          <template #leftIcon><Search aria-hidden="true" /></template>
          Left icon
        </Button>
        <Button variant="outline">
          Right icon
          <template #rightIcon><Search aria-hidden="true" /></template>
        </Button>
        <Button loading>Loading</Button>
        <Button variant="soft" loading>Saving</Button>
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
        <Button class="rounded-full">rounded-full override</Button>
      </div>
      <Button full-width variant="outline">Full width</Button>
    </section>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Input: variants and sizes</Heading>
      <div class="grid gap-4 sm:grid-cols-3">
        <Input variant="outline" placeholder="Outline" aria-label="Outline" />
        <Input variant="filled" placeholder="Filled" aria-label="Filled" />
        <Input variant="flushed" placeholder="Flushed" aria-label="Flushed" />
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-for="size in sizes" :key="size" :size="size" :placeholder="`Size ${size}`" :aria-label="`Size ${size}`" />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Input: states and adornments</Heading>
      <div class="grid gap-4 sm:grid-cols-2">
        <Input placeholder="Search" aria-label="Search">
          <template #startAdornment><Search aria-hidden="true" /></template>
        </Input>
        <Input variant="flushed" placeholder="Search" aria-label="Search flushed">
          <template #startAdornment><Search aria-hidden="true" /></template>
        </Input>
        <Input invalid model-value="not-an-email" aria-label="Invalid">
          <template #endAdornment><Search aria-hidden="true" /></template>
        </Input>
        <Input color="accent" placeholder="Accent focus" aria-label="Accent" />
        <Input disabled placeholder="Disabled" aria-label="Disabled" />
        <Input readonly model-value="Read only" aria-label="Read only" />
        <Input type="password" placeholder="Password" aria-label="Password" />
        <Input type="file" aria-label="File" />
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Responsive props (resize the window)</Heading>
      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <Button id="resp-button" :size="{ base: 'sm', md: 'lg' }" :full-width="{ base: true, md: false }">
          sm on mobile, lg from md
        </Button>
        <Input id="resp-input" :size="{ base: 'sm', md: 'lg' }" placeholder="sm on mobile, lg from md" aria-label="Responsive" />
      </div>
    </section>

    <section id="typography" class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Typography</Heading>
      <div class="flex flex-col gap-3">
        <Heading as="h1">Heading 1</Heading>
        <Heading as="h2">Heading 2</Heading>
        <Heading as="h3">Heading 3</Heading>
        <Heading as="h4">Heading 4</Heading>
        <Heading as="h5">Heading 5</Heading>
        <Heading as="h6">Heading 6</Heading>
        <Text variant="lead" muted>
          Lead paragraph: the font, weight, tracking and case all follow the active style.
        </Text>
        <Text>
          Body text with a <Link href="#typography">regular link</Link>, an
          <Link href="https://tailwindcss.com" external>external link</Link>
          and <Text as="span" variant="code">inline code</Text>.
        </Text>
        <Text variant="small">Small text</Text>
        <Text variant="caption" muted>Caption text</Text>
        <div class="flex flex-wrap gap-4">
          <Link href="#typography" underline="always">Always underlined</Link>
          <Link href="#typography" color="accent">Accent</Link>
          <Link href="#typography" action="danger" underline="none">Danger, no underline</Link>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <Heading as="h2" size="lg">Form example</Heading>
      <form class="flex max-w-sm flex-col gap-3">
        <Input type="email" placeholder="you@example.com" aria-label="Email" />
        <div class="flex gap-2">
          <Button type="submit">Subscribe</Button>
          <Button type="reset" variant="ghost" color="neutral">Reset</Button>
        </div>
      </form>
    </section>
  </main>
</template>
