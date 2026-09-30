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
      urlReact: 'http://localhost:3001',
      urlVue: 'http://localhost:3002',
      urlExpo: 'http://localhost:3000',
    },
  },
  app: {
    head: {
      title: 'UI Framework (Nuxt)',
      meta: [{ name: 'description', content: 'Themeable UI components built with Nuxt and Tailwind CSS' }],
    },
  },
})
