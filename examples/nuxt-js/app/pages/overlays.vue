<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Pencil, Trash2 } from '@lucide/vue'
import { Button, FormField, Input, Menu, MenuItem, MenuLabel, MenuSeparator, Modal, Text, Tooltip } from 'bokoui/vue'

useHead({ title: 'Overlays · UI Framework (Nuxt)' })

const open = ref(false)
const confirm = ref(false)
const big = ref(false)
const last = ref('nothing yet')
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader
      title="Overlays"
      description="Modal uses a native dialog; Tooltip and Menu use the Popover API. Focus, Escape and light dismiss come from the browser plus a little keyboard code."
    />

    <DemoSection title="Modal" note="Try Tab (focus stays inside), Escape, and clicking the backdrop.">
      <div class="flex flex-wrap items-center gap-3">
        <Button @click="open = true">Open modal</Button>
        <Button variant="outline" action="danger" @click="confirm = true">Delete project…</Button>
        <Button variant="soft" @click="big = true">Large, scrolling</Button>
      </div>

      <Modal
        v-model="open"
        title="Edit profile"
        description="Escape, the × button and a backdrop click all close it. Focus returns to the button."
      >
        <FormField label="Display name" v-slot="{ controlProps }">
          <Input v-bind="controlProps" model-value="Ada Lovelace" autofocus />
        </FormField>
        <template #footer>
          <Button variant="ghost" color="neutral" @click="open = false">Cancel</Button>
          <Button @click="open = false">Save</Button>
        </template>
      </Modal>

      <Modal v-model="confirm" size="sm" title="Delete project?" :close-on-backdrop="false" :show-close="false">
        <Text>This cannot be undone. The backdrop does not close this one.</Text>
        <template #footer>
          <Button variant="ghost" color="neutral" @click="confirm = false">Keep it</Button>
          <Button action="danger" @click="confirm = false">Delete</Button>
        </template>
      </Modal>

      <Modal v-model="big" size="lg" title="Long content">
        <div class="flex flex-col gap-3">
          <Text v-for="i in 24" :key="i">
            Paragraph {{ i }}: the body scrolls while the header stays put and the page behind does not move.
          </Text>
        </div>
      </Modal>
    </DemoSection>

    <DemoSection title="Tooltip" note="Hover, or focus with the keyboard. Escape hides it. Near a viewport edge it flips.">
      <div class="flex flex-wrap items-center gap-4 py-8">
        <Tooltip content="Top (default)"><Button variant="outline">Top</Button></Tooltip>
        <Tooltip content="Placed below" placement="bottom"><Button variant="outline">Bottom</Button></Tooltip>
        <Tooltip content="On the left" placement="left"><Button variant="outline">Left</Button></Tooltip>
        <Tooltip content="On the right" placement="right"><Button variant="outline">Right</Button></Tooltip>
        <Tooltip content="No delay" :delay="0"><Button variant="soft">Instant</Button></Tooltip>
        <Tooltip content="Tooltips also describe icon-only buttons">
          <Button icon-only aria-label="Copy" variant="ghost"><Copy aria-hidden="true" /></Button>
        </Tooltip>
        <Tooltip content="Never shown" disabled><Button variant="ghost">Disabled tooltip</Button></Tooltip>
      </div>
    </DemoSection>

    <DemoSection
      title="Menu"
      note="Open with click, ArrowDown or ArrowUp. Arrows, Home/End and typeahead move; Enter selects; Escape closes."
    >
      <div class="flex flex-wrap items-center gap-4">
        <Menu>
          <template #trigger><Button variant="outline">Options</Button></template>
          <MenuLabel>Actions</MenuLabel>
          <MenuItem @select="last = 'Edit'"><Pencil aria-hidden="true" /> Edit</MenuItem>
          <MenuItem @select="last = 'Duplicate'"><Copy aria-hidden="true" /> Duplicate</MenuItem>
          <MenuItem disabled>Archive (disabled)</MenuItem>
          <MenuSeparator />
          <MenuItem danger @select="last = 'Delete'"><Trash2 aria-hidden="true" /> Delete</MenuItem>
        </Menu>
        <Menu placement="bottom-end">
          <template #trigger><Button>Stays open</Button></template>
          <MenuItem @select="(e: Event) => { e.preventDefault(); last = 'Toggle (menu stayed open)' }">Toggle something</MenuItem>
          <MenuItem @select="last = 'Close'">Close</MenuItem>
        </Menu>
        <Text variant="small" muted>Last selected: {{ last }}</Text>
      </div>
    </DemoSection>
  </main>
</template>
