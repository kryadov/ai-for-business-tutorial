import { describe, expect, test } from 'vitest'
import { glossary, termIds } from './glossary'

describe('glossary', () => {
  test('defines every term in both locales', () => {
    for (const id of termIds) {
      expect(glossary.en[id]?.definition.trim(), `en/${id} has no definition`).toBeTruthy()
      expect(glossary.ru[id]?.definition.trim(), `ru/${id} has no definition`).toBeTruthy()
    }
  })

  test('keeps the same term ids in both locales', () => {
    expect(Object.keys(glossary.ru).sort()).toEqual(Object.keys(glossary.en).sort())
  })

  test('keeps untranslatable terms in English in the Russian glossary', () => {
    expect(glossary.ru.embeddings.term).toBe('Embeddings')
    expect(glossary.ru.mcp.term).toBe('MCP')
  })

  test('definitions do not merely repeat the term', () => {
    for (const locale of ['en', 'ru'] as const) {
      for (const id of termIds) {
        const { term, definition } = glossary[locale][id]
        expect(definition.length, `${locale}/${id} definition is too short`).toBeGreaterThan(
          term.length + 20,
        )
      }
    }
  })
})
