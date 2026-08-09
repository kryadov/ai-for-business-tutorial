import type { Quiz } from '../../core/quiz'
import { quiz01 } from './01'
import { quiz02 } from './02'
import { quiz03 } from './03'
import { quiz04 } from './04'
import { quiz05 } from './05'
import { quiz06 } from './06'
import { quiz07 } from './07'
import { quiz08 } from './08'
import { quiz09 } from './09'
import { quiz10 } from './10'
import { quiz11 } from './11'

export const quizzes: Record<string, Quiz> = {
  landscape: quiz01,
  'business-lens': quiz02,
  'llm-limits': quiz03,
  anatomy: quiz04,
  'solution-classes': quiz05,
  catalogue: quiz06,
  security: quiz07,
  economics: quiz08,
  discovery: quiz09,
  framework: quiz10,
  myths: quiz11,
}

export function quizFor(sectionId: string): Quiz | undefined {
  return quizzes[sectionId]
}
