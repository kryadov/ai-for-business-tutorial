// Pure scoring and tallying for the final exam. Mirrors src/core/quiz.ts on
// purpose: the exam is the same kind of product as a section quiz, just built
// over topics instead of section questions, and offered in two modes instead
// of one. No React, no Astro, no localized text — see AGENTS.md.

export interface ExamTopic {
  readonly id: string
  readonly testOptionCount: number
  readonly correct: readonly number[]
}

// Cards mode has no right answer to check against — the reader self-reports.
export type CardMark = 'knew' | 'did-not'

export function isTestCorrect(topic: ExamTopic, selected: readonly number[]): boolean {
  const chosen = new Set(selected)
  const expected = new Set(topic.correct)
  if (chosen.size !== expected.size) return false
  for (const option of expected) if (!chosen.has(option)) return false
  return true
}

export function scoreTest(
  topics: readonly ExamTopic[],
  answers: readonly (readonly number[])[],
): { score: number; total: number } {
  let score = 0
  topics.forEach((topic, index) => {
    if (isTestCorrect(topic, answers[index] ?? [])) score += 1
  })
  return { score, total: topics.length }
}

export function scoreCards(
  topics: readonly ExamTopic[],
  marks: readonly CardMark[],
): { score: number; total: number } {
  let score = 0
  topics.forEach((_, index) => {
    if (marks[index] === 'knew') score += 1
  })
  return { score, total: topics.length }
}

// The point of cards mode: name the topics the reader should reread. Only
// topics explicitly marked "did-not" are listed — an unanswered topic (a run
// abandoned partway through) is not claimed as "known" or "missed", it is
// simply absent from both counts and this list.
export function missedCardTopics(
  topics: readonly ExamTopic[],
  marks: readonly CardMark[],
): readonly string[] {
  return topics.filter((_, index) => marks[index] === 'did-not').map((topic) => topic.id)
}
