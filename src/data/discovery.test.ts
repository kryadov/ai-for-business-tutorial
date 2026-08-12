import { describe, expect, test } from 'vitest'
import {
  discoveryBlocks,
  discoveryFlags,
  discoveryQuestions,
  discoveryText,
  questionsInBlock,
} from './discovery'
import { evaluateFlags } from '../core/discovery-summary'
import { sections } from './sections'
import { uiStrings } from './ui-strings'

const LOCALES = ['en', 'ru'] as const

describe('the question set', () => {
  test('every question belongs to a declared block', () => {
    const known = new Set(discoveryBlocks.map((block) => block.id))
    for (const question of discoveryQuestions) {
      expect(known.has(question.block), `${question.id} is in no block`).toBe(true)
    }
  })

  test('every block has questions', () => {
    for (const block of discoveryBlocks) {
      expect(questionsInBlock(block.id).length, `${block.id} is empty`).toBeGreaterThan(0)
    }
  })

  test('block headings are real interface strings', () => {
    for (const block of discoveryBlocks) {
      for (const locale of LOCALES) {
        expect(uiStrings[locale][block.heading], `${locale}: ${block.heading}`).toBeTruthy()
      }
    }
  })

  test('question ids are unique', () => {
    const ids = discoveryQuestions.map((question) => question.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('a choice question declares options and a text question does not', () => {
    for (const question of discoveryQuestions) {
      if (question.kind === 'choice') {
        expect(question.options?.length, `${question.id} offers no choice`).toBeGreaterThan(1)
      } else {
        expect(question.options, `${question.id} is text but carries options`).toBeUndefined()
      }
    }
  })
})

describe('every question is written in both locales', () => {
  test('label, hint and every option', () => {
    for (const locale of LOCALES) {
      for (const question of discoveryQuestions) {
        const written = discoveryText[locale].questions[question.id]
        expect(written, `${locale}: ${question.id} has no text`).toBeDefined()
        expect(written.label.trim()).not.toBe('')
        expect(written.hint.length, `${locale}: ${question.id} hint is a stub`).toBeGreaterThan(40)

        for (const option of question.options ?? []) {
          expect(
            written.options[option],
            `${locale}: ${question.id}/${option} has no label`,
          ).toBeTruthy()
        }
      }
    }
  })

  test('no locale writes an option the other does not', () => {
    for (const question of discoveryQuestions) {
      const en = Object.keys(discoveryText.en.questions[question.id].options).sort()
      const ru = Object.keys(discoveryText.ru.questions[question.id].options).sort()
      expect(ru, `${question.id} option labels diverge`).toEqual(en)
    }
  })
})

describe('the red flag rules', () => {
  // A rule references its question and its option by string. A typo in either
  // does not fail a build — it silently switches the flag off, and the reader
  // sees an all-clear on a checklist that should be shouting.
  test('every condition names a question that exists', () => {
    const known = new Set<string>(discoveryQuestions.map((question) => question.id))
    for (const flag of discoveryFlags) {
      for (const condition of flag.when) {
        expect(known.has(condition.question), `${flag.id} watches ${condition.question}`).toBe(true)
      }
    }
  })

  test('every condition compares against an option that question actually offers', () => {
    for (const flag of discoveryFlags) {
      for (const condition of flag.when) {
        const question = discoveryQuestions.find((q) => q.id === condition.question)!
        expect(
          question.options ?? [],
          `${flag.id}: ${condition.question} never yields "${condition.equals}"`,
        ).toContain(condition.equals)
      }
    }
  })

  test('every flag can actually fire', () => {
    for (const flag of discoveryFlags) {
      const answers = Object.fromEntries(flag.when.map((c) => [c.question, c.equals]))
      expect(evaluateFlags(discoveryFlags, answers), `${flag.id} never fires`).toContain(flag.id)
    }
  })

  test('every flag sends the reader to a section that exists', () => {
    const known = new Set<string>(sections.map((section) => section.sectionId))
    for (const flag of discoveryFlags) {
      expect(known.has(flag.reread), `${flag.id} points at ${flag.reread}`).toBe(true)
    }
  })

  test('every flag is written in both locales', () => {
    for (const locale of LOCALES) {
      for (const flag of discoveryFlags) {
        const written = discoveryText[locale].flags[flag.id]
        expect(written, `${locale}: ${flag.id} has no text`).toBeDefined()
        expect(written.title.trim()).not.toBe('')
        expect(
          written.consequence.length,
          `${locale}: ${flag.id} says nothing about consequences`,
        ).toBeGreaterThan(40)
        expect(written.reread.trim()).not.toBe('')
      }
    }
  })

  test('an untouched checklist raises nothing', () => {
    expect(evaluateFlags(discoveryFlags, {})).toEqual([])
  })

  // Answering everything the reassuring way must also raise nothing, or the
  // tool cries wolf and consultants stop reading it.
  test('a clean set of answers raises nothing', () => {
    const clean = {
      'a-owner': 'named',
      'b-steps': 'described',
      'c-documents': 'yes',
      'c-database': 'yes',
      'c-access': 'segregated',
      'd-cloud': 'allowed',
      'd-personal-data': 'no',
      'd-error-cost': 'low',
      'd-reviewer': 'yes',
    }
    expect(evaluateFlags(discoveryFlags, clean)).toEqual([])
  })
})
