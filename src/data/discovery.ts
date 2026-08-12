import type { Locale } from '../core/locale'
import type {
  DiscoveryFlagRule,
  DiscoveryQuestion as DiscoveryQuestionShape,
} from '../core/discovery-summary'
import type { UiStringKey } from './ui-strings.types'
import { en } from './discovery.text.en'
import { ru } from './discovery.text.ru'

// Section 9's four blocks, in the order the section insists on: the data
// question is meaningless before the process question, and the constraints
// question rewrites both if it is asked last.
export type DiscoveryBlockId = 'business' | 'process' | 'data' | 'constraints'

export type DiscoveryQuestionId =
  | 'a-problem'
  | 'a-owner'
  | 'a-success'
  | 'a-kpi'
  | 'b-performers'
  | 'b-steps'
  | 'b-manual'
  | 'b-delays'
  | 'c-documents'
  | 'c-database'
  | 'c-knowledge-base'
  | 'c-structure'
  | 'c-access'
  | 'd-cloud'
  | 'd-security'
  | 'd-personal-data'
  | 'd-regulatory'
  | 'd-error-cost'
  | 'd-reviewer'

export type DiscoveryFlagId =
  | 'personal-data'
  | 'no-corpus'
  | 'steps-undescribed'
  | 'no-owner'
  | 'no-reviewer'
  | 'access-not-segregated'

export interface DiscoveryBlock {
  readonly id: DiscoveryBlockId
  // The block headings are ordinary interface strings, so they live in
  // ui-strings with the rest of the chrome; this only records which key.
  readonly heading: UiStringKey
}

export interface DiscoveryQuestion extends DiscoveryQuestionShape {
  readonly id: DiscoveryQuestionId
  readonly block: DiscoveryBlockId
}

export const discoveryBlocks: readonly DiscoveryBlock[] = [
  { id: 'business', heading: 'discovery.blockA' },
  { id: 'process', heading: 'discovery.blockB' },
  { id: 'data', heading: 'discovery.blockC' },
  { id: 'constraints', heading: 'discovery.blockD' },
] as const

// Option ids are stored, never their wording — a rule below compares against
// 'no', not against "No — nothing written down worth retrieving", so the same
// rule holds in both languages.
export const discoveryQuestions: readonly DiscoveryQuestion[] = [
  { id: 'a-problem', block: 'business', kind: 'text' },
  { id: 'a-owner', block: 'business', kind: 'choice', options: ['named', 'none'] },
  { id: 'a-success', block: 'business', kind: 'text' },
  { id: 'a-kpi', block: 'business', kind: 'text' },
  { id: 'b-performers', block: 'process', kind: 'text' },
  { id: 'b-steps', block: 'process', kind: 'choice', options: ['described', 'not-described'] },
  { id: 'b-manual', block: 'process', kind: 'text' },
  { id: 'b-delays', block: 'process', kind: 'text' },
  { id: 'c-documents', block: 'data', kind: 'choice', options: ['yes', 'no'] },
  { id: 'c-database', block: 'data', kind: 'choice', options: ['yes', 'no'] },
  { id: 'c-knowledge-base', block: 'data', kind: 'text' },
  { id: 'c-structure', block: 'data', kind: 'text' },
  { id: 'c-access', block: 'data', kind: 'choice', options: ['segregated', 'not-segregated'] },
  { id: 'd-cloud', block: 'constraints', kind: 'choice', options: ['allowed', 'not-allowed'] },
  { id: 'd-security', block: 'constraints', kind: 'text' },
  { id: 'd-personal-data', block: 'constraints', kind: 'choice', options: ['yes', 'no'] },
  { id: 'd-regulatory', block: 'constraints', kind: 'text' },
  { id: 'd-error-cost', block: 'constraints', kind: 'choice', options: ['high', 'low'] },
  { id: 'd-reviewer', block: 'constraints', kind: 'choice', options: ['yes', 'no'] },
] as const

export interface DiscoveryFlag extends DiscoveryFlagRule {
  readonly id: DiscoveryFlagId
}

// Section 9's five red flags, plus the one section 7 adds about retrieval
// inheriting access rights. Each names the section worth rereading; `reread`
// is a SectionId from sections.ts.
export const discoveryFlags: readonly DiscoveryFlag[] = [
  {
    id: 'personal-data',
    when: [{ question: 'd-personal-data', equals: 'yes' }],
    reread: 'security',
  },
  {
    id: 'no-corpus',
    when: [
      { question: 'c-documents', equals: 'no' },
      { question: 'c-database', equals: 'no' },
    ],
    reread: 'solution-classes',
  },
  {
    id: 'steps-undescribed',
    when: [{ question: 'b-steps', equals: 'not-described' }],
    reread: 'solution-classes',
  },
  {
    id: 'no-owner',
    when: [{ question: 'a-owner', equals: 'none' }],
    reread: 'business-lens',
  },
  {
    id: 'no-reviewer',
    when: [
      { question: 'd-error-cost', equals: 'high' },
      { question: 'd-reviewer', equals: 'no' },
    ],
    reread: 'security',
  },
  {
    id: 'access-not-segregated',
    when: [{ question: 'c-access', equals: 'not-segregated' }],
    reread: 'security',
  },
] as const

export interface DiscoveryQuestionText {
  readonly label: string
  // One line of guidance under the field — what a good answer sounds like,
  // and what a bad one is hiding.
  readonly hint: string
  // Keyed by option id; empty for a 'text' question.
  readonly options: Readonly<Record<string, string>>
}

export interface DiscoveryFlagText {
  readonly title: string
  readonly consequence: string
  readonly reread: string
}

export interface DiscoveryText {
  readonly questions: Readonly<Record<DiscoveryQuestionId, DiscoveryQuestionText>>
  readonly flags: Readonly<Record<DiscoveryFlagId, DiscoveryFlagText>>
}

export const discoveryText: Record<Locale, DiscoveryText> = { en, ru }

export function questionsInBlock(block: DiscoveryBlockId): readonly DiscoveryQuestion[] {
  return discoveryQuestions.filter((question) => question.block === block)
}
