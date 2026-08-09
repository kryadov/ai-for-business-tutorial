import type { Quiz } from '../../core/quiz'

export const quiz04: Quiz = {
  sectionId: 'anatomy',
  questions: [
    { id: '04-embeddings-vs-knowledge-base', optionCount: 4, correct: [2] },
    { id: '04-read-versus-act', optionCount: 4, correct: [1] },
    { id: '04-mcp-or-a2a', optionCount: 4, correct: [3] },
    { id: '04-supplier-agent-handshake', optionCount: 4, correct: [0] },
    { id: '04-inflated-proposal', optionCount: 4, correct: [2] },
  ],
} as const
