import type { ExamTopic } from '../core/exam'

// The thirteen topics of the final exam: the brief's original ten, plus three
// added by later material. Order here is the order the reader sees them in
// either mode. This file owns the answer key for both locales — see
// AGENTS.md's "shared structure, native text" rule. Per-locale wording lives
// in exam.text.en.ts / exam.text.ru.ts, keyed by these same ids.
export type TopicId =
  | 'chatgpt-vs-gpt'
  | 'model-vs-product'
  | 'what-rag-is'
  | 'when-an-agent'
  | 'what-mcp-is'
  | 'api-or-open-source'
  | 'data-for-a-project'
  | 'estimating-roi'
  | 'questions-before-tech'
  | 'class-for-a-problem'
  | 'rag-versus-text2sql'
  | 'a2a-versus-mcp'
  | 'guardrails-not-later'

export const topicIds: readonly TopicId[] = [
  'chatgpt-vs-gpt',
  'model-vs-product',
  'what-rag-is',
  'when-an-agent',
  'what-mcp-is',
  'api-or-open-source',
  'data-for-a-project',
  'estimating-roi',
  'questions-before-tech',
  'class-for-a-problem',
  'rag-versus-text2sql',
  'a2a-versus-mcp',
  'guardrails-not-later',
] as const

// The correct index is deliberately not the same position twice in a row —
// see src/data/quizzes/answer-tell.test.ts, extended to cover this bank, for
// why that matters.
export const examTopics: readonly ExamTopic[] = [
  { id: 'chatgpt-vs-gpt', testOptionCount: 4, correct: [1] },
  { id: 'model-vs-product', testOptionCount: 4, correct: [2] },
  { id: 'what-rag-is', testOptionCount: 4, correct: [0] },
  { id: 'when-an-agent', testOptionCount: 4, correct: [3] },
  { id: 'what-mcp-is', testOptionCount: 4, correct: [1] },
  { id: 'api-or-open-source', testOptionCount: 4, correct: [2] },
  { id: 'data-for-a-project', testOptionCount: 4, correct: [0] },
  { id: 'estimating-roi', testOptionCount: 4, correct: [3] },
  { id: 'questions-before-tech', testOptionCount: 4, correct: [1] },
  { id: 'class-for-a-problem', testOptionCount: 4, correct: [2] },
  { id: 'rag-versus-text2sql', testOptionCount: 4, correct: [0] },
  { id: 'a2a-versus-mcp', testOptionCount: 4, correct: [3] },
  { id: 'guardrails-not-later', testOptionCount: 4, correct: [1] },
] as const

export function examTopicById(id: string): ExamTopic | undefined {
  return examTopics.find((topic) => topic.id === id)
}
