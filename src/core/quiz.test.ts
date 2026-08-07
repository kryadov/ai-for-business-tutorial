import { describe, expect, test } from 'vitest'
import { isCorrect, scoreQuiz, type Question, type Quiz } from './quiz'

const single: Question = { id: 'q1', optionCount: 4, correct: [2] }
const multi: Question = { id: 'q2', optionCount: 4, correct: [0, 3] }

describe('isCorrect', () => {
  test('accepts the right single answer', () => {
    expect(isCorrect(single, [2])).toBe(true)
  })

  test('rejects a wrong single answer', () => {
    expect(isCorrect(single, [1])).toBe(false)
  })

  test('rejects an empty answer', () => {
    expect(isCorrect(single, [])).toBe(false)
  })

  test('accepts a complete multi-answer in any order', () => {
    expect(isCorrect(multi, [3, 0])).toBe(true)
  })

  test('rejects a partially correct multi-answer', () => {
    expect(isCorrect(multi, [0])).toBe(false)
  })

  test('rejects a multi-answer with an extra wrong option', () => {
    expect(isCorrect(multi, [0, 3, 1])).toBe(false)
  })

  test('ignores a duplicated selection', () => {
    expect(isCorrect(multi, [0, 3, 3])).toBe(true)
  })
})

describe('scoreQuiz', () => {
  const quiz: Quiz = { sectionId: 'solution-classes', questions: [single, multi] }

  test('counts only fully correct questions', () => {
    expect(scoreQuiz(quiz, [[2], [0]])).toEqual({ score: 1, total: 2 })
  })

  test('scores a perfect run', () => {
    expect(scoreQuiz(quiz, [[2], [0, 3]])).toEqual({ score: 2, total: 2 })
  })

  test('treats missing answers as wrong', () => {
    expect(scoreQuiz(quiz, [[2]])).toEqual({ score: 1, total: 2 })
  })
})
