import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '06-support-first-project': {
    prompt:
      'A support lead opens the meeting with: "put a bot on our site that answers customers directly — we do not want agents touching it." You get one recommendation for the first project. What is it?',
    options: [
      'The public chatbot exactly as asked, live on the knowledge base the team has today',
      'An operator assistant drafting the reply inside the agent\'s tools, the agent sends',
      'A retrieval system that publishes its answer to the customer with nobody reviewing',
      'Search across the closed-ticket archive, returning past cases instead of a draft',
    ],
    explanations: [
      'A public chatbot is unsupervised: every mistake reaches the customer who triggered it, and every gap in the knowledge base becomes a wrong answer with the company name under it. It also demands a clean knowledge base, which is the one thing this team does not have yet. Usually the third project, not the first.',
      'Correct. The draft goes to a trained operator who still decides and still presses send, so the same knowledge-base gaps get caught before they leave the building — and it can go live on the messy knowledge base the company actually has rather than the tidy one a chatbot needs.',
      'Publishing straight to the customer is the chatbot again wearing a different label. The retrieval step does not add supervision; a human deciding whether the draft goes out is what adds supervision, and this option removes exactly that.',
      'Retrieving similar past cases leaves the operator doing the writing. The ask was a faster reply, and a list of prior tickets is a research aid, not a drafted answer with the relevant policy already surfaced.',
    ],
  },
  '06-crm-twin-question': {
    prompt:
      'In a pipeline review a rep asks two things in one breath: "what did we discuss with this account last month" and "how many logistics deals closed above the segment average this quarter." You are scoping both. How do they split?',
    options: [
      'Both are RAG questions, since both concern deals recorded in the CRM',
      'Both are text2SQL, since every deal record sits in the same database',
      'The first is RAG over notes and call transcripts, the second is text2SQL',
      'The first is text2SQL over the CRM, the second is RAG over won proposals',
    ],
    explanations: [
      'What was discussed lives in prose and is retrieved as a passage. A count of deals above a threshold is an aggregate — a number that does not exist in any document until a query produces it. Calling both retrieval collapses that difference and gets the second one wrong.',
      'The discussion question has no rows behind it. No CRM schema carries a column for what a rep said on a call, so a generated query against that question returns either nothing or something invented.',
      'Correct. Indexing notes, transcripts and emails to surface what was said is retrieval; counting deals above a threshold is an aggregate over deal records, which is a generated query. Same conversation, two solution classes — the twin-question trap.',
      'The two are swapped. A SQL query cannot reconstruct a conversation, and searching the text of past proposals will not produce a reliable count of deals above a threshold.',
    ],
  },
  '06-legal-extraction-order': {
    prompt:
      'The head of legal wants party and date extraction plus risk flagging across 400 lease agreements, scoped and delivered as a single project. What do you propose instead?',
    options: [
      'Run extraction and risk flagging in parallel, reconciling the two outputs at the end',
      'Drop extraction and deliver risk flagging alone, since that is where the value sits',
      'Let the model set the risk threshold itself and have legal review only what it flags',
      'Ship extraction first and alone, with a lawyer checking a sample against the PDFs',
    ],
    explanations: [
      'Reconciling at the end is too late. A wrong renewal date flows into the risk analysis while the analysis is being built, and the error surfaces as a confident conclusion rather than as a mismatch anyone would notice.',
      'Extraction is the quiet prerequisite for everything else here. Until a renewal date has been pulled out of each lease, "which of these renew this quarter" is not a question a database can answer at all.',
      'A model has no house view on what counts as an acceptable liability cap. That threshold comes from a template or a playbook a lawyer writes; asking the model to invent it means legal reviews a list assembled against nobody\'s standard.',
      'Correct. Extraction goes first, on its own, and a lawyer checks a sample of the extracted fields against the source documents before any risk analysis is built on top of them — because everything downstream inherits those fields being right.',
    ],
  },
  '06-access-control-prerequisite': {
    prompt:
      'An IT director wants one assistant answering across wiki documents, HR leave balances and ticket status, rolled out company-wide from day one. What do you put on the table before the technology?',
    options: [
      'Whether retrieval inherits the permissions the source documents already carry',
      'Whether one tidy department folder can serve as the scope for the first pilot',
      'Whether the context window is large enough to hold the whole wiki at once',
      'Whether an HR-only bot should ship first and the rest of the company later',
    ],
    explanations: [
      'Correct. A retrieval system either inherits the permissions its documents already have, or it becomes the fastest route for a junior hire to read the executive severance policy. That is not a tuning detail to settle after a good demo — it is a precondition, and raising it first is what keeps the project from being stopped by security later.',
      'A pilot on one clean folder is precisely the trap this domain sets. It works beautifully, then meets ten years of duplicated, contradictory, unowned documents the moment it goes company-wide.',
      'Context size has nothing to do with the risk here. The question is who is allowed to see which document, and that is unchanged by how much text fits into a single prompt.',
      'Narrowing to HR sidesteps the permissions problem rather than solving it, and the ask was explicitly company-wide from day one. The same question returns the moment scope expands.',
    ],
  },
  '06-analytics-review-step': {
    prompt:
      'A CFO holds up a clean, confidently worded revenue figure produced by a text2SQL system and says it is ready for the board pack. What do you tell them?',
    options: [
      'The clean formatting shows the query joined the correct tables, so it can ship',
      'It already matches the audited figure, because the warehouse is the one source',
      'Fluency proves nothing; someone has to check the figure against a known source',
      'It confirms "active customer" was counted the way finance defines that term',
    ],
    explanations: [
      'Formatting is produced by the language model, not by the query. A well-laid-out answer looks identical whether the join was right or wrong, which is exactly why this failure is invisible.',
      'No comparison against an audited figure happens on its own. That comparison is the review step this domain requires, and it needs a named person whose job includes doing it.',
      'Correct. A confident, well-formatted answer says nothing about whether the query behind it was right. The failure here is not a crash but a plausible number that is quietly wrong, so two things must exist before it reaches a report: a person who spot-checks against a known source, and a visible query that makes the check possible.',
      'How "active customer" is counted is a warehouse-readiness question settled in the schema and the marts, long before the answer is worded. The tone of the output cannot vouch for it.',
    ],
  },
}
