import type { Locale } from '../core/locale'
import type { TopicText } from './exam.text.types'
import { en } from './exam.text.en'
import { ru } from './exam.text.ru'

export type { TopicText }

export const examText: Record<Locale, Record<string, TopicText>> = { en, ru }
