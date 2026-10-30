<script setup lang="ts">
// A rounded tile with a soft primary tint that holds an icon; `color` swaps the tint for a flat swatch.
defineProps<{ color?: string }>()
</script>

<template>
  <span aria-hidden="true" data-tone="primary" :style="color ? { backgroundColor: color } : undefined" class="inline-flex size-10 shrink-0 items-center justify-center rounded-control [&_svg]:size-5" :class="!color && 'bg-(--tone-soft) text-(--tone-ink)'"><slot /></span>
</template>
