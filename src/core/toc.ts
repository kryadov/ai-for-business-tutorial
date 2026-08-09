const STORAGE_KEY = 'afb:toc-open'

// Reads the reader's remembered choice for the table of contents' collapsed
// state. Returns null when nothing was stored yet, or storage is blocked, so
// callers can tell "no preference" apart from an explicit "closed".
export function storedTocOpen(storage: Storage): boolean | null {
  let raw: string | null = null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return null
  }

  if (raw === 'open') return true
  if (raw === 'closed') return false
  return null
}

// Wraps the write so a blocked or full storage (private browsing, disabled
// cookies) cannot break the <details> toggle that triggered it.
export function rememberTocOpenSafely(storage: Storage, open: boolean): void {
  try {
    storage.setItem(STORAGE_KEY, open ? 'open' : 'closed')
  } catch {
    // Ignored on purpose: toggling the table of contents must still work.
  }
}

// An explicit stored preference always outranks the viewport default. With
// no preference yet, a narrow viewport starts collapsed -- that's where the
// list's height actually costs screen space.
export function initialTocOpen(stored: boolean | null, isNarrowViewport: boolean): boolean {
  if (stored !== null) return stored
  return !isNarrowViewport
}
