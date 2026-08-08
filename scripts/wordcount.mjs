import { readFileSync } from 'node:fs'

const file = process.argv[2]
const words = readFileSync(file, 'utf8')
  .replace(/^---[\s\S]*?---/, '')
  .replace(/^import .*$/gm, '')
  .replace(/<[^>]+>/g, ' ')
  .split(/\s+/)
  .filter(Boolean).length

console.log(`${file}: ${words} words`)
if (words < 1000 || words > 1500) {
  console.error('Outside the 1000-1500 word budget agreed in the spec.')
  process.exit(1)
}
