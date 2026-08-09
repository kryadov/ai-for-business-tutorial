import type { Quiz } from '../../core/quiz'

export const quiz10: Quiz = {
  sectionId: 'framework',
  questions: [
    { id: '10-documents-or-database', optionCount: 4, correct: [1] },
    { id: '10-person-or-system', optionCount: 4, correct: [2] },
    { id: '10-fixed-steps-or-varying-path', optionCount: 4, correct: [0] },
    { id: '10-why-not-the-other-four', optionCount: 4, correct: [3] },
    { id: '10-correct-class-wasted-quarter', optionCount: 4, correct: [2] },
  ],
} as const
