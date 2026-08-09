import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '03-token-billing': {
    prompt:
      'A client\'s finance lead pushes back on last month\'s invoice: "why did the bill triple when we didn\'t send more messages?" What\'s the most likely explanation?',
    options: [
      'The vendor changed the price per token silently',
      "Conversations got longer, and documents pasted into calls carry far more tokens even when the message count doesn't rise",
      'The context window shrank, forcing more calls to cover the same ground',
      'The model started hallucinating more, generating longer replies by mistake',
    ],
    explanations: [
      'A silent price change would explain a jump, but nothing here points to it, and it skips past the mechanism the section spells out: token volume, not message count, drives the bill.',
      "Correct. Tokens are what a vendor meters, counted on both what's sent and what comes back — a few long documents pasted into context inflate the token count per call even when the number of messages stays the same.",
      'A context window is a ceiling on what fits into one exchange; it does not shrink from month to month, and hitting it produces an error or a truncated prompt, not a bigger invoice.',
      'Longer replies do add tokens, but tying that to hallucination confuses accuracy with length — a wordy correct answer costs exactly as much as a wordy wrong one.',
    ],
  },
  '03-context-window-not-knowledge': {
    prompt:
      'A project sponsor says: "we spent three hours last month walking the model through our entire pricing policy — it should still have all of that." What do you tell them?',
    options: [
      'It remembers everything discussed, as long as the same account is used for future questions',
      'It kept whatever parts of the session it judged most important',
      'Nothing from that session persists on its own; it only reappears in a future answer if someone captures it and puts it back into the prompt',
      'It remembers the conversation for a limited number of days before forgetting',
    ],
    explanations: [
      'Account continuity has nothing to do with it. Once that exchange ends and its content falls out of the context window, there is no separate memory tied to the account that keeps it.',
      'The model does not triage a conversation for importance and store the winning parts; there is no mechanism inside it that selects and retains anything at all.',
      'Correct. The context window is working memory, not long-term storage — once the exchange that filled it ends, none of it carries forward unless it was captured and deliberately supplied again.',
      "A fixed retention window would still be a form of memory the model doesn't have; the accurate statement is that nothing persists between exchanges without deliberate re-supply, not that it persists for a while.",
    ],
  },
  '03-hallucination-not-a-bug': {
    prompt:
      'A demo answers a compliance question with a specific, confident detail that turns out to be invented. A stakeholder asks: "when will the vendor patch this?" What is the accurate answer?',
    options: [
      'Soon — the next model release should eliminate it',
      "Only on older models; the current version doesn't do this",
      'Once the system prompt is tightened, it will stop happening',
      'It is not a patchable bug — the same mechanism that produces a fluent correct answer produces a fluent wrong one, so the fix is a review step, not a version bump',
    ],
    explanations: [
      "A future release can improve rates, but it cannot remove the mechanism itself: generating plausible text is what the model does, and 'plausible' and 'true' are not the same property.",
      'Model version is beside the point. Every model in this family generates its answer the same way, so the possibility of a confident wrong answer travels with the mechanism, not with an old build.',
      'Prompt tightening can reduce how often this happens in narrow cases, but it cannot close off the underlying behavior — a case outside what the tightened prompt anticipated reopens it.',
      "Correct. There is no error state the model falls into when it doesn't know something; it keeps generating fluent text regardless, so the fix that actually holds is a human or system check before the answer is used.",
    ],
  },
  '03-model-no-domain-expertise': {
    prompt:
      'A prospect says: "your assistant already gets our business — it answered a question about our renewal process perfectly in the demo." What should you check before agreeing?',
    options: [
      "Whether that answer's content actually came from something supplied in the prompt or a document, rather than from the model's own understanding of their company",
      'Whether other companies in the same industry have used the same assistant before',
      'Whether asking the same question twice produces the same answer',
      "Whether the model's training data is recent enough to include their current process",
    ],
    explanations: [
      "Correct. Every correct-sounding answer traces back to either the prompt for that exchange or the training data — checking which one it was is exactly how you find out whether the system 'gets' their business or just got fed the right paragraph this once.",
      "Other customers' usage says nothing about whether this client's own process facts are anywhere the model can reach; it doesn't establish where this answer's content came from.",
      'Repeating the question would show whether the answer is stable, not whether its content is grounded in something real about the client. A model can repeat a confident invention consistently too.',
      "Training recency is beside the point here — a client's internal renewal process is not the kind of fact that appears in general training data no matter how recent it is; it has to arrive through the prompt.",
    ],
  },
  '03-review-cost-of-being-wrong': {
    prompt:
      'Two deliverables are being scoped for the same client: a first-draft marketing caption generator, and a tool that computes a discount percentage that gets written straight into a contract. A junior colleague proposes the same light review — an occasional spot check — for both. What is the problem?',
    options: [
      'There isn\'t one; identical, lightweight review is proportionate since both tools use the same underlying model',
      "The discount tool needs a review step priced into its design, because a wrong number that reaches a contract costs far more than a caption a person will skim and edit anyway",
      'Both need a full second model to verify every output before anything ships',
      "Neither needs review, because a fluent answer from the model is itself evidence that it's correct",
    ],
    explanations: [
      'Using the same model tells you nothing about the cost of being wrong in each case — that cost is what should set how much checking a given output gets, and it differs sharply between the two.',
      'Correct. Where a wrong answer is expensive — a figure that lands in a contract unedited — a review step belongs in the architecture and the price up front; where it is cheap to catch, like a caption someone will read anyway, lighter review is a reasonable choice.',
      'A second model call adds cost without changing the underlying issue: both outputs come from the same kind of process, and a second model can be confidently wrong in the same way as the first.',
      'Fluency and accuracy are not the same signal; a fluent sentence is not evidence that its content is correct, which is exactly why review is a separate step rather than something the model provides on its own.',
    ],
  },
}
