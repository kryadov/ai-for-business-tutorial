export interface DecisionQuestionText {
  readonly prompt: string
  readonly options: Readonly<Record<string, string>>
}

export interface DecisionLeafText {
  readonly verdict: string
  readonly summary: string
}

export interface DecisionScenarioText {
  readonly prompt: string
  readonly analysis: string
}

export interface DecisionTreeText {
  readonly questions: Readonly<Record<string, DecisionQuestionText>>
  readonly leaves: Readonly<Record<string, DecisionLeafText>>
  // Keyed by `${leafId}.${solutionClass}` — see rejectionKey in
  // src/core/decision-engine.ts. One entry per rejected class per leaf, so the
  // argument belongs to the path the reader actually took.
  readonly rejections: Readonly<Record<string, string>>
  readonly scenarios: Readonly<Record<string, DecisionScenarioText>>
}
