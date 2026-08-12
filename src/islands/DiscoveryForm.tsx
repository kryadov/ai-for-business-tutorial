import { useEffect, useState } from 'react'
import type { Locale } from '../core/locale'
import {
  buildSummary,
  evaluateFlags,
  unansweredQuestions,
  type DiscoveryAnswers,
} from '../core/discovery-summary'
import { readProgress, saveDiscoveryDraft, writeProgress } from '../core/progress'
import {
  discoveryBlocks,
  discoveryFlags,
  discoveryQuestions,
  discoveryText,
  questionsInBlock,
} from '../data/discovery'
import { t } from '../data/ui-strings'

interface Props {
  locale: Locale
}

export default function DiscoveryForm({ locale }: Props) {
  const text = discoveryText[locale]
  const [answers, setAnswers] = useState<DiscoveryAnswers>({})
  const [copied, setCopied] = useState(false)

  // The draft is read once on mount rather than rendered on the server: this is
  // a static page, and the notes belong to the browser that took them.
  useEffect(() => {
    setAnswers(readProgress(window.localStorage).discoveryDraft ?? {})
  }, [])

  function answer(questionId: string, value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }))
    setCopied(false)
    saveDiscoveryDraft(window.localStorage, questionId, value)
  }

  const raised = evaluateFlags(discoveryFlags, answers)
  const open = unansweredQuestions(discoveryQuestions, answers)

  function summary(): string {
    return buildSummary(
      discoveryBlocks.map((block) => ({
        heading: t(locale, block.heading),
        questions: questionsInBlock(block.id).map((question) => ({
          id: question.id,
          label: text.questions[question.id].label,
          optionLabels: text.questions[question.id].options,
        })),
      })),
      answers,
      [
        {
          heading: t(locale, 'discovery.flags'),
          items: raised.map(
            (id) => `${text.flags[id as keyof typeof text.flags].title} — ${text.flags[id as keyof typeof text.flags].consequence}`,
          ),
        },
        {
          heading: t(locale, 'discovery.unanswered'),
          items: open.map((id) => text.questions[id as keyof typeof text.questions].label),
        },
      ],
    )
  }

  async function copy() {
    await navigator.clipboard.writeText(summary())
    setCopied(true)
  }

  function clear() {
    // An explicit confirm because this holds a meeting's worth of notes and
    // there is nowhere to get them back from.
    if (!window.confirm(t(locale, 'discovery.clear'))) return
    const progress = readProgress(window.localStorage)
    delete progress.discoveryDraft
    writeProgress(window.localStorage, progress)
    setAnswers({})
    setCopied(false)
  }

  return (
    <section className="my-8 rounded border border-slate-300 p-6" data-widget="discovery">
      <p className="mb-6 text-slate-700 dark:text-slate-300">{t(locale, 'discovery.intro')}</p>

      <div className="mb-6 rounded border border-slate-300 p-4" data-discovery-flags>
        <p className="mb-2 font-semibold">{t(locale, 'discovery.flags')}</p>
        {raised.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">{t(locale, 'discovery.noFlags')}</p>
        ) : (
          <ul className="space-y-2">
            {raised.map((id) => {
              const flag = text.flags[id as keyof typeof text.flags]
              return (
                <li key={id} data-flag={id}>
                  <span className="font-medium">{flag.title}</span>
                  {' — '}
                  {flag.consequence}{' '}
                  <span className="text-slate-500">{flag.reread}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {discoveryBlocks.map((block) => (
        <fieldset key={block.id} className="mb-6" data-discovery-block={block.id}>
          <legend className="mb-3 font-semibold">{t(locale, block.heading)}</legend>
          <div className="space-y-5">
            {questionsInBlock(block.id).map((question) => {
              const written = text.questions[question.id]
              const value = answers[question.id]

              return (
                <div key={question.id}>
                  <label className="block font-medium" htmlFor={`discovery-${question.id}`}>
                    {written.label}
                  </label>
                  <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">{written.hint}</p>

                  {question.kind === 'text' ? (
                    <textarea
                      id={`discovery-${question.id}`}
                      rows={2}
                      className="w-full rounded border border-slate-400 px-2 py-1"
                      value={typeof value === 'string' ? value : ''}
                      onChange={(event) => answer(question.id, event.target.value)}
                    />
                  ) : (
                    <div id={`discovery-${question.id}`} className="space-y-1">
                      {(question.options ?? []).map((option) => (
                        <label key={option} className="flex items-start gap-2">
                          <input
                            type="radio"
                            name={question.id}
                            checked={value === option}
                            onChange={() => answer(question.id, option)}
                          />
                          <span>{written.options[option]}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          className="rounded border border-slate-400 px-3 py-1"
          onClick={() => void copy()}
        >
          {copied ? t(locale, 'discovery.copied') : t(locale, 'discovery.copy')}
        </button>
        <button
          type="button"
          className="rounded border border-slate-400 px-3 py-1"
          onClick={() => window.print()}
        >
          {t(locale, 'discovery.print')}
        </button>
        <button
          type="button"
          className="rounded border border-slate-400 px-3 py-1"
          onClick={clear}
        >
          {t(locale, 'discovery.clear')}
        </button>
      </div>
    </section>
  )
}
