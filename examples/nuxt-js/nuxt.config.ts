import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  // Where each platform's demo runs (fixed ports, see run.sh). Overridable with NUXT_PUBLIC_URL_REACT etc.
  runtimeConfig: {
    public: {
      urlReact: 'http://localhost:3002',
      urlVue: 'http://localhost:3003',
      urlExpo: 'http://localhost:3001',
      urlLayouts: 'http://localhost:3006',
    },
  },
  // The crawler follows the platform switcher's links to the other demos (served by other builds); skip them.
  nitro: { prerender: { ignore: ['/bokoui/react', '/bokoui/expo'] } },
  app: {
    // GitHub Pages serves the Vue demo under /bokoui/vue/ (NUXT_APP_BASE_URL is set in CI).
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    head: {
      title: 'UI Framework (Nuxt)',
      meta: [{ name: 'description', content: 'Themeable UI components built with Nuxt and Tailwind CSS' }],
    },
  },
})
