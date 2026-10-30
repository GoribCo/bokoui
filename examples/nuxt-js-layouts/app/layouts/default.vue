<script setup lang="ts">
// The dashboard shell: header, sidebar (a drawer and bottom tabs on phones), content, footer.
const t = useT()
const { organizations, org, groups, common, profile, collapsed, switchOrg } = await useShell()
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <a href="#content" class="sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded-control focus:bg-background focus:px-3 focus:py-2">{{ t('shell.skip') }}</a>
    <AppHeader :organizations="organizations" :org="org" :profile="profile" @switch-org="switchOrg" />
    <div class="flex min-h-0 flex-1">
      <aside
        class="sticky top-14 hidden h-[calc(100dvh-3.5rem)] shrink-0 border-e border-border transition-[width] duration-200 motion-reduce:transition-none md:block"
        :class="collapsed ? 'w-16' : 'w-64'"
      >
        <SidebarContent :groups="groups" :common="common" :collapsed="collapsed" />
      </aside>
      <div class="flex min-w-0 flex-1 flex-col">
        <main id="content" tabindex="-1" class="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 md:pb-10">
          <AppBreadcrumb :groups="groups" />
          <slot />
        </main>
        <AppFooter />
      </div>
    </div>
    <MobileNav :groups="groups" :common="common" />
  </div>
</template>
