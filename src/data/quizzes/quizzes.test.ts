import { describe, expect, test } from 'vitest'
import { quizzes } from './index'
import { quizText } from './text'

const LOCALES = ['en', 'ru'] as const

describe('quiz data integrity', () => {
  test('every question has at least two options', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        expect(question.optionCount, `${question.id}`).toBeGreaterThanOrEqual(2)
      }
    }
  })

  test('every correct index is inside the option range', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const index of question.correct) {
          expect(index, `${question.id}`).toBeLessThan(question.optionCount)
          expect(index, `${question.id}`).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })

  test('every question has at least one correct answer', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        expect(question.correct.length, `${question.id}`).toBeGreaterThan(0)
      }
    }
  })

  test('question ids are unique across all quizzes', () => {
    const ids = Object.values(quizzes).flatMap((q) => q.questions.map((x) => x.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every question is written in both locales', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          expect(quizText[locale][question.id], `${locale} is missing ${question.id}`).toBeDefined()
        }
      }
    }
  })

  test('option and explanation counts match the skeleton in both locales', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          const text = quizText[locale][question.id]
          expect(text.options, `${locale}/${question.id} options`).toHaveLength(question.optionCount)
          expect(
            text.explanations,
            `${locale}/${question.id} explanations`,
          ).toHaveLength(question.optionCount)
        }
      }
    }
  })

  test('every option carries a non-trivial explanation', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          for (const [index, explanation] of quizText[locale][question.id].explanations.entries()) {
            expect(
              explanation.trim().length,
              `${locale}/${question.id} option ${index} has a stub explanation`,
            ).toBeGreaterThan(40)
          }
        }
      }
    }
  })
})
