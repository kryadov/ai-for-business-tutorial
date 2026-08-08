export type UiStringKey =
  | 'nav.contents'
  | 'nav.glossary'
  | 'nav.exam'
  | 'nav.trainer'
  | 'nav.discovery'
  | 'quiz.check'
  | 'quiz.next'
  | 'quiz.retry'
  | 'quiz.correct'
  | 'quiz.incorrect'
  | 'quiz.score'
  | 'locale.switch'
  | 'draft.notice'
  | 'facts.verifiedOn'
  | 'progress.read'
  | 'progress.quizzed'

export type UiStrings = Record<UiStringKey, string>
