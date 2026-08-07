import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { expect, test } from 'vitest'
import Layout from '../src/components/Layout.astro'

test('sets the html lang attribute from the locale prop', async () => {
  const container = await AstroContainer.create()
  const html = await container.renderToString(Layout, {
    props: { title: 'Test page', locale: 'ru' },
    slots: { default: '<p>body copy</p>' },
  })

  expect(html).toContain('<html lang="ru"')
  expect(html).toContain('<title>Test page</title>')
  expect(html).toContain('body copy')
})

test('renders English as a distinct lang attribute', async () => {
  const container = await AstroContainer.create()
  const html = await container.renderToString(Layout, {
    props: { title: 'Test page', locale: 'en' },
    slots: { default: '<p>body copy</p>' },
  })

  expect(html).toContain('<html lang="en"')
})
