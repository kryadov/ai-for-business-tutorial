import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '10-documents-or-database': {
    prompt:
      'A client says: "Tell me what our expense policy says about international travel, and while you\'re at it, how much the sales team actually spent on international travel last quarter." A vendor scopes the whole thing as one RAG project. What do you tell the client?',
    options: [
      'Nothing is wrong — retrieval over the policy files covers the wording question and the spend question alike.',
      'One half is retrieval, the other is a database query; scoped as RAG alone, the spend number is never produced.',
      'It needs a single agent, since two separate systems have to be consulted before either answer comes back.',
      'It is a workflow: answering both halves runs the same two steps, in the same order, on every such call.',
    ],
    explanations: [
      'Retrieval returns passages, not aggregates. The spend figure does not live in any document until someone runs the query that produces it.',
      'Correct. One sentence can hide two deliverables, and scoping all of it as retrieval quietly drops the half that needed a database query. Say so on the call, before the statement of work is written around the wrong half.',
      'A person reads both answers here, and nobody asked the system to act on its own — so calling it an agent skips the first question the tree asks.',
      'Answering two different questions is not a fixed sequence of steps. A workflow is a system executing the same actions in order, not a person reading two kinds of answer.',
    ],
  },
  '10-person-or-system': {
    prompt:
      'A logistics client says: "when a shipment is delayed, handle it — notify the customer, rebook the carrier, or escalate, whichever fits." A colleague proposes an assistant that drafts the notification for a dispatcher to send. What do you correct before the colleague keeps going?',
    options: [
      'Nothing — producing the notification for a dispatcher to send is exactly what an assistant is built to do.',
      'The place to start is whether the reason for the delay is already written down in the carrier\'s records.',
      'Nobody reads a draft before anything moves here, so the system acts alone — the tree\'s first question.',
      'The check that was missed is whether the steps stay identical no matter what caused the shipment to be late.',
    ],
    explanations: [
      'Drafting for a dispatcher assumes a person is still in the loop, but the client asked for delays to be handled — nobody described reading a draft before it goes out.',
      '"Is the answer written down" is the second-branch question, and it only applies once you already know a person reads the output. That has not been established here.',
      'Correct. The tree opens with who acts, person or system, and the client put the system in charge — which is the branch the assistant framing skipped past.',
      'Whether the path varies decides workflow against agent, but only after the system has been confirmed to act on its own. Asked first, it still skips the root question.',
    ],
  },
  '10-fixed-steps-or-varying-path': {
    prompt:
      'An insurer wants claims under $500 auto-approved, claims from $500 to $5,000 sent to a senior adjuster, and claims above $5,000 or flagged for fraud sent to investigations — every claim goes through the same three-way check, in the same order. A vendor proposes an agent that decides case by case. What do you propose instead?',
    options: [
      'Workflow — the same three thresholds, in the same order, on every claim; only the amount moves, not the steps.',
      'Agent — the outcome differs from claim to claim, so each case has to be judged on what it contains.',
      'Text2SQL — the claim total has to be aggregated out of the claims table before any routing happens.',
      'RAG — the three thresholds sit in a policy document, so the rule has to be retrieved before it applies.',
    ],
    explanations: [
      'Correct. Different claims land in different buckets, but the logic that sorts them is fixed and known in advance — a workflow with branches, not a system judging each case from scratch.',
      'Different outcomes are not a varying path. An agent earns its place when the steps depend on the content in a way nobody can fix in advance; a threshold check can be fixed in advance.',
      'The claim amount arrives with the claim. There is nothing to aggregate and no query to generate, so nothing on this request calls for a database translation step.',
      'Where the thresholds are written down does not change how a claim gets routed. Nobody is retrieving a passage to answer a question — the rule is already encoded in the branching.',
    ],
  },
  '10-why-not-the-other-four': {
    prompt:
      'A client has accepted that their revenue dashboard question is a text2SQL build. Then they ask: "why not just run RAG over our monthly PDF reports — those are already documents." What is your answer?',
    options: [
      'RAG cannot read PDF files, so every report would have to be re-exported as plain text first.',
      'RAG needs a vector index built and kept in sync, while a generated query hits the warehouse directly.',
      'RAG is built for support content and loose prose, not for the financial reporting asked about here.',
      'The PDF freezes at export; the current figure exists only once a query aggregates today\'s rows.',
    ],
    explanations: [
      'Parsing PDFs is a solved problem and not why RAG loses here. The argument is about what a document can hold, not about the file format it is stored in.',
      'Index upkeep is a real difference between the two builds, but it answers a cost question the client did not ask. They asked why the reports cannot answer them, and this leaves that standing.',
      'Retrieval works over any collection of documents, financial reports included. Naming an audience for it invents a limit that does not exist and loses the argument on a false claim.',
      'Correct. A report is frozen at export time, and the figure the client wants only exists once fresh rows are aggregated. That is the gap retrieval cannot close and a generated query closes by design.',
    ],
  },
  '10-correct-class-wasted-quarter': {
    prompt:
      'Two months in, your team ships an agent that handles exceptions in a report a branch manager runs eleven times a year. The class was right at every branch of the tree, and the build works. At the review the sponsor asks whether the quarter was well spent. What do you say?',
    options: [
      'That the class was right at every branch, which is what makes two months of build time sound.',
      'That the class was wrong — anything run only a handful of times a year belongs on the assistant branch.',
      'That the tree settles the shape of a build, never its worth; that verdict was due before the tree.',
      'That the class was wrong — a rare process belongs in a workflow, agents are for high-volume work.',
    ],
    explanations: [
      'Getting the class right answers what shape the solution takes. It says nothing about whether the shape was worth two months of the team\'s time, which is what the sponsor asked.',
      'Frequency alone does not move a request onto the assistant branch. That branch is about whether a person needs something produced from scratch, not about how often the need comes up.',
      'Correct. Naming the class is only half the job: the tree never asks whether solving the problem pays for itself, and a right answer to a low-value question is still a low-value quarter.',
      'Frequency is not one of the three questions either. Workflow against agent turns on whether the path varies, which is a separate judgement from how often the process runs.',
    ],
  },
}
