/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    // `node`, not `jsdom`, and this is load-bearing. Vitest derives transformMode
    // "web" from a DOM environment, which Vite names the "client" environment, and
    // Astro's vite plugin deliberately returns a browser stub for any .astro import
    // there instead of compiling it. The Container API then gets a plain function
    // with no isAstroComponentFactory marker, looks for a framework renderer, finds
    // none, and throws NoMatchingRenderer — every .astro test fails.
    //
    // React island tests opt back into a DOM per file with the docblock
    // `// @vitest-environment jsdom` on their first line.
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
  },
})
