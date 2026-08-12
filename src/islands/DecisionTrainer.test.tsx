// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import DecisionTrainer from './DecisionTrainer'
import { decisionTreeText } from '../data/decision-tree.text'

const en = decisionTreeText.en

describe('walking the tree', () => {
  test('opens on the root question', () => {
    render(<DecisionTrainer locale="en" />)
    expect(screen.getByText(en.questions['q-actor'].prompt)).toBeInTheDocument()
  })

  test('answering moves to the next question, not straight to a verdict', async () => {
    const user = userEvent.setup()
    render(<DecisionTrainer locale="en" />)

    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['system-acts'] }))

    expect(screen.getByText(en.questions['q-steps'].prompt)).toBeInTheDocument()
    expect(screen.queryByText(en.leaves['leaf-workflow'].verdict)).not.toBeInTheDocument()
  })

  test('reaches a verdict and argues against the other four classes', async () => {
    const user = userEvent.setup()
    const { container } = render(<DecisionTrainer locale="en" />)

    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['system-acts'] }))
    await user.click(
      screen.getByRole('button', { name: en.questions['q-steps'].options['always-the-same'] }),
    )

    expect(container.querySelector('[data-trainer-verdict="workflow"]')).not.toBeNull()
    expect(screen.getByText(en.rejections['leaf-workflow.agent'])).toBeInTheDocument()
    expect(screen.getByText(en.rejections['leaf-workflow.rag'])).toBeInTheDocument()
    expect(screen.getByText(en.rejections['leaf-workflow.text2sql'])).toBeInTheDocument()
    expect(screen.getByText(en.rejections['leaf-workflow.assistant'])).toBeInTheDocument()
  })

  test('back undoes one answer rather than resetting the walk', async () => {
    const user = userEvent.setup()
    render(<DecisionTrainer locale="en" />)

    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['person-acts'] }))
    expect(screen.getByText(en.questions['q-need'].prompt)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText(en.questions['q-actor'].prompt)).toBeInTheDocument()
  })
})

describe('the two routes to RAG', () => {
  // The engine hangs rejections off the leaf so these two do not repeat
  // themselves. If that ever regresses, a reader gets the same argument for a
  // materially different situation.
  test('argue against text2SQL differently', async () => {
    const user = userEvent.setup()

    const first = render(<DecisionTrainer locale="en" />)
    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['person-acts'] }))
    await user.click(
      screen.getByRole('button', { name: en.questions['q-need'].options['find-in-documents'] }),
    )
    expect(screen.getByText(en.rejections['leaf-rag-person.text2sql'])).toBeInTheDocument()
    first.unmount()

    render(<DecisionTrainer locale="en" />)
    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['system-acts'] }))
    await user.click(
      screen.getByRole('button', { name: en.questions['q-steps'].options['depends-on-the-case'] }),
    )
    await user.click(
      screen.getByRole('button', {
        name: en.questions['q-system-does'].options['only-looks-things-up'],
      }),
    )
    expect(screen.getByText(en.rejections['leaf-rag-system.text2sql'])).toBeInTheDocument()
  })
})

describe('scenarios', () => {
  test('picking one shows its situation and keeps the analysis hidden', async () => {
    const user = userEvent.setup()
    render(<DecisionTrainer locale="en" />)

    const scenario = en.scenarios['fleet-repair-intake']
    await user.click(screen.getByRole('button', { name: new RegExp(scenario.prompt.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }))

    expect(screen.getByText(scenario.prompt)).toBeInTheDocument()
    expect(screen.queryByText(scenario.analysis)).not.toBeInTheDocument()
  })

  test('says whether the reader matched the tree, and reveals the analysis on request', async () => {
    const user = userEvent.setup()
    render(<DecisionTrainer locale="en" />)

    const scenario = en.scenarios['fleet-repair-intake']
    await user.click(screen.getByRole('button', { name: new RegExp(scenario.prompt.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }))
    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['system-acts'] }))
    await user.click(
      screen.getByRole('button', { name: en.questions['q-steps'].options['always-the-same'] }),
    )

    expect(screen.getByText(/matches the tree/i)).toBeInTheDocument()
    expect(screen.queryByText(scenario.analysis)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show the walkthrough/i }))
    expect(screen.getByText(scenario.analysis)).toBeInTheDocument()
  })

  test('a reader who lands elsewhere is told so rather than silently corrected', async () => {
    const user = userEvent.setup()
    render(<DecisionTrainer locale="en" />)

    const scenario = en.scenarios['fleet-repair-intake']
    await user.click(screen.getByRole('button', { name: new RegExp(scenario.prompt.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }))
    await user.click(screen.getByRole('button', { name: en.questions['q-actor'].options['person-acts'] }))
    await user.click(
      screen.getByRole('button', { name: en.questions['q-need'].options['find-in-documents'] }),
    )

    expect(screen.getByText(/differs from the tree/i)).toBeInTheDocument()
  })
})
