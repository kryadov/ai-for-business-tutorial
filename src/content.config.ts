import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { sections as registeredSections } from './data/sections'

const sectionIds = registeredSections.map((section) => section.sectionId) as [
  (typeof registeredSections)[number]['sectionId'],
  ...(typeof registeredSections)[number]['sectionId'][],
]

const sections = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content' }),
  schema: z.object({
    section: z.enum(sectionIds),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['draft', 'ready']),
  }),
})

export const collections = { sections }
