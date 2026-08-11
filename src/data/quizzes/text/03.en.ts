import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '03-token-billing': {
    prompt:
      'A client\'s finance lead pushes back on last month\'s invoice: "why did the bill triple when nobody sent more messages than before?" What is the most likely explanation?',
    options: [
      'The vendor quietly raised its per-token price partway through the month',
      'Whole documents got pasted into calls, so each call carried far more tokens',
      'The context window shrank, so covering the same ground now takes more calls',
      'The model invented more facts, and those wrong answers ran longer than usual',
    ],
    explanations: [
      'A silent price change would explain a jump, but nothing here points to one, and it skips the mechanism that actually drives the bill: token volume, not message count.',
      "Correct. Tokens are what a vendor meters, counted on both what you send and what comes back — a few long documents dropped into context inflate the token count per call even when the number of messages stays flat.",
      'A context window is a ceiling on what fits into one exchange; it does not shrink from month to month, and hitting it produces a truncated prompt or an error, not a bigger invoice.',
      'Longer replies do add tokens, but tying length to invention confuses accuracy with volume — a wordy correct answer costs exactly what a wordy wrong one costs.',
    ],
  },
  '03-context-window-not-knowledge': {
    prompt:
      'A project sponsor says: "we spent three hours last month walking the model through our whole pricing policy — it should still have all of that." What do you tell them?',
    options: [
      'It remembers all of it, as long as your team keeps using the same account',
      'It kept the parts of that session it judged most important to the project',
      'None of it persists on its own; it returns only if someone re-supplies it',
      'It holds a conversation for a set number of days, then drops the oldest part',
    ],
    explanations: [
      'Account continuity has nothing to do with it. Once that exchange ends and its content falls out of the context window, there is no separate store tied to the account holding it.',
      'The model does not triage a conversation for importance and keep the winning parts; there is no mechanism inside it that selects and retains anything after the exchange closes.',
      'Correct. The context window is working memory, not long-term storage — once the exchange that filled it ends, nothing carries forward unless somebody captured it and deliberately put it back into a later prompt.',
      "A fixed retention period would still be a kind of memory the model does not have. The accurate statement is that nothing survives between exchanges without deliberate re-supply, not that it survives for a while.",
    ],
  },
  '03-hallucination-not-a-bug': {
    prompt:
      'In a demo the assistant answers a compliance question with a specific, confident figure that turns out to be invented. A stakeholder asks when the vendor will patch this. What is the accurate answer?',
    options: [
      'The next model release should remove it — that is what a roadmap is for',
      'Older builds did this; the version in the demo has moved past the problem',
      'Tightening the system prompt with stricter wording will stop it happening',
      'It is not patchable; a fluent wrong answer uses the same mechanism as a right one',
    ],
    explanations: [
      "A future release can lower how often this happens, but it cannot remove the mechanism itself: producing plausible text is what the model does, and 'plausible' and 'true' are different properties.",
      'Build age is beside the point. Every model of this kind constructs its answer the same way, so the possibility of a confident wrong answer travels with the mechanism, not with an old version.',
      'Tighter prompting can cut how often this shows up in narrow cases, but it cannot close the behaviour off — the first case the tightened wording did not anticipate reopens it.',
      "Correct. There is no error state the model falls into when it does not know something; it keeps generating fluent text regardless, so the only fix that holds is a human or system check before the answer is used, priced in from the start.",
    ],
  },
  '03-model-no-domain-expertise': {
    prompt:
      'A prospect says: "your assistant already gets our business — it answered a question about our renewal process perfectly in the demo." What should you check before agreeing?',
    options: [
      'Whether that answer came out of a document someone supplied before the demo',
      'Whether other firms in the same industry have run this assistant in production',
      'Whether asking the same question a second time produces the same answer again',
      'Whether the training data is recent enough to cover their current process',
    ],
    explanations: [
      "Correct. Every answer traces back to either the prompt for that exchange or the training data, and nothing else — establishing which one it was is exactly how you find out whether the system understands their business or simply got handed the right paragraph once.",
      "What other customers did says nothing about whether this client's own process facts are anywhere the model can reach; it does not establish where the content of this answer came from.",
      'Repeating the question shows whether the answer is stable, not whether its content is grounded in anything real about the client. A model will repeat a confident invention just as consistently.',
      "Training recency is beside the point — a client's internal renewal process is not the kind of fact that lands in general training data at any vintage. It has to arrive through the prompt.",
    ],
  },
  '03-review-cost-of-being-wrong': {
    prompt:
      'Two tools are being scoped for the same client: a first-draft caption generator, and a calculator whose discount figure is written straight into a signed contract. A colleague proposes the same occasional spot check for both. What is the problem?',
    options: [
      'Nothing — both tools run on the same model, so one level of checking fits both',
      'The discount tool needs a review step in the design and the price; the captions do not',
      'Both need a second model verifying every output before anything leaves the building',
      'Neither needs review, since a fluent answer is itself evidence the figure is right',
    ],
    explanations: [
      'A shared model tells you nothing about the cost of being wrong in each case, and that cost is what should set how much checking an output gets. Here the two costs are nowhere near each other.',
      'Correct. Where a wrong answer is expensive — a figure landing in a signed contract unedited — the review step belongs in the architecture and the price up front; where the mistake is cheap to catch, like a caption someone reads anyway, lighter review is a defensible choice.',
      'A second model adds cost without changing the underlying issue: both outputs come out of the same kind of process, and the checker can be confidently wrong in exactly the way the first one was.',
      'Fluency and accuracy are not the same signal. A fluent sentence is no evidence that its content is correct, which is precisely why review has to be a separate step rather than something the model supplies on its own.',
    ],
  },
}
