import { describe, expect, test } from 'vitest'
import { quizzes } from './index'
import { quizText } from './text'
import { examTopics } from '../exam'
import { examText } from '../exam.text'

const LOCALES = ['en', 'ru'] as const
// The exam bank is measured alongside the section quizzes below under this
// synthetic id — same shape (id, optionCount, correct), same rules apply.
const EXAM_ID = 'exam'

// The quiz island renders options in declared order and never shuffles them.
// So any property that correlates with correctness is a free pass: a reader who
// has not opened the section can score by spotting it. Length is the one that
// happens by itself, because a writer states the right answer carefully and the
// wrong ones briefly.
//
// This is not a style rule. A quiz that can be beaten without reading teaches
// nothing and tells the reader they learned something, which is worse than
// having no quiz at all.

interface Measured {
  readonly quizId: string
  readonly questionId: string
  readonly locale: string
  readonly lengths: readonly number[]
  readonly correct: readonly number[]
  readonly longestIsCorrect: boolean
  readonly margin: number
}

function measure(): Measured[] {
  const rows: Measured[] = []

  for (const [quizId, quiz] of Object.entries(quizzes)) {
    for (const question of quiz.questions) {
      for (const locale of LOCALES) {
        const text = quizText[locale][question.id]
        if (!text) continue

        const lengths = text.options.map((option) => option.length)
        const longest = Math.max(...lengths)
        const longestIndexes = lengths.flatMap((l, i) => (l === longest ? [i] : []))
        const longestIsCorrect =
          longestIndexes.length === 1 && question.correct.includes(longestIndexes[0])

        const others = lengths.filter((_, i) => !question.correct.includes(i))
        const correctLengths = lengths.filter((_, i) => question.correct.includes(i))
        const margin = Math.max(...correctLengths) - Math.max(...others)

        rows.push({
          quizId,
          questionId: question.id,
          locale,
          lengths,
          correct: question.correct,
          longestIsCorrect,
          margin,
        })
      }
    }
  }

  for (const topic of examTopics) {
    for (const locale of LOCALES) {
      const text = examText[locale][topic.id]
      if (!text) continue

      const lengths = text.testOptions.map((option) => option.length)
      const longest = Math.max(...lengths)
      const longestIndexes = lengths.flatMap((l, i) => (l === longest ? [i] : []))
      const longestIsCorrect =
        longestIndexes.length === 1 && topic.correct.includes(longestIndexes[0])

      const others = lengths.filter((_, i) => !topic.correct.includes(i))
      const correctLengths = lengths.filter((_, i) => topic.correct.includes(i))
      const margin = Math.max(...correctLengths) - Math.max(...others)

      rows.push({
        quizId: EXAM_ID,
        questionId: topic.id,
        locale,
        lengths,
        correct: topic.correct,
        longestIsCorrect,
        margin,
      })
    }
  }

  return rows
}

// A one-character difference is not a tell — nobody scans four options and picks
// the one that happens to be three characters longer. What gives the answer away
// is a visibly longer option. PERCEPTIBLE is the margin above which the eye
// starts sorting by length rather than by meaning: roughly a line of text.
const PERCEPTIBLE = 20

describe('the correct answer must not be guessable from its shape', () => {
  test('the longest option is the correct one in at most a third of questions', () => {
    const rows = measure()
    const tells = rows.filter((r) => r.longestIsCorrect && r.margin > PERCEPTIBLE)
    const share = tells.length / rows.length

    const worst = [...tells]
      .sort((a, b) => b.margin - a.margin)
      .slice(0, 5)
      .map((r) => `${r.locale}/${r.questionId} (+${r.margin} chars)`)
      .join(', ')

    expect(
      share,
      `${tells.length} of ${rows.length} questions key the longest option. ` +
        `A reader who never opened the handbook scores by picking the longest string. ` +
        `Worst offenders: ${worst}. Rebalance the options — make the distractors as ` +
        `specific as the answer rather than trimming the answer.`,
    ).toBeLessThanOrEqual(1 / 3)
  })

  test('no single question hands the answer away by a wide margin', () => {
    const rows = measure()
    const blatant = rows.filter((r) => r.longestIsCorrect && r.margin > 60)

    expect(
      blatant.map((r) => `${r.locale}/${r.questionId} (+${r.margin})`),
      'these questions key an option far longer than every distractor',
    ).toEqual([])
  })

  test('within a quiz, the correct index is not always the same', () => {
    for (const [quizId, quiz] of Object.entries(quizzes)) {
      const indexes = quiz.questions.map((q) => q.correct.join(','))
      expect(new Set(indexes).size, `${quizId} puts every answer at the same position`).toBeGreaterThan(1)
    }
  })

  // Checked against the skeleton directly (src/data/exam.ts), not the text —
  // so this holds regardless of how many of the thirteen topics have wording
  // yet.
  test('within the exam, the correct index is not always the same', () => {
    const indexes = examTopics.map((topic) => topic.correct.join(','))
    expect(new Set(indexes).size, 'the exam puts every answer at the same position').toBeGreaterThan(1)
  })
})
