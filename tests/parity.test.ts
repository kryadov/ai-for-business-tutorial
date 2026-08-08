import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { sections } from '../src/data/sections'
import { uiStrings } from '../src/data/ui-strings'
import { glossary, termIds } from '../src/data/glossary'
import { quizzes } from '../src/data/quizzes'
import { quizText } from '../src/data/quizzes/text'

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

describe('ui string parity', () => {
  test('both locales define exactly the same keys', () => {
    expect(Object.keys(uiStrings.ru).sort()).toEqual(Object.keys(uiStrings.en).sort())
  })

  test('no string is left empty', () => {
    for (const [locale, strings] of Object.entries(uiStrings)) {
      for (const [key, value] of Object.entries(strings)) {
        expect(value.trim(), `${locale}.${key} is empty`).not.toBe('')
      }
    }
  })
})

describe('glossary parity', () => {
  test('every registered term id is defined in both locales', () => {
    for (const id of termIds) {
      expect(Object.keys(glossary.en), `en is missing ${id}`).toContain(id)
      expect(Object.keys(glossary.ru), `ru is missing ${id}`).toContain(id)
    }
  })
})

describe('quiz parity', () => {
  test('every quiz question is defined in both locales', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        expect(quizText.en[question.id], `en is missing ${question.id}`).toBeDefined()
        expect(quizText.ru[question.id], `ru is missing ${question.id}`).toBeDefined()
      }
    }
  })
})
