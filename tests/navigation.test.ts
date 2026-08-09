import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, test } from 'vitest'
import Sidebar from '../src/components/Sidebar.astro'
import LocaleSwitcher from '../src/components/LocaleSwitcher.astro'
import GlossaryPage from '../src/pages/[locale]/glossary.astro'
import { sections } from '../src/data/sections'

describe('Sidebar', () => {
  test('lists written sections as links and unwritten ones as plain text', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: {
        locale: 'en',
        currentSlug: '05-solution-classes',
        titles: { '05-solution-classes': 'Assistants, RAG, text2SQL and agents' },
      },
    })

    expect(html).toContain('/en/section/05-solution-classes')
    expect(html).toContain('Assistants, RAG, text2SQL and agents')
    expect(html).not.toContain('/en/section/01-landscape')
    expect(html).toContain('aria-current="page"')
  })

  test('every list item carries its section id for the progress script to key off of', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'en', titles: {} },
    })

    for (const section of sections) {
      expect(html).toContain(`data-section-id="${section.sectionId}"`)
    }
  })

  test('renders the table of contents open by default, with a localised summary label', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'en', titles: {} },
    })

    expect(html).toMatch(/<details[^>]*\bopen\b[^>]*data-toc/)
    expect(html).toMatch(/<summary[^>]*>\s*Contents\s*<\/summary>/)
  })

  test('renders the table of contents open by default in Russian too', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'ru', titles: {} },
    })

    expect(html).toMatch(/<details[^>]*\bopen\b[^>]*data-toc/)
    expect(html).toMatch(/<summary[^>]*>\s*Содержание\s*<\/summary>/)
  })

  test('links to the glossary with a locale-prefixed href', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'en', titles: {} },
    })

    expect(html).toContain('href="/en/glossary/"')
    expect(html).toContain('Glossary')
  })

  test('the glossary link is also locale-prefixed in Russian', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'ru', titles: {} },
    })

    expect(html).toContain('href="/ru/glossary/"')
  })

  test('links back to the locale-prefixed front page', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'en', titles: {} },
    })

    expect(html).toContain('href="/en/"')
    expect(html).toContain('AI for Business')
  })

  test('the front-page link is also locale-prefixed in Russian', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: { locale: 'ru', titles: {} },
    })

    expect(html).toContain('href="/ru/"')
  })
})

describe('glossary page', () => {
  test('renders the sidebar contents, not just the term list', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(GlossaryPage, {
      params: { locale: 'en' },
    })

    for (const section of sections) {
      expect(html).toContain(`data-section-id="${section.sectionId}"`)
    }
    expect(html).toContain('href="/en/"')
  })
})

describe('LocaleSwitcher', () => {
  test('points at the same page in the other locale', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(LocaleSwitcher, {
      props: { locale: 'en', path: 'section/05-solution-classes' },
    })

    expect(html).toContain('/ru/section/05-solution-classes')
    expect(html).not.toContain('/en/section/05-solution-classes')
    expect(html).toContain('data-locale-switch="ru"')
  })

  test('works in the other direction too', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(LocaleSwitcher, {
      props: { locale: 'ru', path: 'section/05-solution-classes' },
    })

    expect(html).toContain('/en/section/05-solution-classes')
    expect(html).toContain('data-locale-switch="en"')
  })
})
