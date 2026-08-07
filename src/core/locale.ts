export type Locale = 'en' | 'ru'

export const LOCALES: readonly Locale[] = ['en', 'ru'] as const
export const DEFAULT_LOCALE: Locale = 'en'

const STORAGE_KEY = 'afb:locale'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function storedLocale(storage: Storage): Locale | null {
  const raw = storage.getItem(STORAGE_KEY)
  return raw !== null && isLocale(raw) ? raw : null
}

export function rememberLocale(storage: Storage, locale: Locale): void {
  storage.setItem(STORAGE_KEY, locale)
}

export function preferredLocale(
  stored: Locale | null,
  navigatorLanguages: readonly string[],
): Locale {
  if (stored !== null) return stored

  for (const language of navigatorLanguages) {
    const subtag = language.toLowerCase().split('-')[0]
    if (isLocale(subtag)) return subtag
  }

  return DEFAULT_LOCALE
}
