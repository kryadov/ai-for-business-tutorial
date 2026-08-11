import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '02-chatbot-or-outcome': {
    prompt:
      'A client opens the call with: "We need a chatbot on the website." What do you ask first?',
    options: [
      'Which chatbot platform should we standardise on before we build?',
      "What should a visitor be able to do that they can't do today?",
      'How many pages of product documentation will the bot have to read?',
      'Should the bot address visitors formally or casually on the site?',
    ],
    explanations: [
      'Platform choice is downstream of knowing what the bot is for. Settling it first locks in a shape before anyone has named the problem it solves.',
      'Correct. This turns a request for a built thing into a stated outcome, and that outcome becomes the yardstick the project is judged by later.',
      'Page count sizes the retrieval work, which matters eventually, but it does not tell you what has to change for the visitor once the thing is live.',
      'Tone is a copywriting decision. It can be settled in an afternoon, and it says nothing about the result the client is actually buying.',
    ],
  },
  '02-real-outcome-or-guess': {
    prompt:
      'A client says: "This team is too big for what it does — AI should let us cut headcount." What tells you whether that is a real cost case or a guess?',
    options: [
      'Whether anyone can name how long the task takes and how often it runs',
      'Whether the finance lead has already approved a headcount target',
      'Whether the team agrees, out loud, that the workload feels heavy',
      'Whether a competitor of similar size announced the same cut',
    ],
    explanations: [
      'Correct. A duration and a frequency are the baseline this outcome needs; without them there is nothing on record to compare against after launch.',
      'An approved headcount target is a decision about the answer, not evidence that anybody ever measured the work that produced it.',
      'Shared agreement that work feels heavy is precisely the unmeasured impression a baseline is supposed to catch, not confirm.',
      "A competitor's announcement describes their hours and their process. It cannot stand in for numbers nobody has recorded at this client.",
    ],
  },
  '02-adjective-or-criterion': {
    prompt:
      'Asked what success looks like, a client answers: "The process should be much faster and feel more seamless for everyone." How do you treat that answer?',
    options: [
      'Write it into the proposal as the success criterion and start scoping',
      'Read "faster" as a signal that the client actually wants a chatbot',
      'Take it as agreement and leave the measurement talk until kickoff',
      'Treat it as a mood: no metric, no owner, no date to check against',
    ],
    explanations: [
      'Two adjectives with nothing to measure cannot be checked at delivery. Writing them down as they stand just moves the ambiguity into the contract.',
      '"Faster" describes a feeling about the result, not a technology. It says nothing about whether a chatbot, a workflow or a report is the right build.',
      'Warmth about the direction is not agreement on a number. Treating the two as equivalent is how a project becomes impossible to fail on paper.',
      'Correct. With no metric, no owner and no date, nobody can check the sentence in ninety days — and a claim that cannot be missed cannot be hit either.',
    ],
  },
  '02-walk-the-example': {
    prompt:
      'With their own staff present, a client insists they need "a fully autonomous agent" for incoming invoices. You suspect three fixed steps that never vary. What do you do?',
    options: [
      'Say plainly that this is not really an agent problem, then move on',
      'Build the agent as specified, since they know their own process best',
      'Ask them to walk one real invoice from last week through, in order',
      'Quote the agent at full price and let the budget shrink the request',
    ],
    explanations: [
      'Correcting the shape out loud in front of their own staff makes the request personal, and you get a defensive client rather than a corrected one.',
      'They know the process, which is not the same as having described it. Building to the requested shape can buy autonomy the work never uses.',
      'Correct. Walking one real case surfaces the mismatch on its own: everyone notices together that no step ever varied, and nobody had to be told they were wrong.',
      'Price pressure changes what the client can afford. It does not change whether the work contains a decision worth handing to a machine.',
    ],
  },
  '02-who-feels-it': {
    prompt:
      'A client says: "AI would really help our marketing team." Which follow-up gets you closest to a problem you can scope?',
    options: [
      'Which model would you like us to use for the marketing team?',
      "Who loses the most time to this, and how do they describe it?",
      'Has marketing had budget for this approved for the year yet?',
      'Would the team rather have a chatbot here, or a weekly dashboard?',
    ],
    explanations: [
      "Model choice is a build decision that only makes sense once the problem is named. Asking it now adopts the client's framing without examining it.",
      'Correct. A named person, and their own unpolished description of the problem, give you something specific to scope instead of a department-wide wish.',
      'Funding tells you the request will survive the year, not what the request is. A funded vague ask is still a vague ask.',
      'Picking between a chatbot and a dashboard fixes the shape before anyone has said what should change — the same mistake, one step later.',
    ],
  },
}
