import type { DiscoveryText } from './discovery'

export const en: DiscoveryText = {
  questions: {
    'a-problem': {
      label: 'What problem is being solved?',
      hint: 'A specific, recurring cost — who loses what, and how often. "We want to be more efficient with AI" means the thinking has not been done yet.',
      options: {},
    },
    'a-owner': {
      label: 'Who owns the process?',
      hint: 'Not who called the meeting: who is measured on the outcome and loses something if it does not improve.',
      options: {
        named: 'Named — a person and a role, not a department',
        none: 'Nobody — no sponsor has been found',
      },
    },
    'a-success': {
      label: 'What does success look like?',
      hint: 'Keep asking until a metric and a direction come out. Write it in their words, and note who agreed to it out loud.',
      options: {},
    },
    'a-kpi': {
      label: 'What are the current KPIs?',
      hint: 'The number the success metric has to move from. Without it, the improvement you deliver cannot be measured or defended.',
      options: {},
    },
    'b-performers': {
      label: 'Who does the work today?',
      hint: 'A name and a role. A department cannot demo a workflow; the two people who actually do it can.',
      options: {},
    },
    'b-steps': {
      label: 'What steps do they take?',
      hint: 'Ask for them in order, out loud, and write them down as you hear them. Every "and then it depends" is worth going back to.',
      options: {
        described: 'Listed in order, and written down',
        'not-described': 'Nobody could give them in order',
      },
    },
    'b-manual': {
      label: 'Where is the manual labour?',
      hint: 'Clients flag the step that annoys them, not the step that costs the most time. Ask about the second one separately.',
      options: {},
    },
    'b-delays': {
      label: 'Where do the delays happen?',
      hint: 'A three-day approval queue is an organisational bottleneck, and no model resolves it. A slow step and a manual step need different fixes.',
      options: {},
    },
    'c-documents': {
      label: 'Are there documents?',
      hint: 'Policies, contracts, tickets, wiki pages, past proposals — anything written down that already contains the answer somewhere.',
      options: {
        yes: 'Yes — there is written material to retrieve from',
        no: 'No — nothing written down worth retrieving',
      },
    },
    'c-database': {
      label: 'Is there a CRM, warehouse or database?',
      hint: 'A question answered by counting, summing or filtering rows is a different project from a question answered by finding a passage.',
      options: {
        yes: 'Yes — rows can be counted, summed and filtered',
        no: 'No structured store to query',
      },
    },
    'c-knowledge-base': {
      label: 'Is there a knowledge base, and who maintains it?',
      hint: 'Ask who edits it and how often, not only whether it exists — a base with no owner accumulates the contradictions that make retrieval unreliable.',
      options: {},
    },
    'c-structure': {
      label: 'Is the data structured or not?',
      hint: 'A spreadsheet with consistent columns is closer to a database than to a document, whatever format it is saved in.',
      options: {},
    },
    'c-access': {
      label: 'Are document access rights segregated?',
      hint: 'Retrieval does not inherit permissions on its own: the index knows a document is there, not who was meant to open it.',
      options: {
        segregated: 'Yes — restricted documents are kept apart from open ones',
        'not-segregated': 'No — whatever is indexed is readable by anyone',
      },
    },
    'd-cloud': {
      label: 'Can the cloud be used?',
      hint: 'By policy, by contract with their own customers, or by regulation. Find out before you bring an architecture the client cannot approve.',
      options: {
        allowed: 'Yes — data may leave their infrastructure',
        'not-allowed': 'No — the data stays inside',
      },
    },
    'd-security': {
      label: 'What security requirements exist, and who owns them?',
      hint: 'A certification, an approved vendor list, an internal review process. Discovery only has to surface that they exist and who signs them off.',
      options: {},
    },
    'd-personal-data': {
      label: 'Is personal data involved?',
      hint: 'Names, health records, financial details — anything covered by data-protection law.',
      options: {
        yes: 'Yes — personal data is in the process',
        no: 'No personal data is involved',
      },
    },
    'd-regulatory': {
      label: 'What does this industry forbid?',
      hint: 'A bank, a hospital and a marketing agency do not work under the same ceiling. The client’s own compliance team answers faster than any outsider.',
      options: {},
    },
    'd-error-cost': {
      label: 'What does a wrong answer cost?',
      hint: 'Money, a legal position, someone’s health — or an afternoon. The answer decides how much review the design has to carry.',
      options: {
        high: 'High — money, a legal position or health is on the line',
        low: 'Low — a wrong answer is caught and fixed cheaply',
      },
    },
    'd-reviewer': {
      label: 'Is there a reviewer before the result is used?',
      hint: 'Somebody who sees the output and can stop it, on the cases that matter rather than on every case.',
      options: {
        yes: 'Yes — a person checks before it goes out',
        no: 'No — the result is used as produced',
      },
    },
  },
  flags: {
    'personal-data': {
      title: 'Personal data is present',
      consequence:
        'The cloud question is open again, not settled. Revisit it before you promise an architecture.',
      reread: 'Reread chapter 7, on security and guardrails.',
    },
    'no-corpus': {
      title: 'No documents and no CRM',
      consequence:
        'RAG has nothing to retrieve from. The first project is building a corpus, not building a system on top of one.',
      reread: 'Reread chapter 5, on solution classes.',
    },
    'steps-undescribed': {
      title: 'Nobody can describe the process in order',
      consequence:
        'It is too early to talk about an agent, or even a workflow. Describe the process first, automate it second.',
      reread: 'Reread chapter 5, on solution classes.',
    },
    'no-owner': {
      title: 'No named process owner',
      consequence:
        'Nobody is accountable for the outcome, which usually means nobody is actually buying the result.',
      reread: 'Reread chapter 2, on the business lens.',
    },
    'no-reviewer': {
      title: 'A high cost of error with no reviewer in the loop',
      consequence:
        'Human-in-the-loop is not an add-on for later. It belongs in the design from the first sketch.',
      reread: 'Reread chapter 7, on security and guardrails.',
    },
    'access-not-segregated': {
      title: 'Document access is not segregated',
      consequence:
        'Retrieval will quote a restricted document to whoever phrases the question well enough.',
      reread: 'Reread chapter 7, on security and guardrails.',
    },
  },
}
