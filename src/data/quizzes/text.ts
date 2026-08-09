import type { Locale } from '../../core/locale'
import type { QuestionText } from './text.types'
import { en as en05 } from './text/05.en'
import { ru as ru05 } from './text/05.ru'

export type { QuestionText }

const en: Record<string, QuestionText> = { ...en05 }
const ru: Record<string, QuestionText> = { ...ru05 }

export const quizText: Record<Locale, Record<string, QuestionText>> = { en, ru }
