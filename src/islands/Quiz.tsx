import { useState } from 'react'
import type { Locale } from '../core/locale'
import { isCorrect, scoreQuiz } from '../core/quiz'
import { recordQuiz } from '../core/progress'
import { quizFor } from '../data/quizzes/index'
import { quizText } from '../data/quizzes/text'
import { t } from '../data/ui-strings'

interface Props {
  sectionId: string
  locale: Locale
}

export default function Quiz({ sectionId, locale }: Props) {
  const quiz = quizFor(sectionId)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<number[][]>([])

  if (!quiz) return null

  const finished = index >= quiz.questions.length

  if (finished) {
    const { score, total } = scoreQuiz(quiz, answers)
    return (
      <section className="my-8 rounded border border-slate-300 p-6">
        <p className="text-lg font-semibold">
          {t(locale, 'quiz.score')}: {score} / {total}
        </p>
        <button
          type="button"
          className="mt-4 rounded border border-slate-400 px-3 py-1"
          onClick={() => {
            setIndex(0)
            setAnswers([])
            setSelected([])
            setChecked(false)
          }}
        >
          {t(locale, 'quiz.retry')}
        </button>
      </section>
    )
  }

  const question = quiz.questions[index]
  const text = quizText[locale][question.id]
  const multi = question.correct.length > 1

  function toggle(option: number) {
    if (checked) return
    setSelected((current) =>
      multi
        ? current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option]
        : [option],
    )
  }

  function advance() {
    if (!checked) {
      setChecked(true)
      return
    }

    const nextAnswers = [...answers, selected]
    const nextIndex = index + 1
    setAnswers(nextAnswers)
    setSelected([])
    setChecked(false)
    setIndex(nextIndex)

    // `quiz` is narrowed to non-undefined by the early return above, but the
    // narrowing does not cross into this nested closure's own scope, hence
    // the assertions below.
    if (nextIndex === quiz!.questions.length) {
      recordQuiz(window.localStorage, sectionId, {
        ...scoreQuiz(quiz!, nextAnswers),
        answers: nextAnswers,
      })
    }
  }

  return (
    <section className="my-8 rounded border border-slate-300 p-6">
      <p className="mb-4 font-semibold">{text.prompt}</p>
      <ul className="space-y-2">
        {text.options.map((option, optionIndex) => (
          <li key={option}>
            <label className="flex items-start gap-2">
              <input
                type={multi ? 'checkbox' : 'radio'}
                name={question.id}
                checked={selected.includes(optionIndex)}
                onChange={() => toggle(optionIndex)}
                disabled={checked}
              />
              <span>{option}</span>
            </label>
            {checked && selected.includes(optionIndex) && (
              <p className="ml-6 mt-1 text-sm text-slate-600">{text.explanations[optionIndex]}</p>
            )}
          </li>
        ))}
      </ul>

      {checked && (
        <p className="mt-4 font-semibold">
          {isCorrect(question, selected) ? t(locale, 'quiz.correct') : t(locale, 'quiz.incorrect')}
        </p>
      )}

      <button
        type="button"
        className="mt-4 rounded border border-slate-400 px-3 py-1 disabled:opacity-50"
        onClick={advance}
        disabled={selected.length === 0}
      >
        {checked ? t(locale, 'quiz.next') : t(locale, 'quiz.check')}
      </button>
    </section>
  )
}
