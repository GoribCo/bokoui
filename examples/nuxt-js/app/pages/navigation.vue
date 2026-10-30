<script setup lang="ts">
import { ref } from 'vue'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Breadcrumb, BreadcrumbItem, FloatingNav, FloatingNavItem,
  Navbar, NavbarBrand, NavbarLink, Pagination, Sidebar, SidebarItem, SidebarSection, Switch,
} from 'bokoui/vue'

useHead({ title: 'Navigation · UI Framework (Nuxt)' })

const page = ref(4)
const open = ref<string>('a')
const many = ref<string[]>(['a'])
const collapsed = ref(false)
const NuxtLinkComponent = resolveComponent('NuxtLink')
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader title="Navigation" description="Navbar, Sidebar, Breadcrumb, Pagination, FloatingNav and Accordion." />

    <DemoSection title="Navbar" note="Links collapse behind a menu button on small screens.">
      <Navbar class="rounded-card border border-border">
        <template #brand><NavbarBrand href="#">bokoui</NavbarBrand></template>
        <NavbarLink href="#" active>Home</NavbarLink>
        <NavbarLink href="#">Docs</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <template #actions><Badge>beta</Badge></template>
      </Navbar>
    </DemoSection>

    <DemoSection title="Breadcrumb">
      <Breadcrumb>
        <BreadcrumbItem :as="NuxtLinkComponent" to="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Library</BreadcrumbItem>
        <BreadcrumbItem current>Data</BreadcrumbItem>
      </Breadcrumb>
    </DemoSection>

    <DemoSection title="Pagination">
      <Pagination v-model:page="page" :page-count="12" />
      <Pagination :page="2" :page-count="5" :get-href="(p: number) => `#page-${p}`" />
    </DemoSection>

    <DemoSection title="Sidebar">
      <Switch v-model="collapsed">Collapsed</Switch>
      <Sidebar :collapsed="collapsed" class="w-64 rounded-card border border-border">
        <SidebarSection title="Workspace">
          <SidebarItem href="#" active description="Overview">Dashboard</SidebarItem>
          <SidebarItem href="#"><template #end><Badge size="sm">3</Badge></template>Inbox</SidebarItem>
          <SidebarItem href="#" disabled>Billing</SidebarItem>
        </SidebarSection>
      </Sidebar>
    </DemoSection>

    <DemoSection title="Accordion">
      <Accordion v-model="open">
        <AccordionItem value="a"><AccordionTrigger>Single: one open</AccordionTrigger><AccordionContent>Opening another closes this one.</AccordionContent></AccordionItem>
        <AccordionItem value="b"><AccordionTrigger>Second</AccordionTrigger><AccordionContent>Up/Down move between triggers.</AccordionContent></AccordionItem>
      </Accordion>
      <Accordion v-model="many" type="multiple">
        <AccordionItem value="a"><AccordionTrigger>Multiple</AccordionTrigger><AccordionContent>Any number can be open.</AccordionContent></AccordionItem>
        <AccordionItem value="b"><AccordionTrigger>Also open-able</AccordionTrigger><AccordionContent>Independent of the first.</AccordionContent></AccordionItem>
        <AccordionItem value="c" disabled><AccordionTrigger>Disabled</AccordionTrigger><AccordionContent>Never shown.</AccordionContent></AccordionItem>
      </Accordion>
    </DemoSection>

    <DemoSection title="FloatingNav" note="Meant for phones; shown here in flow (fixed=false).">
      <FloatingNav :fixed="false">
        <FloatingNavItem href="#" active aria-label="Home">⌂</FloatingNavItem>
        <FloatingNavItem href="#" aria-label="Search">⌕</FloatingNavItem>
        <FloatingNavItem href="#" aria-label="Profile">☺</FloatingNavItem>
      </FloatingNav>
    </DemoSection>
  </main>
</template>
