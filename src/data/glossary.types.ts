export type TermId =
  | 'llm'
  | 'token'
  | 'context-window'
  | 'system-prompt'
  | 'embeddings'
  | 'vector-db'
  | 'rag'
  | 'text2sql'
  | 'agent'
  | 'workflow'
  | 'tool-calling'
  | 'mcp'
  | 'a2a'
  | 'prompt-injection'
  | 'guardrails'
  | 'inference'
  | 'discovery'

export interface Term {
  readonly term: string
  readonly definition: string
}

export const termIds: readonly TermId[] = [
  'llm', 'token', 'context-window', 'system-prompt', 'embeddings', 'vector-db', 'rag',
  'text2sql', 'agent', 'workflow', 'tool-calling', 'mcp', 'a2a', 'prompt-injection',
  'guardrails', 'inference', 'discovery',
] as const
