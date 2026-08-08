import { describe, expect, test } from 'vitest'
import { isLocale, preferredLocale, rememberLocale, rememberLocaleSafely, storedLocale } from './locale'

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  [key: string]: unknown
  get length() { return this.map.size }
  clear() { this.map.clear() }
  getItem(k: string) { return this.map.get(k) ?? null }
  key(i: number) { return [...this.map.keys()][i] ?? null }
  removeItem(k: string) { this.map.delete(k) }
  setItem(k: string, v: string) { this.map.set(k, v) }
}

describe('isLocale', () => {
  test('accepts the two supported locales', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('ru')).toBe(true)
  })

  test('rejects anything else', () => {
    expect(isLocale('de')).toBe(false)
    expect(isLocale('')).toBe(false)
  })
})

describe('storedLocale', () => {
  test('returns null when nothing was stored', () => {
    expect(storedLocale(new MemoryStorage())).toBeNull()
  })

  test('round-trips a remembered choice', () => {
    const storage = new MemoryStorage()
    rememberLocale(storage, 'ru')
    expect(storedLocale(storage)).toBe('ru')
  })

  test('ignores a stored value that is not a supported locale', () => {
    const storage = new MemoryStorage()
    storage.setItem('afb:locale', 'klingon')
    expect(storedLocale(storage)).toBeNull()
  })
})

describe('rememberLocaleSafely', () => {
  test('stores the target locale, the one the reader clicked, not the current one', () => {
    const storage = new MemoryStorage()
    rememberLocaleSafely(storage, 'ru')
    expect(storedLocale(storage)).toBe('ru')

    rememberLocaleSafely(storage, 'en')
    expect(storedLocale(storage)).toBe('en')
  })

  test('swallows a storage that throws so navigation is never blocked', () => {
    const storage = new MemoryStorage()
    storage.setItem = () => {
      throw new Error('storage blocked (private browsing)')
    }

    expect(() => rememberLocaleSafely(storage, 'ru')).not.toThrow()
  })
})

describe('preferredLocale', () => {
  test('an explicit choice always wins over the browser', () => {
    expect(preferredLocale('en', ['ru-RU', 'ru'])).toBe('en')
    expect(preferredLocale('ru', ['en-US'])).toBe('ru')
  })

  test('falls back to Russian when the browser asks for it first', () => {
    expect(preferredLocale(null, ['ru-RU', 'en-US'])).toBe('ru')
  })

  test('falls back to English for every other browser language', () => {
    expect(preferredLocale(null, ['de-DE'])).toBe('en')
    expect(preferredLocale(null, [])).toBe('en')
  })

  test('matches on the language subtag, not the exact string', () => {
    expect(preferredLocale(null, ['ru-BY'])).toBe('ru')
  })
})
