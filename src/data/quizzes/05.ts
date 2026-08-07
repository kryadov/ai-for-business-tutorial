import type { Quiz } from '../../core/quiz'

export const quiz05: Quiz = {
  sectionId: 'solution-classes',
  questions: [
    { id: '05-documents-or-database', optionCount: 4, correct: [1] },
    { id: '05-rag-does-not-train', optionCount: 4, correct: [2] },
    { id: '05-when-an-agent-earns-its-keep', optionCount: 4, correct: [3] },
    { id: '05-assistant-versus-agent', optionCount: 4, correct: [0] },
    { id: '05-multi-agent-overkill', optionCount: 4, correct: [2] },
  ],
} as const
