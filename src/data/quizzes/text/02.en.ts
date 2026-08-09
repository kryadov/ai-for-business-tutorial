import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '02-chatbot-or-outcome': {
    prompt:
      'A client opens with: "We need a chatbot on the website." What should you ask first?',
    options: [
      'Which vendor do you want to use for the chatbot?',
      "What should a visitor be able to do afterward that they can't do today?",
      'How many pages will the chatbot need to read?',
      'Do you want the chatbot to sound formal or casual?',
    ],
    explanations: [
      'Vendor choice is downstream of knowing what the chatbot is supposed to change; picking one first locks in a shape before the problem is named.',
      'Correct. This is the move that turns a request for a built thing into a stated outcome — the answer becomes the yardstick the project is judged against, not the chatbot itself.',
      'Page count is an implementation detail of retrieval, not a diagnosis of what actually needs to change for the visitor.',
      "Tone is copywriting, not the outcome the client is actually buying — it doesn't tell you what changes when the project ships.",
    ],
  },
  '02-real-outcome-or-guess': {
    prompt:
      'A client says: "This team is too big for what it does — AI should let us cut headcount." What tells you whether that is a real cost-reduction case or a guess dressed up as one?',
    options: [
      'Whether the client can say how many hours a task takes and how often it happens',
      'Whether the client is willing to sign a multi-year contract',
      'Whether the team agrees the workload feels heavy',
      'Whether a similar company in the same industry has done something like this',
    ],
    explanations: [
      "Correct. A number and a frequency is the baseline the outcome needs — without it there is nothing on record to compare against once the project ships.",
      'Contract length is a commercial decision made later; it says nothing about whether today\'s workload has ever been measured.',
      'A shared feeling that work is heavy is exactly the kind of unmeasured impression the baseline check is meant to catch, not confirm.',
      "Another company's case study describes their numbers, not this client's hours or frequency — it cannot stand in for a baseline that was never recorded here.",
    ],
  },
  '02-adjective-or-criterion': {
    prompt:
      'Asked what success looks like, a client answers: "The process should be much faster and feel more seamless for everyone." How should you treat that answer?',
    options: [
      'Write it down as the success criterion and move to scoping',
      'Assume "faster" means the client wants a chatbot',
      'Treat it as agreement and skip the measurement conversation',
      'Treat it as a mood, not a criterion, because there is no metric, owner, or date attached',
    ],
    explanations: [
      "Two adjectives with nothing to measure cannot be checked at delivery — writing them down as-is just moves the ambiguity into the proposal.",
      "\"Faster\" describes a feeling about the outcome, not a technology; it says nothing about whether a chatbot, a workflow, or something else fits.",
      "Enthusiasm about the direction is not the same as agreement on a number — treating them as equivalent is how a project ends up impossible to fail on paper.",
      'Correct. Without a metric, an owner, and a date, the sentence cannot be checked in ninety days — which is the definition of a mood, not a success criterion.',
    ],
  },
  '02-walk-the-example': {
    prompt:
      'A client\'s team insists, with their own staff in the room, that they need "a fully autonomous agent" to process incoming invoices. You suspect the actual work is three fixed steps that never vary. What do you do?',
    options: [
      'Tell the room directly: "this isn\'t really an agent problem"',
      'Agree to build the agent since the client is confident about what they need',
      'Ask them to walk through one real invoice from last week, start to finish, in order',
      'Suggest they lower their budget until the request becomes an agent',
    ],
    explanations: [
      'Correcting the shape out loud in front of their own team makes the request personal and tends to produce a defensive client, not a corrected one.',
      "Confidence about the request is not evidence about the work — building around an assumed shape risks paying for autonomy the process never uses.",
      'Correct. Walking a real case surfaces the mismatch on its own — the room notices together that the steps never actually varied, without anyone being told they were wrong.',
      'Budget has nothing to do with whether the underlying work involves a decision — this sidesteps the actual question instead of answering it.',
    ],
  },
  '02-who-feels-it': {
    prompt:
      'A client says: "AI would really help our marketing team." Which follow-up question gets you closer to a scoped problem?',
    options: [
      'Which large language model should we use for the marketing team?',
      "Who on that team loses the most time to this today, and how do they describe the problem when they're annoyed about it?",
      'Does marketing have a budget approved yet?',
      'Would the team prefer a chatbot or a dashboard?',
    ],
    explanations: [
      'Model choice is a build decision that comes after the problem is named — asking it here just adopts the client\'s unexamined framing.',
      "Correct. Naming who feels the problem, and hearing it in their own frustrated words rather than the polished pitch, gets you the actual pain point instead of a generic wish.",
      'Budget approval does not tell you what the team actually needs fixed — a funded vague request is still a vague request.',
      'Choosing between a chatbot and a dashboard picks a shape before anyone has said what should change — exactly the trap the section warns about.',
    ],
  },
}
