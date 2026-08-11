import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '09-success-with-a-metric': {
    prompt:
      'In a discovery call, a client says success would be "the team being more efficient with AI." Everyone nods and starts moving to the next agenda item. What do you do?',
    options: [
      'Record "more efficient with AI" in the scope document as the agreed criterion',
      'Ask for the current KPI first, since a baseline number implies the target',
      'Keep asking until a metric and a direction are said aloud, in their words',
      'Move on now and settle on a metric yourself when you sit down to estimate',
    ],
    explanations: [
      'A wish with no number and no direction gets read back six months later as whatever the scope document happens to say, and the person who wrote that sentence is you.',
      'The current KPI is the point you measure from, not the point you are aiming at. A baseline with no stated direction still leaves the criterion unwritten.',
      "Correct. A criterion only counts once it carries a metric and a direction, said out loud with witnesses, and captured in the client's own words rather than yours. Note who agreed to it, too — that is the person the budget review will call.",
      'Inventing the number afterwards means you are held to a target the client never committed to, which is the worst possible position when the finance review comes around.',
    ],
  },
  '09-slow-versus-manual': {
    prompt:
      'A client describes an invoice queue: "once it reaches the finance manager\'s desk, it sits there three days before anyone opens it." They ask for an AI system that speeds this up. What do you tell them?',
    options: [
      'An agent will clear invoices faster than a person, so the three days shrink',
      'A three-day wait is a delay, not manual work, and no model removes it',
      'Retrieval can surface the approval policy so the manager decides sooner',
      'The route through approvers varies, so this calls for an agent, not a workflow',
    ],
    explanations: [
      'Nobody is copying data by hand at that desk, so there is no manual step for an agent to take over. An unopened invoice is not slow because the work is slow.',
      'Correct. A slow step and a manual step are different problems with different fixes, and three days sitting with one manager is an organisational bottleneck no model resolves.',
      'Putting the policy in front of the manager does not shorten the time the invoice spends unopened. The delay is about priority and workload, not missing information.',
      'Whether the path varies decides agent versus workflow, but that is a separate question. It says nothing about why the invoice waits three days before anyone looks.',
    ],
  },
  '09-documents-or-database-discovery': {
    prompt:
      'A client mentions a spreadsheet with consistent columns that the claims team keeps as an email attachment. They ask whether that counts as documents or as a database. What do you answer?',
    options: [
      'Documents, since it arrives as an attachment rather than living in a system',
      'Undecided, until you learn who maintains the file and how often it changes',
      'A database, but only because the client used the word "database" earlier on',
      'Closer to a database, because the columns decide it and not the file format',
    ],
    explanations: [
      'How a file reaches you is a delivery detail, not a data shape. A file with consistent columns behaves like rows in a table whether it is emailed, shared or exported.',
      'Who maintains it affects how much you can trust the contents, but it does not settle the documents-versus-database question. The column structure already settles that.',
      'The word the client reached for is not the test. What matters is whether an answer comes from counting, summing or filtering rows, which this spreadsheet supports.',
      'Correct. A spreadsheet with consistent columns is closer to a database than to a document, whatever format it happens to be saved in — structure decides, not the container. That answer points the project at text2SQL rather than retrieval.',
    ],
  },
  '09-tidy-process-versus-last-tuesday': {
    prompt:
      'The process owner opens the meeting with a clean flowchart of how claims move from intake to payout. What do you do next?',
    options: [
      'Ask for one real case from last week and compare it against the flowchart',
      'Take the flowchart as the process, since the owner presenting it would know',
      'Move to the data block, since the process is documented step by step already',
      'Ask which tool drew the diagram so the proposal can reuse the same styling',
    ],
    explanations: [
      'Correct. Clients routinely describe the process on paper rather than the one that actually runs, and a specific recent case — the exception, the reassigned ticket, the spreadsheet nobody admits to using — surfaces what the flowchart smooths over.',
      'Owning the process does not guarantee the diagram matches the work. The owner is often the person furthest from the exceptions, describing the version that was approved.',
      'A flowchart shows the order of steps, not where the manual labour sits or where the delays build up, and those are the two things the process block exists to find.',
      'The drawing tool is a formatting question. It has no bearing on whether the diagram describes what the claims team actually did with last week\'s awkward case.',
    ],
  },
  '09-no-named-owner': {
    prompt:
      'Asked who owns the claims process, the client answers: "well, a few people are involved, and leadership is generally supportive." What does that tell you?',
    options: [
      'Little on its own, since a claims process naturally touches several teams',
      'Nobody is accountable for the outcome, so nobody is really buying the result',
      'Build it as a workflow rather than an agent, since ownership is distributed',
      'The KPI question is answered, since leadership backing implies a target set',
    ],
    explanations: [
      'Several teams touching a process is ordinary and expected. What is missing is not headcount but a single name measured on the outcome, and no name was offered.',
      'Correct. A client who has to think about who owns the process has not found their sponsor yet, and a project with no sponsor is the first thing deprioritised when budgets tighten.',
      'Agent versus workflow is decided by whether the path varies with the request, not by how many people share ownership. Distributed ownership is a sales problem, not a design one.',
      '"Generally supportive" is sentiment, not a number with a direction. It tells you nothing about the current baseline or about what improvement anyone would accept.',
    ],
  },
}
