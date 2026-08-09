import type { Quiz } from '../../core/quiz'

export const quiz08: Quiz = {
  sectionId: 'economics',
  questions: [
    { id: '08-both-directions-billed', optionCount: 4, correct: [2] },
    { id: '08-demo-multiplier', optionCount: 4, correct: [0] },
    { id: '08-output-tokens-pricier', optionCount: 4, correct: [3] },
    { id: '08-build-vs-run', optionCount: 4, correct: [1] },
    { id: '08-fixed-floor-vs-per-token', optionCount: 4, correct: [2] },
  ],
} as const
