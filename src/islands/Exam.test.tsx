// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { readProgress } from '../core/progress'

// The real bank has thirteen topics but only one carries text so far (the
// worked example for the next authoring phase — see src/data/exam.text.en.ts).
// The island's behaviour does not depend on how many topics are written, so
// it is tested here against a small, fully-written fixture instead of
// depending on that phase being finished.
vi.mock('../data/exam', () => ({
  examTopics: [
    { id: 'topic-a', testOptionCount: 2, correct: [0] },
    { id: 'topic-b', testOptionCount: 2, correct: [1] },
  ],
}))

vi.mock('../data/exam.text', () => ({
  examText: {
    en: {
      'topic-a': {
        testPrompt: 'Prompt A',
        testOptions: ['Right answer A', 'Wrong answer A'],
        testExplanations: ['Correct. Because A.', 'Not because A.'],
        cardQuestion: 'Open question A?',
        cardAnswer: 'Model answer for A.',
      },
      'topic-b': {
        testPrompt: 'Prompt B',
        testOptions: ['Wrong answer B', 'Right answer B'],
        testExplanations: ['Not because B.', 'Correct. Because B.'],
        cardQuestion: 'Open question B?',
        cardAnswer: 'Model answer for B.',
      },
    },
    ru: {
      'topic-a': {
        testPrompt: 'Вопрос A',
        testOptions: ['Верный ответ A', 'Неверный ответ A'],
        testExplanations: ['Верно. Потому что A.', 'Не потому что A.'],
        cardQuestion: 'Открытый вопрос A?',
        cardAnswer: 'Эталонный ответ A.',
      },
      'topic-b': {
        testPrompt: 'Вопрос B',
        testOptions: ['Неверный ответ B', 'Верный ответ B'],
        testExplanations: ['Не потому что B.', 'Верно. Потому что B.'],
        cardQuestion: 'Открытый вопрос B?',
        cardAnswer: 'Эталонный ответ B.',
      },
    },
  },
}))

const { default: Exam } = await import('./Exam')

beforeEach(() => {
  window.localStorage.clear()
})

describe('Exam island', () => {
  test('defaults to test mode, showing the first topic as a scenario question', () => {
    render(<Exam locale="en" />)
    expect(screen.getByText('Prompt A')).toBeInTheDocument()
  })

  test('switching to cards mode shows the open question instead', async () => {
    const user = userEvent.setup()
    render(<Exam locale="en" />)

    await user.click(screen.getByRole('tab', { name: /cards/i }))

    expect(screen.getByText('Open question A?')).toBeInTheDocument()
    expect(screen.queryByText('Prompt A')).not.toBeInTheDocument()
  })

  test('switching back to test mode is always available and resets the run', async () => {
    const user = userEvent.setup()
    render(<Exam locale="en" />)

    await user.click(screen.getByRole('tab', { name: /cards/i }))
    await user.click(screen.getByRole('tab', { name: /^test$/i }))

    expect(screen.getByText('Prompt A')).toBeInTheDocument()
  })

  test('cards mode hides the model answer until revealed', async () => {
    const user = userEvent.setup()
    render(<Exam locale="en" />)
    await user.click(screen.getByRole('tab', { name: /cards/i }))

    expect(screen.queryByText('Model answer for A.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show a model answer/i }))

    expect(screen.getByText('Model answer for A.')).toBeInTheDocument()
  })

  test('cards mode tallies the result and names the topics marked "did not"', async () => {
    const user = userEvent.setup()
    render(<Exam locale="en" />)
    await user.click(screen.getByRole('tab', { name: /cards/i }))

    // Topic A: reveal, then say "I did not" know it.
    await user.click(screen.getByRole('button', { name: /show a model answer/i }))
    await user.click(screen.getByRole('button', { name: /^i did not$/i }))

    // Topic B: reveal, then say "I knew this".
    await user.click(screen.getByRole('button', { name: /show a model answer/i }))
    await user.click(screen.getByRole('button', { name: /^i knew this$/i }))

    expect(screen.getByText('Score: 1 / 2')).toBeInTheDocument()
    expect(screen.getByText('Open question A?')).toBeInTheDocument()
    expect(screen.queryByText('Open question B?')).not.toBeInTheDocument()

    const stored = readProgress(window.localStorage)
    expect(stored.examResult).toEqual({ mode: 'cards', score: 1, total: 2 })
  })

  test('test mode gives immediate per-option feedback and a final score', async () => {
    const user = userEvent.setup()
    render(<Exam locale="en" />)

    await user.click(screen.getByRole('radio', { name: 'Right answer A' }))
    await user.click(screen.getByRole('button', { name: /check answer/i }))
    expect(screen.getByText('Correct. Because A.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /next question/i }))

    await user.click(screen.getByRole('radio', { name: 'Wrong answer B' }))
    await user.click(screen.getByRole('button', { name: /check answer/i }))
    await user.click(screen.getByRole('button', { name: /next question/i }))

    expect(screen.getByText('Score: 1 / 2')).toBeInTheDocument()

    const stored = readProgress(window.localStorage)
    expect(stored.examResult).toEqual({ mode: 'test', score: 1, total: 2 })
  })

  test('retry after a finished test run starts over', async () => {
    const user = userEvent.setup()
    render(<Exam locale="en" />)

    for (let i = 0; i < 2; i += 1) {
      await user.click(screen.getAllByRole('radio')[0])
      await user.click(screen.getByRole('button', { name: /check answer/i }))
      await user.click(screen.getByRole('button', { name: /next question/i }))
    }

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByText('Prompt A')).toBeInTheDocument()
  })
})
