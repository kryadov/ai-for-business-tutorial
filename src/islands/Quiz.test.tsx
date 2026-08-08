// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import Quiz from './Quiz'
import { readProgress } from '../core/progress'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Quiz island', () => {
  test('shows the first question of the section', () => {
    render(<Quiz sectionId="solution-classes" locale="en" />)
    expect(screen.getByText(/north-west region/i)).toBeInTheDocument()
  })

  test('explains the answer as soon as an option is chosen', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    await user.click(screen.getByRole('radio', { name: /RAG over the company wiki/i }))
    await user.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByText(/does not exist in any document|prose about process/i)).toBeInTheDocument()
  })

  test('explains why the correct option is correct, not only that it is', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    await user.click(screen.getByRole('radio', { name: /Text2SQL over the data warehouse/i }))
    await user.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByText(/aggregate over rows/i)).toBeInTheDocument()
  })

  test('records the finished quiz in progress', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    // Each question needs two button clicks to move past it — "check answer"
    // reveals the explanation, then a separate "next question" click advances
    // the index. A single click per iteration only gets halfway through the
    // quiz and never reaches the last question, so both clicks are needed here
    // to actually finish it and exercise the recordQuiz call at completion.
    for (let i = 0; i < 5; i += 1) {
      const options = screen.getAllByRole('radio')
      await user.click(options[0])
      await user.click(screen.getByRole('button', { name: /check answer/i }))
      await user.click(screen.getByRole('button', { name: /next question/i }))
    }

    const stored = readProgress(window.localStorage)
    expect(stored.quizResults['solution-classes']?.total).toBe(5)
  })

  test('does not record progress before the quiz is finished', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    await user.click(screen.getAllByRole('radio')[0])
    await user.click(screen.getByRole('button', { name: /check answer/i }))
    await user.click(screen.getByRole('button', { name: /next question/i }))

    const stored = readProgress(window.localStorage)
    expect(stored.quizResults['solution-classes']).toBeUndefined()
  })

  test('renders nothing when the section has no quiz', () => {
    const { container } = render(<Quiz sectionId="no-such-section" locale="en" />)
    expect(container).toBeEmptyDOMElement()
  })
})
