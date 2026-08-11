import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '04-embeddings-vs-knowledge-base': {
    prompt:
      "A chatbot built on your client's support content keeps giving contradictory answers about the same refund window. The vendor's fix is \"we'll move you to a better vector database.\" Where does the problem most likely sit?",
    options: [
      'The embeddings model, which is placing unrelated wording too close together',
      'The vector database, whose index needs re-tuning for the document volume',
      'The knowledge base, where two versions of the policy are both indexed',
      'The application, whose context window is too small to hold the passages',
    ],
    explanations: [
      'Embeddings decide whether retrieval finds a relevant passage at all. When they place things badly you get answers about the wrong topic, not two confident answers that disagree about the same one.',
      'Index tuning changes how fast and how completely retrieval runs at scale. It does not make two documents stop saying opposite things about the same refund window.',
      'Correct. Contradictory answers almost always come from contradictory sources — the superseded policy was never removed from the index when the new one shipped, and nobody owns keeping it current. That is a data-quality problem, and no infrastructure swap touches it.',
      'A bigger context window lets the model hold more retrieved passages at once. Holding both contradictory versions is exactly the situation it is already in.',
    ],
  },
  '04-read-versus-act': {
    prompt:
      'A proposal you are reviewing says the assistant will "have access to the billing system." The client\'s ops lead asks what that phrase commits them to. What do you clarify first?',
    options: [
      "Whether the billing system runs in the client's cloud or on their own servers",
      'Whether the model may only read billing records, or may also issue a refund',
      "Whether the vendor's API calls this function calling or tool calling",
      'Whether the billing system exposes an API the application can call at all',
    ],
    explanations: [
      'Where the system runs shapes the network and security review, not the question of what it is permitted to do once it is connected.',
      'Correct. A model that can only read the account tells the customer what the refund policy says. A model wired to the refund tool can issue the refund. The second one raises a question the first never does — who is accountable when it acts on wrong information — and that belongs in the proposal, not in a production incident.',
      'Function calling and tool calling are the same mechanism under two names. Which term the documentation happens to use tells you nothing about what the tool is allowed to do.',
      'An API is a precondition for any tool call, but its existence says nothing about whether the design intends read-only lookups or account-changing actions.',
    ],
  },
  '04-mcp-or-a2a': {
    prompt:
      "Two internal apps at a client — claims and renewals — each want to give their own model the same custom customer-lookup tool, without either team rebuilding the integration. Which part of the stack does that job?",
    options: [
      "A vector database, so both teams can index and reuse the tool's results",
      'Embeddings, so each team can discover the right tool by meaning',
      'A2A, because the two teams’ agents have to negotiate with each other',
      'MCP, because it standardises how an app hands a model its tools',
    ],
    explanations: [
      'Nothing here is searched by similarity. The tool returns one specific customer record, not a ranked set of passages, so indexing solves a problem this scenario does not have.',
      'Embeddings make text findable by meaning. A tool call is an action the model requests, not a passage it retrieves, so there is nothing here to embed.',
      'A2A standardises how one agent talks to another. Here there is one tool being wired into two models; the two teams are not conversing through agents at all.',
      'Correct. This is the vertical connection MCP addresses: a tool built once can be plugged into different applications and models without each team rewriting the plumbing.',
    ],
  },
  '04-supplier-agent-handshake': {
    prompt:
      "A manufacturer's procurement agent has to send purchase requests to a freight forwarder's agent — a different company, a different stack. Neither side will expose its internal tools. What has to be in place?",
    options: [
      'A2A, so two agents can exchange requests without exposing their internals',
      "MCP, so the forwarder's model can be handed the manufacturer's own tools",
      'A shared vector database that both companies load their documents into',
      "A larger context window on both models, sized to hold the other's data",
    ],
    explanations: [
      "Correct. This is the horizontal connection A2A addresses: two agents built by different teams on different stacks exchange a request without either side seeing how the other is wired inside.",
      'MCP standardises how an application hands its own model its own tools. It says nothing about how two separately built agents in two companies agree on anything.',
      'A shared vector database means shared underlying documents, which is the exact opposite of the requirement that neither side expose its internals.',
      'Context window size governs how much text one model holds at a time. It has no bearing on how two separately owned systems agree to exchange a request.',
    ],
  },
  '04-inflated-proposal': {
    prompt:
      'A vendor\'s proposal for "let staff check their remaining leave days" lists embeddings, a vector database, tool calling, MCP and a five-agent orchestration layer. What is the fastest way to find the padding?',
    options: [
      'Ask which model vendor sits behind each component on the diagram',
      'Ask for a live demo of the five-agent orchestration layer running',
      'Ask, block by block, whether the project still works without it',
      'Ask for a line-item price against every component in the proposal',
    ],
    explanations: [
      'Which vendor supplies the model is a downstream implementation detail. It does not tell you whether that block belongs on the diagram in the first place.',
      'A working demo proves the orchestrator runs, not that the request needed one. Checking a leave balance is a single lookup, not work for five specialised agents.',
      "Correct. Run the diagram backwards against the request: if the project still works with a block removed, that block is on the slide because it is in the vendor's product, not because the project needs it.",
      'A price breakdown tells you what the padding costs, not which parts are padding. You would still be paying for blocks the request never asked for.',
    ],
  },
}
