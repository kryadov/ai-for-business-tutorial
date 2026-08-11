import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '08-both-directions-billed': {
    prompt:
      'A support lead scoping a retrieval-backed bot budgets it like this: "the average reply runs about 150 words, so that\'s our token cost." How do you answer?',
    options: [
      'Agree, because the reply is the billed unit and everything else rides along for free',
      'Warn that the reply is being counted twice, once going out and once coming back',
      'Point out that instructions, retrieved passages and prior turns are billed as well',
      'Explain that retrieval-backed answers are metered per document instead of per token',
    ],
    explanations: [
      'The reply is only the outbound half. Every call also carries system instructions, retrieved passages and the earlier turns, and each of those is metered on the way in.',
      'There is no double count here. The estimate undercounts rather than overcounts, because it never priced the inbound side of the call at all.',
      'Correct. Instructions, retrieved passages and conversation history are billed on the way in, on top of the reply, and in a long-running chat that inbound side can outweigh everything the bot ever says.',
      'Retrieval does not change the unit. Pulled passages are pasted into the prompt and billed as the tokens they are, which is why ten long passages cost more than three short ones.',
    ],
  },
  '08-demo-multiplier': {
    prompt:
      'A client watched a five-turn demo and now wants the cost of a fifty-turn production chat: "ten times the turns, so ten times the demo, right?" What do you say?',
    options: [
      'No: every turn resends the conversation before it, so the total climbs much steeper',
      'No: only the retrieved passages pile up, and the earlier turns are never resent',
      'Yes: turns are priced one at a time, so the total tracks the turn count in a line',
      'Roughly yes: the growth sits in the replies, and replies stay about the same length',
    ],
    explanations: [
      "Correct. Turn fifty costs turn fifty's reply plus forty-nine turns of accumulated history, so the total grows with the sum of every turn's context — ten times the turns buys well over ten times the tokens.",
      'Retrieved passages do accumulate, but the conversation is resent too. The model holds no memory between calls, so the history has to travel with every request.',
      'Turns are priced one at a time, yet each one carries a longer prompt than the last, so a straight-line projection off a short demo lands low — and lands low by a widening margin.',
      'Reply length is the steady part; it is the prompt that swells. By turn fifty the inbound side carries the whole conversation, and that is where the multiplier hides.',
    ],
  },
  '08-output-tokens-pricier': {
    prompt:
      'A drafting feature regenerates an entire contract every time one clause is edited. The client wants the running cost down without losing quality. What do you propose?',
    options: [
      'Trim the system prompt so each call carries fewer standing instructions to the model',
      'Compress the source contract before sending it, so the inbound side of the call shrinks',
      'Turn the verbosity setting down so the model writes in a plainer, less padded style',
      'Return only the edited clause, since generating a token costs more than reading one',
    ],
    explanations: [
      'A leaner system prompt shaves input tokens, which are the cheaper stream. The expensive part of this call — writing a whole contract out again — is untouched by it.',
      'Compressing the source trims the cheap inbound stream while the feature still produces the entire contract at the pricier outbound rate, on every single edit.',
      'A plainer style removes some padding, but the feature still reproduces every clause it was already handed, and pays the generation rate for each one of them.',
      'Correct. Generating a token costs more than reading one, so returning the edited clause instead of the whole contract cuts the expensive stream — and cuts it on every edit, thousands of times a day.',
    ],
  },
  '08-build-vs-run': {
    prompt:
      'A manufacturer hears the build estimate and says: "good, so that is what this costs." What do you add before the meeting ends?',
    options: [
      'Nothing, since the build estimate answers the question asked and covers the project',
      'A second number: what inference costs per call, for as long as the feature is live',
      'A contingency line, because build estimates for this work rarely survive first contact',
      'A retraining schedule, since refreshing the model is the expense they have not counted',
    ],
    explanations: [
      'The build estimate ends when the feature ships. It says nothing about what happens each time a real user calls the feature afterwards, month after month.',
      'Correct. Inference recurs on every call for as long as the feature stays live and grows with usage, which makes it a monthly number sitting beside the project number rather than inside it.',
      'Contingency argues about how accurate the build number is. What is missing is a different number entirely — the operating cost that starts the day the feature goes live.',
      'Retraining is not what recurs here. The feature lives on inference: a model answering real questions, billed every time, whether or not anyone ever refreshes the weights.',
    ],
  },
  '08-fixed-floor-vs-per-token': {
    prompt:
      'A retail chain\'s engineering lead says: "put an open-weight model on our own hardware, the token bill goes to zero, so it is cheaper." How do you reframe that?',
    options: [
      'The token bill really does go to zero, so the saving starts from the very first month',
      'Self-hosting suits companies that already run open-weight models somewhere else',
      'It swaps a per-token bill for a fixed floor: hardware, operations, someone on call',
      'The real axis here is control over the data, so cost is not what decides the question',
    ],
    explanations: [
      'The variable half of the bill does disappear. The fixed half underneath it does not: hardware, operations and a person on call are paid in a quiet month exactly as in a busy one.',
      'Prior experience with open weights is not what decides this. What decides it is whether monthly volume is large enough to clear the fixed floor that self-hosting creates.',
      'Correct. The honest comparison is per-token price against a fixed monthly floor — hardware, operations, and whoever is paged when it falls over — and self-hosting only wins once volume clears that floor.',
      'Control over data is a legitimate reason to self-host, but it does not answer the cost claim that was just made. The volume-against-floor comparison still has to be done.',
    ],
  },
}
