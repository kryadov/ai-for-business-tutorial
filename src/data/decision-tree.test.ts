import { describe, expect, test } from 'vitest'
import { decisionScenarios, decisionTree } from './decision-tree'
import { decisionTreeText } from './decision-tree.text'
import { rejectionKey, solutionClasses } from '../core/decision-engine'

const LOCALES = ['en', 'ru'] as const

describe('every node of the tree is written in both locales', () => {
  test('questions and their options', () => {
    for (const locale of LOCALES) {
      const text = decisionTreeText[locale]
      for (const question of decisionTree.questions) {
        const written = text.questions[question.id]
        expect(written, `${locale}: ${question.id} has no prompt`).toBeDefined()
        expect(written.prompt.trim()).not.toBe('')

        for (const option of question.options) {
          expect(
            written.options[option.id],
            `${locale}: ${question.id}/${option.id} has no label`,
          ).toBeTruthy()
        }
      }
    }
  })

  test('leaves carry a verdict and a summary', () => {
    for (const locale of LOCALES) {
      for (const leaf of decisionTree.leaves) {
        const written = decisionTreeText[locale].leaves[leaf.id]
        expect(written, `${locale}: ${leaf.id} has no text`).toBeDefined()
        expect(written.verdict.trim()).not.toBe('')
        expect(written.summary.length, `${locale}: ${leaf.id} summary is a stub`).toBeGreaterThan(60)
      }
    }
  })

  // The reason this feature exists: a reader who can only name the answer
  // loses the argument. Every leaf must argue against all four other classes,
  // in both languages, or the verdict panel renders a blank.
  test('every leaf argues against every other class', () => {
    for (const locale of LOCALES) {
      for (const leaf of decisionTree.leaves) {
        for (const solutionClass of solutionClasses) {
          if (solutionClass === leaf.verdict) continue

          const key = rejectionKey(leaf.id, solutionClass)
          const written = decisionTreeText[locale].rejections[key]
          expect(written, `${locale}: nothing argues against ${solutionClass} at ${leaf.id}`).toBeTruthy()
          expect(written.length, `${locale}: ${key} is a stub`).toBeGreaterThan(40)
        }
      }
    }
  })

  test('no rejection text is written for a class the leaf actually recommends', () => {
    for (const locale of LOCALES) {
      for (const leaf of decisionTree.leaves) {
        const key = rejectionKey(leaf.id, leaf.verdict)
        expect(
          decisionTreeText[locale].rejections[key],
          `${locale}: ${leaf.id} argues against its own verdict`,
        ).toBeUndefined()
      }
    }
  })

  test('scenarios carry a prompt and an analysis', () => {
    for (const locale of LOCALES) {
      for (const scenario of decisionScenarios) {
        const written = decisionTreeText[locale].scenarios[scenario.id]
        expect(written, `${locale}: ${scenario.id} has no text`).toBeDefined()
        expect(written.prompt.length, `${locale}: ${scenario.id} prompt is a stub`).toBeGreaterThan(60)
        expect(written.analysis.length, `${locale}: ${scenario.id} analysis is a stub`).toBeGreaterThan(60)
      }
    }
  })

  test('no locale carries text for a node the other does not', () => {
    const [en, ru] = LOCALES.map((locale) => decisionTreeText[locale])
    expect(Object.keys(ru.questions).sort()).toEqual(Object.keys(en.questions).sort())
    expect(Object.keys(ru.leaves).sort()).toEqual(Object.keys(en.leaves).sort())
    expect(Object.keys(ru.rejections).sort()).toEqual(Object.keys(en.rejections).sort())
    expect(Object.keys(ru.scenarios).sort()).toEqual(Object.keys(en.scenarios).sort())
  })
})

// Sections 6 and 10 already use support, sales, legal, company knowledge,
// analytics, HR, logistics, clinics and property management. The bank is here
// so a reader practises the tree, not so they recognise an example.
describe('the scenario bank is its own material', () => {
  test('each locale tells a different story for the same scenario id', () => {
    for (const scenario of decisionScenarios) {
      const en = decisionTreeText.en.scenarios[scenario.id].prompt
      const ru = decisionTreeText.ru.scenarios[scenario.id].prompt
      expect(en).not.toBe(ru)
    }
  })
})
