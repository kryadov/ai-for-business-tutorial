import type { QuestionText } from '../text.types'

export const en: Record<string, QuestionText> = {
  '09-success-with-a-metric': {
    prompt:
      'In a discovery call, a client says success would be "the team being more efficient with AI." The room seems satisfied and moves toward wrapping up. What should you do?',
    options: [
      'Write "more efficient" into the scope document as the agreed success criterion',
      'Skip to the KPI question, since it will supply the missing metric on its own',
      "Keep asking until the answer carries a metric and a direction, and write it down in the client's own words while they are still in the room",
      'Move on to process questions, since business criteria have now been confirmed',
    ],
    explanations: [
      'Wishes without a metric or a direction get invented later by whoever writes the scope document — and that person answers for it, not the client who said it.',
      'The current-KPI question supplies a baseline, not a target. Without a stated direction and metric, there is nothing for that baseline to move toward.',
      "Correct. A criterion only counts once it carries a metric and a direction, said aloud with the room listening, and captured in the client's own words before anyone leaves.",
      '"More efficient" is exactly the vague version the section warns against — moving on without a metric hands the invention job to you at estimate time.',
    ],
  },
  '09-slow-versus-manual': {
    prompt:
      'A client describes an invoice queue: "once it lands on the finance manager\'s desk, it sits there for three days before anyone touches it." They ask you to design an AI system that speeds this up. What do you tell them?',
    options: [
      'That an agent will process invoices faster than a human, closing most of the three days',
      'That a three-day approval queue is a delay, not manual labour, and no model resolves an organisational bottleneck',
      'That RAG can retrieve the approval policy so the manager decides faster',
      'That the description confirms this needs a workflow rather than an agent',
    ],
    explanations: [
      'The desk is not the bottleneck an agent removes — nobody is manually copying data there. Speeding up a queue a person ignores is not what an agent does.',
      'Correct. A slow step and a manual step are different problems with different fixes; a three-day queue sitting with one manager is an organisational delay no model resolves.',
      'Retrieving a policy document does not shorten how long the invoice sits unopened. The delay is about priority and workload, not missing information.',
      'Workflow versus agent is a separate question about how the invoice moves through steps; it says nothing about why the manager takes three days to look at it.',
    ],
  },
  '09-documents-or-database-discovery': {
    prompt:
      'During discovery, a client mentions a spreadsheet with consistent columns that the claims team keeps as an email attachment. Where does the question "is this documents or a database" land?',
    options: [
      'It is a documents question, because it arrived as an attachment, so it should go to RAG',
      'It stays undecided until you know whether anyone treats it as a knowledge base',
      'It is a text2SQL question only because the client used the word "database" somewhere in the meeting',
      'It is closer to a database than a document, because the consistent columns are what matter, not the file format it happens to be saved in',
    ],
    explanations: [
      'Attachment is a delivery mechanism, not a data shape. A file with consistent columns behaves like rows in a table regardless of how it was sent.',
      'Whether it has a maintainer affects reliability, but it does not decide the documents-versus-database question — the column structure already answers that.',
      "The client's choice of word is not the test. What matters is whether an answer comes from counting or filtering rows, which this spreadsheet supports.",
      'Correct. A spreadsheet with consistent columns is closer to a database than to a document, whatever format it is saved in — the structure decides, not the container.',
    ],
  },
  '09-tidy-process-versus-last-tuesday': {
    prompt:
      'The process owner opens the meeting with a clean flowchart of how claims move from intake to payout. What should you do next?',
    options: [
      "Ask for last week's real, specific case — the one with the exception or the reassigned ticket — and compare it to the flowchart",
      'Accept the flowchart as the process, since the owner presenting it is the authority on how the work happens',
      'Move on to the data block, since the process is now fully documented',
      'Ask which software was used to draw the diagram, so you can reproduce it in the proposal',
    ],
    explanations: [
      'Correct. Clients routinely describe the process on paper, not the one that actually runs; a specific recent case surfaces the exception the flowchart smooths over.',
      'Authority over the process does not guarantee the diagram matches what actually happens — even the owner may be describing the intended version.',
      'A flowchart alone does not tell you where the manual labour or the delays are; those rarely match what the diagram shows.',
      'The diagramming tool has no bearing on whether the diagram reflects reality. It answers a formatting question, not a discovery question.',
    ],
  },
  '09-no-named-owner': {
    prompt:
      'Asked who owns the claims process, the room answers: "well, a few people are involved, and leadership is generally supportive." What does that tell you?',
    options: [
      'Nothing significant — most processes naturally involve several people',
      'No one is actually accountable for the outcome, which usually means no one is really buying the result',
      'The project should be built as a workflow instead of an agent, since ownership is distributed',
      'The KPI question is already answered, since leadership support implies measurable goals',
    ],
    explanations: [
      'A process touching several people is normal; the missing element here is not headcount but a name attached to the outcome, and neither was given.',
      'Correct. A client who has to think about who owns the process has not found their sponsor yet, and a project without one gets deprioritised when budgets tighten.',
      'Workflow versus agent is decided by whether the path varies with the request, not by how many people are involved in owning the process.',
      '"Generally supportive" is sentiment, not a stated metric or baseline; it says nothing about whether success criteria or current KPIs were ever named.',
    ],
  },
}
