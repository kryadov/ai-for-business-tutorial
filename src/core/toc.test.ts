import { describe, expect, test } from 'vitest'
import { initialTocOpen, rememberTocOpenSafely, storedTocOpen } from './toc'

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

describe('storedTocOpen', () => {
  test('returns null when nothing was stored', () => {
    expect(storedTocOpen(new MemoryStorage())).toBeNull()
  })

  test('round-trips an open preference', () => {
    const storage = new MemoryStorage()
    rememberTocOpenSafely(storage, true)
    expect(storedTocOpen(storage)).toBe(true)
  })

  test('round-trips a closed preference', () => {
    const storage = new MemoryStorage()
    rememberTocOpenSafely(storage, false)
    expect(storedTocOpen(storage)).toBe(false)
  })

  test('ignores a stored value it does not recognise', () => {
    const storage = new MemoryStorage()
    storage.setItem('afb:toc-open', 'sideways')
    expect(storedTocOpen(storage)).toBeNull()
  })

  test('treats a storage that throws as no preference', () => {
    const storage = new MemoryStorage()
    storage.getItem = () => {
      throw new Error('storage blocked (private browsing)')
    }
    expect(storedTocOpen(storage)).toBeNull()
  })
})

describe('rememberTocOpenSafely', () => {
  test('swallows a storage that throws so the toggle is never blocked', () => {
    const storage = new MemoryStorage()
    storage.setItem = () => {
      throw new Error('storage blocked (private browsing)')
    }
    expect(() => rememberTocOpenSafely(storage, true)).not.toThrow()
  })
})

describe('initialTocOpen', () => {
  test('an explicit stored choice always wins over the viewport', () => {
    expect(initialTocOpen(true, true)).toBe(true)
    expect(initialTocOpen(false, false)).toBe(false)
  })

  test('with no preference, a narrow viewport starts collapsed', () => {
    expect(initialTocOpen(null, true)).toBe(false)
  })

  test('with no preference, a wide viewport starts open', () => {
    expect(initialTocOpen(null, false)).toBe(true)
  })
})
