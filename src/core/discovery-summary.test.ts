import { describe, expect, test } from 'vitest'
import {
  answeredQuestions,
  buildSummary,
  evaluateFlags,
  isAnswered,
  unansweredQuestions,
  type DiscoveryFlagRule,
  type DiscoveryQuestion,
} from './discovery-summary'

const questions: DiscoveryQuestion[] = [
  { id: 'problem', kind: 'text' },
  { id: 'owner', kind: 'choice', options: ['named', 'none'] },
  { id: 'docs', kind: 'choice', options: ['yes', 'no'] },
]

const rules: DiscoveryFlagRule[] = [
  { id: 'no-owner', when: [{ question: 'owner', equals: 'none' }], reread: 'business-lens' },
  {
    id: 'no-corpus',
    when: [
      { question: 'docs', equals: 'no' },
      { question: 'owner', equals: 'none' },
    ],
    reread: 'solution-classes',
  },
]

describe('what counts as answered', () => {
  test('typed prose counts', () => {
    expect(isAnswered('invoices are reconciled by hand')).toBe(true)
  })

  test('an untouched field does not', () => {
    expect(isAnswered(undefined)).toBe(false)
    expect(isAnswered('')).toBe(false)
  })

  // Someone who tabbed through a textarea in the meeting has not answered it,
  // and a summary that claims otherwise is worse than one with a gap in it.
  test('whitespace does not', () => {
    expect(isAnswered('   ')).toBe(false)
    expect(isAnswered('\n\t ')).toBe(false)
  })

  test('an empty list does not, a list with an entry does', () => {
    expect(isAnswered([])).toBe(false)
    expect(isAnswered(['   ', ''])).toBe(false)
    expect(isAnswered(['named'])).toBe(true)
  })

  test('answered and unanswered partition the question set', () => {
    const answers = { problem: 'duplicate data entry', owner: '  ' }
    expect(answeredQuestions(questions, answers)).toEqual(['problem'])
    expect(unansweredQuestions(questions, answers)).toEqual(['owner', 'docs'])
  })
})

describe('red flags', () => {
  // The rule that matters most: a consultant who opens the checklist before the
  // meeting must not be met by six warnings about nothing.
  test('an untouched checklist raises none', () => {
    expect(evaluateFlags(rules, {})).toEqual([])
  })

  test('a single-condition rule fires on its own trigger', () => {
    expect(evaluateFlags(rules, { owner: 'none' })).toContain('no-owner')
  })

  test('and stays silent on the other answer', () => {
    expect(evaluateFlags(rules, { owner: 'named' })).toEqual([])
  })

  test('a two-condition rule needs both, not either', () => {
    expect(evaluateFlags(rules, { docs: 'no' })).not.toContain('no-corpus')
    expect(evaluateFlags(rules, { docs: 'no', owner: 'none' })).toContain('no-corpus')
  })

  test('a rule with no conditions never fires', () => {
    const malformed: DiscoveryFlagRule[] = [{ id: 'broken', when: [], reread: 'security' }]
    expect(evaluateFlags(malformed, { anything: 'at all' })).toEqual([])
  })
})

describe('the pasted summary', () => {
  const blocks = [
    {
      heading: 'Block A — Business',
      questions: [
        { id: 'problem', label: 'What problem is being solved?' },
        {
          id: 'owner',
          label: 'Who owns the process?',
          optionLabels: { named: 'Named', none: 'Nobody' },
        },
      ],
    },
    { heading: 'Block C — Data', questions: [{ id: 'docs', label: 'Are there documents?' }] },
  ]

  test('writes answered questions and omits unanswered ones', () => {
    const summary = buildSummary(blocks, { problem: 'invoices reconciled by hand' })
    expect(summary).toContain('- **What problem is being solved?** — invoices reconciled by hand')
    expect(summary).not.toContain('Who owns the process?')
  })

  test('renders a chosen option as the label the reader saw, not the stored id', () => {
    const summary = buildSummary(blocks, { owner: 'none' })
    expect(summary).toContain('- **Who owns the process?** — Nobody')
    expect(summary).not.toContain('— none')
  })

  // The four headings always appear, so it is visible at a glance which block
  // the meeting never reached — an absent heading reads as "asked and fine".
  test('keeps every block heading even when nothing under it was answered', () => {
    const summary = buildSummary(blocks, {})
    expect(summary).toContain('## Block A — Business')
    expect(summary).toContain('## Block C — Data')
  })

  test('is markdown with the blocks as headings', () => {
    const summary = buildSummary(blocks, { problem: 'x' })
    expect(summary.split('\n').filter((line) => line.startsWith('## '))).toHaveLength(2)
    expect(summary.endsWith('\n')).toBe(true)
  })

  test('keeps a multi-line note inside its own list item', () => {
    const summary = buildSummary(blocks, { problem: 'first line\nsecond line' })
    expect(summary).toContain('- **What problem is being solved?** — first line\n  second line')
  })

  test('appends extra sections only when they have items', () => {
    const withFlags = buildSummary(blocks, {}, [
      { heading: 'Red flags', items: ['No named process owner'] },
      { heading: 'Not answered yet', items: [] },
    ])
    expect(withFlags).toContain('## Red flags')
    expect(withFlags).toContain('- No named process owner')
    expect(withFlags).not.toContain('## Not answered yet')
  })
})
