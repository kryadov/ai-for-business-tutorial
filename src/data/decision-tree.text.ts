import type { Locale } from '../core/locale'
import type { DecisionTreeText } from './decision-tree.text.types'
import { en } from './decision-tree.text.en'
import { ru } from './decision-tree.text.ru'

export type {
  DecisionTreeText,
  DecisionQuestionText,
  DecisionLeafText,
  DecisionScenarioText,
} from './decision-tree.text.types'

export const decisionTreeText: Record<Locale, DecisionTreeText> = { en, ru }
