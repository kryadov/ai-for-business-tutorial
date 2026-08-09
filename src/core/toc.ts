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

// A <details> element, or anything shaped enough like one to be driven by
// this function and stood in for by a test double.
export interface TocDetails {
  open: boolean
  addEventListener(type: 'toggle', listener: () => void): void
}

// Syncs a <details> element to the reader's remembered (or default) open
// state, then keeps storage in sync with every later toggle.
//
// Setting `.open` only queues a `toggle` event when it actually flips the
// value, and per the HTML spec that event fires asynchronously -- after
// this function has already returned and attached the listener below. Left
// alone, that synthetic event is indistinguishable from a reader's click:
// it would write the viewport default to storage as though the reader had
// chosen it, and that fabricated preference would then outrank the
// viewport default on every future visit. This suppresses exactly the one
// event the assignment below can queue; every toggle after that is a
// genuine reader action.
export function wireTocToggle(
  details: TocDetails,
  storage: Storage,
  isNarrowViewport: boolean,
): void {
  const initial = initialTocOpen(storedTocOpen(storage), isNarrowViewport)
  let suppressNextToggle = details.open !== initial
  details.open = initial

  details.addEventListener('toggle', () => {
    if (suppressNextToggle) {
      suppressNextToggle = false
      return
    }
    rememberTocOpenSafely(storage, details.open)
  })
}
