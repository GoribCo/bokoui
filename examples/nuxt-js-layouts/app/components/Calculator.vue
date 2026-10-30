<script setup lang="ts">
import { Button, Card } from 'bokoui/vue'

type Operator = '+' | '-' | '*' | '/'
interface CalcState { display: string; previous: number | null; operator: Operator | null; fresh: boolean }
const initial = (): CalcState => ({ display: '0', previous: null, operator: null, fresh: true })

const apply = (a: number, b: number, op: Operator) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : b === 0 ? NaN : a / b)
const show = (n: number) => (Number.isFinite(n) ? String(Math.round(n * 1e9) / 1e9) : 'Error')

function press(state: CalcState, key: string): CalcState {
  if (/^\d$/.test(key)) return { ...state, display: state.fresh || state.display === '0' ? key : state.display + key, fresh: false }
  if (key === '.') return state.display.includes('.') && !state.fresh ? state : { ...state, display: state.fresh ? '0.' : state.display + '.', fresh: false }
  if (key === 'C') return initial()
  if (key === '±') return { ...state, display: state.display.startsWith('-') ? state.display.slice(1) : state.display === '0' ? '0' : `-${state.display}` }
  if (key === '%') return { ...state, display: show(Number(state.display) / 100), fresh: true }
  const current = Number(state.display)
  const result = state.operator && state.previous !== null && !state.fresh ? apply(state.previous, current, state.operator) : current
  if (key === '=') return { display: show(result), previous: null, operator: null, fresh: true }
  return { display: show(result), previous: result, operator: key as Operator, fresh: true }
}

const state = ref(initial())
const symbol = { '*': '×', '/': '÷', '+': '+', '-': '−' } as const
const keys = [
  { key: 'C' }, { key: '±', label: '+/−', name: 'plus minus' }, { key: '%' }, { key: '/', op: true, label: '÷', name: 'divide' },
  { key: '7' }, { key: '8' }, { key: '9' }, { key: '*', op: true, label: '×', name: 'multiply' },
  { key: '4' }, { key: '5' }, { key: '6' }, { key: '-', op: true, label: '−', name: 'minus' },
  { key: '1' }, { key: '2' }, { key: '3' }, { key: '+', op: true, label: '+', name: 'plus' },
  { key: '0', wide: true }, { key: '.' }, { key: '=', op: true, name: 'equals' },
] as { key: string; label?: string; name?: string; op?: boolean; wide?: boolean }[]
</script>

<template>
  <div class="mx-auto flex max-w-sm flex-col gap-4">
    <h1 class="sr-only">Calculator</h1>
    <Card class="items-end py-5">
      <p class="text-sm text-muted-foreground">{{ state.previous !== null && state.operator ? `${show(state.previous)} ${symbol[state.operator]}` : ' ' }}</p>
      <p role="status" aria-live="polite" class="max-w-full truncate text-5xl font-semibold tabular-nums">{{ state.display }}</p>
    </Card>
    <div class="grid grid-cols-4 gap-3">
      <Button v-for="k in keys" :key="k.key" :variant="k.op ? 'solid' : 'soft'" :color="k.op ? 'primary' : 'neutral'" :aria-label="k.name ?? k.key" class="h-15 text-lg" :class="k.wide && 'col-span-2'" @click="state = press(state, k.key)">{{ k.label ?? k.key }}</Button>
    </div>
  </div>
</template>
