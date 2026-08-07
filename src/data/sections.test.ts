import { describe, expect, test } from 'vitest'
import { sections, sectionBySlug } from './sections'

describe('section registry', () => {
  test('holds eleven sections', () => {
    expect(sections).toHaveLength(11)
  })

  test('orders are 1..11 without gaps or duplicates', () => {
    expect(sections.map((s) => s.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })

  test('slugs are unique and url safe', () => {
    const slugs = sections.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^\d{2}-[a-z0-9-]+$/)
  })

  test('section ids are unique', () => {
    const ids = sections.map((s) => s.sectionId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('looks a section up by slug', () => {
    expect(sectionBySlug('05-solution-classes')?.order).toBe(5)
    expect(sectionBySlug('nope')).toBeUndefined()
  })
})
