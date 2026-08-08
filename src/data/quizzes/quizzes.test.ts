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

  // The bilingual contract is "wording is per-locale, which option is right is not":
  // src/data/quizzes/05.ts is the single shared answer key for both locales. This guards
  // against a translated rewrite reordering a question's options (or the answer key
  // drifting from a locale's text) without moving the "this is correct" explanation along
  // with it — every prior test here stays green even when that happens, because they only
  // check counts and lengths, never which index reads as the affirmation.
  const AFFIRMATION: Record<(typeof LOCALES)[number], string> = {
    en: 'Correct.',
    ru: 'Верно.',
  }

  test('the explanation at the correct index affirms, in both locales', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          const { explanations } = quizText[locale][question.id]
          for (const index of question.correct) {
            expect(
              explanations[index],
              `${locale}/${question.id} option ${index} is marked correct but its explanation does not affirm`,
            ).toMatch(new RegExp(`^${AFFIRMATION[locale]}`))
          }
        }
      }
    }
  })

  test('no explanation at a wrong index affirms, in either locale', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          const { explanations } = quizText[locale][question.id]
          explanations.forEach((explanation, index) => {
            if (question.correct.includes(index)) return
            expect(
              explanation.startsWith(AFFIRMATION[locale]),
              `${locale}/${question.id} option ${index} is marked wrong but its explanation affirms`,
            ).toBe(false)
          })
        }
      }
    }
  })
})
