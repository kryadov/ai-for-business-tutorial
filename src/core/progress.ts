const STORAGE_KEY = 'afb:progress:v1'

export interface QuizResult {
  score: number
  total: number
  answers: number[][]
}

export interface ExamResult {
  mode: 'test' | 'cards'
  score: number
  total: number
}

export interface Progress {
  readSections: string[]
  quizResults: Record<string, QuizResult>
  examResult?: ExamResult
}

const isNonNegativeInt = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= 0

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((item) => typeof item === 'string')

const isAnswers = (v: unknown): v is number[][] =>
  Array.isArray(v) && v.every((row) => Array.isArray(row) && row.every(isNonNegativeInt))

const isQuizResult = (v: unknown): v is QuizResult => {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return isNonNegativeInt(r.score) && isNonNegativeInt(r.total) && isAnswers(r.answers)
}

const isQuizResults = (v: unknown): v is Record<string, QuizResult> => {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false
  return Object.values(v as Record<string, unknown>).every(isQuizResult)
}

const isExamResult = (v: unknown): v is ExamResult => {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  return (
    (r.mode === 'test' || r.mode === 'cards') &&
    isNonNegativeInt(r.score) &&
    isNonNegativeInt(r.total)
  )
}

const isProgress = (v: unknown): v is Progress => {
  if (typeof v !== 'object' || v === null) return false
  const r = v as Record<string, unknown>
  if (!isStringArray(r.readSections)) return false
  if (!isQuizResults(r.quizResults)) return false
  if ('examResult' in r && r.examResult !== undefined && !isExamResult(r.examResult)) return false
  return true
}

const empty = (): Progress => ({ readSections: [], quizResults: {} })

export function readProgress(storage: Storage): Progress {
  let raw: string | null = null
  try {
    raw = storage.getItem(STORAGE_KEY)
  } catch {
    return empty()
  }

  if (raw === null) return empty()

  try {
    const parsed: unknown = JSON.parse(raw)
    return isProgress(parsed) ? parsed : empty()
  } catch {
    return empty()
  }
}

export function writeProgress(storage: Storage, progress: Progress): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // A full or blocked storage must never break the page. The reader loses
    // their checkmarks, not the ability to read.
  }
}

export function markRead(storage: Storage, sectionId: string): Progress {
  const progress = readProgress(storage)
  if (!progress.readSections.includes(sectionId)) {
    progress.readSections = [...progress.readSections, sectionId]
  }
  writeProgress(storage, progress)
  return progress
}

export interface SectionMarks {
  readonly read: boolean
  readonly quizzed: boolean
}

export function sectionMarks(progress: Progress, sectionId: string): SectionMarks {
  return {
    read: progress.readSections.includes(sectionId),
    quizzed: Object.hasOwn(progress.quizResults, sectionId),
  }
}

export function recordQuiz(storage: Storage, sectionId: string, result: QuizResult): Progress {
  const progress = readProgress(storage)
  progress.quizResults = { ...progress.quizResults, [sectionId]: result }
  writeProgress(storage, progress)
  return progress
}
