import type { DecisionTree, SolutionClass } from '../core/decision-engine'

// The tree of section 10, made runnable. Structure only: every label lives in
// decision-tree.text.en.ts / decision-tree.text.ru.ts, keyed by these ids.
//
// The first question is who acts, not what the data looks like, because the
// section argues that order: a system nobody is allowed to let act is an
// assistant however the data is shaped. The documents-versus-database fork
// comes immediately after, since the section calls confusing those two the
// most common class error in the business.
//
// Two leaves end in RAG. That is deliberate and is why rejections hang off the
// leaf rather than the class: the reason text2SQL loses to RAG when a person
// is looking something up is not the reason it loses when a system is doing
// the looking, and a reader handed a generic blurb learns nothing.

export const decisionTree: DecisionTree = {
  rootId: 'q-actor',
  questions: [
    {
      id: 'q-actor',
      options: [
        { id: 'person-acts', next: 'q-need' },
        { id: 'system-acts', next: 'q-steps' },
      ],
    },
    {
      id: 'q-need',
      options: [
        { id: 'find-in-documents', next: 'leaf-rag-person' },
        { id: 'number-from-database', next: 'leaf-text2sql' },
        { id: 'something-drafted', next: 'leaf-assistant' },
      ],
    },
    {
      id: 'q-steps',
      options: [
        { id: 'always-the-same', next: 'leaf-workflow' },
        { id: 'depends-on-the-case', next: 'q-system-does' },
      ],
    },
    {
      id: 'q-system-does',
      options: [
        { id: 'decides-and-acts', next: 'leaf-agent' },
        { id: 'only-looks-things-up', next: 'leaf-rag-system' },
      ],
    },
  ],
  leaves: [
    { id: 'leaf-rag-person', verdict: 'rag', reread: ['solution-classes', 'security'] },
    { id: 'leaf-text2sql', verdict: 'text2sql', reread: ['solution-classes', 'discovery'] },
    { id: 'leaf-assistant', verdict: 'assistant', reread: ['solution-classes', 'business-lens'] },
    { id: 'leaf-workflow', verdict: 'workflow', reread: ['solution-classes', 'framework'] },
    { id: 'leaf-agent', verdict: 'agent', reread: ['solution-classes', 'security'] },
    { id: 'leaf-rag-system', verdict: 'rag', reread: ['solution-classes', 'myths'] },
  ],
} as const

// Situations the reader runs through the tree themselves, then compares with
// the analysis. Deliberately drawn from industries sections 6 and 10 do not
// use, so this is practice rather than recognition.
export interface DecisionScenario {
  readonly id: string
  readonly expected: SolutionClass
  readonly expectedLeafId: string
}

export const decisionScenarios: readonly DecisionScenario[] = [
  { id: 'university-regulations', expected: 'rag', expectedLeafId: 'leaf-rag-person' },
  { id: 'utility-tariff-switchers', expected: 'text2sql', expectedLeafId: 'leaf-text2sql' },
  { id: 'publisher-blurb-draft', expected: 'assistant', expectedLeafId: 'leaf-assistant' },
  { id: 'fleet-repair-intake', expected: 'workflow', expectedLeafId: 'leaf-workflow' },
  { id: 'museum-loan-request', expected: 'agent', expectedLeafId: 'leaf-agent' },
  { id: 'construction-standard-lookup', expected: 'rag', expectedLeafId: 'leaf-rag-system' },
] as const

export function scenarioById(id: string): DecisionScenario | undefined {
  return decisionScenarios.find((scenario) => scenario.id === id)
}
