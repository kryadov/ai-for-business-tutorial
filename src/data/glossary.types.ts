export type TermId =
  | 'llm'
  | 'token'
  | 'context-window'
  | 'embeddings'
  | 'vector-db'
  | 'rag'
  | 'text2sql'
  | 'agent'
  | 'workflow'
  | 'tool-calling'
  | 'mcp'
  | 'a2a'
  | 'guardrails'
  | 'inference'

export interface Term {
  readonly term: string
  readonly definition: string
}

export const termIds: readonly TermId[] = [
  'llm', 'token', 'context-window', 'embeddings', 'vector-db', 'rag', 'text2sql',
  'agent', 'workflow', 'tool-calling', 'mcp', 'a2a', 'guardrails', 'inference',
] as const
