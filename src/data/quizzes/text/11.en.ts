import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '11-smartest-model-request': {
    prompt:
      'A client\'s IT lead says: "Let\'s take the most advanced model on the market — nobody wants to be the one who cheaped out." What do you ask instead of comparing rankings?',
    options: [
      'Where the model sits in the current leaderboard, and when that board was last refreshed',
      'Which business problem needs that capability that a cheaper model would miss',
      'How many parameters it has next to the model one generation behind it',
      'Whether a one-year commitment to the top tier earns a volume discount',
    ],
    explanations: [
      'A leaderboard compares models against each other on general tasks. It says nothing about whether this project can reach the data it needs, or whether anyone has granted the permissions to read it.',
      'Correct. Capability is rarely the constraint. What stops these projects is data nobody can reach, permissions nobody has granted and a process nobody has written down, and a stronger model opens none of the three.',
      'Parameter count is a rough proxy for capability, and capability is not what anyone in the meeting doubts. What is missing is a problem stated precisely enough to compare two models against.',
      'A discount changes the price of the top tier. It does not answer whether that tier is needed for this problem at all, which is the question sitting under the request.',
    ],
  },
  '11-shrink-team-after-agents': {
    prompt:
      'A COO announces: "Once the agent goes live in the claims team, we can cut headcount by a third." What do you check before agreeing to that number?',
    options: [
      'Whether the API contract guarantees availability and a response time in seconds',
      'How many claims per hour the agent clears at peak volume rather than on average',
      'Whether competitors of a comparable size have already automated claims handling',
      'Which task eats the most staff hours today, and whether the agent touches that one',
    ],
    explanations: [
      'Availability and response time describe the service, not the work. An agent can never go down and still leave the expensive part of claims — the disputed cases — exactly where it was.',
      'Throughput counts the mechanical steps, and those were never the bottleneck. The hours disappear into exceptions and judgment calls, which are not the items being cleared per hour.',
      'What a competitor automated elsewhere says nothing about where the hours go in this team, and this is the team whose headcount is being cut.',
      'Correct. An agent usually takes over one mechanical slice of a process. Judgment calls, exceptions and relationships stay with people, so a team of the same size absorbs more volume instead of shrinking by a third.',
    ],
  },
  '11-self-host-cheaper-claim': {
    prompt:
      'An engineering lead says: "We\'ll self-host an open model — no per-token fees, so it comes out cheaper than the API." Which cost is missing from that comparison?',
    options: [
      'GPUs sized for the peak, a team keeping it served, and every release to chase.',
      'The one-off cost of downloading the open weights and storing them locally.',
      'The engineering time spent tuning a system prompt to the open model.',
      'Customs duty on the imported GPUs and the currency swing between orders.',
    ],
    explanations: [
      'Correct. The token fee is usually the smallest line in the total. Hardware has to be sized for the peak rather than the average, somebody has to keep it served and patched, and each new release has to be caught up with by hand instead of arriving on its own.',
      'Weights are downloaded once. Everything expensive about self-hosting starts the day after that and repeats every day the system stays up.',
      'A system prompt is written once and costs the same whichever way the model is hosted, so it cannot explain a gap between the two options.',
      'Duty is charged once, at purchase, and only if hardware is bought at all. What decides this comparison is the cost that never stops: capacity held for peaks and people paid to keep it running.',
    ],
  },
  '11-model-first-question': {
    prompt:
      'A stakeholder opens the kickoff with: "Before anything else — which model are we building on?" What is the strongest response?',
    options: [
      'Agree, and run a bake-off between the flagship models of three vendors',
      'Pick the largest context window available so the decision never has to be revisited',
      'Say the model is one of the last calls, and ask which problem and data define this',
      'Postpone the kickoff until the client has named the vendor they prefer',
    ],
    explanations: [
      'A bake-off answers a question this project has not reached yet. Until the problem is described there is no bar for the models to clear, so the comparison measures nothing that decides anything.',
      'Context window is one attribute among many, and choosing on it fixes the decision before anyone knows what data the system has to work with.',
      'Correct. A project starts from a business problem worth solving and the data needed to solve it. Several models clear the bar for a well-scoped problem, and swapping one for another later is normally a configuration change rather than a redesign.',
      'Waiting for a vendor name postpones the meeting without moving it forward. The first decision is the problem and the data, and neither of them depends on who supplies the model.',
    ],
  },
  '11-guardrails-later-request': {
    prompt:
      'A product owner proposes: "Let\'s ship the working version now, and bolt on permissions and human review right before we open it to everyone." What do you say back?',
    options: [
      'Agree, and book the guardrail work into the sprint straight after the rollout',
      'Warn that once users rely on current behaviour, every new limit becomes a change to justify',
      'Suggest watching real usage for a quarter first, since some limits may prove unnecessary',
      'Ask the vendor to switch on access control with the next model upgrade',
    ],
    explanations: [
      'Agreeing preserves the exact order that causes the trouble: the users arrive first, and after that every limit added looks like breaking something that worked.',
      'Correct. Once real users depend on current behaviour, each constraint added afterwards has to be defended as a change to something that already worked. Teams usually get to that work the week after an incident rather than by choice, under conditions worse than any design review.',
      'Watching usage shows how the system is used while nothing goes wrong. Access control exists for the first time it is wrong in front of the wrong person, and volume of usage does not remove that.',
      'Access control and human review are built by the team deploying the system, around a specific list of people and permissions. Upgrading the underlying model cannot supply either of them.',
    ],
  },
}
