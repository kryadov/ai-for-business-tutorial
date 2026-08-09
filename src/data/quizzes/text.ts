import type { Locale } from '../../core/locale'
import type { QuestionText } from './text.types'
import { en as en01 } from './text/01.en'
import { ru as ru01 } from './text/01.ru'
import { en as en02 } from './text/02.en'
import { ru as ru02 } from './text/02.ru'
import { en as en03 } from './text/03.en'
import { ru as ru03 } from './text/03.ru'
import { en as en04 } from './text/04.en'
import { ru as ru04 } from './text/04.ru'
import { en as en05 } from './text/05.en'
import { ru as ru05 } from './text/05.ru'
import { en as en06 } from './text/06.en'
import { ru as ru06 } from './text/06.ru'
import { en as en07 } from './text/07.en'
import { ru as ru07 } from './text/07.ru'
import { en as en08 } from './text/08.en'
import { ru as ru08 } from './text/08.ru'
import { en as en09 } from './text/09.en'
import { ru as ru09 } from './text/09.ru'
import { en as en10 } from './text/10.en'
import { ru as ru10 } from './text/10.ru'
import { en as en11 } from './text/11.en'
import { ru as ru11 } from './text/11.ru'

export type { QuestionText }

const en: Record<string, QuestionText> = {
  ...en01,
  ...en02,
  ...en03,
  ...en04,
  ...en05,
  ...en06,
  ...en07,
  ...en08,
  ...en09,
  ...en10,
  ...en11,
}
const ru: Record<string, QuestionText> = {
  ...ru01,
  ...ru02,
  ...ru03,
  ...ru04,
  ...ru05,
  ...ru06,
  ...ru07,
  ...ru08,
  ...ru09,
  ...ru10,
  ...ru11,
}

export const quizText: Record<Locale, Record<string, QuestionText>> = { en, ru }
