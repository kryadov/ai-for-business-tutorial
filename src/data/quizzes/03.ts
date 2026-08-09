import type { Quiz } from '../../core/quiz'

export const quiz03: Quiz = {
  sectionId: 'llm-limits',
  questions: [
    { id: '03-token-billing', optionCount: 4, correct: [1] },
    { id: '03-context-window-not-knowledge', optionCount: 4, correct: [2] },
    { id: '03-hallucination-not-a-bug', optionCount: 4, correct: [3] },
    { id: '03-model-no-domain-expertise', optionCount: 4, correct: [0] },
    { id: '03-review-cost-of-being-wrong', optionCount: 4, correct: [1] },
  ],
} as const
