import type { Locale } from '../core/locale'
import type { UiStringKey, UiStrings } from './ui-strings.types'
import { en } from './ui-strings.en'
import { ru } from './ui-strings.ru'

export type { UiStringKey, UiStrings }

export const uiStrings: Record<Locale, UiStrings> = { en, ru }

export function t(locale: Locale, key: UiStringKey): string {
  return uiStrings[locale][key]
}
