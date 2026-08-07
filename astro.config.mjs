// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://kryadov.github.io',
  base: '/ai-for-business-tutorial',
  integrations: [react(), mdx()],
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true },
  },
  vite: { plugins: [tailwindcss()] },
})
