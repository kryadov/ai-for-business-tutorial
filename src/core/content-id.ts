import { isLocale, type Locale } from './locale'

export interface ParsedEntryId {
  readonly locale: Locale
  readonly slug: string
}

export function parseEntryId(id: string): ParsedEntryId | null {
  const parts = id.split('/')
  if (parts.length !== 2) return null

  const [locale, slug] = parts
  if (!isLocale(locale) || slug === '') return null

  return { locale, slug }
}
