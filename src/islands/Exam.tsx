import { useState } from 'react'
import type { Locale } from '../core/locale'
import { isTestCorrect, missedCardTopics, scoreCards, scoreTest, type CardMark } from '../core/exam'
import { recordExam } from '../core/progress'
import { examTopics } from '../data/exam'
import { examText } from '../data/exam.text'
import { t } from '../data/ui-strings'

interface Props {
  locale: Locale
}

type Mode = 'test' | 'cards'

export default function Exam({ locale }: Props) {
  const [mode, setMode] = useState<Mode>('test')

  return (
    <section className="my-8 rounded border border-slate-300 p-6">
      <div className="mb-6 flex gap-2" role="tablist">
        <button
          type="button"
          role="tab"
          id="exam-tab-test"
          aria-controls="exam-panel"
          aria-selected={mode === 'test'}
          className="rounded border border-slate-400 px-3 py-1 aria-selected:bg-slate-900 aria-selected:text-white"
          onClick={() => setMode('test')}
        >
          {t(locale, 'exam.mode.test')}
        </button>
        <button
          type="button"
          role="tab"
          id="exam-tab-cards"
          aria-controls="exam-panel"
          aria-selected={mode === 'cards'}
          className="rounded border border-slate-400 px-3 py-1 aria-selected:bg-slate-900 aria-selected:text-white"
          onClick={() => setMode('cards')}
        >
          {t(locale, 'exam.mode.cards')}
        </button>
      </div>

      {/* Switching modes remounts the branch below with fresh state — an
          in-progress run in one mode is abandoned, never mixed with the
          other, which is what "reversible at any time" means here. */}
      <div
        id="exam-panel"
        role="tabpanel"
        aria-labelledby={mode === 'test' ? 'exam-tab-test' : 'exam-tab-cards'}
      >
        {mode === 'test' ? <TestMode locale={locale} /> : <CardsMode locale={locale} />}
      </div>
    </section>
  )
}

function TestMode({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<number[][]>([])

  const finished = index >= examTopics.length

  if (finished) {
    const { score, total } = scoreTest(examTopics, answers)
    return (
      <div>
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
      </div>
    )
  }

  const topic = examTopics[index]
  const text = examText[locale][topic.id]
  if (!text) return null

  function toggle(option: number) {
    if (checked) return
    setSelected([option])
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

    if (nextIndex === examTopics.length) {
      recordExam(window.localStorage, { mode: 'test', ...scoreTest(examTopics, nextAnswers) })
    }
  }

  return (
    <div>
      <p className="mb-4 font-semibold">{text.testPrompt}</p>
      <ul className="space-y-2">
        {text.testOptions.map((option, optionIndex) => (
          <li key={option}>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name={topic.id}
                checked={selected.includes(optionIndex)}
                onChange={() => toggle(optionIndex)}
                disabled={checked}
              />
              <span>{option}</span>
            </label>
            {checked && selected.includes(optionIndex) && (
              <p className="ml-6 mt-1 text-sm text-slate-600">{text.testExplanations[optionIndex]}</p>
            )}
          </li>
        ))}
      </ul>

      {checked && (
        <p className="mt-4 font-semibold">
          {isTestCorrect(topic, selected) ? t(locale, 'quiz.correct') : t(locale, 'quiz.incorrect')}
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
    </div>
  )
}

function CardsMode({ locale }: { locale: Locale }) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [marks, setMarks] = useState<CardMark[]>([])

  const finished = index >= examTopics.length

  if (finished) {
    const { score, total } = scoreCards(examTopics, marks)
    const missed = missedCardTopics(examTopics, marks)

    return (
      <div>
        <p className="text-lg font-semibold">
          {t(locale, 'quiz.score')}: {score} / {total}
        </p>

        {missed.length > 0 ? (
          <div className="mt-4">
            <p className="font-semibold">{t(locale, 'exam.card.missedHeading')}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {missed.map((id) => (
                <li key={id}>{examText[locale][id]?.cardQuestion ?? id}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4">{t(locale, 'exam.card.none')}</p>
        )}

        <button
          type="button"
          className="mt-4 rounded border border-slate-400 px-3 py-1"
          onClick={() => {
            setIndex(0)
            setMarks([])
            setRevealed(false)
          }}
        >
          {t(locale, 'quiz.retry')}
        </button>
      </div>
    )
  }

  const topic = examTopics[index]
  const text = examText[locale][topic.id]
  if (!text) return null

  function mark(value: CardMark) {
    const nextMarks = [...marks, value]
    const nextIndex = index + 1
    setMarks(nextMarks)
    setRevealed(false)
    setIndex(nextIndex)

    if (nextIndex === examTopics.length) {
      recordExam(window.localStorage, { mode: 'cards', ...scoreCards(examTopics, nextMarks) })
    }
  }

  return (
    <div>
      <p className="mb-4 font-semibold">{text.cardQuestion}</p>
      {revealed ? (
        <>
          <p className="mb-4 text-slate-700">{text.cardAnswer}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-slate-400 px-3 py-1"
              onClick={() => mark('knew')}
            >
              {t(locale, 'exam.card.knew')}
            </button>
            <button
              type="button"
              className="rounded border border-slate-400 px-3 py-1"
              onClick={() => mark('did-not')}
            >
              {t(locale, 'exam.card.didNot')}
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          className="rounded border border-slate-400 px-3 py-1"
          onClick={() => setRevealed(true)}
        >
          {t(locale, 'exam.card.reveal')}
        </button>
      )}
    </div>
  )
}
