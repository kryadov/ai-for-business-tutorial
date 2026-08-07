export interface Question {
  readonly id: string
  readonly optionCount: number
  readonly correct: readonly number[]
}

export interface Quiz {
  readonly sectionId: string
  readonly questions: readonly Question[]
}

export function isCorrect(question: Question, selected: readonly number[]): boolean {
  const chosen = new Set(selected)
  const expected = new Set(question.correct)
  if (chosen.size !== expected.size) return false
  for (const option of expected) if (!chosen.has(option)) return false
  return true
}

export function scoreQuiz(
  quiz: Quiz,
  answers: readonly (readonly number[])[],
): { score: number; total: number } {
  let score = 0
  quiz.questions.forEach((question, index) => {
    if (isCorrect(question, answers[index] ?? [])) score += 1
  })
  return { score, total: quiz.questions.length }
}
