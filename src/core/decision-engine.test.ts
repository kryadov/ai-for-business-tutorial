import { describe, expect, test } from 'vitest'
import { decide, enumeratePaths, leafById, solutionClasses, walk } from './decision-engine'
import { decisionScenarios, decisionTree } from '../data/decision-tree'

describe('walking the tree', () => {
  test('an empty answer set leaves the root question open', () => {
    const state = walk(decisionTree, [])
    expect(state.question?.id).toBe('q-actor')
    expect(state.leaf).toBeNull()
    expect(state.path).toEqual([])
  })

  test('a half-answered tree hands back the next question, not a verdict', () => {
    const state = walk(decisionTree, ['system-acts'])
    expect(state.question?.id).toBe('q-steps')
    expect(state.leaf).toBeNull()
    expect(decide(decisionTree, ['system-acts'])).toBeNull()
  })

  test('an answer naming no option stops the walk instead of throwing', () => {
    const state = walk(decisionTree, ['person-acts', 'not-an-option'])
    expect(state.question?.id).toBe('q-need')
    expect(state.path).toHaveLength(1)
  })

  test('a stale saved path degrades rather than taking the page down', () => {
    expect(() => walk(decisionTree, ['renamed-long-ago', 'and-another'])).not.toThrow()
    expect(walk(decisionTree, ['renamed-long-ago']).question?.id).toBe('q-actor')
  })
})

describe('the tree itself', () => {
  const paths = enumeratePaths(decisionTree)

  test('every path ends at a leaf', () => {
    for (const answers of paths) {
      const state = walk(decisionTree, answers)
      expect(state.leaf, `path ${answers.join(' > ')} ends nowhere`).not.toBeNull()
      expect(state.question).toBeNull()
    }
  })

  test('every leaf is reachable', () => {
    const reached = new Set(paths.map((answers) => walk(decisionTree, answers).leaf?.id))
    for (const leaf of decisionTree.leaves) {
      expect(reached.has(leaf.id), `${leaf.id} cannot be reached by any answer`).toBe(true)
    }
  })

  test('no leaf is declared without being used, and none is reached twice by one path', () => {
    expect(paths).toHaveLength(decisionTree.leaves.length)
  })

  test('every option points somewhere real', () => {
    const known = new Set([
      ...decisionTree.questions.map((question) => question.id),
      ...decisionTree.leaves.map((leaf) => leaf.id),
    ])

    for (const question of decisionTree.questions) {
      for (const option of question.options) {
        expect(known.has(option.next), `${question.id}/${option.id} points at ${option.next}`).toBe(
          true,
        )
      }
    }
  })

  test('every leaf names sections worth rereading', () => {
    for (const leaf of decisionTree.leaves) {
      expect(leaf.reread.length, `${leaf.id} sends the reader nowhere`).toBeGreaterThan(0)
    }
  })
})

describe('the verdict', () => {
  const paths = enumeratePaths(decisionTree)

  test('always argues against the other four classes, never fewer', () => {
    for (const answers of paths) {
      const verdict = decide(decisionTree, answers)
      expect(verdict).not.toBeNull()
      expect(verdict!.rejected).toHaveLength(solutionClasses.length - 1)
      expect(verdict!.rejected.map((r) => r.solutionClass)).not.toContain(verdict!.solutionClass)
    }
  })

  // The whole point of hanging rejections off the leaf: two paths that both
  // end in RAG must not hand the reader the same argument, because the reason
  // text2SQL loses differs between them.
  test('two paths ending in the same class argue it differently', () => {
    const ragLeaves = decisionTree.leaves.filter((leaf) => leaf.verdict === 'rag')
    expect(ragLeaves.length, 'expected more than one route to RAG').toBeGreaterThan(1)

    const keys = ragLeaves.map((leaf) => {
      const answers = paths.find((path) => walk(decisionTree, path).leaf?.id === leaf.id)!
      return decide(decisionTree, answers)!
        .rejected.map((rejection) => rejection.reasonKey)
        .join('|')
    })

    expect(new Set(keys).size, 'both RAG leaves reuse the same rejection text').toBe(keys.length)
  })

  test('the reread list survives into the verdict', () => {
    for (const answers of paths) {
      const verdict = decide(decisionTree, answers)!
      expect(verdict.reread).toEqual(leafById(decisionTree, verdict.leafId)!.reread)
    }
  })
})

describe('the scenario bank', () => {
  test('every scenario names a leaf that exists', () => {
    for (const scenario of decisionScenarios) {
      const leaf = leafById(decisionTree, scenario.expectedLeafId)
      expect(leaf, `${scenario.id} points at a leaf that is not in the tree`).toBeDefined()
    }
  })

  test('every scenario agrees with its leaf about the class', () => {
    for (const scenario of decisionScenarios) {
      const leaf = leafById(decisionTree, scenario.expectedLeafId)!
      expect(leaf.verdict, `${scenario.id} expects ${scenario.expected}`).toBe(scenario.expected)
    }
  })

  test('the bank exercises every class the tree can produce', () => {
    const covered = new Set(decisionScenarios.map((scenario) => scenario.expected))
    const produced = new Set(decisionTree.leaves.map((leaf) => leaf.verdict))
    for (const solutionClass of produced) {
      expect(covered.has(solutionClass), `no scenario lands on ${solutionClass}`).toBe(true)
    }
  })
})
