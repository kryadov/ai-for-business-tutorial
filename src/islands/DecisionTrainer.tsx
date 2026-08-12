import { useState } from 'react'
import type { Locale } from '../core/locale'
import { decide, walk } from '../core/decision-engine'
import { decisionScenarios, decisionTree, scenarioById } from '../data/decision-tree'
import { decisionTreeText } from '../data/decision-tree.text'
import { t } from '../data/ui-strings'

interface Props {
  locale: Locale
}

export default function DecisionTrainer({ locale }: Props) {
  const text = decisionTreeText[locale]
  const [answers, setAnswers] = useState<string[]>([])
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [analysisShown, setAnalysisShown] = useState(false)

  const state = walk(decisionTree, answers)
  const verdict = decide(decisionTree, answers)
  const scenario = scenarioId === null ? undefined : scenarioById(scenarioId)

  function restart(nextScenarioId: string | null) {
    setAnswers([])
    setScenarioId(nextScenarioId)
    setAnalysisShown(false)
  }

  return (
    <section className="my-8 rounded border border-slate-300 p-6" data-widget="trainer">
      <p className="mb-4 text-slate-700 dark:text-slate-300">{t(locale, 'trainer.intro')}</p>

      {scenario && (
        <blockquote className="mb-4 border-l-4 border-slate-300 pl-4 text-slate-700 dark:text-slate-300">
          {text.scenarios[scenario.id].prompt}
        </blockquote>
      )}

      {state.question && (
        <div data-trainer-question={state.question.id}>
          <p className="mb-3 font-semibold">{text.questions[state.question.id].prompt}</p>
          <ul className="space-y-2">
            {state.question.options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className="w-full rounded border border-slate-400 px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setAnswers([...answers, option.id])}
                >
                  {text.questions[state.question!.id].options[option.id]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {verdict && (
        <div data-trainer-verdict={verdict.solutionClass}>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            {t(locale, 'trainer.verdict')}
          </p>
          <p className="mb-2 text-2xl font-semibold">{text.leaves[verdict.leafId].verdict}</p>
          <p className="mb-6 text-slate-700 dark:text-slate-300">
            {text.leaves[verdict.leafId].summary}
          </p>

          {/* The reason this tool exists. Section 5: a reader who can only name
              the answer loses the argument; one who can say why the other four
              are wrong wins it. */}
          <p className="mb-2 font-semibold">{t(locale, 'trainer.whyNot')}</p>
          <ul className="mb-6 space-y-2">
            {verdict.rejected.map((rejection) => (
              <li key={rejection.solutionClass} className="text-slate-700 dark:text-slate-300">
                <span className="font-medium">{rejection.solutionClass}</span>
                {' — '}
                <span data-rejection={rejection.solutionClass}>
                  {text.rejections[rejection.reasonKey]}
                </span>
              </li>
            ))}
          </ul>

          {scenario && (
            <div className="mb-6 rounded border border-slate-300 p-4">
              <p className="mb-2 font-semibold">
                {verdict.solutionClass === scenario.expected
                  ? t(locale, 'trainer.matched')
                  : t(locale, 'trainer.mismatched')}
              </p>
              {analysisShown ? (
                <p className="text-slate-700 dark:text-slate-300">
                  {text.scenarios[scenario.id].analysis}
                </p>
              ) : (
                <button
                  type="button"
                  className="rounded border border-slate-400 px-3 py-1"
                  onClick={() => setAnalysisShown(true)}
                >
                  {t(locale, 'trainer.showAnalysis')}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {answers.length > 0 && (
          <button
            type="button"
            className="rounded border border-slate-400 px-3 py-1"
            onClick={() => {
              setAnswers(answers.slice(0, -1))
              setAnalysisShown(false)
            }}
          >
            {t(locale, 'trainer.back')}
          </button>
        )}
        {(answers.length > 0 || scenarioId !== null) && (
          <button
            type="button"
            className="rounded border border-slate-400 px-3 py-1"
            onClick={() => restart(null)}
          >
            {t(locale, 'trainer.restart')}
          </button>
        )}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
        <p className="mb-1 font-semibold">{t(locale, 'trainer.scenarios')}</p>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
          {t(locale, 'trainer.scenarioPrompt')}
        </p>
        <ul className="flex flex-wrap gap-2">
          {decisionScenarios.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                aria-pressed={candidate.id === scenarioId}
                className="rounded border border-slate-400 px-3 py-1 text-sm aria-pressed:bg-slate-900 aria-pressed:text-white"
                onClick={() => restart(candidate.id)}
              >
                {text.scenarios[candidate.id].prompt.slice(0, 48)}…
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
