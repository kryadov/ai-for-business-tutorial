import type { Quiz } from '../../core/quiz'

export const quiz01: Quiz = {
  sectionId: 'landscape',
  questions: [
    { id: '01-chatgpt-api-category-error', optionCount: 4, correct: [0] },
    { id: '01-building-on-claude', optionCount: 4, correct: [1] },
    { id: '01-platform-not-vendor', optionCount: 4, correct: [2] },
    { id: '01-llama-not-a-competitor', optionCount: 4, correct: [3] },
    { id: '01-placing-a-new-name', optionCount: 4, correct: [1] },
  ],
} as const
