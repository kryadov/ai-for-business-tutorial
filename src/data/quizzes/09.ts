import type { Quiz } from '../../core/quiz'

export const quiz09: Quiz = {
  sectionId: 'discovery',
  questions: [
    { id: '09-success-with-a-metric', optionCount: 4, correct: [2] },
    { id: '09-slow-versus-manual', optionCount: 4, correct: [1] },
    { id: '09-documents-or-database-discovery', optionCount: 4, correct: [3] },
    { id: '09-tidy-process-versus-last-tuesday', optionCount: 4, correct: [0] },
    { id: '09-no-named-owner', optionCount: 4, correct: [1] },
  ],
} as const
