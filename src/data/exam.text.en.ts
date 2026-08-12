import type { TopicText } from './exam.text.types'

// Worked example for the writers filling in the remaining twelve topics: see
// src/data/exam.ts for the full ordered list and the answer key. Only
// 'chatgpt-vs-gpt' is written here on purpose — src/data/exam.test.ts and
// tests/parity.test.ts are meant to fail on the other twelve until their text
// lands, in both this file and exam.text.ru.ts.
export const en: Record<string, TopicText> = {
  'chatgpt-vs-gpt': {
    testPrompt:
      'A client says: "We already pay for ChatGPT Plus, so we can just point our workflow automation at GPT-4 through that same subscription." How do you respond?',
    testOptions: [
      'Yes — Plus already includes API access to the model',
      'No — ChatGPT is the product; automation needs a separate API account',
      "It doesn't matter which one the team uses",
      'GPT is just the old version that ChatGPT replaced',
    ],
    testExplanations: [
      'A ChatGPT Plus subscription pays for the chat interface a person logs into. It carries no API key, and a workflow cannot authenticate against a website login.',
      'Correct. ChatGPT is a product with its own interface and subscription; the model behind it is sold separately through an API, with its own account, billing and terms — conflating the two is how a client ends up promising an integration nobody can build.',
      'It decides the whole shape of the proposal: one is a seat a person clicks around in, the other is a metered service a system calls. Getting this wrong sizes the project incorrectly from the start.',
      'GPT is not discontinued — it is the model family that ChatGPT, the API and other products are all built on. The two exist side by side today, not one replacing the other.',
    ],
    cardQuestion: 'What is the difference between ChatGPT and GPT?',
    cardAnswer:
      "ChatGPT is a product — a chat interface, a subscription plan, and a set of default behaviors that OpenAI ships and updates. GPT is the underlying model family that actually does the language processing, and it is sold separately through an API with its own account and its own pricing. A client can hold a ChatGPT Plus subscription and have no API access at all, and the reverse is just as common. Keep the two apart when scoping a project, because 'the client already has ChatGPT' is not the same claim as 'the client already has model access to build on.'",
  },
}
