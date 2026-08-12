import { describe, expect, test } from 'vitest'
import { examTopics } from './exam'
import { examText } from './exam.text'

const LOCALES = ['en', 'ru'] as const

// Mirrors src/data/quizzes/quizzes.test.ts. As of this phase only the
// 'chatgpt-vs-gpt' topic has text in both locales — it is the worked example
// for the writers filling in the other twelve (see exam.text.en.ts /
// exam.text.ru.ts). The two tests below that require every topic to be
// *present* are therefore expected to fail until that text lands; every other
// test here already tolerates a missing topic (`if (!text) continue`) and
// passes today, so it stays meaningful once the bank is complete.
describe('exam data integrity', () => {
  test('every topic has at least two test options', () => {
    for (const topic of examTopics) {
      expect(topic.testOptionCount, topic.id).toBeGreaterThanOrEqual(2)
    }
  })

  test('every correct index is inside the option range', () => {
    for (const topic of examTopics) {
      for (const index of topic.correct) {
        expect(index, topic.id).toBeLessThan(topic.testOptionCount)
        expect(index, topic.id).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('every topic has at least one correct answer', () => {
    for (const topic of examTopics) {
      expect(topic.correct.length, topic.id).toBeGreaterThan(0)
    }
  })

  test('topic ids are unique', () => {
    const ids = examTopics.map((topic) => topic.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every topic is written in both locales', () => {
    for (const topic of examTopics) {
      for (const locale of LOCALES) {
        expect(examText[locale][topic.id], `${locale} is missing ${topic.id}`).toBeDefined()
      }
    }
  })

  test('option and explanation counts match the skeleton in both locales', () => {
    for (const topic of examTopics) {
      for (const locale of LOCALES) {
        const text = examText[locale][topic.id]
        expect(text, `${locale}/${topic.id}`).toBeDefined()
        expect(text.testOptions, `${locale}/${topic.id} options`).toHaveLength(topic.testOptionCount)
        expect(
          text.testExplanations,
          `${locale}/${topic.id} explanations`,
        ).toHaveLength(topic.testOptionCount)
      }
    }
  })

  test('every option carries a non-trivial explanation', () => {
    for (const topic of examTopics) {
      for (const locale of LOCALES) {
        const text = examText[locale][topic.id]
        if (!text) continue
        for (const [index, explanation] of text.testExplanations.entries()) {
          expect(
            explanation.trim().length,
            `${locale}/${topic.id} option ${index} has a stub explanation`,
          ).toBeGreaterThan(40)
        }
      }
    }
  })

  // Same bilingual contract as the quiz bank: src/data/exam.ts is the single
  // shared answer key, wording is per locale. See the comment in
  // src/data/quizzes/quizzes.test.ts for the full rationale.
  const AFFIRMATION: Record<(typeof LOCALES)[number], string> = {
    en: 'Correct.',
    ru: 'Верно.',
  }

  test('the explanation at the correct index affirms, in both locales', () => {
    for (const topic of examTopics) {
      for (const locale of LOCALES) {
        const text = examText[locale][topic.id]
        if (!text) continue
        for (const index of topic.correct) {
          expect(
            text.testExplanations[index],
            `${locale}/${topic.id} option ${index} is marked correct but its explanation does not affirm`,
          ).toMatch(new RegExp(`^${AFFIRMATION[locale].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
        }
      }
    }
  })

  test('no explanation at a wrong index affirms, in either locale', () => {
    for (const topic of examTopics) {
      for (const locale of LOCALES) {
        const text = examText[locale][topic.id]
        if (!text) continue
        text.testExplanations.forEach((explanation, index) => {
          if (topic.correct.includes(index)) return
          expect(
            explanation.startsWith(AFFIRMATION[locale]),
            `${locale}/${topic.id} option ${index} is marked wrong but its explanation affirms`,
          ).toBe(false)
        })
      }
    }
  })

  test('cardQuestion and cardAnswer are non-empty in both locales', () => {
    for (const topic of examTopics) {
      for (const locale of LOCALES) {
        const text = examText[locale][topic.id]
        if (!text) continue
        expect(text.cardQuestion.trim().length, `${locale}/${topic.id} cardQuestion`).toBeGreaterThan(0)
        expect(text.cardAnswer.trim().length, `${locale}/${topic.id} cardAnswer`).toBeGreaterThan(0)
      }
    }
  })
})
