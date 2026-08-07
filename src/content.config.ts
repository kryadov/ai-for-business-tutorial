import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const sections = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content' }),
  schema: z.object({
    section: z.string(),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['draft', 'ready']),
  }),
})

export const collections = { sections }
