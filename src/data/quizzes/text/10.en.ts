import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '10-documents-or-database': {
    prompt:
      'A client says: "Tell me what our expense policy says about international travel, and while you\'re at it, how much did the sales team actually spend on international travel last quarter." A vendor scopes this as a single RAG project. What is the problem?',
    options: [
      'Nothing — both are questions RAG can answer directly.',
      'The policy text is RAG, the spend figure is text2SQL — scoping the whole thing as retrieval leaves the number unanswered, since no document contains it yet.',
      'It should be scoped as a single agent, since something has to look up two different things.',
      'It should be scoped as a workflow, since answering both questions follows the same sequence every time.',
    ],
    explanations: [
      'Retrieval returns passages, not aggregates. The spend figure does not live in any document until someone runs the query that produces it.',
      "Correct. One sentence can hide two different deliverables, and a vendor who scopes the whole thing as retrieval quietly drops the half that needed a database query.",
      "A person reads both answers here — nobody asked the system to act on its own, so calling this an agent skips the tree's first question.",
      'Answering two different questions is not a fixed sequence of actions; workflow describes a system executing steps on its own, not a person reading two different kinds of answer.',
    ],
  },
  '10-person-or-system': {
    prompt:
      'A logistics client says: "when a shipment is delayed, handle it automatically — notify the customer, rebook the carrier, or escalate, whatever fits." A colleague scopes this as an assistant that drafts the notification for a dispatcher to send. What did the colleague get wrong at the very first branch of the tree?',
    options: [
      'Nothing — drafting the notification for a dispatcher is exactly what an assistant does.',
      'They should have started by asking whether the delay reason is already written down somewhere.',
      "They answered a later question before the first one: nothing here says a person reads the output before anything happens — the client wants the system to act on its own, which is the root question the tree asks before any other.",
      'They should have checked whether the steps taken are always the same regardless of the delay reason.',
    ],
    explanations: [
      'Drafting for a dispatcher assumes a person is still in the loop, but the client asked for delays to be "handled automatically" — nobody described reading a draft before it goes out.',
      '"Is the answer written down" is the second-branch question, and it only applies once you already know a person reads the output. Here that has not been established.',
      "Correct. The tree's first question is who acts — person or system — and the client's own words put the system in charge, which the colleague's assistant framing skipped entirely.",
      "Whether the steps vary matters, but only after you've confirmed the system acts on its own — asking it first still skips the root question.",
    ],
  },
  '10-fixed-steps-or-varying-path': {
    prompt:
      'An insurer wants claims under $500 auto-approved, claims from $500 to $5,000 routed to a senior adjuster, and claims above $5,000 or flagged for fraud sent to a special investigations unit — every claim goes through the same three-way check, in the same order. A vendor proposes an agent that decides case by case. What is the better class here, and why?',
    options: [
      'Workflow — the check itself never changes: same three thresholds, same order, on every claim; only the claim amount varies, not the sequence of steps taken to decide.',
      'Agent — because the outcome differs depending on the claim amount.',
      'Text2SQL — because a number has to be looked up before the routing decision.',
      'RAG — because the thresholds are written down in a policy document somewhere.',
    ],
    explanations: [
      "Correct. Different claims land in different buckets, but the decision logic that sorts them is fixed and known in advance — that's a workflow with branches, not a system judging unstructured content case by case.",
      'Different outcomes are not the same as a varying path. An agent earns its place when the steps depend on the content of the request in a way that cannot be fixed in advance; a threshold check can be.',
      'The claim amount is already known when the claim arrives; there is no aggregation to run and no query to generate, so nothing here calls for text2SQL.',
      'Where the thresholds are written down is irrelevant to how the claim gets routed — nobody is retrieving a passage to answer a question here.',
    ],
  },
  '10-why-not-the-other-four': {
    prompt:
      'A client has agreed your proposal is a text2SQL system for their revenue dashboard question. Then they ask: "why not just use RAG on our monthly PDF reports — that\'s already a document." What is the strongest answer for why RAG loses here?',
    options: [
      'RAG cannot parse PDF files, so it is technically impossible here.',
      'RAG needs a vector database and text2SQL does not, so text2SQL is the lighter build.',
      'RAG is designed for support tickets, not financial reports.',
      "The PDF is a snapshot from whenever it was generated, and the question asks for current figures; no document contains that number until someone runs the aggregation that produces it — which is what the generated query does, not a retrieval step.",
    ],
    explanations: [
      'Parsing PDFs is a solved problem and not the reason RAG is the wrong class here; the issue is what the document can and cannot contain.',
      'Infrastructure weight is a real difference between the two, but it is not the argument that settles which class fits the question being asked.',
      'RAG has no restriction to support tickets — it works over any collection of documents. That is not why it loses this argument.',
      "Correct. A PDF report is frozen at export time; the figure the client wants only exists once a query aggregates current rows, which is exactly the gap RAG can't close and text2SQL closes.",
    ],
  },
  '10-correct-class-wasted-quarter': {
    prompt:
      "A team spends two months building a fully correct agent — right class, right architecture — automating exception handling for a report a manager runs eleven times a year. The classification was right at every step. What does the tree's caveat say about this project?",
    options: [
      'Nothing — a well-classified agent is by definition a good investment.',
      'The class was wrong — anything used only a few times a year should have been scoped as an assistant instead.',
      "The tree only tells you the shape of a solution, not whether the underlying problem is worth solving; a correctly classed agent for a process nobody hits often is still a wasted quarter, and that judgment has to come from the value question asked earlier, not from the tree.",
      'The class was wrong — infrequent processes should always be built as workflows, since agents are reserved for high-volume cases.',
    ],
    explanations: [
      "Getting the class right answers what shape the solution takes, not whether building it was worth two months of the team's time.",
      'Frequency alone does not move a request onto the assistant branch — that branch is about whether a person needs something produced from scratch, not about how often the need arises.',
      "Correct. Naming the class correctly is only half the job; the tree never asks whether solving this problem pays for itself, and a right answer to a low-value question is still a low-value project.",
      "Frequency is not one of the tree's three questions either; whether the path varies is what decides workflow versus agent, and that's a separate judgment from how often the process runs.",
    ],
  },
}
