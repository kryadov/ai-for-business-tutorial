import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '01-chatgpt-api-category-error': {
    prompt:
      'A colleague drafts a proposal line: "We will use the ChatGPT API to power the client\'s support bot." What is the precise problem with that sentence?',
    options: [
      'It collapses product, model and platform into one word, leaving a technical listener unable to tell what would actually be bought or integrated',
      'It should say "the OpenAI API" only, because model names are irrelevant',
      'Nothing is wrong; ChatGPT does have an API for building bots this way',
      'It is correct for support bots but wrong for internal tools',
    ],
    explanations: [
      'Correct. Saying "the ChatGPT API" tells a technical listener that product, model and platform were never separated, so nobody on the call can tell what is being bought, integrated or billed.',
      "Dropping the model name doesn't fix the sentence — the client still needs to know which GPT model, and which platform, actually serves it.",
      'ChatGPT is the finished chat product; it does not expose the kind of line-by-line API this sentence implies you\'d integrate into a helpdesk.',
      'The category error is identical regardless of use case — an internal tool built on "the ChatGPT API" has the same problem as a support bot.',
    ],
  },
  '01-building-on-claude': {
    prompt:
      'A client emails: "Our team already has a workflow built on Claude — can you extend it?" Before answering, what is the one clarifying question this section says you must ask?',
    options: [
      'Which version number of Claude they are running',
      'Whether they mean the chat app open in a browser tab, or a model reached through an API',
      'Whether Anthropic or a reseller issued their invoice',
      'Whether their workflow already produces the outcome they want',
    ],
    explanations: [
      "A version number only matters once you already know you're talking about the model layer — asking it first skips past the ambiguity in the client's sentence.",
      'Correct. "Claude" names both the chat product and the model family behind it — the same one-word-for-two-layers pattern as ChatGPT and GPT, so you ask exactly what you\'d ask about those two.',
      "That question belongs to the platform-versus-vendor distinction, not this one — it matters once you already know they mean the API, not the chat app.",
      'A worthwhile discovery question eventually, but it doesn\'t resolve which of the two layers "Claude" refers to in their sentence.',
    ],
  },
  '01-platform-not-vendor': {
    prompt:
      'A logistics company already runs all of its infrastructure on a specific cloud and is contractually barred from moving data off it. They ask you to "just use the best model." What should you determine before naming any model?',
    options: [
      'Which model scores highest on public benchmarks',
      "Whether the model supports their industry's terminology",
      'Which platform can serve a suitable model inside the cloud they are already locked into, and whose contract governs that platform',
      'Which company trained the model they end up using',
    ],
    explanations: [
      "A benchmark score doesn't answer the constraint in front of you: a top-scoring model served from the wrong platform is still unusable if it can't sit inside their cloud.",
      "Terminology fit is a real evaluation criterion later in the process, but it does nothing to resolve the residency constraint blocking the conversation right now.",
      'Correct. This client cares which platform serves the model and whose data-processing agreement applies — not which company trained it, exactly backwards from the usual instinct.',
      'The company that trained the model is the detail this client can afford to be indifferent to — it decides nothing about where their data physically sits.',
    ],
  },
  '01-llama-not-a-competitor': {
    prompt:
      'A prospect says: "Is Llama better than ChatGPT?" What makes this comparison a category error rather than just an imprecise question?',
    options: [
      'Llama is newer, so any comparison is premature',
      'ChatGPT is more expensive, so the comparison is about price, not quality',
      'Llama only runs on specialized hardware, so the two are not interchangeable',
      'The two names sit at different layers — one is a model you deploy on infrastructure, the other is a product you open with no equivalent download',
    ],
    explanations: [
      'Release timing has nothing to do with why the comparison fails — even a same-day release would still sit at the wrong layer for this comparison.',
      "Price framing skips the actual mismatch: the two names don't even answer the same question, regardless of what either one costs.",
      'Hardware requirements are a downstream deployment detail, not the reason the comparison is a category error in the first place.',
      'Correct. Llama is a model you place on infrastructure before it does anything; ChatGPT is a product a person opens with no download involved — different layers, different questions.',
    ],
  },
  '01-placing-a-new-name': {
    prompt:
      "Mid-call, a client mentions a name you've never heard, then asks what your team can build with it. What is the fastest way to place it, per this section, without pretending to know more than you do?",
    options: [
      'Ask what the model scores on recent leaderboards',
      "Ask who built it, whether it's the trained model or something wrapping it, and through whose infrastructure it would run",
      'Ask the client to send documentation before continuing the call',
      'Assume it is a product, since most names people mention in calls are',
    ],
    explanations: [
      "A leaderboard score presumes you already know which layer you're scoring — company, model or product — and that's exactly what's still undetermined.",
      'Correct. Company, model-or-product, and platform are the three questions this section says to ask in order, out loud, before the conversation moves on to what the thing can do.',
      'Pausing the call to read documentation gives up the one advantage in the room: a live person who can just answer the layering questions directly.',
      "Assuming product is exactly the collapse this section warns against — plenty of names people mention are the underlying model, not something they've opened.",
    ],
  },
}
