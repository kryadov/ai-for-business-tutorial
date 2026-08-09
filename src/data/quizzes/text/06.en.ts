import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '06-support-first-project': {
    prompt:
      'A support lead says: "put a bot on the site that answers customers directly, no humans involved." Based on the chapter, what should you propose as the first project instead?',
    options: [
      'The public-facing chatbot, since that is literally what was requested',
      'An operator assistant that drafts replies inside the agent\'s existing tools, with the agent still sending',
      'A RAG system that publishes answers straight to customers with no review step',
      'Enterprise search over the closed-ticket archive alone',
    ],
    explanations: [
      'A public chatbot is unsupervised: every mistake reaches the customer who triggered it, and every gap in the knowledge base becomes a wrong answer with the company\'s name on it. That is why it is usually the third project, not the first.',
      'Correct. The operator assistant drafts for a trained person who still decides and hits send, so a human catches the same knowledge-base gaps before they leave the building, and it can launch on the messy knowledge base the company actually has.',
      'Publishing straight to the customer without review is the chatbot again under a different label; nobody catches the mistake before the customer sees it.',
      'Searching closed tickets does not solve the actual ask: an operator still needs a drafted reply and the relevant policy surfaced, not a list of similar past cases.',
    ],
  },
  '06-crm-twin-question': {
    prompt:
      'In one weekly pipeline review, a rep asks "what did we discuss with this account last month" and then, in the same breath, "how many deals in the logistics vertical closed above our usual deal size this year." What do these two questions map to?',
    options: [
      'Both are RAG questions, since both are about deals',
      'Both are text2SQL, since deal data lives in the CRM',
      'The first is RAG over notes and call transcripts; the second is text2SQL over the deal database',
      'The first is text2SQL; the second is RAG over won proposals',
    ],
    explanations: [
      'What was discussed lives in prose — notes and call transcripts — while the count of deals above a size is an aggregate, a number rather than a passage; treating both as retrieval misses that distinction.',
      'The discussion question has no rows to query; a database has no column for "what a rep said on a call," so text2SQL over that question returns nothing useful.',
      'Correct. Retrieving what was discussed means indexing notes and transcripts, which is RAG; counting deals above a size is an aggregate over deal records, which is text2SQL.',
      'The mapping is reversed here: the discussion question cannot be answered by a SQL query, and counting deals is not solved by searching past proposal text.',
    ],
  },
  '06-legal-extraction-order': {
    prompt:
      'The head of legal asks for party/date extraction and risk flagging on a batch of lease agreements as one project, delivered together. What does the chapter recommend?',
    options: [
      'Run both stages in parallel to save time',
      'Skip extraction — risk flagging is the valuable part',
      'Let the model decide what counts as risky on its own, without a lawyer',
      'Do extraction first, on its own, and have a lawyer check a sample against the source documents before analysis depends on those fields',
    ],
    explanations: [
      'Running both at once lets an error in an extracted date or party slide silently into the risk analysis before anyone has a chance to catch it.',
      'Extraction is the quiet prerequisite for the rest: you cannot ask "which leases renew this quarter" as a database question until someone has pulled a renewal date out of each one.',
      'A model has no house view of what counts as an acceptable risk without a playbook or template defining it locally — that judgment has to come from a lawyer, not be invented by the model.',
      'Correct. Extraction goes first and alone, and a lawyer verifies a sample against the source documents before any risk analysis is built on top of those fields.',
    ],
  },
  '06-access-control-prerequisite': {
    prompt:
      'An IT director wants an employee assistant that answers questions across documents, HR balances and ticket status, rolled out company-wide from day one. What does the chapter call non-optional before that ships?',
    options: [
      'Access control that the retrieval system correctly inherits from the underlying documents',
      'A single tidy department\'s folder to use as the pilot scope',
      'A model with the largest available context window',
      'A separate bot limited to HR questions only',
    ],
    explanations: [
      'Correct. A retrieval system inherits whatever permissions the underlying documents already have, or it becomes the fastest way for a junior hire to read something they should not see — this is called out as not optional.',
      'A pilot built on one department\'s clean folder is the exact trap the chapter warns about: it works beautifully, then meets ten years of duplicated, unowned documents once it rolls out company-wide.',
      'Context window size has nothing to do with the risk described; the risk is who can see which document, not how much text fits in a prompt.',
      'A bot scoped to HR alone sidesteps the access problem for the rest of the company rather than solving it — the ask here was a company-wide assistant.',
    ],
  },
  '06-analytics-review-step': {
    prompt:
      'A text2SQL system returns a fluent, cleanly formatted revenue number for a board report. According to the chapter, what does that fluency actually guarantee?',
    options: [
      'That the query joined the correct tables',
      'That the number matches a previously audited figure',
      'Nothing — a fluent answer says nothing about whether the query behind it was correct',
      'That "active customer" was defined the same way finance defines it',
    ],
    explanations: [
      'A fluent, well-formatted answer indicates nothing about whether the query joined the right tables — that is exactly the gap the chapter warns is invisible.',
      'No automatic comparison against an audited figure happens; that comparison is precisely the missing review step the chapter says has to exist.',
      'Correct. Nothing about a confident, well-formatted answer indicates whether the underlying query is right; the failure is not a crash but a plausible number that is quietly wrong.',
      'Agreement on what "active customer" means is a separate warehouse-readiness condition from an earlier chapter, not something the tone of an answer can guarantee.',
    ],
  },
}
