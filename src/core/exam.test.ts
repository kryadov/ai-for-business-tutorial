import { describe, expect, test } from 'vitest'
import {
  isTestCorrect,
  missedCardTopics,
  scoreCards,
  scoreTest,
  type CardMark,
  type ExamTopic,
} from './exam'

const topics: readonly ExamTopic[] = [
  { id: 'chatgpt-vs-gpt', testOptionCount: 4, correct: [1] },
  { id: 'model-vs-product', testOptionCount: 4, correct: [2] },
  { id: 'what-rag-is', testOptionCount: 4, correct: [0] },
]

describe('isTestCorrect', () => {
  test('accepts the right single answer', () => {
    expect(isTestCorrect(topics[0], [1])).toBe(true)
  })

  test('rejects a wrong single answer', () => {
    expect(isTestCorrect(topics[0], [0])).toBe(false)
  })

  test('rejects an empty answer', () => {
    expect(isTestCorrect(topics[0], [])).toBe(false)
  })
})

describe('scoreTest', () => {
  test('counts only fully correct topics', () => {
    expect(scoreTest(topics, [[1], [2], [3]])).toEqual({ score: 2, total: 3 })
  })

  test('scores a perfect run', () => {
    expect(scoreTest(topics, [[1], [2], [0]])).toEqual({ score: 3, total: 3 })
  })

  test('treats a partial run as wrong for every unanswered topic', () => {
    // The reader answered only the first topic and stopped there — the total
    // is still the full exam, same as a section quiz scored mid-run.
    expect(scoreTest(topics, [[1]])).toEqual({ score: 1, total: 3 })
  })

  test('a retry starts from a clean slate independent of the previous run', () => {
    // Index 3 is wrong for every topic in this fixture (their correct
    // answers are 1, 2 and 0), so this is a guaranteed zero.
    const firstRun = scoreTest(topics, [[3], [3], [3]])
    const secondRun = scoreTest(topics, [[1], [2], [0]])

    expect(firstRun).toEqual({ score: 0, total: 3 })
    expect(secondRun).toEqual({ score: 3, total: 3 })
  })
})

describe('scoreCards', () => {
  const marks: CardMark[] = ['knew', 'did-not', 'knew']

  test('counts only topics marked knew', () => {
    expect(scoreCards(topics, marks)).toEqual({ score: 2, total: 3 })
  })

  test('treats a partial run as not-knew for every unmarked topic', () => {
    expect(scoreCards(topics, ['knew'])).toEqual({ score: 1, total: 3 })
  })

  test('a retry starts from a clean slate independent of the previous run', () => {
    const firstRun = scoreCards(topics, ['did-not', 'did-not', 'did-not'])
    const secondRun = scoreCards(topics, ['knew', 'knew', 'knew'])

    expect(firstRun).toEqual({ score: 0, total: 3 })
    expect(secondRun).toEqual({ score: 3, total: 3 })
  })
})

describe('missedCardTopics', () => {
  test('names only the topics marked did-not', () => {
    const marks: CardMark[] = ['knew', 'did-not', 'did-not']
    expect(missedCardTopics(topics, marks)).toEqual(['model-vs-product', 'what-rag-is'])
  })

  test('returns nothing when every marked topic was known', () => {
    const marks: CardMark[] = ['knew', 'knew', 'knew']
    expect(missedCardTopics(topics, marks)).toEqual([])
  })

  test('an unanswered topic from a partial run is not counted as missed', () => {
    const marks: CardMark[] = ['did-not']
    expect(missedCardTopics(topics, marks)).toEqual(['chatgpt-vs-gpt'])
  })
})
