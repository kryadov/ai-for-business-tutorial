export type SectionId =
  | 'landscape'
  | 'business-lens'
  | 'llm-limits'
  | 'anatomy'
  | 'solution-classes'
  | 'catalogue'
  | 'security'
  | 'economics'
  | 'discovery'
  | 'framework'
  | 'myths'

export type Widget = 'quiz' | 'trainer' | 'discovery'

export interface Section {
  readonly sectionId: SectionId
  readonly slug: string
  readonly order: number
  readonly widget?: Widget
}

export const sections: readonly Section[] = [
  { sectionId: 'landscape', slug: '01-landscape', order: 1, widget: 'quiz' },
  { sectionId: 'business-lens', slug: '02-business-lens', order: 2, widget: 'quiz' },
  { sectionId: 'llm-limits', slug: '03-llm-limits', order: 3, widget: 'quiz' },
  { sectionId: 'anatomy', slug: '04-anatomy', order: 4, widget: 'quiz' },
  { sectionId: 'solution-classes', slug: '05-solution-classes', order: 5, widget: 'quiz' },
  { sectionId: 'catalogue', slug: '06-catalogue', order: 6, widget: 'quiz' },
  { sectionId: 'security', slug: '07-security', order: 7, widget: 'quiz' },
  { sectionId: 'economics', slug: '08-economics', order: 8, widget: 'quiz' },
  { sectionId: 'discovery', slug: '09-discovery', order: 9, widget: 'discovery' },
  { sectionId: 'framework', slug: '10-framework', order: 10, widget: 'trainer' },
  { sectionId: 'myths', slug: '11-myths', order: 11, widget: 'quiz' },
] as const

const bySlug = new Map(sections.map((s) => [s.slug, s]))

export function sectionBySlug(slug: string): Section | undefined {
  return bySlug.get(slug)
}
