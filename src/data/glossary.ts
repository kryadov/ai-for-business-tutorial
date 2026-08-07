import type { Locale } from '../core/locale'
import type { Term, TermId } from './glossary.types'
import { en } from './glossary.en'
import { ru } from './glossary.ru'

export { termIds } from './glossary.types'
export type { Term, TermId }

export const glossary: Record<Locale, Record<TermId, Term>> = { en, ru }

export function defineTerm(locale: Locale, id: TermId): Term {
  return glossary[locale][id]
}
