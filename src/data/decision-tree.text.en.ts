import type { DecisionTreeText } from './decision-tree.text.types'

export const en: DecisionTreeText = {
  questions: {
    'q-actor': {
      prompt: 'When the system produces something, who acts on it?',
      options: {
        'person-acts': 'A person reads it and decides what happens next',
        'system-acts': 'The system does the thing itself, without waiting',
      },
    },
    'q-need': {
      prompt: 'What does that person actually need from it?',
      options: {
        'find-in-documents': 'To find something written down in documents',
        'number-from-database': 'A figure that only exists once someone computes it',
        'something-drafted': 'A draft they will edit, send, sign or discard',
      },
    },
    'q-steps': {
      prompt: 'Do the steps change from one case to the next?',
      options: {
        'always-the-same': 'No — the same steps, in the same order, every time',
        'depends-on-the-case': 'Yes — the path depends on what arrived',
      },
    },
    'q-system-does': {
      prompt: 'On a varying path, what is the system doing at each step?',
      options: {
        'decides-and-acts': 'Choosing what to do next and doing it in other systems',
        'only-looks-things-up': 'Only fetching information and handing it over',
      },
    },
  },

  leaves: {
    'leaf-rag-person': {
      verdict: 'RAG',
      summary:
        'Someone needs an answer that is already written down somewhere. Index the documents, retrieve the passages, answer with them cited. The interesting engineering is the retrieval and the access control, not the model.',
    },
    'leaf-text2sql': {
      verdict: 'Text2SQL',
      summary:
        'The answer is a number nobody has computed yet. Generate the query, show it, and put a review step between the figure and any report it lands in.',
    },
    'leaf-assistant': {
      verdict: 'Assistant',
      summary:
        'A person needs a draft and stays in control of what happens to it. This is the cheapest class to ship and the one clients are most embarrassed to ask for.',
    },
    'leaf-workflow': {
      verdict: 'Workflow',
      summary:
        'The steps are known in advance and never vary. Encode them. It is cheaper, faster, testable, and boring in the way production systems should be.',
    },
    'leaf-agent': {
      verdict: 'Agent',
      summary:
        'The path genuinely depends on what arrived, and the system acts on its own. Now the real questions start: which actions are irreversible, who signs off on them, and what the audit trail looks like.',
    },
    'leaf-rag-system': {
      verdict: 'RAG',
      summary:
        'A system that only ever looks things up is retrieval, whatever the proposal calls it. The varying path is in the question, not in the actions — nothing irreversible ever happens.',
    },
  },

  rejections: {
    'leaf-rag-person.text2sql':
      'Nothing here is an aggregate. The answer is a paragraph somebody already wrote, and a generated query has no rows to count.',
    'leaf-rag-person.assistant':
      'Nothing is being drafted. The reader wants a passage found and quoted, not new text produced for them to edit.',
    'leaf-rag-person.agent':
      'The system takes no action at all — a person reads the answer and decides. Autonomy would be theatre.',
    'leaf-rag-person.workflow':
      'There are no steps to encode. One question, one lookup, one answer, with nothing that varies from case to case.',

    'leaf-text2sql.rag':
      'Retrieval would return the policy that defines the metric, not the metric. The number is not in any document until a query produces it.',
    'leaf-text2sql.assistant':
      'The deliverable is a figure, not prose. Drafting adds words around a number that still has to be right.',
    'leaf-text2sql.agent':
      'Nobody asked the system to act on the figure. It reports; a person decides what the figure means.',
    'leaf-text2sql.workflow':
      'The question changes every time it is asked. There is no fixed sequence to encode, only a query to generate.',

    'leaf-assistant.rag':
      'Retrieval alone hands back what already exists. The person needs something that does not exist yet, written for this case.',
    'leaf-assistant.text2sql':
      'There is no number at the end of this. A query cannot draft a paragraph, however clean the schema is.',
    'leaf-assistant.agent':
      'A person edits and sends. The moment they stop doing that it becomes an agent, and that is a different conversation about permissions.',
    'leaf-assistant.workflow':
      'The output differs every time because the input does. A fixed sequence would produce the same document regardless of the case.',

    'leaf-workflow.rag':
      'Nothing is being looked up. The steps are known; the difficulty is running them reliably, not finding them.',
    'leaf-workflow.text2sql':
      'A query might be one of the steps, but it is not the shape of the solution. The value is the sequence, not the number.',
    'leaf-workflow.assistant':
      'Nobody is drafting anything. A person is not in the middle of this at all once it is running.',
    'leaf-workflow.agent':
      'An agent decides what to do next. Here the next step is already decided, so the decision-making would add cost, latency and failure modes for nothing.',

    'leaf-agent.rag':
      'Retrieval would find the relevant policy and stop. The work is what happens after that, in other systems.',
    'leaf-agent.text2sql':
      'A figure might be needed along the way, but the deliverable is an action taken, not a number reported.',
    'leaf-agent.assistant':
      'Nobody is waiting to read a draft. The moment a person has to approve every step, the autonomy that justifies the cost disappears.',
    'leaf-agent.workflow':
      'The path cannot be drawn in advance — it depends on what arrived. A workflow would need a branch for every case nobody has thought of yet.',

    'leaf-rag-system.text2sql':
      'What varies is which document answers the question, not which rows to sum. There is no aggregate here.',
    'leaf-rag-system.assistant':
      'A person is not in this loop. If one were, the varying path would be theirs to walk, not the system\'s.',
    'leaf-rag-system.agent':
      'This is the case section 5 calls search dressed as autonomy. Nothing irreversible happens, so the permissions, confirmations and audit trail an agent needs would guard nothing.',
    'leaf-rag-system.workflow':
      'The lookup differs by case, so there is no fixed sequence — but the difference is in the question asked, not in the steps taken.',
  },

  scenarios: {
    'university-regulations': {
      prompt:
        'A university registrar asks: "our thesis formatting rules run to forty pages and change every year — students email us the same six questions all week. Can we just let them ask?"',
      analysis:
        'A person asks, reads the answer, and acts on it themselves; the answer is written down in a document that already exists. Retrieval, with the current year\'s regulations in the index and the old ones out of it — the freshness problem here is bigger than the model problem.',
    },
    'utility-tariff-switchers': {
      prompt:
        'A utility company\'s commercial director asks: "how many households moved to the new tariff last quarter, split by region?" — and wants to ask that kind of question himself, without going through analysts.',
      analysis:
        'That number is in no document until somebody computes it, and he reads the result rather than acting on it automatically. Text2SQL, with the generated query visible and a review step before any figure reaches a board pack.',
    },
    'publisher-blurb-draft': {
      prompt:
        'A publishing house wants back-cover copy drafted from each manuscript. The editor rewrites most of it, and nothing goes to print without them.',
      analysis:
        'The editor stays in control and the output is new text, not a retrieved passage. An assistant. The tell is the sentence "nothing goes to print without them" — that is the definition, not a caveat.',
    },
    'fleet-repair-intake': {
      prompt:
        'A transport company logs every repair request the same way: photograph the fault, check the vehicle in the register, assign a mechanic, notify the driver. Always those four, always that order.',
      analysis:
        'The system acts, and the steps never vary. A workflow with a trigger. An agent would add cost and unpredictability to a sequence that is already decided — and would be harder to test.',
    },
    'museum-loan-request': {
      prompt:
        'A museum receives loan requests for objects. Depending on the object, a request may need the conservation department, the insurer, an export licence, or none of them — and the system is expected to route it and open the right cases itself.',
      analysis:
        'The path depends on what arrived, and the system acts in other systems rather than drafting for a curator. An agent — and the first questions after that are which of those actions are irreversible and who confirms them.',
    },
    'construction-standard-lookup': {
      prompt:
        'A construction firm wants a system that, given any drawing under review, finds the building standards that apply to it and puts them in front of the engineer. Which standards apply differs with every drawing.',
      analysis:
        'The path varies, so it sounds agent-shaped — but the system only ever fetches and hands over. Retrieval. Section 5 calls this search dressed as autonomy, and the giveaway is that nothing irreversible ever happens.',
    },
  },
}
