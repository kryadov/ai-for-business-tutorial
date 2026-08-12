// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import DiscoveryForm from './DiscoveryForm'
import { readProgress } from '../core/progress'
import { discoveryText } from '../data/discovery'

const en = discoveryText.en

beforeEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe('an untouched checklist', () => {
  test('says so instead of showing warnings', () => {
    render(<DiscoveryForm locale="en" />)
    expect(screen.getByText(/no red flags so far/i)).toBeInTheDocument()
    expect(document.querySelector('[data-flag]')).toBeNull()
  })

  test('renders all four blocks', () => {
    const { container } = render(<DiscoveryForm locale="en" />)
    expect(container.querySelectorAll('[data-discovery-block]')).toHaveLength(4)
  })
})

describe('answers', () => {
  test('save as the reader types, so a crash mid-meeting loses nothing', async () => {
    const user = userEvent.setup()
    render(<DiscoveryForm locale="en" />)

    await user.type(
      screen.getByLabelText(en.questions['a-problem'].label),
      'invoices reconciled by hand',
    )

    await waitFor(() => {
      expect(readProgress(window.localStorage).discoveryDraft?.['a-problem']).toBe(
        'invoices reconciled by hand',
      )
    })
  })

  test('come back after a remount', async () => {
    const user = userEvent.setup()
    const first = render(<DiscoveryForm locale="en" />)
    await user.click(screen.getByLabelText(en.questions['a-owner'].options.none))
    first.unmount()

    render(<DiscoveryForm locale="en" />)
    await waitFor(() => {
      expect(screen.getByLabelText(en.questions['a-owner'].options.none)).toBeChecked()
    })
  })
})

describe('red flags', () => {
  test('a single-condition flag appears as soon as its answer is given', async () => {
    const user = userEvent.setup()
    const { container } = render(<DiscoveryForm locale="en" />)

    await user.click(screen.getByLabelText(en.questions['a-owner'].options.none))

    expect(container.querySelector('[data-flag="no-owner"]')).not.toBeNull()
    expect(screen.getByText(en.flags['no-owner'].consequence, { exact: false })).toBeInTheDocument()
  })

  test('a two-condition flag waits for both answers', async () => {
    const user = userEvent.setup()
    const { container } = render(<DiscoveryForm locale="en" />)

    await user.click(screen.getByLabelText(en.questions['d-error-cost'].options.high))
    expect(container.querySelector('[data-flag="no-reviewer"]')).toBeNull()

    await user.click(screen.getByLabelText(en.questions['d-reviewer'].options.no))
    expect(container.querySelector('[data-flag="no-reviewer"]')).not.toBeNull()
  })

  test('answering the reassuring way raises nothing', async () => {
    const user = userEvent.setup()
    const { container } = render(<DiscoveryForm locale="en" />)

    await user.click(screen.getByLabelText(en.questions['a-owner'].options.named))
    await user.click(screen.getByLabelText(en.questions['d-personal-data'].options.no))

    expect(container.querySelector('[data-flag]')).toBeNull()
  })
})

describe('the summary', () => {
  test('copies markdown carrying the answers, the flags and what is still open', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    // After setup, not before: userEvent installs its own clipboard stub and
    // would otherwise overwrite this one. jsdom exposes the property through a
    // getter, so it has to be redefined rather than assigned.
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })

    render(<DiscoveryForm locale="en" />)

    await user.type(screen.getByLabelText(en.questions['a-problem'].label), 'duplicate entry')
    await user.click(screen.getByLabelText(en.questions['a-owner'].options.none))
    await user.click(screen.getByRole('button', { name: /copy summary/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalled())
    const markdown = writeText.mock.calls[0][0] as string

    expect(markdown).toContain('## Block A — Business')
    expect(markdown).toContain('duplicate entry')
    expect(markdown).toContain(en.flags['no-owner'].title)
    // The option label the reader saw, never the id the rule matches on.
    expect(markdown).toContain('Nobody — no sponsor has been found')
    expect(markdown).not.toMatch(/— none$/m)
    expect(markdown).toContain(en.questions['a-kpi'].label)
  })
})

describe('clearing', () => {
  test('does nothing when the reader declines the confirm', async () => {
    const user = userEvent.setup()
    render(<DiscoveryForm locale="en" />)
    await user.type(screen.getByLabelText(en.questions['a-problem'].label), 'keep me')

    vi.spyOn(window, 'confirm').mockReturnValue(false)
    await user.click(screen.getByRole('button', { name: /clear the checklist/i }))

    expect(screen.getByLabelText(en.questions['a-problem'].label)).toHaveValue('keep me')
    expect(readProgress(window.localStorage).discoveryDraft?.['a-problem']).toBe('keep me')
  })

  test('empties the form and the stored draft once confirmed', async () => {
    const user = userEvent.setup()
    render(<DiscoveryForm locale="en" />)
    await user.type(screen.getByLabelText(en.questions['a-problem'].label), 'throw me away')

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: /clear the checklist/i }))

    expect(screen.getByLabelText(en.questions['a-problem'].label)).toHaveValue('')
    expect(readProgress(window.localStorage).discoveryDraft).toBeUndefined()
  })
})
