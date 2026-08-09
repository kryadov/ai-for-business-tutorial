import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '11-smartest-model-request': {
    prompt:
      'A client\'s IT lead says: "Let\'s use the most advanced model — we don\'t want to be the ones who cut corners." What should you ask instead of comparing benchmark scores?',
    options: [
      'Which benchmark suite ranks it highest',
      'Which specific business problem needs that level of capability that a cheaper model would not solve',
      'How many parameters the model has',
      'Whether the vendor offers a discount for committing to the top-tier model',
    ],
    explanations: [
      'Benchmark rankings measure general capability, not the specific business problem in front of you — and capability rarely decides whether the project works.',
      'Correct. Capability is rarely the constraint — what actually stops these projects is unreachable data, missing permissions and an undocumented process, none of which a smarter model fixes.',
      'Parameter count is a proxy for capability, not for whether the project has the data and permissions it needs to work at all.',
      'A discount changes the price of the top-tier model, but the question is whether that tier is even needed for this problem.',
    ],
  },
  '11-shrink-team-after-agents': {
    prompt:
      'A COO announces: "Once the agent goes live in the claims team, we can cut headcount by a third." Before agreeing to size that reduction, what should you check first?',
    options: [
      "Whether the agent's API has a service-level agreement",
      'How many claims the agent can process per hour',
      'Whether competitors have already automated their claims teams',
      'Which specific task consumes the most staff time today, and whether the agent actually touches that task',
    ],
    explanations: [
      "An SLA covers uptime and response time, not whether the agent actually removes the expensive, judgment-heavy part of the job.",
      'Throughput describes volume, but the costly work in claims is usually the exceptions and judgment calls, not the mechanical steps counted per hour.',
      'What a competitor automated elsewhere does not tell you whether this agent touches this team\'s most time-consuming task.',
      'Correct. Agents typically automate one mechanical slice of a process; the expensive part — judgment calls, exceptions, relationships — is usually what is left, so the same team ends up doing more, not fewer people doing the same work.',
    ],
  },
  '11-self-host-cheaper-claim': {
    prompt:
      'An engineering lead says: "We\'ll self-host an open model — no per-token fees, so it has to be cheaper than the API." What cost did they leave out of that comparison?',
    options: [
      'GPUs sized for peak load, the team keeping the model served and patched, and falling behind each new release',
      'The one-time cost of downloading the model weights',
      'The cost of writing a system prompt for the open model',
      'Import tariffs on GPU hardware',
    ],
    explanations: [
      'Correct. The token fee is usually the smallest line item; self-hosting adds hardware sized for peaks rather than averages, an ongoing maintenance team, and the cost of manually catching up with every new release.',
      'Downloading weights is a one-time, largely negligible cost next to running and maintaining the model in production every day after.',
      'A system prompt costs nothing extra to write and is not what makes self-hosting expensive compared to a metered API.',
      'Import tariffs are not the cost driver the section points to — the ongoing operational burden is.',
    ],
  },
  '11-model-first-question': {
    prompt:
      'A stakeholder opens the kickoff meeting with: "Before anything else, which model are we building on?" What is the strongest response?',
    options: [
      "Agree, and schedule a bake-off between three vendors' flagship models",
      'Pick the model with the largest context window to avoid revisiting the choice',
      'Point out that the model is one of the last decisions, and ask what business problem and data define the project first',
      'Defer the whole meeting until the client names a preferred vendor',
    ],
    explanations: [
      'A bake-off treats model choice as the first decision to settle, when the section argues it is one of the last and least consequential ones.',
      'Optimizing for context window locks in a choice before the business problem and data needs are even defined.',
      'Correct. The model is one of the last decisions, not the first — several models usually clear the bar for a well-scoped problem, and switching later is normally a configuration change, not a redesign.',
      'Waiting for a vendor name skips the actual first step, which is defining the business problem and the data needed to solve it.',
    ],
  },
  '11-guardrails-later-request': {
    prompt:
      'A product owner says: "Let\'s ship the working version now and add the permissions and review layer before we open it to more users." What does the section say actually happens next?',
    options: [
      'The team adds guardrails on schedule, before the wider rollout, exactly as planned',
      "Retrofitting access control after real users depend on current behaviour costs more, and the change usually happens the week after an incident, not on a calm schedule",
      'Guardrails turn out to be unnecessary once usage patterns are observed',
      'The vendor adds guardrails automatically as part of a routine model upgrade',
    ],
    explanations: [
      "That is the plan being described, but the section's point is that this calm, scheduled retrofit rarely happens — reality intervenes first.",
      'Correct. Once real users depend on the current behaviour, every constraint added afterward has to be justified as a change, and the retrofit usually happens the week after an incident rather than by choice.',
      'Guardrails address what happens when the system is wrong in front of the wrong person — usage volume alone does not remove that risk.',
      'Vendors do not add access control or human review as part of a routine model upgrade; that layer is built by the team deploying the system.',
    ],
  },
}
