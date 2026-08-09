import type { Quiz } from '../../core/quiz'

export const quiz11: Quiz = {
  sectionId: 'myths',
  questions: [
    { id: '11-smartest-model-request', optionCount: 4, correct: [1] },
    { id: '11-shrink-team-after-agents', optionCount: 4, correct: [3] },
    { id: '11-self-host-cheaper-claim', optionCount: 4, correct: [0] },
    { id: '11-model-first-question', optionCount: 4, correct: [2] },
    { id: '11-guardrails-later-request', optionCount: 4, correct: [1] },
  ],
} as const
