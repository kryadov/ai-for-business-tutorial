import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '07-shared-folder-rag': {
    prompt:
      'A client\'s IT lead says the index will only cover the sales team\'s shared folder, which every manager can already open, so access control is not a concern here. What do you tell him?',
    options: [
      'Agree: every sales manager can open that folder today, so indexing it exposes nothing new',
      'It is safe enough once the model runs inside the client\'s own network instead of a public API',
      'The index records that a file exists, not who it was for, so retrieval must re-check the asker',
      'A nightly rebuild drops whatever the owners have since locked down, so the index self-corrects',
    ],
    explanations: [
      'A folder the whole team can open is not a folder every file in it was meant for — one document with a narrower audience lands in the same sweep and comes back out in an answer.',
      'Where the model runs answers a different security question, the one about which network the bytes cross. It says nothing about which employee is allowed to read a given document.',
      'Correct. Indexing answers "what is here", never "who may read this", so the only working fix is permissioning at the source plus a check at query time against the asking user\'s own access.',
      'A rebuild changes how current the passages are. It does not change who may receive them, and a file that was never restricted in the first place stays retrievable by everyone.',
    ],
  },
  '07-system-prompt-defense': {
    prompt:
      'A vendor\'s proposal reads: "We instructed the model in the system prompt to ignore any commands found inside uploaded documents, so indirect injection is covered." What is missing from that claim?',
    options: [
      'Nothing: an instruction in the system prompt outranks any command met inside a document',
      'The system prompt competes for attention with the text being read, so it raises the bar only',
      'It says nothing about direct injection, where the attacker types the command into the chat',
      'It holds for plain text but not for a command hidden in a scanned or image-only attachment',
    ],
    explanations: [
      'There is no ranking. Instructions and content arrive as the same stream of tokens through the same channel, and the model has no reliable way to tell one from the other.',
      'Correct. A system prompt is a strong suggestion competing with whatever the model is reading at that moment, not a locked gate — it makes the attack harder rather than impossible, which is why "we forbade it" cannot stand alone as the defence.',
      'Direct injection is the easier half, because the attacker is visible in the chat log. The claim is specifically about text arriving inside documents, and that is the half it fails to cover.',
      'The carrier format is not the weak point. Whether the payload arrives as typed text or as scanned pixels, the model still cannot separate data it was asked to read from an instruction to obey.',
    ],
  },
  '07-agent-refund-authority': {
    prompt:
      'A client wants an agent that issues the refund automatically the moment a return is marked validated, so nobody waits on an operator. What do you build in before agreeing to that?',
    options: [
      'Credentials only for the refund system, a human approval before money moves, an audit trail',
      'A system prompt telling the agent to be careful with customer money and to check twice first',
      'A longer context window so the agent can read the customer\'s whole order history first',
      'Nothing extra: once the return shows as validated in the source system, paying it is routine',
    ],
    explanations: [
      'Correct. Moving money is expensive to reverse, so the agent gets least-privilege credentials, a person confirms the irreversible step before it fires, and the decision is logged well enough to trace afterwards.',
      'Wording is not an access control. A sentence about being careful does not remove the agent\'s ability to fire a refund it should never have held the credentials to fire.',
      'How much the agent can read affects the quality of its decision, not the question of who authorised it to move money with nobody checking.',
      'A validated flag is a data state, not a permission. The payout is still irreversible, and irreversible steps are exactly the ones that need a person to approve them first.',
    ],
  },
  '07-one-error-rate': {
    prompt:
      'A client asks "what error rate can we live with?" before anyone has discussed how the answers will actually be used. What is the honest reply?',
    options: [
      'Under 1%, the bar production systems are normally held to once they are past the pilot',
      'Zero: an answer that can be wrong at all should not reach employees or customers',
      'It follows from the model chosen, since a more capable model earns a looser tolerance',
      'It depends on the use case: a draft a human rereads tolerates more than an unreviewed reply',
    ],
    explanations: [
      'A single company-wide number borrowed from nowhere in particular is the reassurance this question should not get, and it will be quoted back at you when one use case misses it.',
      'A zero bar treats a first draft that a person edits and an answer sent unread to a customer as the same risk. They are not, and no system clears zero anyway.',
      'Model capability shifts what the error rate turns out to be. It does not decide what the client can afford, which depends on who checks the output and what a mistake costs.',
      'Correct. A reviewed draft costs a few minutes when it is wrong, an unreviewed answer to a customer costs a relationship, so the acceptable rate — and whether a person checks every answer or a sample — is set per use case, not once for the company.',
    ],
  },
  '07-guardrails-later': {
    prompt:
      'A vendor\'s timeline reads "core feature first, guardrails in phase two once we know the product is worth it." What do you push back on?',
    options: [
      'Nothing: deferring guardrails keeps the pilot cheap and phase two adds them once value shows',
      'Only the missing date — phase two belongs on the calendar before the pilot ever starts',
      'Permissioning, filtering and review sit in the architecture, so adding them later is a rebuild',
      'Only the scope: an internal tool can wait, guardrails are for bots that customers talk to',
    ],
    explanations: [
      'The saving is illusory. The system can produce the embarrassing answer during the pilot, well before phase two starts, and by then the cost is reputational rather than engineering days.',
      'A firm date does not fix the shape of the thing. The system was built as if access control and filtering did not exist, and that has to be undone before either can be fitted.',
      'Correct. Guardrails are not a coat of paint applied after the building is finished — permissioning, filtering and review touch the architecture itself, which is why retrofitting them usually means rebuilding rather than adding.',
      'An internal tool leaks to employees, which is exactly the failure worth worrying about here. The risk follows who can see what the system retrieves, not which side of the firewall they sit on.',
    ],
  },
}
