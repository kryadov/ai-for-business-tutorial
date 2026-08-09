// @vitest-environment jsdom
import { describe, expect, test, vi } from 'vitest'
import { initialTocOpen, rememberTocOpenSafely, storedTocOpen, wireTocToggle } from './toc'

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

// A real <details> element: jsdom queues its `toggle` event as an async
// task on every add/remove of the `open` attribute, exactly per the HTML
// spec, so this exercises the same timing that broke the naive call site.
function waitForQueuedToggle(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('wireTocToggle', () => {
  test('a narrow-viewport first visit with no stored preference does not fabricate a "closed" choice', async () => {
    const storage = new MemoryStorage()
    const details = document.createElement('details')
    document.body.append(details)

    wireTocToggle(details, storage, /* isNarrowViewport */ true)

    expect(details.open).toBe(false)
    await waitForQueuedToggle()

    // The programmatic sync fired a toggle event asynchronously. It must
    // not have been mistaken for a reader's choice.
    expect(storedTocOpen(storage)).toBeNull()
  })

  test('a wide-viewport first visit with no stored preference does not fabricate an "open" choice', async () => {
    const storage = new MemoryStorage()
    const details = document.createElement('details')
    document.body.append(details)

    wireTocToggle(details, storage, /* isNarrowViewport */ false)

    expect(details.open).toBe(true)
    await waitForQueuedToggle()

    expect(storedTocOpen(storage)).toBeNull()
  })

  test('a genuine reader toggle after the initial sync is remembered', async () => {
    const storage = new MemoryStorage()
    const details = document.createElement('details')
    document.body.append(details)

    wireTocToggle(details, storage, /* isNarrowViewport */ true)
    await waitForQueuedToggle()
    expect(storedTocOpen(storage)).toBeNull()

    details.open = true
    await waitForQueuedToggle()

    expect(storedTocOpen(storage)).toBe(true)
  })

  test('applying a stored preference does not re-queue a synthetic write to storage', async () => {
    const storage = new MemoryStorage()
    rememberTocOpenSafely(storage, false)
    const setItem = vi.spyOn(storage, 'setItem')
    const details = document.createElement('details')
    details.open = true
    document.body.append(details)

    wireTocToggle(details, storage, /* isNarrowViewport */ false)

    expect(details.open).toBe(false)
    await waitForQueuedToggle()

    expect(setItem).not.toHaveBeenCalled()
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
