import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '04-embeddings-vs-knowledge-base': {
    prompt:
      "A chatbot built on your client's support content keeps giving contradictory answers. The vendor's fix is \"we'll switch to a better vector database.\" Where does the actual problem most likely sit?",
    options: [
      "In the embeddings model — it isn't placing similar meanings close enough together",
      'In the vector database — its index needs re-tuning for the document volume',
      'In the knowledge base — the source documents themselves disagree with each other',
      'In the application — it needs a longer context window to hold more passages',
    ],
    explanations: [
      'Embeddings position similar meanings near each other; a placement problem shows up as irrelevant passages returned, not passages that contradict one another once found.',
      'Index tuning changes retrieval speed and recall at scale, not whether two retrieved documents say opposite things about the same policy.',
      'Correct. Contradictory answers usually mean contradictory source documents — old and new policy versions both still indexed, no owner keeping either current. That is a data-quality problem, not an infrastructure one.',
      'A bigger context window lets the model hold more retrieved passages at once; it does nothing to reconcile two passages that disagree.',
    ],
  },
  '04-read-versus-act': {
    prompt:
      'A proposal states the assistant will "have access to the billing system." The client\'s ops lead asks what that phrase actually commits you to. What should you clarify first?',
    options: [
      'Whether the billing system is hosted in the cloud or on-premise',
      'Whether "access" means the model can read billing records, or can also trigger actions like issuing a refund',
      "Whether the LLM vendor's API supports function calling",
      'Whether the billing system exposes an API at all',
    ],
    explanations: [
      'Hosting location affects networking and security review, not the question of what the system is allowed to do once connected.',
      'Correct. A model that can only read the account can tell a customer what the refund policy says; a model that can call the refund tool can issue one. That gap is exactly where the accountability question — who signs off when it acts on wrong information — belongs, and it needs answering before scoping, not after.',
      '"Function calling" and "tool calling" are the same mechanism under two names; which term the vendor\'s docs use tells you nothing about what the tool is permitted to do.',
      'An API is a precondition for any tool call, but its existence says nothing about whether the proposal intends read-only lookups or account-changing actions.',
    ],
  },
  '04-mcp-or-a2a': {
    prompt:
      "Two internal apps at the client's company both need to hand the same custom order-lookup tool to their own model, without each team rebuilding the integration from scratch. What piece of the stack is actually doing that job?",
    options: [
      "A vector database, since the tool's outputs need to be indexed for reuse",
      'Embeddings, so the tool becomes discoverable by meaning',
      'A2A, because it connects one agent to another',
      'MCP, because it standardizes how an application hands a model its tools and data',
    ],
    explanations: [
      "Nothing here is being searched by similarity — the tool returns a specific order, not a set of passages ranked by closeness. Indexing solves a different problem.",
      'Embeddings make text findable by meaning; a tool call is an action the model requests, not a passage it retrieves. There is nothing here to embed.',
      'A2A standardizes agent-to-agent conversation, and there is only one agent in this scenario — both apps are wiring the same tool into their own model, not talking to each other.',
      'Correct. This is the vertical connection MCP standardizes: a tool built once can be plugged into different applications and models without each team rewriting the plumbing.',
    ],
  },
  '04-supplier-agent-handshake': {
    prompt:
      "A client's procurement system needs to send purchase requests to a supplier's fulfillment system, built and hosted by a different company on a different stack. Neither side wants to expose its internal tools to the other. What actually needs to be in place?",
    options: [
      "A2A, so the two agents can exchange requests without either side seeing the other's internals",
      "MCP, so the supplier's model can be handed the client's tools directly",
      'A shared vector database both companies can query',
      "A larger context window on both models so each can hold the other's data",
    ],
    explanations: [
      "Correct. This is the horizontal connection A2A addresses: two agents built by different teams on different stacks exchanging requests without either exposing its internal tools or data.",
      "MCP standardizes how one application hands its own model its own tools — it says nothing about how two separately-built agents talk to each other across a company boundary.",
      'Sharing a vector database means sharing the underlying documents, which is the opposite of the "neither side exposes its internals" requirement here.',
      'Context window size affects how much text a single model can hold at once; it has no bearing on how two separately-owned systems agree to exchange a request.',
    ],
  },
  '04-inflated-proposal': {
    prompt:
      'A vendor\'s proposal for "let customers check their order status" lists embeddings, a vector database, tool calling, MCP, and a five-agent orchestration layer. What is the fastest way to find out which of those are padding?',
    options: [
      'Ask which LLM vendor is powering each component',
      'Ask for a live demo of the multi-agent orchestrator',
      'For each box on the diagram, ask whether the project would still work without it',
      'Ask for a line-item price on every component',
    ],
    explanations: [
      'Vendor choice is a downstream implementation detail; it does not tell you whether a box belongs on the diagram at all.',
      'A working demo shows the orchestrator can run, not that the request needed one — order status is a lookup, not a task requiring five specialised agents.',
      "Correct. Run the diagram backwards against the request: if the project would still work with a box removed, that box is on the slide because it's on the vendor's product, not because the project needs it.",
      "A price breakdown tells you what padding costs, not which parts are padding — you'd still be paying for boxes the request never asked for.",
    ],
  },
}
