import { services } from '~/services'

/** Notifications with a shared read state: the header panel and the page show the same unread count. */
export async function useNotifications() {
  const req = useAsyncData('notifications', () => services.notifications(), { default: () => [] })
  const read = useState<string[]>('boko_notifications_read', () => [])
  await req
  const items = computed(() => req.data.value.map((n) => ({ ...n, unread: n.unread && !read.value.includes(n.id) })))
  return {
    items,
    unreadCount: computed(() => items.value.filter((n) => n.unread).length),
    markRead: (ids?: string[]) => (read.value = [...new Set([...read.value, ...(ids ?? req.data.value.map((n) => n.id))])]),
  }
}
