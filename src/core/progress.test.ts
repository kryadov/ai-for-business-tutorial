import { beforeEach, describe, expect, test } from 'vitest'
import { markRead, readProgress, recordQuiz, writeProgress } from './progress'

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  [key: string]: unknown
  get length() { return this.map.size }
  clear() { this.map.clear() }
  getItem(k: string) { return this.map.get(k) ?? null }
  key(i: number) { return [...this.map.keys()][i] ?? null }
  removeItem(k: string) { this.map.delete(k) }
  setItem(k: string, v: string) { this.map.set(k, v) }
}

let storage: Storage

beforeEach(() => {
  storage = new MemoryStorage()
})

describe('readProgress', () => {
  test('returns an empty progress when nothing was stored', () => {
    expect(readProgress(storage)).toEqual({ readSections: [], quizResults: {} })
  })

  test('survives a value that is not JSON at all', () => {
    storage.setItem('afb:progress:v1', 'not json {{{')
    expect(readProgress(storage)).toEqual({ readSections: [], quizResults: {} })
  })

  test('survives JSON that does not match the schema', () => {
    storage.setItem('afb:progress:v1', JSON.stringify({ readSections: 'five' }))
    expect(readProgress(storage)).toEqual({ readSections: [], quizResults: {} })
  })

  test('a read that throws degrades to empty progress', () => {
    class BlockedStorage extends MemoryStorage {
      override getItem(): never {
        throw new Error('access denied')
      }
    }

    expect(readProgress(new BlockedStorage())).toEqual({ readSections: [], quizResults: {} })
  })

  test('round-trips a valid progress', () => {
    const progress = {
      readSections: ['solution-classes'],
      quizResults: { 'solution-classes': { score: 4, total: 5, answers: [[0], [2]] } },
    }
    writeProgress(storage, progress)
    expect(readProgress(storage)).toEqual(progress)
  })
})

describe('markRead', () => {
  test('adds a section', () => {
    expect(markRead(storage, 'landscape').readSections).toEqual(['landscape'])
  })

  test('never stores the same section twice', () => {
    markRead(storage, 'landscape')
    const progress = markRead(storage, 'landscape')
    expect(progress.readSections).toEqual(['landscape'])
  })

  test('persists across reads', () => {
    markRead(storage, 'landscape')
    expect(readProgress(storage).readSections).toEqual(['landscape'])
  })
})

describe('recordQuiz', () => {
  test('stores the result under the section id', () => {
    const progress = recordQuiz(storage, 'solution-classes', {
      score: 3,
      total: 5,
      answers: [[0], [1], [2], [0], [1]],
    })
    expect(progress.quizResults['solution-classes'].score).toBe(3)
  })

  test('overwrites an earlier attempt at the same section', () => {
    recordQuiz(storage, 'solution-classes', { score: 3, total: 5, answers: [] })
    const progress = recordQuiz(storage, 'solution-classes', { score: 5, total: 5, answers: [] })
    expect(progress.quizResults['solution-classes'].score).toBe(5)
  })

  test('a write that throws does not lose the in-memory result', () => {
    class FullStorage extends MemoryStorage {
      override setItem(): void {
        throw new Error('quota exceeded')
      }
    }

    const progress = recordQuiz(new FullStorage(), 'solution-classes', {
      score: 1,
      total: 5,
      answers: [],
    })
    expect(progress.quizResults['solution-classes'].score).toBe(1)
  })
})
