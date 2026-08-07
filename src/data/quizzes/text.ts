import type { Locale } from '../../core/locale'
import type { QuestionText } from './text.types'
import { en } from './text.en'
import { ru } from './text.ru'

export type { QuestionText }

export const quizText: Record<Locale, Record<string, QuestionText>> = { en, ru }
