import type { Quiz } from '../../core/quiz'

export const quiz06: Quiz = {
  sectionId: 'catalogue',
  questions: [
    { id: '06-support-first-project', optionCount: 4, correct: [1] },
    { id: '06-crm-twin-question', optionCount: 4, correct: [2] },
    { id: '06-legal-extraction-order', optionCount: 4, correct: [3] },
    { id: '06-access-control-prerequisite', optionCount: 4, correct: [0] },
    { id: '06-analytics-review-step', optionCount: 4, correct: [2] },
  ],
} as const
