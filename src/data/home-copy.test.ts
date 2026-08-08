import { describe, expect, test } from 'vitest'
import { homeCopy } from './home-copy'

describe('home copy', () => {
  test('states the positioning from the brief in both locales', () => {
    expect(homeCopy.en.lede).toMatch(/will not teach you to write code/i)
    expect(homeCopy.ru.lede).toMatch(/не научит вас писать код/i)
  })

  test('says who the handbook is not for', () => {
    expect(homeCopy.en.notFor).toMatch(/data scientists/i)
    expect(homeCopy.ru.notFor).toMatch(/data scientists/i)
  })

  test('defines the same fields in both locales', () => {
    expect(Object.keys(homeCopy.ru).sort()).toEqual(Object.keys(homeCopy.en).sort())
  })

  test('leaves no field empty', () => {
    for (const [locale, copy] of Object.entries(homeCopy)) {
      for (const [field, value] of Object.entries(copy)) {
        expect(value.trim(), `${locale}.${field} is empty`).not.toBe('')
      }
    }
  })
})
