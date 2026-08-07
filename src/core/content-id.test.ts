import { describe, expect, test } from 'vitest'
import { parseEntryId } from './content-id'

describe('parseEntryId', () => {
  test('splits a locale-prefixed entry id', () => {
    expect(parseEntryId('en/05-solution-classes')).toEqual({
      locale: 'en',
      slug: '05-solution-classes',
    })
  })

  test('handles the other locale', () => {
    expect(parseEntryId('ru/11-myths')).toEqual({ locale: 'ru', slug: '11-myths' })
  })

  test('returns null for an id without a locale prefix', () => {
    expect(parseEntryId('05-solution-classes')).toBeNull()
  })

  test('returns null for an unsupported locale', () => {
    expect(parseEntryId('de/05-solution-classes')).toBeNull()
  })

  test('returns null for a nested path it cannot interpret', () => {
    expect(parseEntryId('en/drafts/05-solution-classes')).toBeNull()
  })
})
