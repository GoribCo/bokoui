import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  // Where the same shell runs on the other platforms (fixed ports, see run.sh). Overridable with NUXT_PUBLIC_URL_NEXT_LAYOUTS etc.
  runtimeConfig: { public: { urlNextLayouts: 'http://localhost:3004', urlExpoLayouts: 'http://localhost:3005' } },
  // The footer links to the other platforms' layouts apps (served by other builds); the prerender crawler must not follow them.
  nitro: { prerender: { ignore: ['/bokoui/next-layouts', '/bokoui/expo-layouts'] } },
  app: {
    head: {
      title: 'Bokoui Layout (Nuxt)',
      meta: [{ name: 'description', content: 'A generic application shell for large, multi-organization products.' }],
    },
  },
})
