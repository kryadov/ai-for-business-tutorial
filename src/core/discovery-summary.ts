// The discovery checklist's engine: which red flags the answers so far raise,
// which questions are still open, and the markdown a consultant pastes into an
// email on the way out of the meeting.
//
// Nothing here knows a language. Every heading and every label arrives as a
// parameter already rendered by the caller, so the same code serves both
// locales and is tested without a DOM.

export type DiscoveryAnswerValue = string | readonly string[]

export type DiscoveryAnswers = Readonly<Record<string, DiscoveryAnswerValue | undefined>>

// The shape src/data/discovery.ts fills in, mirroring core/quiz.ts: the shape
// lives here, the instances live in data.
export interface DiscoveryQuestion {
  readonly id: string
  // 'text' is free prose typed in the meeting; 'choice' is one of `options`,
  // stored as the option id rather than its localized label so a flag rule can
  // be written once for both languages.
  readonly kind: 'text' | 'choice'
  readonly options?: readonly string[]
}

export interface DiscoveryCondition {
  readonly question: string
  readonly equals: string
}

// A rule fires when every one of its conditions matches an answer that is
// actually there. Conditions are a conjunction and never a disjunction, which
// is why "no documents and no CRM" is one rule with two conditions rather than
// two rules.
export interface DiscoveryFlagRule {
  readonly id: string
  readonly when: readonly DiscoveryCondition[]
  // The section worth rereading when this flag comes up, by section id.
  readonly reread: string
}

export interface SummaryQuestion {
  readonly id: string
  readonly label: string
  // Present for 'choice' questions: maps the stored option id to the wording
  // the reader saw. A value with no entry here is written out as stored.
  readonly optionLabels?: Readonly<Record<string, string>>
}

export interface SummaryBlock {
  readonly heading: string
  readonly questions: readonly SummaryQuestion[]
}

// Extra sections appended after the four blocks — the raised flags and the
// still-open questions. Skipped entirely when they have no items.
export interface SummarySection {
  readonly heading: string
  readonly items: readonly string[]
}

function nonEmpty(value: DiscoveryAnswerValue | undefined): readonly string[] {
  if (value === undefined) return []
  const list = typeof value === 'string' ? [value] : value
  return list.map((item) => item.trim()).filter((item) => item.length > 0)
}

// Whitespace counts as nothing typed: a reader who tabbed through a textarea
// has not answered it, and must not be treated as having answered it.
export function isAnswered(value: DiscoveryAnswerValue | undefined): boolean {
  return nonEmpty(value).length > 0
}

export function unansweredQuestions(
  questions: readonly DiscoveryQuestion[],
  answers: DiscoveryAnswers,
): readonly string[] {
  return questions.filter((q) => !isAnswered(answers[q.id])).map((q) => q.id)
}

export function answeredQuestions(
  questions: readonly DiscoveryQuestion[],
  answers: DiscoveryAnswers,
): readonly string[] {
  return questions.filter((q) => isAnswered(answers[q.id])).map((q) => q.id)
}

function matches(condition: DiscoveryCondition, answers: DiscoveryAnswers): boolean {
  return nonEmpty(answers[condition.question]).includes(condition.equals)
}

// An empty form is not a red form. A condition only matches an answer that is
// present, so a checklist nobody has touched raises nothing; a rule with no
// conditions is treated as never firing rather than as always firing, so a
// malformed rule stays quiet instead of shouting at every reader.
export function evaluateFlags(
  rules: readonly DiscoveryFlagRule[],
  answers: DiscoveryAnswers,
): readonly string[] {
  return rules
    .filter((rule) => rule.when.length > 0 && rule.when.every((c) => matches(c, answers)))
    .map((rule) => rule.id)
}

function renderValue(
  value: DiscoveryAnswerValue,
  optionLabels: Readonly<Record<string, string>> | undefined,
): string {
  const parts = nonEmpty(value).map((item) => optionLabels?.[item] ?? item)
  // Continuation lines are indented by two spaces so a multi-line note stays
  // inside its own list item instead of ending the list.
  return parts
    .flatMap((part) => part.split(/\r?\n/))
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n  ')
}

// Every block keeps its heading even when nothing under it was answered, so the
// pasted summary always shows the four blocks and it is visible at a glance
// which one the meeting never got to.
export function buildSummary(
  blocks: readonly SummaryBlock[],
  answers: DiscoveryAnswers,
  sections: readonly SummarySection[] = [],
): string {
  const parts: string[] = []

  for (const block of blocks) {
    const items = block.questions.flatMap((question) => {
      const value = answers[question.id]
      if (value === undefined || !isAnswered(value)) return []
      return [`- **${question.label}** — ${renderValue(value, question.optionLabels)}`]
    })
    parts.push(items.length > 0 ? `## ${block.heading}\n\n${items.join('\n')}` : `## ${block.heading}`)
  }

  for (const section of sections) {
    if (section.items.length === 0) continue
    parts.push(`## ${section.heading}\n\n${section.items.map((item) => `- ${item}`).join('\n')}`)
  }

  return `${parts.join('\n\n')}\n`
}
