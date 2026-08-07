import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { sections } from '../src/data/sections'

const CONTENT = join(process.cwd(), 'src', 'content')
const LOCALES = ['en', 'ru'] as const

describe('content parity between locales', () => {
  test('every written section exists in both locales', () => {
    const written = new Set(
      LOCALES.flatMap((locale) =>
        existsSync(join(CONTENT, locale))
          ? readdirSync(join(CONTENT, locale)).map((f) => f.replace(/\.mdx$/, ''))
          : [],
      ),
    )

    for (const slug of written) {
      for (const locale of LOCALES) {
        expect(
          existsSync(join(CONTENT, locale, `${slug}.mdx`)),
          `${slug} is missing the ${locale} version`,
        ).toBe(true)
      }
    }
  })

  test('every content file corresponds to a registered section', () => {
    const knownSlugs = new Set(sections.map((s) => s.slug))
    for (const locale of LOCALES) {
      if (!existsSync(join(CONTENT, locale))) continue
      for (const file of readdirSync(join(CONTENT, locale))) {
        const slug = file.replace(/\.mdx$/, '')
        expect(knownSlugs.has(slug), `${slug} is not in the section registry`).toBe(true)
      }
    }
  })
})
