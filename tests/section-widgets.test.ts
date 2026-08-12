import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import reactRenderer from '@astrojs/react/server.js'
import { describe, expect, test, vi } from 'vitest'
import type { Locale } from '../src/core/locale'

// `astro:content`'s glob loader reads from a data store that only the dev
// server / build populate; it comes back empty inside the test runner (see
// the "collection does not exist or is empty" warning `getCollection` logs
// for every other page test in this suite too). `render()` needs a real
// Astro component to hand `<Content />`, so the mock returns one loaded from
// a fixture rather than a plain function, which the container has no
// renderer for.
vi.mock('astro:content', async () => {
  const { default: MockSectionContent } = await import('./fixtures/MockSectionContent.astro')
  return {
    getCollection: vi.fn(async () => []),
    render: vi.fn(async () => ({ Content: MockSectionContent, headings: [] })),
  }
})

const { default: SectionPage } = await import('../src/pages/[locale]/section/[slug].astro')

async function createContainerWithReact() {
  const container = await AstroContainer.create()
  container.addServerRenderer({ renderer: reactRenderer })
  return container
}

async function renderSectionPage(locale: Locale, slug: string) {
  const container = await createContainerWithReact()
  const entry = {
    id: `${locale}/${slug}`,
    data: {
      section: 'landscape',
      title: 'Test section',
      summary: 'Test summary',
      status: 'ready' as const,
    },
  }

  return container.renderToString(SectionPage, {
    params: { locale, slug },
    props: { entry, titles: {} },
  })
}

describe('section page widgets', () => {
  test('section 09 (discovery) renders the discovery widget above its quiz, in English', async () => {
    const html = await renderSectionPage('en', '09-discovery')
    expect(html).toContain('data-widget="discovery"')
    expect(html).not.toContain('data-widget="trainer"')
    expect(html).toContain('Work through the four blocks below')
    expect(html).toContain('Check answer')
    expect(html.indexOf('data-widget="discovery"')).toBeLessThan(html.indexOf('Check answer'))
  })

  test('section 09 (discovery) renders the discovery widget above its quiz, in Russian', async () => {
    const html = await renderSectionPage('ru', '09-discovery')
    expect(html).toContain('data-widget="discovery"')
    expect(html).toContain('Пройдите четыре блока ниже')
    expect(html).toContain('Проверить')
  })

  test('section 10 (framework) renders the trainer widget above its quiz, in English', async () => {
    const html = await renderSectionPage('en', '10-framework')
    expect(html).toContain('data-widget="trainer"')
    expect(html).not.toContain('data-widget="discovery"')
    expect(html).toContain('Walk through the same questions')
    expect(html).toContain('Check answer')
    expect(html.indexOf('data-widget="trainer"')).toBeLessThan(html.indexOf('Check answer'))
  })

  test('section 10 (framework) renders the trainer widget above its quiz, in Russian', async () => {
    const html = await renderSectionPage('ru', '10-framework')
    expect(html).toContain('data-widget="trainer"')
    expect(html).toContain('Пройдите те же вопросы')
    expect(html).toContain('Проверить')
  })

  test('a section without a trainer/discovery widget renders neither, but still renders its quiz', async () => {
    const html = await renderSectionPage('en', '05-solution-classes')
    expect(html).not.toContain('data-widget="trainer"')
    expect(html).not.toContain('data-widget="discovery"')
    expect(html).toContain('Check answer')
  })
})
