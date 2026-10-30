<script setup lang="ts">
import { Check, ChevronsUpDown, Globe, LogOut, Menu as MenuIcon, PanelLeft, Settings, User } from '@lucide/vue'
import { Button, Menu, MenuItem, MenuLabel, MenuSeparator, ThemeSwitcher } from 'bokoui/vue'
import type { Locale, MenuGroup, Organization, UserProfile } from '~/utils/types'

defineProps<{ organizations: Organization[]; org?: Organization; profile?: UserProfile | null; groups: MenuGroup[] }>()
const emit = defineEmits<{ switchOrg: [id: string] }>()
const t = useT()
const locale = useLocale()
const { collapsed, drawerOpen } = useShellState()
const { signOut } = useAuth()
const logout = () => {
  signOut()
  return navigateTo('/')
}
const initials = (name = '') => name.split(' ').map((w) => w[0]).slice(0, 2).join('')
</script>

<template>
  <header class="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur sm:px-4">
    <Button icon-only variant="ghost" color="neutral" class="md:hidden" :aria-label="t('shell.openMenu')" @click="drawerOpen = true">
      <MenuIcon aria-hidden="true" />
    </Button>
    <Button icon-only variant="ghost" color="neutral" class="hidden md:inline-flex" :aria-label="t(collapsed ? 'shell.expand' : 'shell.collapse')" :aria-pressed="collapsed" @click="collapsed = !collapsed">
      <PanelLeft aria-hidden="true" />
    </Button>
    <Branding />

    <div class="ms-auto flex min-w-0 items-center gap-1 sm:gap-2">
      <Menu v-if="org" placement="bottom-end" :aria-label="t('shell.organization')">
        <template #trigger>
          <Button variant="outline" color="neutral" class="max-w-40 sm:max-w-64">
            <span class="truncate">{{ org.name }}</span>
            <ChevronsUpDown aria-hidden="true" />
          </Button>
        </template>
        <MenuLabel>{{ t('organization.workspaces') }}</MenuLabel>
        <MenuItem v-for="o in organizations" :key="o.id" @select="emit('switchOrg', o.id)">
          <Check :class="o.id === org.id ? 'opacity-100' : 'opacity-0'" aria-hidden="true" />
          <span class="max-w-56 truncate">{{ o.name }}</span>
        </MenuItem>
      </Menu>

      <Menu placement="bottom-end" :aria-label="t('shell.language')">
        <template #trigger><Button icon-only variant="ghost" color="neutral" :aria-label="t('shell.language')"><Globe aria-hidden="true" /></Button></template>
        <MenuItem v-for="l in locales" :key="l.code" @select="locale = l.code as Locale">
          <Check :class="l.code === locale ? 'opacity-100' : 'opacity-0'" aria-hidden="true" />{{ l.label }}
        </MenuItem>
      </Menu>

      <HeaderSearch :groups="groups" />
      <NotificationsButton />
      <ThemeSwitcher class="hidden lg:flex" />

      <Menu placement="bottom-end" :aria-label="t('account.menu')">
        <template #trigger>
          <Button icon-only variant="soft" :aria-label="t('account.menu')"><span aria-hidden="true" class="text-xs font-semibold">{{ initials(profile?.name) || '?' }}</span></Button>
        </template>
        <MenuLabel>{{ profile?.name }}</MenuLabel>
        <MenuItem @select="navigateTo('/profile')"><User aria-hidden="true" />{{ t('account.profile') }}</MenuItem>
        <MenuSeparator />
        <MenuItem @select="navigateTo('/account')"><Settings aria-hidden="true" />{{ t('account.manage') }}</MenuItem>
        <MenuItem @select="navigateTo('/organizations')">{{ t('organization.manage') }}</MenuItem>
        <MenuItem @select="logout"><LogOut aria-hidden="true" />{{ t('account.logout') }}</MenuItem>
      </Menu>
    </div>
  </header>
</template>
