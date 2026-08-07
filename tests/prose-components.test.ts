import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, test } from 'vitest'
import Callout from '../src/components/Callout.astro'
import Flow from '../src/components/Flow.astro'
import Facts from '../src/components/Facts.astro'

describe('Callout', () => {
  test('marks a mistake and a correction differently', async () => {
    const container = await AstroContainer.create()
    const mistake = await container.renderToString(Callout, {
      props: { kind: 'mistake' },
      slots: { default: 'We will use the ChatGPT API' },
    })
    const right = await container.renderToString(Callout, {
      props: { kind: 'right' },
      slots: { default: 'We will use a GPT model through the OpenAI API' },
    })

    expect(mistake).toContain('data-kind="mistake"')
    expect(right).toContain('data-kind="right"')
    expect(mistake).toContain('We will use the ChatGPT API')
  })
})

describe('Flow', () => {
  test('renders every step in order', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Flow, {
      props: { steps: ['Email arrives', 'Check the CRM', 'Create a task', 'Send a reply'] },
    })

    const positions = ['Email arrives', 'Check the CRM', 'Create a task', 'Send a reply'].map((s) =>
      html.indexOf(s),
    )
    expect(positions.every((p) => p >= 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })
})

describe('Facts', () => {
  test('shows the verification date and links every source', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Facts, {
      props: {
        verifiedOn: '2026-08-08',
        sources: ['https://example.com/pricing', 'https://example.com/docs'],
        locale: 'en',
      },
      slots: { default: 'Prices as quoted by the vendor.' },
    })

    expect(html).toContain('2026-08-08')
    expect(html).toContain('https://example.com/pricing')
    expect(html).toContain('https://example.com/docs')
    expect(html).toContain('Checked on')
  })
})
