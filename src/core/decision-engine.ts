// Walking the decision tree of section 10, as pure logic. Mirrors
// src/core/quiz.ts and src/core/exam.ts on purpose: the topology and every
// piece of wording live in src/data, this file only moves a reader through a
// tree it is handed. No React, no Astro, no localized text — see AGENTS.md.

export type SolutionClass = 'rag' | 'text2sql' | 'assistant' | 'agent' | 'workflow'

// The order the four rejected classes are argued in. Fixed here rather than
// derived from the tree so a verdict panel always lists them the same way.
export const solutionClasses: readonly SolutionClass[] = [
  'rag',
  'text2sql',
  'assistant',
  'agent',
  'workflow',
] as const

export interface DecisionOption {
  readonly id: string
  // Id of the next question, or of the leaf this answer settles on.
  readonly next: string
}

export interface DecisionQuestion {
  readonly id: string
  readonly options: readonly DecisionOption[]
}

// A leaf is not a class: several leaves can end in the same class, reached by
// different answers, and that is the point. The reason text2SQL beats RAG for
// a scattered pile of delivery notes is not the reason it beats RAG for a
// warehouse question, so the rejections hang off the leaf, never off the
// class.
export interface DecisionLeaf {
  readonly id: string
  readonly verdict: SolutionClass
  // Section ids, in the order they are worth rereading.
  readonly reread: readonly string[]
}

export interface DecisionTree {
  readonly rootId: string
  readonly questions: readonly DecisionQuestion[]
  readonly leaves: readonly DecisionLeaf[]
}

export interface DecisionStep {
  readonly questionId: string
  readonly optionId: string
}

export interface Rejection {
  readonly solutionClass: SolutionClass
  // Key into the per-locale rejection text. Derived from the leaf, so the
  // argument a reader is handed belongs to the path they took.
  readonly reasonKey: string
}

export interface Verdict {
  readonly leafId: string
  readonly solutionClass: SolutionClass
  readonly rejected: readonly Rejection[]
  readonly reread: readonly string[]
  readonly path: readonly DecisionStep[]
}

export interface Walk {
  // The answers that resolved, in order.
  readonly path: readonly DecisionStep[]
  // The question still waiting for an answer, or null once a leaf is reached.
  readonly question: DecisionQuestion | null
  readonly leaf: DecisionLeaf | null
}

export function questionById(tree: DecisionTree, id: string): DecisionQuestion | undefined {
  return tree.questions.find((question) => question.id === id)
}

export function leafById(tree: DecisionTree, id: string): DecisionLeaf | undefined {
  return tree.leaves.find((leaf) => leaf.id === id)
}

export function rejectionKey(leafId: string, solutionClass: SolutionClass): string {
  return `${leafId}.${solutionClass}`
}

// Answers are option ids in the order they were chosen. An answer that names
// no option of the current question stops the walk there — the caller gets
// back the question that is still open, not a throw, because a stale saved
// path must never take the page down.
export function walk(tree: DecisionTree, answers: readonly string[]): Walk {
  const path: DecisionStep[] = []
  let nodeId = tree.rootId

  for (const answer of answers) {
    const question = questionById(tree, nodeId)
    if (!question) break

    const option = question.options.find((candidate) => candidate.id === answer)
    if (!option) break

    path.push({ questionId: question.id, optionId: option.id })
    nodeId = option.next
  }

  const question = questionById(tree, nodeId)
  if (question) return { path, question, leaf: null }

  return { path, question: null, leaf: leafById(tree, nodeId) ?? null }
}

// Null until the answers actually reach a leaf: a half-walked tree has no
// verdict to defend, and the caller should keep asking questions instead.
export function decide(tree: DecisionTree, answers: readonly string[]): Verdict | null {
  const { path, leaf } = walk(tree, answers)
  if (!leaf) return null

  const rejected = solutionClasses
    .filter((solutionClass) => solutionClass !== leaf.verdict)
    .map((solutionClass) => ({ solutionClass, reasonKey: rejectionKey(leaf.id, solutionClass) }))

  return {
    leafId: leaf.id,
    solutionClass: leaf.verdict,
    rejected,
    reread: leaf.reread,
    path,
  }
}

// Every answer sequence the tree can produce. A sequence stops as soon as the
// next node is not a question — at a leaf normally, at a dangling id or a
// cycle if the tree is malformed, which is exactly what the tests look for.
export function enumeratePaths(tree: DecisionTree): readonly (readonly string[])[] {
  const paths: string[][] = []

  const visit = (nodeId: string, answers: readonly string[], seen: readonly string[]): void => {
    const question = questionById(tree, nodeId)

    if (!question || question.options.length === 0 || seen.includes(nodeId)) {
      paths.push([...answers])
      return
    }

    for (const option of question.options) {
      visit(option.next, [...answers, option.id], [...seen, nodeId])
    }
  }

  visit(tree.rootId, [], [])
  return paths
}
