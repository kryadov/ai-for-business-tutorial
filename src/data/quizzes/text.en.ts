import type { QuestionText } from './text.types'

export const en: Record<string, QuestionText> = {
  '05-documents-or-database': {
    prompt:
      'A retailer asks: "how much did we sell in the north-west region last quarter, by category?" Where does that question belong?',
    options: [
      'RAG over the company wiki',
      'Text2SQL over the data warehouse',
      'An assistant with a longer context window',
      'An agent that reads the quarterly report',
    ],
    explanations: [
      'The wiki holds prose about process, not the transaction rows the question asks about. Retrieval would return pages describing how sales are reported, not the number.',
      'Correct. The answer is an aggregate over rows in a database, which is exactly what a generated query returns — and it can be re-run tomorrow with fresh data.',
      'Context size is not the constraint. The figure does not exist in any document until somebody queries the database for it.',
      'An agent could fetch the report, but the report is a stale snapshot. The question is about numbers that live in the warehouse.',
    ],
  },
  '05-rag-does-not-train': {
    prompt:
      'A client says: "so once we feed our contracts into RAG, the model will have learned our contracts." What is wrong with that sentence?',
    options: [
      'Nothing — that is what retrieval does',
      'Only the word "contracts"; RAG works on any document type',
      'RAG supplies passages as context at question time; the model weights never change',
      'RAG does train the model, but only on the documents you upload',
    ],
    explanations: [
      'Retrieval finds passages and puts them in front of the model at the moment of the question. Nothing is learned or retained.',
      'Document type is not the issue. The misconception is about learning versus retrieval.',
      'Correct. Indexing is not training. Remove a document from the index and the system stops knowing it — which is also why access control and freshness are configuration, not retraining.',
      'No training happens at any point. The model that answers tomorrow is bit-for-bit the model that answered yesterday.',
    ],
  },
  '05-when-an-agent-earns-its-keep': {
    prompt: 'Which of these actually calls for an agent rather than a workflow?',
    options: [
      'Every incoming invoice is parsed, validated and filed, always in that order',
      'A weekly report is generated from three fixed queries',
      'New employees get a welcome email followed by three onboarding tasks',
      'A support case may need the CRM, the billing system or neither, depending on what the customer wrote',
    ],
    explanations: [
      'Fixed steps in a fixed order is the definition of a workflow. An agent adds cost and non-determinism for nothing.',
      'Three fixed queries on a schedule is a scheduled job. There is no decision to make.',
      'The sequence never varies, so this is a workflow with a trigger.',
      'Correct. The path is not known in advance and depends on the content of the request — deciding which systems to touch is the work an agent does.',
    ],
  },
  '05-assistant-versus-agent': {
    prompt:
      'A sales team wants help drafting proposals from past deals. Nothing is sent without a human reading it. What is this?',
    options: [
      'An assistant',
      'An agent, because it uses CRM data',
      'A workflow, because proposals follow a template',
      'Text2SQL, because deal data lives in the CRM',
    ],
    explanations: [
      'Correct. It produces a draft for a person who stays in control of what happens next. That is an assistant, regardless of how many systems it reads from.',
      'Reading data does not make something an agent. Taking action on its own does, and here a person always sends.',
      'A template shapes the output, but the interesting work is drafting from unstructured past deals, not filling fixed fields.',
      'Some deal facts do live in the CRM, but the deliverable is a written proposal, not a number.',
    ],
  },
  '05-multi-agent-overkill': {
    prompt:
      'A vendor proposes five specialised agents — a researcher, a writer, a critic, a formatter and a coordinator — to answer support emails. What should you ask first?',
    options: [
      'Which model each agent uses',
      'Whether the agents run in parallel',
      'What one agent, or a plain retrieval step, fails to do here',
      'How many tokens the coordinator consumes',
    ],
    explanations: [
      'Model choice is downstream of whether the architecture is needed at all.',
      'Parallelism is an implementation detail of a design you have not yet agreed is warranted.',
      'Correct. Multi-agent designs multiply cost, latency and failure modes. The burden of proof is on the extra agents, and support email is usually retrieval plus one drafting step.',
      'Token accounting matters, but it measures the cost of a decision rather than testing it.',
    ],
  },
}
