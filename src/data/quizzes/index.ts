import type { Quiz } from '../../core/quiz'
import { quiz05 } from './05'

export const quizzes: Record<string, Quiz> = {
  'solution-classes': quiz05,
}

export function quizFor(sectionId: string): Quiz | undefined {
  return quizzes[sectionId]
}
