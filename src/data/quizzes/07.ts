import type { Quiz } from '../../core/quiz'

export const quiz07: Quiz = {
  sectionId: 'security',
  questions: [
    { id: '07-shared-folder-rag', optionCount: 4, correct: [2] },
    { id: '07-system-prompt-defense', optionCount: 4, correct: [1] },
    { id: '07-agent-refund-authority', optionCount: 4, correct: [0] },
    { id: '07-one-error-rate', optionCount: 4, correct: [3] },
    { id: '07-guardrails-later', optionCount: 4, correct: [2] },
  ],
} as const
