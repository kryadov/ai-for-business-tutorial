export interface TopicText {
  // Test mode: a scenario ("a client says X, what do you answer") with a
  // fixed number of options, mirroring src/data/quizzes/text.types.ts.
  readonly testPrompt: string
  readonly testOptions: readonly string[]
  readonly testExplanations: readonly string[]
  // Cards mode: the same topic in its original open form, plus the model
  // answer the reader compares their own attempt against.
  readonly cardQuestion: string
  readonly cardAnswer: string
}
