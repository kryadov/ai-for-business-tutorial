import type { Quiz } from '../../core/quiz'

export const quiz02: Quiz = {
  sectionId: 'business-lens',
  questions: [
    { id: '02-chatbot-or-outcome', optionCount: 4, correct: [1] },
    { id: '02-real-outcome-or-guess', optionCount: 4, correct: [0] },
    { id: '02-adjective-or-criterion', optionCount: 4, correct: [3] },
    { id: '02-walk-the-example', optionCount: 4, correct: [2] },
    { id: '02-who-feels-it', optionCount: 4, correct: [1] },
  ],
} as const
