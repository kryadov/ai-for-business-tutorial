import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '08-both-directions-billed': {
    prompt:
      'A client scopes a RAG-powered support bot and budgets it with: "the average reply is about 150 words, so that\'s the token cost." What\'s missing from that estimate?',
    options: [
      'Nothing is wrong — reply length is what determines the bill',
      'The estimate double-counts the output tokens',
      'The prompt tokens — system instructions, retrieved passages, and conversation history — are billed too, and on a long-running chat they can dwarf the reply itself',
      'Token billing only applies to plain chat, not RAG-augmented replies',
    ],
    explanations: [
      'Reply length is only half the bill. Every call also sends system instructions, retrieved passages and prior turns, and all of that is billed as input tokens too.',
      "There's no double counting here — the estimate is undercounting, not overcounting, because it never priced the prompt side of the call at all.",
      'Correct. Input tokens — instructions, retrieved passages, and conversation history — are billed on top of the reply, and on a long-running chat that side of the bill can dwarf the output.',
      'Token billing applies to every call regardless of whether retrieval is involved; RAG just adds more input tokens to the same metered request.',
    ],
  },
  '08-demo-multiplier': {
    prompt:
      'In the demo, five-turn conversations cost about $0.02 each. The client wants to forecast fifty-turn production conversations by multiplying that by ten. What do you tell them?',
    options: [
      "No — cost isn't ten times the demo; each turn resends the whole history so far, so cost grows with the sum of every turn's growing context, not with turn count",
      "That's the right approach — cost scales linearly with turn count",
      "Ten times the demo turns means ten times the cost, because it's the same conversation type",
      "The demo number is irrelevant in production; the API charges a flat monthly rate regardless of turns",
    ],
    explanations: [
      "Correct. Each turn resends the whole conversation so far, so the fiftieth turn costs the fiftieth turn's reply plus forty-nine turns of accumulated history — the total grows faster than turn count.",
      'Cost does not scale linearly with turn count once history is being resent — a ten-times increase in turns produces a much larger increase in total tokens billed.',
      "Multiplying by ten assumes every turn costs the same as the first, but turn fifty also carries forty-nine turns of history that turn one never had.",
      "The demo figure isn't irrelevant — it's the wrong basis for a linear projection, not a number to discard outright.",
    ],
  },
  '08-output-tokens-pricier': {
    prompt:
      'A drafting feature currently asks the model to "rewrite the whole document with the requested change applied" on every edit. The client wants to cut the running cost without touching quality. What is the highest-leverage change?',
    options: [
      'Switch to a shorter system prompt',
      'Compress the input document before sending it',
      'Lower the verbosity setting',
      'Ask the model to return only the diff or the changed section, not the whole document, since output tokens are billed at the pricier rate',
    ],
    explanations: [
      'A shorter system prompt trims input tokens, which are billed at the cheaper rate; it does not touch the expensive side of the call.',
      'Compressing the input document reduces the cheaper input tokens, leaving the costly full-document output untouched.',
      'Lower verbosity trims some filler, but the feature still regenerates the entire document at the pricier output rate on every edit.',
      'Correct. Generating each output token costs more than reading an input token, so returning only the diff instead of the whole document cuts the expensive side of the bill, on every call, at scale.',
    ],
  },
  '08-build-vs-run': {
    prompt:
      'A manufacturing client hears the build estimate and asks "so how much will this cost," treating that number as the whole answer. What are you missing if you don\'t correct that?',
    options: [
      'Nothing — the build estimate already is the total cost of the project',
      'A second, separate number: the recurring inference cost of running the feature every time a real user calls it, for as long as it stays live',
      'A discount that should be applied for future maintenance work',
      'The cost of periodically retraining the model on new data',
    ],
    explanations: [
      'The build estimate covers the one-off cost of shipping the feature; it says nothing about what happens every time a live user calls it afterward.',
      'Correct. Inference recurs on every call for as long as the feature stays live and scales with usage, which is a different number from the one-time cost of building it.',
      "Maintenance discounts aren't the gap here — the missing number is the ongoing per-call cost of running the feature, not future engineering work.",
      'Nothing in the section ties this cost to retraining; the recurring cost being missed is inference on real calls, not model updates.',
    ],
  },
  '08-fixed-floor-vs-per-token': {
    prompt:
      'A retail client\'s engineering lead insists: "self-host an open-weight model and we stop paying for tokens, so it\'s automatically cheaper." What\'s the accurate reframe?',
    options: [
      'Self-hosting is always cheaper once volume is nonzero, because the per-token bill drops to zero',
      'Self-hosting only makes sense for companies that already use open-weight models elsewhere',
      "The comparison isn't per-token price versus zero — it's per-token price versus a fixed monthly floor covering hardware, operations, and whoever is paged when it breaks, and it only wins once volume clears that floor",
      "API price and self-hosting price will converge automatically as GPUs get cheaper",
    ],
    explanations: [
      "The per-token bill does drop to zero, but the fixed costs underneath it — hardware, operations, staffing — don't, so 'cheaper' depends on volume, not on the switch itself.",
      "Prior use of open-weight models isn't the deciding factor here — what decides it is whether the client's token volume clears the fixed monthly floor.",
      'Correct. Self-hosting swaps a variable per-token bill for a fixed floor covering hardware, operations and support; it only pays off once volume is high enough to clear that floor.',
      "GPU prices moving doesn't make the comparison automatic — someone still has to check both numbers at the time of the decision, since neither is fixed forever.",
    ],
  },
}
