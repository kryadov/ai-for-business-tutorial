import type { Term, TermId } from './glossary.types'

export const en: Record<TermId, Term> = {
  'llm': {
    term: 'LLM',
    definition:
      'A large language model: a system trained to continue text. It manipulates information you give it; it does not hold your company knowledge unless you supply it.',
  },
  'token': {
    term: 'Token',
    definition:
      'The unit a model reads and writes in — roughly a word fragment. Vendors bill per token, so tokens are the unit your invoice is denominated in.',
  },
  'context-window': {
    term: 'Context window',
    definition:
      'The maximum amount of text a model can consider at once, counted in tokens. Anything beyond it has to be selected, summarised or dropped.',
  },
  'system-prompt': {
    term: 'System prompt',
    definition:
      'The standing instruction an application places in front of a model: who it is, what it may do, how it should sound. It shapes answers strongly, but it is not a lock — the model reads it as text, alongside everything else it is given.',
  },
  'embeddings': {
    term: 'Embeddings',
    definition:
      'Numeric representations of text that place similar meanings close together, which is what lets a system retrieve passages by meaning rather than by keyword.',
  },
  'vector-db': {
    term: 'Vector database',
    definition:
      'A store built to search embeddings quickly. It is where a retrieval system keeps the indexed fragments of your documents.',
  },
  'rag': {
    term: 'RAG',
    definition:
      'Retrieval-augmented generation: find the relevant passages first, then let the model answer using them. It supplies context, it does not train the model.',
  },
  'text2sql': {
    term: 'Text2SQL',
    definition:
      'Turning a question in plain language into a database query. It answers questions about numbers in a database, where RAG answers questions about text in documents.',
  },
  'agent': {
    term: 'Agent',
    definition:
      'A system that decides its own next step and takes actions in other systems, rather than only producing text for a person to act on.',
  },
  'workflow': {
    term: 'Workflow',
    definition:
      'A process with fixed steps decided in advance. When the steps never vary, a workflow is cheaper and more predictable than an agent.',
  },
  'tool-calling': {
    term: 'Tool calling',
    definition:
      'Letting a model invoke a defined function — search a catalogue, create a ticket — instead of only describing what should happen.',
  },
  'mcp': {
    term: 'MCP',
    definition:
      'Model Context Protocol: a common way to expose tools and data to a model, so an integration written once can serve any compatible client.',
  },
  'a2a': {
    term: 'A2A',
    definition:
      'Agent2Agent: a protocol for agents built by different teams to discover each other and delegate work. It addresses a different layer than MCP rather than competing with it.',
  },
  'prompt-injection': {
    term: 'Prompt injection',
    definition:
      'Text a model reads as data and then obeys as an instruction. It arrives either in the chat message itself or from inside a document, email or web page the model was asked to read.',
  },
  'guardrails': {
    term: 'Guardrails',
    definition:
      'The checks placed around a model — on what goes in, what comes out and what it is allowed to do — that keep a working demo from becoming an incident in production.',
  },
  'inference': {
    term: 'Inference',
    definition:
      'Running a trained model to produce an answer. It is the recurring cost of an AI system, as opposed to the one-off cost of building it.',
  },
  'discovery': {
    term: 'Discovery',
    definition:
      'The conversations that precede a proposal, where you establish the client\'s problem, process, available data and constraints. While discovery is running, no architecture, timeline or price has been promised yet.',
  },
}
