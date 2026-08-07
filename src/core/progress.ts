import { z } from 'zod'

const STORAGE_KEY = 'afb:progress:v1'

const quizResultSchema = z.object({
  score: z.number().int().min(0),
  total: z.number().int().min(0),
  answers: z.array(z.array(z.number().int().min(0))),
})

const examResultSchema = z.object({
  mode: z.enum(['test', 'cards']),
  score: z.number().int().min(0),
  total: z.number().int().min(0),
})

const progressSchema = z.object({
  readSections: z.array(z.string()),
  quizResults: z.record(z.string(), quizResultSchema),
  examResult: examResultSchema.optional(),
})

export type QuizResult = z.infer<typeof quizResultSchema>
export type ExamResult = z.infer<typeof examResultSchema>
export type Progress = z.infer<typeof progressSchema>

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
    const parsed = progressSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : empty()
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

export function recordQuiz(storage: Storage, sectionId: string, result: QuizResult): Progress {
  const progress = readProgress(storage)
  progress.quizResults = { ...progress.quizResults, [sectionId]: result }
  writeProgress(storage, progress)
  return progress
}
