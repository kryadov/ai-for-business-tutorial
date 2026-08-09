import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '07-shared-folder-rag': {
    prompt:
      'A client\'s IT lead says the RAG index only pulls from a folder that\'s already "shared" internally, so access control isn\'t a concern. What should you tell them?',
    options: [
      'Agree — if the folder is already shared, indexing it changes nothing',
      'It\'s safe as long as the model itself is hosted inside the client\'s VPC',
      'Indexing does not know who a document was meant for, only that it exists — permissions have to be checked at query time against what the asking user could already open',
      'The risk goes away once the index is refreshed nightly',
    ],
    explanations: [
      '"Shared" internally does not mean every file in that folder was meant for every reader — a file with a narrower audience can still land in a folder that gets indexed whole.',
      'Where the model is hosted is a data-location question from a different part of the discovery conversation, not a question about who is allowed to see a given document.',
      'Correct. The index only knows a document is there, not who it was restricted to — retrieval has to be re-checked against the asking user\'s own access, not the folder\'s label.',
      'Refresh frequency affects how current an answer is, not who is permitted to receive it — staleness and access control are separate problems.',
    ],
  },
  '07-system-prompt-defense': {
    prompt:
      'A vendor\'s proposal reads: "We instructed the model in the system prompt to ignore any commands found inside uploaded documents, so indirect injection is covered." What is missing from that claim?',
    options: [
      'Nothing — a system prompt instruction is authoritative and the model always obeys it over document content',
      'The system prompt is a strong suggestion competing for the model\'s attention with whatever text it is currently processing — it raises the bar but does not remove the risk',
      'A mention of direct injection, which is the more dangerous variant',
      'It only works for plain text; it fails once the document contains an embedded image',
    ],
    explanations: [
      'A system prompt is not a locked gate — the model has no reliable way to tell content it was asked to read from an instruction it should follow, since both arrive as the same stream of tokens.',
      'Correct. The system prompt competes for attention with whatever the model is processing at that moment; it makes the attack harder, not impossible, which is why "we forbade it" is not a defence on its own.',
      'Direct injection is the easier half to defend because you can see the attacker typing it — indirect injection, arriving inside a document, is the one this claim actually needs to answer for.',
      'The format of the carrier is not the issue here — the problem is the model\'s inability to separate data to read from instructions to follow, regardless of whether that data is text or an image.',
    ],
  },
  '07-agent-refund-authority': {
    prompt:
      'A client wants an agent that issues a refund automatically the moment a return is marked validated, to cut turnaround time. What do you build in before agreeing to that?',
    options: [
      'Credentials scoped only to the refund system, human confirmation before the refund actually fires, and an audit trail of what the agent decided and why',
      'A more detailed system prompt telling the agent to be careful with the customer\'s money',
      'A longer context window so the agent can read the customer\'s full order history before deciding',
      'Nothing extra — if the return was already validated, issuing the refund is routine',
    ],
    explanations: [
      'Correct. A refund is expensive to reverse, so it needs least-privilege access, a human approval step before the money moves, and a record of the decision that can be traced if something goes wrong.',
      'Wording in a prompt is not an access control — it does not stop the agent from being able to fire a refund it should not have the credentials to fire in the first place.',
      'Context window size affects how much the agent can read, not who decided it is allowed to move money without anyone checking first.',
      'Validation in the source system is a data state, not a permission — the action is still irreversible, and irreversible actions are exactly the ones that need a person to approve them.',
    ],
  },
  '07-one-error-rate': {
    prompt:
      'A client asks "what error rate can we live with?" before you have discussed how the answers will actually be used. What is the honest answer?',
    options: [
      'Under 1%, since that is the industry standard for production AI systems',
      'Zero — anything above that is not worth shipping',
      'It depends on the model chosen; a more capable model justifies a higher tolerance',
      'It depends on the use case — a draft a human reviews before sending can tolerate more errors than an answer that reaches a customer unreviewed',
    ],
    explanations: [
      'Naming a single industry-wide number is exactly the reassurance this question should not get — the acceptable rate is a property of the use case, not a constant borrowed from elsewhere.',
      'A zero bar ignores that some answers pass through a human before anyone acts on them and some do not — those are different risks with different acceptable rates.',
      'Which model was chosen speaks to capability, not to who checks the output before it reaches someone or how expensive a mistake is once it does.',
      'Correct. A reviewed first draft and an unreviewed answer sent straight to a customer carry different costs when wrong, so the acceptable rate — and whether a human checks every answer or a sample — is set per use case.',
    ],
  },
  '07-guardrails-later': {
    prompt:
      'A vendor\'s timeline reads "core feature first, guardrails in phase two once we know the product is worth it." What should you push back on?',
    options: [
      'Nothing — sequencing guardrails after the core feature keeps the pilot\'s cost down',
      'Only that phase two needs a firm date on the calendar',
      'Guardrails are not a coat of paint applied after the building is finished — permissioning, filtering and review touch the architecture itself, so retrofitting them usually means rebuilding',
      'Guardrails only matter for chatbots that face external customers, so an internal tool can safely skip them for now',
    ],
    explanations: [
      'The saving is illusory — the system can produce an embarrassing or harmful answer before phase two ever starts, and by then the cost is reputational, not just engineering time.',
      'A date on phase two does not fix the underlying problem: the system was already built as if access control and filtering did not exist, and that shape has to be undone before guardrails fit.',
      'Correct. Access control, filtering and review are load-bearing parts of the architecture, not a layer added on top — building without them first usually means rebuilding once they are finally required.',
      'An internal tool can leak just as badly as an external one — the risk is about who can see what the system retrieves, not about which side of the company firewall the users sit on.',
    ],
  },
}
