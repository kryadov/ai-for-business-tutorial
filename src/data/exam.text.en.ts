import type { TopicText } from './exam.text.types'

// English wording for the thirteen exam topics. The ordered list, the option
// counts and the answer key live once, in src/data/exam.ts — this file only
// supplies text, written natively rather than translated from
// exam.text.ru.ts. See AGENTS.md, "structure is shared, prose is native".
//
// Two rules govern the test options below and are easy to break by accident:
// every option carries its own explanation with a concrete reason, including
// the correct one, and the four options are kept within a similar length so
// the answer cannot be spotted by shape alone. The argument belongs in the
// explanation, which nobody sees before answering — see
// src/data/quizzes/answer-tell.test.ts.
export const en: Record<string, TopicText> = {
  'chatgpt-vs-gpt': {
    testPrompt:
      'A client says: "We already pay for ChatGPT Plus, so we can just point our workflow automation at GPT-4 through that same subscription." How do you respond?',
    testOptions: [
      'Yes — Plus already includes API access to the model',
      "It doesn't matter which one the team uses",
      'No — ChatGPT is the product; automation needs a separate API account',
      'GPT is just the old version that ChatGPT replaced',
    ],
    testExplanations: [
      'A ChatGPT Plus subscription pays for the chat interface a person logs into. It carries no API key, and a workflow cannot authenticate against a website login.',
      'It decides the whole shape of the proposal: one is a seat a person clicks around in, the other is a metered service a system calls. Getting this wrong sizes the project incorrectly from the start.',
      'Correct. ChatGPT is a product with its own interface and subscription; the model behind it is sold separately through an API, with its own account, billing and terms — conflating the two is how a client ends up promising an integration nobody can build.',
      'GPT is not discontinued — it is the model family that ChatGPT, the API and other products are all built on. The two exist side by side today, not one replacing the other.',
    ],
    cardQuestion: 'What is the difference between ChatGPT and GPT?',
    cardAnswer:
      "ChatGPT is a product — a chat interface, a subscription plan, and a set of default behaviors that OpenAI ships and updates. GPT is the underlying model family that actually does the language processing, and it is sold separately through an API with its own account and its own pricing. A client can hold a ChatGPT Plus subscription and have no API access at all, and the reverse is just as common. Keep the two apart when scoping a project, because 'the client already has ChatGPT' is not the same claim as 'the client already has model access to build on.'",
  },

  'model-vs-product': {
    testPrompt:
      'A client\'s IT director opens the call with: "We\'ve picked our AI vendor, so that decision is made — we can go straight to features." What do you ask next?',
    testOptions: [
      'Which layer they picked: company, model, platform or product',
      'Which model version they intend to lock in first',
      'Nothing — naming the vendor settles the architecture',
      'Whether a competing vendor scored better on benchmarks',
    ],
    testExplanations: [
      'Correct. One word covers four layers — the company that trains, the model that was trained, the platform that hosts and bills it, and the product a person opens — and the contract, the data-residency answer and the integration work differ at every one of them. Asking which layer they actually bought takes ten seconds and prevents a statement of work built on the wrong one.',
      'Version pinning is a real question, but it sits underneath this one. Until you know whether they bought a model, a platform or a product, there is nothing yet whose version you could pin.',
      'A vendor name routinely stands for the company that trained the model, the platform that hosts and bills it, or the finished product a person opens — three different contracts and three different data paths, none of which the name alone settles.',
      'Benchmarks argue about the model layer only. They cannot tell you whose contract applies, which region the data sits in, or whether the thing in question is integrable at all.',
    ],
    cardQuestion:
      'What are the four layers a single AI name can stand for, and why does telling them apart matter commercially?',
    cardAnswer:
      'Every name in this market sits at one of four layers: the company that trains the model, the model itself, the platform that hosts and bills it, and the product a person opens. People collapse all four into one word, usually the product\'s, because that is the only layer they have personally clicked on. It matters because each layer answers a different commercial question — who you sign with, whose data-processing agreement applies, which region the data lives in, and whether there is anything to integrate rather than something to log into. So when a client tells you the vendor is decided, the useful reply is "decided at which layer", asked as curiosity rather than as a correction.',
  },

  'what-rag-is': {
    testPrompt:
      'A client says: "So once we plug our policy documents in, the model will have learned our company and we can stop worrying about updates?" What do you tell them?',
    testOptions: [
      'Only for documents uploaded before the system first went live',
      "Yes — the documents become part of what the model knows from then on",
      'Yes, after an overnight retraining run over the new documents',
      'No — retrieval hands it passages at the moment of the question',
    ],
    testExplanations: [
      'Retrieval reads the index as it stands at the moment of each question, so a document added this morning is answerable this afternoon, and one removed this morning is already gone from the answers.',
      "The model's weights are untouched by retrieval. If nothing were retrieved on the next question, it would answer exactly as if it had never seen those documents at all — which is also the honest test to offer the client.",
      'There is no retraining step in a retrieval system, overnight or otherwise. Promising one puts a schedule and a budget line into the proposal for work that never happens, and sets an expectation you cannot meet.',
      "Correct. Retrieval finds the passages that match the question and puts them into that one prompt; nothing persists afterwards. That is why deleting a document changes tomorrow's answer immediately, why corrections and freshness are configuration rather than a retraining project with a budget line, and why access control has to be solved at the index rather than hoped for from the model.",
    ],
    cardQuestion: 'What is RAG, and what does it not do?',
    cardAnswer:
      'RAG is retrieval: a question arrives, the system finds the passages that actually answer it, those passages go into the prompt, and the model answers from what it was just handed. It does not train the model and nothing is memorised — take a document out of the index and it disappears from the answers immediately. That is the commercially useful part, because it means freshness, corrections and access control are configuration rather than a retraining project with its own budget line. So when a client says "and then the model will know our contracts", correct it gently and right away, because the whole cost model follows from that one sentence.',
  },

  'when-an-agent': {
    testPrompt:
      'A client says: "We want an agent that takes every incoming invoice, checks it against the purchase order, files it, and notifies accounting." What do you say?',
    testOptions: [
      'Agreed — that is exactly the kind of multi-step work agents do',
      'Those steps never vary, so this is a workflow with a trigger',
      'Start with an agent and simplify it once volumes are clear',
      'It needs several agents: a checker, a filer and a notifier',
    ],
    testExplanations: [
      'Multiple steps do not make an agent. What makes an agent is a path that changes with the content of the request, and here every invoice goes through the same four steps in the same order.',
      'Correct. Draw the chain for the client and ask whether every case goes through exactly these steps in exactly this order. It does, so this is a workflow with a trigger — cheaper, faster, testable and boring in the way production systems should be. An agent earns its place only where the path genuinely varies with what is in the request.',
      'Starting with the more expensive shape means paying for re-deciding, monitoring and debugging a path that was never in doubt, and simplification rarely gets scheduled once something works.',
      'Each additional agent multiplies cost, latency and the number of ways a run can fail. Here there is not one genuine decision for the first agent to make, let alone three.',
    ],
    cardQuestion: 'When does an agent earn its place, and when is it just complication?',
    cardAnswer:
      'An agent earns its place when the system has to act on its own and the path genuinely depends on the content of the request — a support case that might need the CRM, the billing system, both or neither depending on what the customer actually wrote. The test on a call is to draw the chain of steps and ask whether every case goes through exactly those steps in exactly that order; if it does, you have a workflow, which is cheaper, testable and far less exciting to demo. Fixed sequences, scheduled reports, single lookups, and processes nobody has written down are all cases where an agent adds cost, latency and new failure modes without adding a decision. And a good share of "you don\'t need an agent here" is really "nobody is going to grant it write access to billing" — a permissions answer wearing a technology argument\'s clothes.',
  },

  'what-mcp-is': {
    testPrompt:
      'A vendor slide says the product is "MCP-ready". The client turns to you and asks what that actually buys them. What do you say?',
    testOptions: [
      'A standard way to hand a model its tools and data',
      'A faster model, since MCP shortens the path to an answer',
      'A security layer that vets what the model may read',
      "A way for their agents to talk to a supplier's agents",
    ],
    testExplanations: [
      'Correct. MCP addresses the vertical connection in the diagram: how an application exposes tools and data to a model, so a tool built once can be plugged into different models and applications without rewriting the plumbing each time. It is wiring, which makes the useful follow-up concrete — which tools are actually connected, and what does each one let the system do that it could not do before.',
      'A connection standard does not change how fast a model answers. Latency comes from the model, the size of the prompt and the tool sitting behind the connection, none of which the standard touches.',
      'A wiring standard describes how a tool is offered to a model, not who is permitted to use it. Permissioning and retrieval scoping remain yours to design, to build and to price.',
      'That is the horizontal problem — one agent talking to another — which is what A2A addresses. Same diagram, different axis, and a project can need either, both or neither.',
    ],
    cardQuestion: 'What is MCP for?',
    cardAnswer:
      'MCP is a standard for the vertical connection inside an AI system: how the application hands a model its tools and its data. The point of it is reuse — a tool built once can be plugged into different models and different applications without someone rewriting the plumbing every time. It is wiring, not intelligence and not security: it says nothing about who is allowed to call a tool, which is still a thing you design and budget for. So when a slide says "MCP-ready", the question worth asking is which tools are actually connected, and what each one lets the system do that it could not do before.',
  },

  'api-or-open-source': {
    testPrompt:
      'A client\'s engineering lead says: "We\'ll self-host an open-weight model — no per-token bill, so it has to come out cheaper." How do you answer?',
    testOptions: [
      'Agreed — removing the per-token bill removes the main cost',
      'A hosted API is always cheaper, so they should keep paying per token',
      'It swaps a variable bill for a fixed floor — what is the volume?',
      'Decide it on model quality; the running costs come out similar',
    ],
    testExplanations: [
      'The token fee is usually the smallest line in the total. Removing it leaves GPUs sized for peak rather than average load, a serving stack somebody patches and monitors, and every new open-weight release evaluated by hand.',
      'There is a volume above which the API bill dwarfs the monthly cost of a served model, and a client already carrying an infrastructure team has a genuine case for it. This is arithmetic, not a rule that runs one way.',
      "Correct. Self-hosting replaces a variable cost with a fixed one, and a fixed cost is owed whether or not anyone used the system today. What decides it is where the client's monthly volume sits against that floor — and whether the person paged at three in the morning is already on the payroll or a gap in the plan that nobody has priced.",
      'Model quality rarely decides these projects at all, and the two running costs are not similar in shape: one scales with usage and stops when usage stops, the other is due every month regardless.',
    ],
    cardQuestion: 'When is a hosted API the economical choice, and when does self-hosting win?',
    cardAnswer:
      'Self-hosting genuinely removes the per-token bill, but it replaces a variable cost with a fixed one, and the fixed one is owed whether or not anybody used the system this month. What the API fee was quietly covering is infrastructure sized for peak rather than average load, someone keeping the serving stack patched and monitored, model upgrades that used to arrive invisibly, and the person who gets paged when it falls over on a Saturday. So the honest comparison is never per-token price against zero — it is per-token price against a fixed monthly floor, and what decides it is where the client\'s volume sits relative to that floor. A client with high steady volume and an engineering team already carrying the pager has a real case; a client with modest volume and no infrastructure staff is buying a fixed cost to avoid a smaller variable one.',
  },

  'data-for-a-project': {
    testPrompt:
      'A client wants an assistant that answers employees\' questions about internal policy, and asks when you could start. What do you check first?',
    testOptions: [
      'Which model has the largest context window for the policies',
      'Which documents exist, who owns them, and who may read each',
      'Whether the team prefers a chat window or an email interface',
      'How many employees will use it in the first month of launch',
    ],
    testExplanations: [
      'Context size is a late configuration detail, and a larger window helps not at all when the policies are contradictory, unowned, or sitting in folders nobody has checked the permissions on.',
      'Correct. A retrieval project stands or falls on the corpus: documents that actually contain the answers, an owner who keeps them current so versions stop contradicting each other, and permissions checked at the source so the assistant only surfaces what the asking employee could already open. All three belong on discovery, before an architecture exists and long before a demo goes well.',
      'The interface is worth agreeing on, and it changes nothing about whether the answers exist to be retrieved. A well-designed window over an unmaintained wiki still answers badly, just more attractively.',
      'Usage volume prices the running cost and sizes the rollout, which makes it a fair question later. It cannot tell you whether there is anything worth building on in the first place.',
    ],
    cardQuestion: 'What has to already exist before an AI project can start?',
    cardAnswer:
      'Three things, and none of them is a model. First, something to work from: documents that genuinely contain the answers, or a database with a schema a human could explain and some agreement about what "active customer" means — and if there is neither, the first project is writing things down and structuring them, which the proposal should say out loud. Second, an owner for that material, because a knowledge base nobody maintains accumulates exactly the contradictions that make retrieval unreliable. Third, permissions you can inspect today at the source, since a retrieval system will happily surface whatever got indexed to whoever asks the right question.',
  },

  'estimating-roi': {
    testPrompt:
      'A sponsor needs an ROI number for their board next week. Nobody in the room can tell you what the process costs today. What do you do?',
    testOptions: [
      'Use an industry benchmark figure for this kind of automation',
      'Skip the number; say the benefit is strategic, not financial',
      'Estimate the saving from what the team says the work feels like',
      "Get today's number first: how long, how often, and who owns it",
    ],
    testExplanations: [
      'A borrowed benchmark measures somebody else\'s process. When the board asks how it was derived, the answer is that it was not — and the figure the project gets judged against was never the client\'s own to begin with.',
      '"Strategic" is what a proposal says when nobody measured the current state. An outcome that cannot be measured today, in its broken state, cannot be shown to have improved in six months either — it can neither be hit nor missed.',
      '"It feels like forever" is not a baseline. Build the estimate on it and you have invented the number, in your own words, in your own scope document, and you are the one who will be held to it.',
      "Correct. Size the return from the client's own current state: how long the task takes, how often it happens, who is measured on it, and what that number sits at right now. Then write the criterion as a metric moving from X to Y by a date with a named owner — a figure the finance review can actually check in six months, and one you did not have to make up.",
    ],
    cardQuestion: 'How do you size the return on an AI project without inventing numbers?',
    cardAnswer:
      'You build it from the client\'s current state rather than from a benchmark: how long the task takes, how often it happens, who does it, and what that number sits at today. If nobody in the room can state that baseline, you do not have an ROI estimate yet — you have an adjective, and anything that cannot be measured in its broken state cannot be proven improved later either. So push until the success criterion reads as a metric going from X to Y by a date, owned by a named person, and write it in their words while they are still in front of you. And keep the project cost and the running cost apart, because "how much will this cost" has two answers, and a proposal that gives only the first gets reopened in month three when usage is healthy.',
  },

  'questions-before-tech': {
    testPrompt:
      'Ten minutes into a first call the client says: "We need a chatbot on the website." Where do you take the conversation?',
    testOptions: [
      'To the model options, so scoping can start this same week',
      "To whether they have seen a competitor's chatbot they liked",
      'To what a visitor should be able to do that they cannot today',
      'To a demo, since seeing one working usually settles requirements',
    ],
    testExplanations: [
      'Naming a model first fixes the least consequential decision in the project and leaves the consequential ones untouched. Swapping models later is usually configuration; swapping the problem is a new project.',
      'A competitor they admired tells you what impressed the room, which is useful colour and no substitute for a problem. It also quietly imports somebody else\'s requirements into a project that has not defined its own.',
      'Correct. Asking what changes rather than what gets built turns the request back into the outcome it stands for, without ever sounding like a refusal. From there the rest follows in order: which number is currently wrong and what it sits at today, who loses the most time to it, and only then whether a chatbot is even the right shape for it.',
      'A demo answers "can it do something impressive" and never "what should be different afterwards". Run before the outcome is agreed, it becomes the requirement by default, and the requirement was never discussed.',
    ],
    cardQuestion: 'What do you ask a client before any technology is named?',
    cardAnswer:
      'Four things, and none of them mentions a model. What should be different afterwards — what can somebody do at the end of this that they cannot do today? Which number is currently wrong, and what is it sitting at right now, so there is a baseline to be judged against later? Who feels the problem, by name or by role, and how do they describe it when they are annoyed about it rather than presenting it upward? And when the request arrives already shaped as a chatbot or an agent, ask them to walk one real case from last week start to finish — the mismatch surfaces on its own, and the room reaches the conclusion together instead of you overruling the client in front of their team.',
  },

  'class-for-a-problem': {
    testPrompt:
      'A logistics client says: "When a shipment is late we want the system to sort it out — notify the customer, rebook a carrier, or escalate to a person, depending on why." Which class is this?',
    testOptions: [
      'RAG over the carrier contracts and the shipping policies',
      'An agent — the path depends on what is in each case',
      'An assistant that drafts the reply for a dispatcher to send',
      'A workflow that runs the three steps in a fixed order',
    ],
    testExplanations: [
      'Retrieval ends by handing a passage to a person, and nobody here is waiting to read one. The client asked for something that acts, which retrieval never does no matter how good the index is.',
      'Correct. The system acts on its own, and the path genuinely varies with the content of each case: notify, rebook or escalate depending on why the shipment is late. That is exactly where an agent repays its cost, and the immediate follow-up is which of those three actions is irreversible enough to need a human confirming it before it fires.',
      'An assistant leaves a dispatcher deciding on every late shipment, which is precisely the labour the client asked to remove. It becomes the right answer only if they are not permitted to let the system act — worth confirming out loud.',
      'A workflow fixes one sequence for every run, which here would produce the right action on some late shipments and the wrong one on the rest — silently, and at speed.',
    ],
    cardQuestion: 'How do you match a business problem to a solution class?',
    cardAnswer:
      'Three questions, asked in order, and they land every request on one of five classes before the technology comes up. First: does a person read the output before anything happens, or does the system act on its own? If a person reads it, ask whether the answer is already written down somewhere — that is RAG — whether it is a number nobody has computed yet, which is text2SQL, or whether something new has to be produced from scratch, which is an assistant. If the system acts, ask whether the steps ever change with what is in the request: never means a workflow, depends means an agent. Then be ready to say why the four you rejected lose, because that is the half a client actually tests you on.',
  },

  'rag-versus-text2sql': {
    testPrompt:
      'A property manager asks, in one breath: "What does this lease say about early termination, and how much rent did the portfolio collect last quarter?" How do you scope it?',
    testOptions: [
      'Two projects: the lease is retrieval, the rent is a query',
      'One retrieval system — both answers live in their documents',
      'One reporting system, since both end in a figure for a report',
      'Either shape works; pick whichever the client already owns',
    ],
    testExplanations: [
      'Correct. The lease answer is written down and waiting to be retrieved; the rent figure exists only once somebody aggregates the records, and no passage anywhere contains it yet. Same person, same tone, two systems with different data prerequisites and different failure modes — this is the most common class error in the business, and it usually arrives in exactly one sentence like this one.',
      'No document holds last quarter\'s collected rent until the aggregation runs. Point retrieval at that question and you get a confident quote of how rent is defined, instead of what it actually came to.',
      'Build reporting for the lease question and you get a system that can answer nothing which is not already a column. Clauses, obligations and exceptions have no aggregate to compute.',
      'The two shapes need different things before day one: readable documents with an owner on one side, a schema a human could explain and agreed marts on the other. Owning one does not make it fit the other question.',
    ],
    cardQuestion: 'What is the difference between RAG and text2SQL, and why is confusing them expensive?',
    cardAnswer:
      'RAG answers questions whose answers are already written down somewhere — a policy, a contract, a manual — by retrieving the passage and handing it to the model at the moment of the question. Text2SQL answers questions whose answers do not exist in any document yet, because they have to be computed from records: how much, how many, in which region, last quarter. They arrive from the same person in the same breath and sound like one request, which is why this is the most common class error in the business. It is expensive in both directions too: retrieval built for a reporting question quotes the definition of a KPI instead of its value, and text2SQL built for a policy question cannot answer anything that is not already a column.',
  },

  'a2a-versus-mcp': {
    testPrompt:
      'A vendor tells your client they should "standardise on A2A rather than MCP" before the project starts. What do you say in the room?',
    testOptions: [
      'Ask which of the two currently has the wider adoption',
      'Agree — supporting one standard is simpler than two',
      'Neither matters until the model choice is settled',
      'They answer different questions; ask which we need',
    ],
    testExplanations: [
      'Adoption and version numbers for both specifications move fast enough that a figure quoted on a call is routinely stale, and even a current one would not tell you which connection problem this project actually has.',
      'It is not a choice between two ways of doing the same thing. Picking a side here means either wiring tools by hand or having no standard way to reach an outside party\'s agent, depending on which side was picked.',
      'These are wiring decisions that follow from what the system connects to, and the model is usually one of the last and least consequential picks. Neither question waits on the other.',
      'Correct. MCP connects a model to its tools and data — the vertical link between an application and a model. A2A connects agents to each other — the horizontal link across teams or companies. So the answer is to ask what this project actually talks to: only its own tools, another party\'s agent, both, or neither. And treat any "full compliance" claim on the slide as something to verify rather than to repeat.',
    ],
    cardQuestion: 'Are A2A and MCP competitors?',
    cardAnswer:
      'No — they sit on different axes of the same diagram. MCP is the vertical connection: how an application hands a model its tools and its data, so a tool built once works across different models and applications. A2A is the horizontal one: how one agent talks to another agent, possibly built by a different team or a different company, without either side exposing its internals. A project can need one, the other, both or neither, and what decides it is simply what the system talks to — so when a vendor asks the client to pick a side, the honest answer is that it is not that kind of question.',
  },

  'guardrails-not-later': {
    testPrompt:
      'A client wants to cut scope: "Ship the core assistant now, and we\'ll add the permissions and review layer before we open it up to everyone." How do you respond?',
    testOptions: [
      'Reasonable — the review layer is a later phase by nature',
      'Fine, as long as the system prompt forbids the risky answers',
      'Permissioning is architecture — adding it later means rebuilding',
      "Fine if we keep the pilot to one department's own folder",
    ],
    testExplanations: [
      'Retrieval scoping, input filtering and review touch how the system is built rather than how it is finished. And the retrofit rarely happens on a calm Tuesday by choice — it happens the week after an incident, under worse conditions than any design review would have offered.',
      'A system prompt is a strong suggestion competing for attention with whatever text the model is reading right now, not a locked gate. It does little against instructions that arrive inside a document the model was asked to summarise.',
      'Correct. Access control at the source, retrieval scoped to what the asking user could already open, and a review step on high-stakes answers all shape the architecture itself, so adding them once real users depend on current behaviour usually means rebuilding. Put them in the estimate and the timeline during scoping, as line items with a cost and a week attached — not as a change request three weeks before go-live.',
      'A clean single-department pilot is exactly what hides this problem. It works beautifully, then meets ten years of unowned folders — and indexing checks what is there, never who was allowed to read it.',
    ],
    cardQuestion:
      'Why does retrofitting access control and review cost more than designing them in from the start?',
    cardAnswer:
      'Because permissioning, retrieval scoping and human review are not a coat of paint applied to a finished building — they touch the architecture itself. Scoping retrieval to what the asking user could already open changes how the index is built and queried; a review step changes the flow of the system and who is staffed on it. By the time you add them, real users depend on the current behaviour, so every constraint you introduce is a change somebody has to justify breaking, which is why the retrofit usually turns into a rebuild. And it almost never happens by calm choice — it happens the week after the first confidently wrong answer reaches a customer, which is exactly why these belong in the estimate and the timeline during scoping, with a cost and a week beside them.',
  },
}
