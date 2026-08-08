import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const CONTENT = join(process.cwd(), 'src', 'content')
const MAX_AGE_DAYS = 90

function contentFiles(): string[] {
  const files: string[] = []
  for (const locale of ['en', 'ru']) {
    const dir = join(CONTENT, locale)
    if (!existsSync(dir)) continue
    for (const name of readdirSync(dir)) files.push(join(dir, name))
  }
  return files
}

describe('fact freshness', () => {
  test('every Facts block declares a verifiedOn date and at least one source', () => {
    for (const file of contentFiles()) {
      const text = readFileSync(file, 'utf8')
      const blocks = text.match(/<Facts[^>]*>/g) ?? []

      for (const block of blocks) {
        expect(block, `${file}: a Facts block has no verifiedOn`).toMatch(
          /verifiedOn="\d{4}-\d{2}-\d{2}"/,
        )
        expect(block, `${file}: a Facts block has no sources`).toMatch(
          /sources=\{\[\s*["'][^"']+["']/,
        )
      }
    }
  })

  test('no verified fact is older than 90 days', () => {
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000

    for (const file of contentFiles()) {
      const text = readFileSync(file, 'utf8')
      for (const match of text.matchAll(/verifiedOn="(\d{4}-\d{2}-\d{2})"/g)) {
        const verifiedOn = Date.parse(match[1])
        expect(
          verifiedOn,
          `${file}: fact verified on ${match[1]} is older than ${MAX_AGE_DAYS} days — re-check the source and update the date`,
        ).toBeGreaterThan(cutoff)
      }
    }
  })
})
