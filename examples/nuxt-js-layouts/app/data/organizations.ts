import type { Organization, UserProfile } from '~/utils/types'

export const profile: UserProfile = {
  id: 'user-1',
  name: 'Amina Rahman',
  email: 'amina.rahman@example.com',
  phone: '+880 1700 000000',
  jobTitle: 'Chief Medical Officer',
  joinedAt: '2022-03-14',
}

/** One user, three organizations of different types, with different roles in each. */
export const organizations: Organization[] = [
  { id: 'org-hospital', slug: 'green-valley-hospital', name: 'Green Valley Hospital', type: 'hospital', roles: ['doctor', 'admin'] },
  { id: 'org-pharmacy', slug: 'citycare-pharmacy', name: 'CityCare Pharmacy', type: 'pharmacy', roles: ['pharmacist'] },
  {
    id: 'org-company',
    slug: 'acme-health',
    name: 'Acme Health Solutions with an Exceptionally Long Registered Name Ltd',
    type: 'company',
    roles: ['manager', 'auditor'],
  },
]

export const commonMenu = [
  { id: 'help', label: 'Help', labelKey: 'common.help', icon: 'help-circle', href: '/help' },
  { id: 'terms', label: 'Terms', labelKey: 'common.terms', icon: 'file-text', href: '/legal/terms' },
  { id: 'contact', label: 'Contact', labelKey: 'footer.contact', icon: 'lock', href: '/contact' },
]

export const footerLinks = [
  { id: 'terms', label: 'Terms', labelKey: 'footer.terms', href: '/legal/terms' },
  { id: 'privacy', label: 'Privacy', labelKey: 'footer.privacy', href: '/legal/privacy' },
  { id: 'help', label: 'Help', labelKey: 'footer.help', href: '/help' },
  { id: 'contact', label: 'Contact', labelKey: 'footer.contact', href: '/contact' },
]
