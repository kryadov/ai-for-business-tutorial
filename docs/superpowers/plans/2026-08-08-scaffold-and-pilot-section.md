# Каркас сайта и пилотный раздел — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Получить развёрнутый на GitHub Pages двуязычный сайт-методичку с рабочей навигацией, квизом и полностью написанным Разделом 5 на обоих языках — чтобы заказчик утвердил тон и объём до написания остальных десяти разделов.

**Architecture:** Astro 7 отдаёт прозу статическим HTML; React подключается островами только там, где есть интерактив. Проза живёт в MDX внутри content collection с zod-схемой фронтматтера; структура (реестр разделов, ключ ответов квиза) лежит в TypeScript один раз на оба языка, а локализуется только текст. Вся предметная логика — чистые функции в `src/core/`, тестируемые без DOM.

**Tech Stack:** Astro 7.2.0, React 19.2.8 (острова), TypeScript 5.9.3, Tailwind CSS 4.3.3 через `@tailwindcss/vite`, Vitest 4.1.10, zod 4.4.3, MDX через `@astrojs/mdx` 7.0.5.

## Global Constraints

- **Node `>=22.12.0`** — требование Astro 7. В CI использовать Node 22.
- **Версии зафиксированы в `package.json` точными мажорами:** `astro@^7.2.0`, `@astrojs/react@^6.0.2`, `@astrojs/mdx@^7.0.5`, `react@^19.2.8`, `react-dom@^19.2.8`, `tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`, `vitest@^4.1.10`, `zod@^4.4.3`, `typescript@^5.9.3`.
- **Vite 8 напрямую не ставить.** Astro 7 несёт его внутри себя. Отдельный `vite` в зависимостях создаст вторую копию бандлера.
- **`@mdx-js/rollup` не ставить.** MDX подключается только интеграцией `@astrojs/mdx`.
- **`base: '/ai-for-business-tutorial'`** — все внутренние ссылки строятся через `import.meta.env.BASE_URL` или хелперы `astro:i18n`, никогда конкатенацией строк вручную.
- **Локали ровно две:** `en` (по умолчанию) и `ru`. Порядок в `locales` — `['en', 'ru']`.
- **Ни один модуль из `src/core/` не импортирует React, Astro или текст локали.** Только структура и чистые функции.
- **Тексты на английском и русском пишутся нативно**, но идентификаторы разделов, вопросов, вариантов ответа и терминов общие. Расхождение идентификаторов роняет `tests/parity.test.ts`.
- **Ни один факт о вендорах, моделях, ценах и протоколах не пишется по памяти.** Только сверка с первоисточником и разметка `verifiedOn` + `sources`.
- **Все коммиты на английском**, тело сообщения объясняет причину, а не пересказывает диф.

## Структура файлов

| Файл | Ответственность |
|---|---|
| `astro.config.mjs` | интеграции, i18n, base, Tailwind |
| `vitest.config.ts` | `getViteConfig` из `astro/config`, окружение jsdom для островов |
| `src/content.config.ts` | коллекция `sections`: glob-загрузчик и zod-схема фронтматтера |
| `src/data/sections.ts` | реестр 11 разделов: `sectionId`, `slug`, `order`, `widget` — один на оба языка |
| `src/data/ui-strings.{en,ru}.ts` | строки интерфейса по общим ключам |
| `src/data/glossary.{en,ru}.ts` | определения терминов по общим идентификаторам |
| `src/data/quizzes/05.ts` | скелет квиза раздела 5: идентификаторы вопросов и ключ ответов |
| `src/data/quizzes/text.{en,ru}.ts` | формулировки и объяснения по тем же идентификаторам |
| `src/core/locale.ts` | тип локали, чтение и запись выбора языка |
| `src/core/progress.ts` | схема прогресса в localStorage, устойчивое чтение |
| `src/core/quiz.ts` | проверка ответа и подсчёт результата |
| `src/components/Layout.astro` | каркас страницы, `<html lang>`, подключение стилей |
| `src/components/Sidebar.astro` | оглавление из реестра разделов |
| `src/components/LocaleSwitcher.astro` | переключатель языка, сохраняющий раздел |
| `src/components/Callout.astro` | врезка: ошибка, правильный подход, предупреждение |
| `src/components/Flow.astro` | схема-цепочка вместо ASCII-диаграмм из ТЗ |
| `src/components/Facts.astro` | блок факта с датой проверки и источниками |
| `src/components/T.astro` | термин с определением из глоссария |
| `src/islands/Quiz.tsx` | React-остров квиза |
| `src/pages/index.astro` | корень: автоопределение языка и переход на локаль |
| `src/pages/[locale]/index.astro` | титульная страница локали |
| `src/pages/[locale]/section/[slug].astro` | страница раздела |
| `src/pages/[locale]/glossary.astro` | страница глоссария |
| `tests/parity.test.ts` | паритет языков |
| `tests/facts.test.ts` | свежесть фактов |
| `.github/workflows/deploy.yml` | сборка, тесты, публикация на GitHub Pages |

---

### Task 1: Скелет проекта и сборка

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
- Create: `src/styles/global.css`, `src/components/Layout.astro`
- Create: `src/pages/index.astro`, `src/pages/[locale]/index.astro`
- Test: `tests/layout.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `Layout.astro` с пропсами `{ title: string; locale: 'en' | 'ru'; description?: string }` и слотом по умолчанию. Все последующие страницы оборачиваются в него.

- [ ] **Step 1: Создать `package.json`**

```json
{
  "name": "ai-for-business-tutorial",
  "type": "module",
  "version": "0.1.0",
  "private": false,
  "license": "MIT",
  "homepage": "https://kryadov.github.io/ai-for-business-tutorial/",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "astro check"
  },
  "dependencies": {
    "astro": "^7.2.0",
    "@astrojs/mdx": "^7.0.5",
    "@astrojs/react": "^6.0.2",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.10",
    "@tailwindcss/vite": "^4.3.3",
    "@testing-library/jest-dom": "^7.0.0",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^26.2.0",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "jsdom": "^30.0.1",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.3",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: Установить зависимости**

Run: `npm install`
Expected: установка без ошибок peer-зависимостей. Если npm сообщает о конфликте — остановиться и разобраться, `--legacy-peer-deps` не применять.

- [ ] **Step 3: Создать `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://kryadov.github.io',
  base: '/ai-for-business-tutorial',
  integrations: [react(), mdx()],
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: true },
  },
  vite: { plugins: [tailwindcss()] },
})
```

`redirectToDefaultLocale` намеренно не включён: корневой редирект делает собственная страница `src/pages/index.astro` из шага 8, потому что ей нужно ещё и определить язык браузера.

- [ ] **Step 4: Создать `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

- [ ] **Step 5: Создать `vitest.config.ts`**

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 6: Создать `.gitignore`**

```
node_modules/
dist/
.astro/
.DS_Store
*.log
```

- [ ] **Step 7: Создать `src/styles/global.css`**

```css
@import "tailwindcss";

:root {
  color-scheme: light dark;
}

body {
  text-wrap: pretty;
}
```

- [ ] **Step 8: Написать падающий тест для `Layout.astro`**

Create `tests/layout.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { expect, test } from 'vitest'
import Layout from '../src/components/Layout.astro'

test('sets the html lang attribute from the locale prop', async () => {
  const container = await AstroContainer.create()
  const html = await container.renderToString(Layout, {
    props: { title: 'Test page', locale: 'ru' },
    slots: { default: '<p>body copy</p>' },
  })

  expect(html).toContain('<html lang="ru"')
  expect(html).toContain('<title>Test page</title>')
  expect(html).toContain('body copy')
})

test('renders English as a distinct lang attribute', async () => {
  const container = await AstroContainer.create()
  const html = await container.renderToString(Layout, {
    props: { title: 'Test page', locale: 'en' },
    slots: { default: '<p>body copy</p>' },
  })

  expect(html).toContain('<html lang="en"')
})
```

- [ ] **Step 9: Запустить тест и убедиться, что он падает**

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/components/Layout.astro'`.

- [ ] **Step 10: Создать `src/components/Layout.astro`**

```astro
---
import '../styles/global.css'

interface Props {
  title: string
  locale: 'en' | 'ru'
  description?: string
}

const { title, locale, description } = Astro.props
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body class="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <slot />
  </body>
</html>
```

- [ ] **Step 11: Запустить тест и убедиться, что он проходит**

Run: `npm test`
Expected: PASS, два теста.

- [ ] **Step 12: Создать временные титульные страницы**

Create `src/pages/[locale]/index.astro`:

```astro
---
import Layout from '../../components/Layout.astro'

export function getStaticPaths() {
  return [{ params: { locale: 'en' } }, { params: { locale: 'ru' } }]
}

const { locale } = Astro.params as { locale: 'en' | 'ru' }
const title = locale === 'ru' ? 'AI для бизнеса' : 'AI for Business'
---

<Layout title={title} locale={locale}>
  <h1>{title}</h1>
</Layout>
```

Create `src/pages/index.astro`:

```astro
---
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={`0; url=${base}/en/`} />
    <title>AI for Business</title>
  </head>
  <body>
    <a href={`${base}/en/`}>Continue to the handbook</a>
  </body>
</html>
```

- [ ] **Step 13: Собрать проект и проверить выходные файлы**

Run: `npm run build && ls dist dist/en dist/ru`
Expected: сборка без ошибок, существуют `dist/index.html`, `dist/en/index.html`, `dist/ru/index.html`.

- [ ] **Step 14: Проверить типы**

Run: `npm run typecheck`
Expected: 0 errors.

- [ ] **Step 15: Коммит**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore src tests
git commit -m "feat: scaffold the bilingual Astro site

Astro 7 with both locales prefixed, so /en/ and /ru/ stay symmetric and no
link has to know which language is the default one."
```

---

### Task 2: Реестр разделов и коллекция контента

**Files:**
- Create: `src/data/sections.ts`, `src/content.config.ts`
- Create: `src/content/en/05-solution-classes.mdx`, `src/content/ru/05-solution-classes.mdx`
- Test: `src/data/sections.test.ts`, `tests/parity.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces:
  - `type SectionId` — литеральное объединение из одиннадцати идентификаторов;
  - `type Section = { sectionId: SectionId; slug: string; order: number; widget?: 'quiz' | 'trainer' | 'discovery' }`;
  - `export const sections: readonly Section[]` — отсортирован по `order`;
  - `export function sectionBySlug(slug: string): Section | undefined`;
  - коллекция `sections` с фронтматтером `{ section: SectionId; title: string; summary: string; status: 'draft' | 'ready' }`.

- [ ] **Step 1: Написать падающий тест реестра**

Create `src/data/sections.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { sections, sectionBySlug } from './sections'

describe('section registry', () => {
  test('holds eleven sections', () => {
    expect(sections).toHaveLength(11)
  })

  test('orders are 1..11 without gaps or duplicates', () => {
    expect(sections.map((s) => s.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })

  test('slugs are unique and url safe', () => {
    const slugs = sections.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^\d{2}-[a-z0-9-]+$/)
  })

  test('section ids are unique', () => {
    const ids = sections.map((s) => s.sectionId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('looks a section up by slug', () => {
    expect(sectionBySlug('05-solution-classes')?.order).toBe(5)
    expect(sectionBySlug('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/data/sections.test.ts`
Expected: FAIL — модуль `./sections` не найден.

- [ ] **Step 3: Создать `src/data/sections.ts`**

```ts
export type SectionId =
  | 'landscape'
  | 'business-lens'
  | 'llm-limits'
  | 'anatomy'
  | 'solution-classes'
  | 'catalogue'
  | 'security'
  | 'economics'
  | 'discovery'
  | 'framework'
  | 'myths'

export type Widget = 'quiz' | 'trainer' | 'discovery'

export interface Section {
  readonly sectionId: SectionId
  readonly slug: string
  readonly order: number
  readonly widget?: Widget
}

export const sections: readonly Section[] = [
  { sectionId: 'landscape', slug: '01-landscape', order: 1, widget: 'quiz' },
  { sectionId: 'business-lens', slug: '02-business-lens', order: 2, widget: 'quiz' },
  { sectionId: 'llm-limits', slug: '03-llm-limits', order: 3, widget: 'quiz' },
  { sectionId: 'anatomy', slug: '04-anatomy', order: 4, widget: 'quiz' },
  { sectionId: 'solution-classes', slug: '05-solution-classes', order: 5, widget: 'quiz' },
  { sectionId: 'catalogue', slug: '06-catalogue', order: 6, widget: 'quiz' },
  { sectionId: 'security', slug: '07-security', order: 7, widget: 'quiz' },
  { sectionId: 'economics', slug: '08-economics', order: 8, widget: 'quiz' },
  { sectionId: 'discovery', slug: '09-discovery', order: 9, widget: 'discovery' },
  { sectionId: 'framework', slug: '10-framework', order: 10, widget: 'trainer' },
  { sectionId: 'myths', slug: '11-myths', order: 11, widget: 'quiz' },
] as const

const bySlug = new Map(sections.map((s) => [s.slug, s]))

export function sectionBySlug(slug: string): Section | undefined {
  return bySlug.get(slug)
}
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/data/sections.test.ts`
Expected: PASS, пять тестов.

- [ ] **Step 5: Создать `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const sections = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content' }),
  schema: z.object({
    section: z.string(),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['draft', 'ready']),
  }),
})

export const collections = { sections }
```

Идентификатор записи, который выдаёт `glob`, включает путь: `en/05-solution-classes`. Локаль извлекается из первого сегмента, слаг — из второго.

- [ ] **Step 6: Создать два MDX-файла раздела 5**

Create `src/content/en/05-solution-classes.mdx`:

```mdx
---
section: solution-classes
title: "Assistants, RAG, text2SQL and agents"
summary: "The four solution classes business people mix up most, and the questions that tell them apart."
status: draft
---

Draft. The full text of this section is written in Task 12.
```

Create `src/content/ru/05-solution-classes.mdx`:

```mdx
---
section: solution-classes
title: "Ассистенты, RAG, text2SQL и агенты"
summary: "Четыре класса решений, которые чаще всего путают, и вопросы, которые их различают."
status: draft
---

Черновик. Полный текст раздела пишется в задаче 12.
```

- [ ] **Step 7: Написать падающий тест паритета**

Create `tests/parity.test.ts`:

```ts
import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { sections } from '../src/data/sections'

const CONTENT = join(process.cwd(), 'src', 'content')
const LOCALES = ['en', 'ru'] as const

describe('content parity between locales', () => {
  test('every written section exists in both locales', () => {
    const written = new Set(
      LOCALES.flatMap((locale) =>
        existsSync(join(CONTENT, locale))
          ? readdirSync(join(CONTENT, locale)).map((f) => f.replace(/\.mdx$/, ''))
          : [],
      ),
    )

    for (const slug of written) {
      for (const locale of LOCALES) {
        expect(
          existsSync(join(CONTENT, locale, `${slug}.mdx`)),
          `${slug} is missing the ${locale} version`,
        ).toBe(true)
      }
    }
  })

  test('every content file corresponds to a registered section', () => {
    const knownSlugs = new Set(sections.map((s) => s.slug))
    for (const locale of LOCALES) {
      if (!existsSync(join(CONTENT, locale))) continue
      for (const file of readdirSync(join(CONTENT, locale))) {
        const slug = file.replace(/\.mdx$/, '')
        expect(knownSlugs.has(slug), `${slug} is not in the section registry`).toBe(true)
      }
    }
  })
})
```

- [ ] **Step 8: Запустить тесты — паритет должен проходить, потому что оба файла созданы**

Run: `npm test`
Expected: PASS. Затем временно удалить `src/content/ru/05-solution-classes.mdx`, снова запустить `npm test`, убедиться, что первый тест падает с сообщением `05-solution-classes is missing the ru version`, и вернуть файл на место. Это проверка того, что тест действительно ловит расхождение, а не проходит вхолостую.

- [ ] **Step 9: Собрать проект**

Run: `npm run build`
Expected: сборка проходит, Astro не жалуется на схему коллекции.

- [ ] **Step 10: Коммит**

```bash
git add src/data src/content.config.ts src/content tests/parity.test.ts
git commit -m "feat: add the section registry and the bilingual content collection

Structure lives once in sections.ts while prose is per-locale, so a renamed
slug or a missing translation fails a test instead of silently shipping."
```

---

### Task 3: Страница раздела и маршрутизация

**Files:**
- Create: `src/core/content-id.ts`, `src/pages/[locale]/section/[slug].astro`
- Test: `src/core/content-id.test.ts`

**Interfaces:**
- Consumes: `sectionBySlug` из `src/data/sections.ts`; `isLocale`, `Locale` из `src/core/locale.ts`; коллекцию `sections`.
- Produces:
  - `interface ParsedEntryId { readonly locale: Locale; readonly slug: string }`;
  - `function parseEntryId(id: string): ParsedEntryId | null`;
  - маршруты `/{locale}/section/{slug}/` для каждой пары локаль-раздел, у которой есть MDX-файл.

**Порядок:** эта задача зависит от `src/core/locale.ts` из Задачи 4. Выполнять после неё.

- [ ] **Step 1: Написать падающий тест разбора идентификатора записи**

Логика «из `en/05-solution-classes` получить локаль и слаг» — единственное, что стоит
проверять отдельно от Astro. Сама генерация маршрутов проверяется сборкой на шаге 5:
импортировать `getStaticPaths` из `.astro`-файла в юнит-тесте технически возможно, но
завязывает тест на детали компиляции, а не на поведение.

Create `src/core/content-id.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { parseEntryId } from './content-id'

describe('parseEntryId', () => {
  test('splits a locale-prefixed entry id', () => {
    expect(parseEntryId('en/05-solution-classes')).toEqual({
      locale: 'en',
      slug: '05-solution-classes',
    })
  })

  test('handles the other locale', () => {
    expect(parseEntryId('ru/11-myths')).toEqual({ locale: 'ru', slug: '11-myths' })
  })

  test('returns null for an id without a locale prefix', () => {
    expect(parseEntryId('05-solution-classes')).toBeNull()
  })

  test('returns null for an unsupported locale', () => {
    expect(parseEntryId('de/05-solution-classes')).toBeNull()
  })

  test('returns null for a nested path it cannot interpret', () => {
    expect(parseEntryId('en/drafts/05-solution-classes')).toBeNull()
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/core/content-id.test.ts`
Expected: FAIL — модуль `./content-id` не найден.

- [ ] **Step 3: Создать `src/core/content-id.ts`**

```ts
import { isLocale, type Locale } from './locale'

export interface ParsedEntryId {
  readonly locale: Locale
  readonly slug: string
}

export function parseEntryId(id: string): ParsedEntryId | null {
  const parts = id.split('/')
  if (parts.length !== 2) return null

  const [locale, slug] = parts
  if (!isLocale(locale) || slug === '') return null

  return { locale, slug }
}
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/core/content-id.test.ts`
Expected: PASS, пять тестов.

Эта задача идёт после Задачи 4 в порядке зависимостей, потому что использует `isLocale`.
Если выполняете задачи по порядку номеров, сначала выполните Задачу 4.

- [ ] **Step 5: Создать `src/pages/[locale]/section/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content'
import Layout from '../../../components/Layout.astro'
import { sectionBySlug } from '../../../data/sections'
import { parseEntryId } from '../../../core/content-id'

export async function getStaticPaths() {
  const entries = await getCollection('sections')

  return entries.flatMap((entry) => {
    const parsed = parseEntryId(entry.id)
    if (parsed === null) return []
    return [{ params: { locale: parsed.locale, slug: parsed.slug }, props: { entry } }]
  })
}

const { entry } = Astro.props
const { locale, slug } = Astro.params as { locale: 'en' | 'ru'; slug: string }
const section = sectionBySlug(slug)
const { Content } = await render(entry)
---

<Layout title={entry.data.title} locale={locale} description={entry.data.summary}>
  <main class="mx-auto max-w-3xl px-6 py-12">
    {entry.data.status === 'draft' && (
      <p class="mb-8 rounded border border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        {locale === 'ru' ? 'Черновик: текст этого раздела ещё не написан.' : 'Draft: this section has not been written yet.'}
      </p>
    )}
    <p class="text-sm text-slate-500">{section?.order}</p>
    <h1 class="mb-6 text-3xl font-semibold">{entry.data.title}</h1>
    <article class="prose">
      <Content />
    </article>
  </main>
</Layout>
```

- [ ] **Step 6: Собрать и проверить выходные файлы**

Run: `npm run build && ls dist/en/section dist/ru/section`
Expected: существуют `dist/en/section/05-solution-classes/index.html` и та же страница под `ru`.
Это и есть проверка генерации маршрутов: если `getStaticPaths` вернёт не то, файлов не будет.

- [ ] **Step 7: Коммит**

```bash
git add src/pages src/core/content-id.ts src/core/content-id.test.ts
git commit -m "feat: render section pages from the content collection

Routes come from the files that actually exist, so a section appears in a
locale exactly when its prose has been written."
```

---

### Task 4: Строки интерфейса и модуль локали

**Files:**
- Create: `src/data/ui-strings.types.ts`, `src/data/ui-strings.en.ts`, `src/data/ui-strings.ru.ts`, `src/data/ui-strings.ts`
- Create: `src/core/locale.ts`
- Test: `src/core/locale.test.ts`, дополнение `tests/parity.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces:
  - `type Locale = 'en' | 'ru'`, `const LOCALES: readonly Locale[]`;
  - `function isLocale(value: string): value is Locale`;
  - `function storedLocale(storage: Storage): Locale | null`;
  - `function rememberLocale(storage: Storage, locale: Locale): void`;
  - `function preferredLocale(stored: Locale | null, navigatorLanguages: readonly string[]): Locale`;
  - `const uiStrings: Record<Locale, UiStrings>` с ключами `nav.contents`, `nav.glossary`, `nav.exam`, `nav.trainer`, `nav.discovery`, `quiz.check`, `quiz.retry`, `quiz.correct`, `quiz.incorrect`, `quiz.score`, `locale.switch`, `draft.notice`, `facts.verifiedOn`.

- [ ] **Step 1: Написать падающий тест модуля локали**

Create `src/core/locale.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { isLocale, preferredLocale, rememberLocale, storedLocale } from './locale'

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  [key: string]: unknown
  get length() { return this.map.size }
  clear() { this.map.clear() }
  getItem(k: string) { return this.map.get(k) ?? null }
  key(i: number) { return [...this.map.keys()][i] ?? null }
  removeItem(k: string) { this.map.delete(k) }
  setItem(k: string, v: string) { this.map.set(k, v) }
}

describe('isLocale', () => {
  test('accepts the two supported locales', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('ru')).toBe(true)
  })

  test('rejects anything else', () => {
    expect(isLocale('de')).toBe(false)
    expect(isLocale('')).toBe(false)
  })
})

describe('storedLocale', () => {
  test('returns null when nothing was stored', () => {
    expect(storedLocale(new MemoryStorage())).toBeNull()
  })

  test('round-trips a remembered choice', () => {
    const storage = new MemoryStorage()
    rememberLocale(storage, 'ru')
    expect(storedLocale(storage)).toBe('ru')
  })

  test('ignores a stored value that is not a supported locale', () => {
    const storage = new MemoryStorage()
    storage.setItem('afb:locale', 'klingon')
    expect(storedLocale(storage)).toBeNull()
  })
})

describe('preferredLocale', () => {
  test('an explicit choice always wins over the browser', () => {
    expect(preferredLocale('en', ['ru-RU', 'ru'])).toBe('en')
    expect(preferredLocale('ru', ['en-US'])).toBe('ru')
  })

  test('falls back to Russian when the browser asks for it first', () => {
    expect(preferredLocale(null, ['ru-RU', 'en-US'])).toBe('ru')
  })

  test('falls back to English for every other browser language', () => {
    expect(preferredLocale(null, ['de-DE'])).toBe('en')
    expect(preferredLocale(null, [])).toBe('en')
  })

  test('matches on the language subtag, not the exact string', () => {
    expect(preferredLocale(null, ['ru-BY'])).toBe('ru')
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/core/locale.test.ts`
Expected: FAIL — модуль `./locale` не найден.

- [ ] **Step 3: Создать `src/core/locale.ts`**

```ts
export type Locale = 'en' | 'ru'

export const LOCALES: readonly Locale[] = ['en', 'ru'] as const
export const DEFAULT_LOCALE: Locale = 'en'

const STORAGE_KEY = 'afb:locale'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function storedLocale(storage: Storage): Locale | null {
  const raw = storage.getItem(STORAGE_KEY)
  return raw !== null && isLocale(raw) ? raw : null
}

export function rememberLocale(storage: Storage, locale: Locale): void {
  storage.setItem(STORAGE_KEY, locale)
}

export function preferredLocale(
  stored: Locale | null,
  navigatorLanguages: readonly string[],
): Locale {
  if (stored !== null) return stored

  for (const language of navigatorLanguages) {
    const subtag = language.toLowerCase().split('-')[0]
    if (isLocale(subtag)) return subtag
  }

  return DEFAULT_LOCALE
}
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/core/locale.test.ts`
Expected: PASS, девять тестов.

- [ ] **Step 5: Создать словари строк интерфейса**

Create `src/data/ui-strings.types.ts`:

```ts
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

export type UiStrings = Record<UiStringKey, string>
```

Тип вынесен в отдельный модуль, чтобы словари и сборщик не импортировали друг друга по кругу.
`UiStrings` — это `Record` по замкнутому объединению ключей, поэтому пропущенный или лишний
ключ в любом языке ломает `astro check` ещё до тестов.

Create `src/data/ui-strings.en.ts`:

```ts
import type { UiStrings } from './ui-strings.types'

export const en: UiStrings = {
  'nav.contents': 'Contents',
  'nav.glossary': 'Glossary',
  'nav.exam': 'Final exam',
  'nav.trainer': 'Solution picker',
  'nav.discovery': 'Discovery checklist',
  'quiz.check': 'Check answer',
  'quiz.next': 'Next question',
  'quiz.retry': 'Try again',
  'quiz.correct': 'Correct',
  'quiz.incorrect': 'Not quite',
  'quiz.score': 'Score',
  'locale.switch': 'Читать по-русски',
  'draft.notice': 'Draft: this section has not been written yet.',
  'facts.verifiedOn': 'Checked on',
}
```

Create `src/data/ui-strings.ru.ts`:

```ts
import type { UiStrings } from './ui-strings.types'

export const ru: UiStrings = {
  'nav.contents': 'Содержание',
  'nav.glossary': 'Глоссарий',
  'nav.exam': 'Финальный экзамен',
  'nav.trainer': 'Выбор решения',
  'nav.discovery': 'Discovery-чеклист',
  'quiz.check': 'Проверить',
  'quiz.next': 'Следующий вопрос',
  'quiz.retry': 'Ещё раз',
  'quiz.correct': 'Верно',
  'quiz.incorrect': 'Не совсем',
  'quiz.score': 'Результат',
  'locale.switch': 'Read in English',
  'draft.notice': 'Черновик: текст этого раздела ещё не написан.',
  'facts.verifiedOn': 'Проверено',
}
```

Create `src/data/ui-strings.ts`:

```ts
import type { Locale } from '../core/locale'
import type { UiStringKey, UiStrings } from './ui-strings.types'
import { en } from './ui-strings.en'
import { ru } from './ui-strings.ru'

export type { UiStringKey, UiStrings }

export const uiStrings: Record<Locale, UiStrings> = { en, ru }

export function t(locale: Locale, key: UiStringKey): string {
  return uiStrings[locale][key]
}
```

- [ ] **Step 6: Дополнить тест паритета проверкой строк**

Append to `tests/parity.test.ts`:

```ts
import { uiStrings } from '../src/data/ui-strings'

describe('ui string parity', () => {
  test('both locales define exactly the same keys', () => {
    expect(Object.keys(uiStrings.ru).sort()).toEqual(Object.keys(uiStrings.en).sort())
  })

  test('no string is left empty', () => {
    for (const [locale, strings] of Object.entries(uiStrings)) {
      for (const [key, value] of Object.entries(strings)) {
        expect(value.trim(), `${locale}.${key} is empty`).not.toBe('')
      }
    }
  })
})
```

- [ ] **Step 7: Запустить тесты и проверку типов**

Run: `npm test && npm run typecheck`
Expected: PASS, 0 ошибок типов.

- [ ] **Step 8: Коммит**

```bash
git add src/core/locale.ts src/core/locale.test.ts src/data/ui-strings*.ts tests/parity.test.ts
git commit -m "feat: add the locale module and interface strings

An explicit choice outranks navigator.language, because a reader who picked a
language once should not be re-routed by their browser on the next visit."
```

---

### Task 5: Сайдбар и переключатель языка

**Files:**
- Create: `src/components/Sidebar.astro`, `src/components/LocaleSwitcher.astro`
- Modify: `src/components/Layout.astro`, `src/pages/[locale]/section/[slug].astro`
- Test: `tests/navigation.test.ts`

**Interfaces:**
- Consumes: `sections`, `t`, `Locale`.
- Produces: `Sidebar.astro` с пропсами `{ locale: Locale; currentSlug?: string; titles: Readonly<Record<string, string>> }`, где ключ карты — слаг, а наличие ключа означает «раздел написан на этом языке»; `LocaleSwitcher.astro` с пропсами `{ locale: Locale; path: string }`, где `path` — часть адреса после локали, например `section/05-solution-classes`.

- [ ] **Step 1: Написать падающий тест навигации**

Create `tests/navigation.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, test } from 'vitest'
import Sidebar from '../src/components/Sidebar.astro'
import LocaleSwitcher from '../src/components/LocaleSwitcher.astro'

describe('Sidebar', () => {
  test('lists written sections as links and unwritten ones as plain text', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Sidebar, {
      props: {
        locale: 'en',
        currentSlug: '05-solution-classes',
        titles: { '05-solution-classes': 'Assistants, RAG, text2SQL and agents' },
      },
    })

    expect(html).toContain('/en/section/05-solution-classes')
    expect(html).toContain('Assistants, RAG, text2SQL and agents')
    expect(html).not.toContain('/en/section/01-landscape')
    expect(html).toContain('aria-current="page"')
  })
})

describe('LocaleSwitcher', () => {
  test('points at the same page in the other locale', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(LocaleSwitcher, {
      props: { locale: 'en', path: 'section/05-solution-classes' },
    })

    expect(html).toContain('/ru/section/05-solution-classes')
    expect(html).not.toContain('/en/section/05-solution-classes')
  })

  test('works in the other direction too', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(LocaleSwitcher, {
      props: { locale: 'ru', path: 'section/05-solution-classes' },
    })

    expect(html).toContain('/en/section/05-solution-classes')
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run tests/navigation.test.ts`
Expected: FAIL — компоненты не существуют.

- [ ] **Step 3: Создать `src/components/LocaleSwitcher.astro`**

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n'
import type { Locale } from '../core/locale'
import { t } from '../data/ui-strings'

interface Props {
  locale: Locale
  path: string
}

const { locale, path } = Astro.props
const other: Locale = locale === 'en' ? 'ru' : 'en'
const href = getRelativeLocaleUrl(other, path)
---

<a
  href={href}
  hreflang={other}
  class="text-sm underline underline-offset-4"
  data-locale-switch={other}
>
  {t(locale, 'locale.switch')}
</a>
```

- [ ] **Step 4: Создать `src/components/Sidebar.astro`**

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n'
import type { Locale } from '../core/locale'
import { sections } from '../data/sections'
import { t } from '../data/ui-strings'

interface Props {
  locale: Locale
  currentSlug?: string
  titles: Readonly<Record<string, string>>
}

const { locale, currentSlug, titles } = Astro.props
---

<nav class="text-sm" aria-label={t(locale, 'nav.contents')}>
  <p class="mb-3 font-semibold uppercase tracking-wide text-slate-500">
    {t(locale, 'nav.contents')}
  </p>
  <ol class="space-y-1">
    {sections.map((section) => {
      const title = titles[section.slug]
      const isAvailable = title !== undefined
      const isCurrent = section.slug === currentSlug
      const href = getRelativeLocaleUrl(locale, `section/${section.slug}`)

      return (
        <li>
          {isAvailable ? (
            <a
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              class:list={['hover:underline', isCurrent && 'font-semibold']}
            >
              {section.order}. {title}
            </a>
          ) : (
            <span class="text-slate-400">{section.order}</span>
          )}
        </li>
      )
    })}
  </ol>
</nav>
```

Признак «раздел написан» — наличие заголовка в переданной карте. Заголовки берутся из
фронтматтера, то есть существуют ровно для тех разделов, у которых есть MDX-файл в этой
локали. Ненаписанный раздел показывает только номер: показывать читателю английский слаг
вместо названия — хуже, чем показать пустое место.

- [ ] **Step 5: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run tests/navigation.test.ts`
Expected: PASS, три теста.

- [ ] **Step 6: Подключить сайдбар и переключатель на странице раздела**

Modify `src/pages/[locale]/section/[slug].astro` — заменить содержимое фронтматтера и разметку на:

```astro
---
import { getCollection, render } from 'astro:content'
import Layout from '../../../components/Layout.astro'
import Sidebar from '../../../components/Sidebar.astro'
import LocaleSwitcher from '../../../components/LocaleSwitcher.astro'
import { sectionBySlug } from '../../../data/sections'
import { parseEntryId } from '../../../core/content-id'
import { t } from '../../../data/ui-strings'
import type { Locale } from '../../../core/locale'

export async function getStaticPaths() {
  const entries = await getCollection('sections')

  return entries.flatMap((entry) => {
    const parsed = parseEntryId(entry.id)
    if (parsed === null) return []

    const titles = Object.fromEntries(
      entries.flatMap((other) => {
        const otherId = parseEntryId(other.id)
        return otherId?.locale === parsed.locale ? [[otherId.slug, other.data.title]] : []
      }),
    )

    return [{ params: { locale: parsed.locale, slug: parsed.slug }, props: { entry, titles } }]
  })
}

const { entry, titles } = Astro.props
const { locale, slug } = Astro.params as { locale: Locale; slug: string }
const section = sectionBySlug(slug)
const { Content } = await render(entry)
---

<Layout title={entry.data.title} locale={locale} description={entry.data.summary}>
  <div class="mx-auto flex max-w-6xl gap-12 px-6 py-12">
    <aside class="hidden w-64 shrink-0 lg:block">
      <Sidebar locale={locale} currentSlug={slug} titles={titles} />
    </aside>
    <main class="min-w-0 flex-1">
      <div class="mb-8 flex items-baseline justify-between">
        <p class="text-sm text-slate-500">{section?.order}</p>
        <LocaleSwitcher locale={locale} path={`section/${slug}`} />
      </div>
      {entry.data.status === 'draft' && (
        <p class="mb-8 rounded border border-amber-400 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {t(locale, 'draft.notice')}
        </p>
      )}
      <h1 class="mb-6 text-3xl font-semibold">{entry.data.title}</h1>
      <article class="prose max-w-none">
        <Content />
      </article>
    </main>
  </div>
</Layout>
```

- [ ] **Step 7: Собрать и глазами проверить страницу**

Run: `npm run build && npm run preview`
Expected: по адресу `http://localhost:4321/ai-for-business-tutorial/en/section/05-solution-classes/` виден сайдбар, ссылка на русскую версию ведёт на тот же раздел, нерождённые разделы показаны серым и не кликабельны.

- [ ] **Step 8: Коммит**

```bash
git add src/components src/pages tests/navigation.test.ts
git commit -m "feat: add the sidebar and the locale switcher

The switcher is built from the current slug, so it lands on the same section
in the other language instead of dropping the reader on the home page."
```

---

### Task 6: Компоненты прозы — Callout, Flow, Facts

**Files:**
- Create: `src/components/Callout.astro`, `src/components/Flow.astro`, `src/components/Facts.astro`
- Create: `tests/facts.test.ts`
- Test: `tests/prose-components.test.ts`

**Interfaces:**
- Consumes: `Locale`, `t`.
- Produces:
  - `Callout.astro`, пропсы `{ kind: 'mistake' | 'right' | 'warning' | 'note'; title?: string }`, слот по умолчанию;
  - `Flow.astro`, пропсы `{ steps: readonly string[]; branchAt?: number; branches?: readonly string[] }`;
  - `Facts.astro`, пропсы `{ verifiedOn: string (ISO date); sources: readonly string[]; locale: Locale }`, слот по умолчанию.

- [ ] **Step 1: Написать падающий тест компонентов прозы**

Create `tests/prose-components.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, test } from 'vitest'
import Callout from '../src/components/Callout.astro'
import Flow from '../src/components/Flow.astro'
import Facts from '../src/components/Facts.astro'

describe('Callout', () => {
  test('marks a mistake and a correction differently', async () => {
    const container = await AstroContainer.create()
    const mistake = await container.renderToString(Callout, {
      props: { kind: 'mistake' },
      slots: { default: 'We will use the ChatGPT API' },
    })
    const right = await container.renderToString(Callout, {
      props: { kind: 'right' },
      slots: { default: 'We will use a GPT model through the OpenAI API' },
    })

    expect(mistake).toContain('data-kind="mistake"')
    expect(right).toContain('data-kind="right"')
    expect(mistake).toContain('We will use the ChatGPT API')
  })
})

describe('Flow', () => {
  test('renders every step in order', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Flow, {
      props: { steps: ['Email arrives', 'Check the CRM', 'Create a task', 'Send a reply'] },
    })

    const positions = ['Email arrives', 'Check the CRM', 'Create a task', 'Send a reply'].map((s) =>
      html.indexOf(s),
    )
    expect(positions.every((p) => p >= 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })
})

describe('Facts', () => {
  test('shows the verification date and links every source', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(Facts, {
      props: {
        verifiedOn: '2026-08-08',
        sources: ['https://example.com/pricing', 'https://example.com/docs'],
        locale: 'en',
      },
      slots: { default: 'Prices as quoted by the vendor.' },
    })

    expect(html).toContain('2026-08-08')
    expect(html).toContain('https://example.com/pricing')
    expect(html).toContain('https://example.com/docs')
    expect(html).toContain('Checked on')
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run tests/prose-components.test.ts`
Expected: FAIL — компоненты не существуют.

- [ ] **Step 3: Создать `src/components/Callout.astro`**

```astro
---
interface Props {
  kind: 'mistake' | 'right' | 'warning' | 'note'
  title?: string
}

const { kind, title } = Astro.props

const styles: Record<Props['kind'], string> = {
  mistake: 'border-rose-400 bg-rose-50 text-rose-950',
  right: 'border-emerald-400 bg-emerald-50 text-emerald-950',
  warning: 'border-amber-400 bg-amber-50 text-amber-950',
  note: 'border-slate-300 bg-slate-50 text-slate-900',
}

const marks: Record<Props['kind'], string> = {
  mistake: '✗',
  right: '✓',
  warning: '!',
  note: 'i',
}
---

<aside data-kind={kind} class:list={['my-6 rounded border-l-4 px-4 py-3', styles[kind]]}>
  <p class="mb-1 font-semibold">
    <span aria-hidden="true">{marks[kind]}</span>
    {title}
  </p>
  <div class="[&>p:last-child]:mb-0">
    <slot />
  </div>
</aside>
```

- [ ] **Step 4: Создать `src/components/Flow.astro`**

```astro
---
interface Props {
  steps: readonly string[]
  branchAt?: number
  branches?: readonly string[]
}

const { steps, branchAt, branches = [] } = Astro.props
---

<ol class="my-6 space-y-2" data-flow>
  {steps.map((step, index) => (
    <li>
      <div class="rounded border border-slate-300 px-4 py-2">{step}</div>
      {index === branchAt && branches.length > 0 && (
        <ul class="mt-2 ml-6 flex flex-wrap gap-2">
          {branches.map((branch) => (
            <li class="rounded border border-dashed border-slate-300 px-3 py-1 text-sm">
              {branch}
            </li>
          ))}
        </ul>
      )}
      {index < steps.length - 1 && (
        <div class="my-1 ml-4 text-slate-400" aria-hidden="true">↓</div>
      )}
    </li>
  ))}
</ol>
```

- [ ] **Step 5: Создать `src/components/Facts.astro`**

```astro
---
import type { Locale } from '../core/locale'
import { t } from '../data/ui-strings'

interface Props {
  verifiedOn: string
  sources: readonly string[]
  locale: Locale
}

const { verifiedOn, sources, locale } = Astro.props
---

<section
  class="my-6 rounded border border-slate-300 px-4 py-3"
  data-facts
  data-verified-on={verifiedOn}
>
  <slot />
  <footer class="mt-3 text-xs text-slate-500">
    <span>{t(locale, 'facts.verifiedOn')} {verifiedOn}</span>
    <ul class="mt-1 space-y-0.5">
      {sources.map((source) => (
        <li>
          <a href={source} rel="nofollow noopener" class="underline underline-offset-2">
            {source}
          </a>
        </li>
      ))}
    </ul>
  </footer>
</section>
```

- [ ] **Step 6: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run tests/prose-components.test.ts`
Expected: PASS, три теста.

- [ ] **Step 7: Написать тест свежести фактов**

Create `tests/facts.test.ts`:

```ts
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, test } from 'vitest'

const CONTENT = join(process.cwd(), 'src', 'content')
const MAX_AGE_DAYS = 90

function contentFiles(): string[] {
  const files: string[] = []
  for (const locale of ['en', 'ru']) {
    const dir = join(CONTENT, locale)
    if (!existsSync(dir)) continue
    for (const name of readdirSync(dir)) files.push(join(dir, name))
  }
  return files
}

describe('fact freshness', () => {
  test('every Facts block declares a verifiedOn date and at least one source', () => {
    for (const file of contentFiles()) {
      const text = readFileSync(file, 'utf8')
      const blocks = text.match(/<Facts[^>]*>/g) ?? []

      for (const block of blocks) {
        expect(block, `${file}: a Facts block has no verifiedOn`).toMatch(
          /verifiedOn="\d{4}-\d{2}-\d{2}"/,
        )
        expect(block, `${file}: a Facts block has no sources`).toMatch(/sources=\{\[/)
      }
    }
  })

  test('no verified fact is older than 90 days', () => {
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000

    for (const file of contentFiles()) {
      const text = readFileSync(file, 'utf8')
      for (const match of text.matchAll(/verifiedOn="(\d{4}-\d{2}-\d{2})"/g)) {
        const verifiedOn = Date.parse(match[1])
        expect(
          verifiedOn,
          `${file}: fact verified on ${match[1]} is older than ${MAX_AGE_DAYS} days — re-check the source and update the date`,
        ).toBeGreaterThan(cutoff)
      }
    }
  })
})
```

- [ ] **Step 8: Запустить весь набор тестов**

Run: `npm test`
Expected: PASS. Тест свежести пока проходит вхолостую — блоков `<Facts>` в контенте ещё нет. Чтобы убедиться, что он рабочий, временно добавить в `src/content/en/05-solution-classes.mdx` строку `<Facts verifiedOn="2020-01-01" sources={["https://example.com"]}>x</Facts>`, запустить `npm test`, увидеть падение с внятным сообщением, затем строку удалить.

- [ ] **Step 9: Коммит**

```bash
git add src/components tests/prose-components.test.ts tests/facts.test.ts
git commit -m "feat: add prose components and a fact-freshness test

Every dated claim carries its sources and a check date, and the suite fails
once a date passes ninety days — stale pricing should be loud, not quiet."
```

---

### Task 7: Глоссарий

**Files:**
- Create: `src/data/glossary.types.ts`, `src/data/glossary.en.ts`, `src/data/glossary.ru.ts`, `src/data/glossary.ts`
- Create: `src/components/T.astro`, `src/pages/[locale]/glossary.astro`
- Modify: `tests/parity.test.ts`
- Test: `src/data/glossary.test.ts`

**Interfaces:**
- Consumes: `Locale`.
- Produces:
  - `type TermId` — литеральное объединение идентификаторов терминов;
  - `const glossary: Record<Locale, Record<TermId, { term: string; definition: string }>>`;
  - `function defineTerm(locale: Locale, id: TermId)`;
  - `T.astro` с пропсами `{ id: TermId; locale: Locale }` и необязательным слотом.

- [ ] **Step 1: Написать падающий тест глоссария**

Create `src/data/glossary.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { glossary, termIds } from './glossary'

describe('glossary', () => {
  test('defines every term in both locales', () => {
    for (const id of termIds) {
      expect(glossary.en[id]?.definition.trim(), `en/${id} has no definition`).toBeTruthy()
      expect(glossary.ru[id]?.definition.trim(), `ru/${id} has no definition`).toBeTruthy()
    }
  })

  test('keeps the same term ids in both locales', () => {
    expect(Object.keys(glossary.ru).sort()).toEqual(Object.keys(glossary.en).sort())
  })

  test('keeps untranslatable terms in English in the Russian glossary', () => {
    expect(glossary.ru.embeddings.term).toBe('Embeddings')
    expect(glossary.ru.mcp.term).toBe('MCP')
  })

  test('definitions do not merely repeat the term', () => {
    for (const locale of ['en', 'ru'] as const) {
      for (const id of termIds) {
        const { term, definition } = glossary[locale][id]
        expect(definition.length, `${locale}/${id} definition is too short`).toBeGreaterThan(
          term.length + 20,
        )
      }
    }
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/data/glossary.test.ts`
Expected: FAIL — модуль `./glossary` не найден.

- [ ] **Step 3: Создать `src/data/glossary.types.ts`**

```ts
export type TermId =
  | 'llm'
  | 'token'
  | 'context-window'
  | 'embeddings'
  | 'vector-db'
  | 'rag'
  | 'text2sql'
  | 'agent'
  | 'workflow'
  | 'tool-calling'
  | 'mcp'
  | 'a2a'
  | 'guardrails'
  | 'inference'

export interface Term {
  readonly term: string
  readonly definition: string
}

export const termIds: readonly TermId[] = [
  'llm', 'token', 'context-window', 'embeddings', 'vector-db', 'rag', 'text2sql',
  'agent', 'workflow', 'tool-calling', 'mcp', 'a2a', 'guardrails', 'inference',
] as const
```

- [ ] **Step 4: Создать `src/data/glossary.ts`**

```ts
import type { Locale } from '../core/locale'
import type { Term, TermId } from './glossary.types'
import { en } from './glossary.en'
import { ru } from './glossary.ru'

export { termIds } from './glossary.types'
export type { Term, TermId }

export const glossary: Record<Locale, Record<TermId, Term>> = { en, ru }

export function defineTerm(locale: Locale, id: TermId): Term {
  return glossary[locale][id]
}
```

- [ ] **Step 5: Создать `src/data/glossary.en.ts`**

Определения пишутся своими словами, для бизнес-аудитории, без формул. Каждое — одно-два предложения.

```ts
import type { Term, TermId } from './glossary.types'

export const en: Record<TermId, Term> = {
  'llm': {
    term: 'LLM',
    definition:
      'A large language model: a system trained to continue text. It manipulates information you give it; it does not hold your company knowledge unless you supply it.',
  },
  'token': {
    term: 'Token',
    definition:
      'The unit a model reads and writes in — roughly a word fragment. Vendors bill per token, so tokens are the unit your invoice is denominated in.',
  },
  'context-window': {
    term: 'Context window',
    definition:
      'The maximum amount of text a model can consider at once, counted in tokens. Anything beyond it has to be selected, summarised or dropped.',
  },
  'embeddings': {
    term: 'Embeddings',
    definition:
      'Numeric representations of text that place similar meanings close together, which is what lets a system retrieve passages by meaning rather than by keyword.',
  },
  'vector-db': {
    term: 'Vector database',
    definition:
      'A store built to search embeddings quickly. It is where a retrieval system keeps the indexed fragments of your documents.',
  },
  'rag': {
    term: 'RAG',
    definition:
      'Retrieval-augmented generation: find the relevant passages first, then let the model answer using them. It supplies context, it does not train the model.',
  },
  'text2sql': {
    term: 'Text2SQL',
    definition:
      'Turning a question in plain language into a database query. It answers questions about numbers in a database, where RAG answers questions about text in documents.',
  },
  'agent': {
    term: 'Agent',
    definition:
      'A system that decides its own next step and takes actions in other systems, rather than only producing text for a person to act on.',
  },
  'workflow': {
    term: 'Workflow',
    definition:
      'A process with fixed steps decided in advance. When the steps never vary, a workflow is cheaper and more predictable than an agent.',
  },
  'tool-calling': {
    term: 'Tool calling',
    definition:
      'Letting a model invoke a defined function — search a catalogue, create a ticket — instead of only describing what should happen.',
  },
  'mcp': {
    term: 'MCP',
    definition:
      'Model Context Protocol: a common way to expose tools and data to a model, so an integration written once can serve any compatible client.',
  },
  'a2a': {
    term: 'A2A',
    definition:
      'Agent2Agent: a protocol for agents built by different teams to discover each other and delegate work. It addresses a different layer than MCP rather than competing with it.',
  },
  'guardrails': {
    term: 'Guardrails',
    definition:
      'The checks placed around a model — on what goes in, what comes out and what it is allowed to do — that keep a working demo from becoming an incident in production.',
  },
  'inference': {
    term: 'Inference',
    definition:
      'Running a trained model to produce an answer. It is the recurring cost of an AI system, as opposed to the one-off cost of building it.',
  },
}
```

- [ ] **Step 6: Создать `src/data/glossary.ru.ts`**

Термины, которые в жизни не переводят, остаются английскими; переводится определение.

```ts
import type { Term, TermId } from './glossary.types'

export const ru: Record<TermId, Term> = {
  'llm': {
    term: 'LLM',
    definition:
      'Большая языковая модель — система, обученная продолжать текст. Она работает с той информацией, которую ей дали, и не знает знаний вашей компании, пока их не передали.',
  },
  'token': {
    term: 'Токен',
    definition:
      'Единица, которой модель читает и пишет, примерно кусок слова. Вендоры берут плату за токены, поэтому счёт приходит именно в них.',
  },
  'context-window': {
    term: 'Контекстное окно',
    definition:
      'Сколько текста модель способна удерживать одновременно, в токенах. Всё, что не поместилось, приходится отбирать, сжимать или отбрасывать.',
  },
  'embeddings': {
    term: 'Embeddings',
    definition:
      'Числовое представление текста, в котором близкие по смыслу фрагменты оказываются рядом. Именно это позволяет искать по смыслу, а не по совпадению слов.',
  },
  'vector-db': {
    term: 'Векторная база',
    definition:
      'Хранилище, приспособленное быстро искать по embeddings. В нём лежат проиндексированные фрагменты ваших документов.',
  },
  'rag': {
    term: 'RAG',
    definition:
      'Сначала находим подходящие фрагменты, потом даём модели ответить на их основе. RAG передаёт контекст, а не обучает модель.',
  },
  'text2sql': {
    term: 'Text2SQL',
    definition:
      'Превращение вопроса на человеческом языке в запрос к базе данных. Отвечает на вопросы про цифры в базе, тогда как RAG отвечает на вопросы про текст в документах.',
  },
  'agent': {
    term: 'Агент',
    definition:
      'Система, которая сама выбирает следующий шаг и выполняет действия в других системах, а не просто выдаёт текст, с которым дальше работает человек.',
  },
  'workflow': {
    term: 'Workflow',
    definition:
      'Процесс с заранее заданными шагами. Когда шаги не меняются, workflow дешевле и предсказуемее агента.',
  },
  'tool-calling': {
    term: 'Tool calling',
    definition:
      'Возможность модели вызвать заданную функцию — найти товар, создать заявку — вместо того чтобы только описать словами, что следовало бы сделать.',
  },
  'mcp': {
    term: 'MCP',
    definition:
      'Model Context Protocol — общий способ отдавать модели инструменты и данные, чтобы одна написанная интеграция работала с любым совместимым клиентом.',
  },
  'a2a': {
    term: 'A2A',
    definition:
      'Agent2Agent — протокол, позволяющий агентам разных команд находить друг друга и передавать работу. Решает другой уровень задачи, чем MCP, и не конкурирует с ним.',
  },
  'guardrails': {
    term: 'Guardrails',
    definition:
      'Проверки вокруг модели — на входе, на выходе и на разрешённые действия, — которые не дают работающему демо превратиться в инцидент на проде.',
  },
  'inference': {
    term: 'Инференс',
    definition:
      'Запуск обученной модели ради получения ответа. Это регулярная статья расходов, в отличие от разовой стоимости разработки.',
  },
}
```

- [ ] **Step 7: Запустить тест глоссария**

Run: `npx vitest run src/data/glossary.test.ts`
Expected: PASS, четыре теста.

- [ ] **Step 8: Создать `src/components/T.astro`**

```astro
---
import type { Locale } from '../core/locale'
import { defineTerm, type TermId } from '../data/glossary'

interface Props {
  id: TermId
  locale: Locale
}

const { id, locale } = Astro.props
const { term, definition } = defineTerm(locale, id)
---

<abbr
  title={definition}
  data-term={id}
  class="cursor-help border-b border-dotted border-slate-400 no-underline"
>
  <slot>{term}</slot>
</abbr>
```

- [ ] **Step 9: Создать страницу глоссария**

Create `src/pages/[locale]/glossary.astro`:

```astro
---
import Layout from '../../components/Layout.astro'
import LocaleSwitcher from '../../components/LocaleSwitcher.astro'
import type { Locale } from '../../core/locale'
import { glossary, termIds } from '../../data/glossary'
import { t } from '../../data/ui-strings'

export function getStaticPaths() {
  return [{ params: { locale: 'en' } }, { params: { locale: 'ru' } }]
}

const { locale } = Astro.params as { locale: Locale }
const terms = termIds
  .map((id) => ({ id, ...glossary[locale][id] }))
  .sort((a, b) => a.term.localeCompare(b.term, locale))
---

<Layout title={t(locale, 'nav.glossary')} locale={locale}>
  <main class="mx-auto max-w-3xl px-6 py-12">
    <div class="mb-8 flex items-baseline justify-between">
      <h1 class="text-3xl font-semibold">{t(locale, 'nav.glossary')}</h1>
      <LocaleSwitcher locale={locale} path="glossary" />
    </div>
    <dl class="space-y-6">
      {terms.map((term) => (
        <div id={term.id}>
          <dt class="font-semibold">{term.term}</dt>
          <dd class="text-slate-700 dark:text-slate-300">{term.definition}</dd>
        </div>
      ))}
    </dl>
  </main>
</Layout>
```

- [ ] **Step 10: Дополнить тест паритета терминами**

Append to `tests/parity.test.ts`:

```ts
import { glossary, termIds } from '../src/data/glossary'

describe('glossary parity', () => {
  test('every registered term id is defined in both locales', () => {
    for (const id of termIds) {
      expect(Object.keys(glossary.en), `en is missing ${id}`).toContain(id)
      expect(Object.keys(glossary.ru), `ru is missing ${id}`).toContain(id)
    }
  })
})
```

- [ ] **Step 11: Прогнать всё и собрать**

Run: `npm test && npm run typecheck && npm run build`
Expected: PASS, 0 ошибок, `dist/en/glossary/index.html` и `dist/ru/glossary/index.html` существуют.

- [ ] **Step 12: Коммит**

```bash
git add src/data/glossary*.ts src/data/glossary.test.ts src/components/T.astro src/pages tests/parity.test.ts
git commit -m "feat: add the bilingual glossary

Term ids are shared while definitions are written natively; terms nobody
translates in a real meeting stay in English on the Russian side."
```

---

### Task 8: Хранилище прогресса

**Files:**
- Create: `src/core/progress.ts`
- Test: `src/core/progress.test.ts`

**Interfaces:**
- Consumes: `SectionId` из `src/data/sections.ts`.
- Produces:
  - `interface Progress { readSections: string[]; quizResults: Record<string, QuizResult>; examResult?: ExamResult }`;
  - `interface QuizResult { score: number; total: number; answers: number[][] }`;
  - `interface ExamResult { mode: 'test' | 'cards'; score: number; total: number }`;
  - `function readProgress(storage: Storage): Progress`;
  - `function writeProgress(storage: Storage, progress: Progress): void`;
  - `function markRead(storage: Storage, sectionId: string): Progress`;
  - `function recordQuiz(storage: Storage, sectionId: string, result: QuizResult): Progress`.

- [ ] **Step 1: Написать падающий тест хранилища**

Create `src/core/progress.test.ts`:

```ts
import { beforeEach, describe, expect, test } from 'vitest'
import { markRead, readProgress, recordQuiz, writeProgress } from './progress'

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  [key: string]: unknown
  get length() { return this.map.size }
  clear() { this.map.clear() }
  getItem(k: string) { return this.map.get(k) ?? null }
  key(i: number) { return [...this.map.keys()][i] ?? null }
  removeItem(k: string) { this.map.delete(k) }
  setItem(k: string, v: string) { this.map.set(k, v) }
}

let storage: Storage

beforeEach(() => {
  storage = new MemoryStorage()
})

describe('readProgress', () => {
  test('returns an empty progress when nothing was stored', () => {
    expect(readProgress(storage)).toEqual({ readSections: [], quizResults: {} })
  })

  test('survives a value that is not JSON at all', () => {
    storage.setItem('afb:progress:v1', 'not json {{{')
    expect(readProgress(storage)).toEqual({ readSections: [], quizResults: {} })
  })

  test('survives JSON that does not match the schema', () => {
    storage.setItem('afb:progress:v1', JSON.stringify({ readSections: 'five' }))
    expect(readProgress(storage)).toEqual({ readSections: [], quizResults: {} })
  })

  test('round-trips a valid progress', () => {
    const progress = {
      readSections: ['solution-classes'],
      quizResults: { 'solution-classes': { score: 4, total: 5, answers: [[0], [2]] } },
    }
    writeProgress(storage, progress)
    expect(readProgress(storage)).toEqual(progress)
  })
})

describe('markRead', () => {
  test('adds a section', () => {
    expect(markRead(storage, 'landscape').readSections).toEqual(['landscape'])
  })

  test('never stores the same section twice', () => {
    markRead(storage, 'landscape')
    const progress = markRead(storage, 'landscape')
    expect(progress.readSections).toEqual(['landscape'])
  })

  test('persists across reads', () => {
    markRead(storage, 'landscape')
    expect(readProgress(storage).readSections).toEqual(['landscape'])
  })
})

describe('recordQuiz', () => {
  test('stores the result under the section id', () => {
    const progress = recordQuiz(storage, 'solution-classes', {
      score: 3,
      total: 5,
      answers: [[0], [1], [2], [0], [1]],
    })
    expect(progress.quizResults['solution-classes'].score).toBe(3)
  })

  test('overwrites an earlier attempt at the same section', () => {
    recordQuiz(storage, 'solution-classes', { score: 3, total: 5, answers: [] })
    const progress = recordQuiz(storage, 'solution-classes', { score: 5, total: 5, answers: [] })
    expect(progress.quizResults['solution-classes'].score).toBe(5)
  })

  test('a write that throws does not lose the in-memory result', () => {
    class FullStorage extends MemoryStorage {
      override setItem(): void {
        throw new Error('quota exceeded')
      }
    }

    const progress = recordQuiz(new FullStorage(), 'solution-classes', {
      score: 1,
      total: 5,
      answers: [],
    })
    expect(progress.quizResults['solution-classes'].score).toBe(1)
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/core/progress.test.ts`
Expected: FAIL — модуль `./progress` не найден.

- [ ] **Step 3: Создать `src/core/progress.ts`**

```ts
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
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/core/progress.test.ts`
Expected: PASS, десять тестов.

- [ ] **Step 5: Коммит**

```bash
git add src/core/progress.ts src/core/progress.test.ts
git commit -m "feat: store reading progress in localStorage

Corrupt or foreign data resets to empty progress rather than throwing: a
stale key from an old schema must not take the page down with it."
```

---

### Task 9: Движок квиза и данные раздела 5

**Files:**
- Create: `src/core/quiz.ts`, `src/data/quizzes/05.ts`, `src/data/quizzes/index.ts`, `src/data/quizzes/text.types.ts`, `src/data/quizzes/text.en.ts`, `src/data/quizzes/text.ru.ts`, `src/data/quizzes/text.ts`
- Test: `src/core/quiz.test.ts`, `src/data/quizzes/quizzes.test.ts`, дополнение `tests/parity.test.ts`

**Interfaces:**
- Consumes: `Locale`.
- Produces:
  - `interface Question { readonly id: string; readonly optionCount: number; readonly correct: readonly number[] }`;
  - `interface Quiz { readonly sectionId: string; readonly questions: readonly Question[] }`;
  - `function isCorrect(question: Question, selected: readonly number[]): boolean`;
  - `function scoreQuiz(quiz: Quiz, answers: readonly (readonly number[])[]): { score: number; total: number }`;
  - `interface QuestionText { readonly prompt: string; readonly options: readonly string[]; readonly explanations: readonly string[] }`;
  - `const quizText: Record<Locale, Record<string, QuestionText>>`.

- [ ] **Step 1: Написать падающий тест движка**

Create `src/core/quiz.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { isCorrect, scoreQuiz, type Question, type Quiz } from './quiz'

const single: Question = { id: 'q1', optionCount: 4, correct: [2] }
const multi: Question = { id: 'q2', optionCount: 4, correct: [0, 3] }

describe('isCorrect', () => {
  test('accepts the right single answer', () => {
    expect(isCorrect(single, [2])).toBe(true)
  })

  test('rejects a wrong single answer', () => {
    expect(isCorrect(single, [1])).toBe(false)
  })

  test('rejects an empty answer', () => {
    expect(isCorrect(single, [])).toBe(false)
  })

  test('accepts a complete multi-answer in any order', () => {
    expect(isCorrect(multi, [3, 0])).toBe(true)
  })

  test('rejects a partially correct multi-answer', () => {
    expect(isCorrect(multi, [0])).toBe(false)
  })

  test('rejects a multi-answer with an extra wrong option', () => {
    expect(isCorrect(multi, [0, 3, 1])).toBe(false)
  })

  test('ignores a duplicated selection', () => {
    expect(isCorrect(multi, [0, 3, 3])).toBe(true)
  })
})

describe('scoreQuiz', () => {
  const quiz: Quiz = { sectionId: 'solution-classes', questions: [single, multi] }

  test('counts only fully correct questions', () => {
    expect(scoreQuiz(quiz, [[2], [0]])).toEqual({ score: 1, total: 2 })
  })

  test('scores a perfect run', () => {
    expect(scoreQuiz(quiz, [[2], [0, 3]])).toEqual({ score: 2, total: 2 })
  })

  test('treats missing answers as wrong', () => {
    expect(scoreQuiz(quiz, [[2]])).toEqual({ score: 1, total: 2 })
  })
})
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/core/quiz.test.ts`
Expected: FAIL — модуль `./quiz` не найден.

- [ ] **Step 3: Создать `src/core/quiz.ts`**

```ts
export interface Question {
  readonly id: string
  readonly optionCount: number
  readonly correct: readonly number[]
}

export interface Quiz {
  readonly sectionId: string
  readonly questions: readonly Question[]
}

export function isCorrect(question: Question, selected: readonly number[]): boolean {
  const chosen = new Set(selected)
  const expected = new Set(question.correct)
  if (chosen.size !== expected.size) return false
  for (const option of expected) if (!chosen.has(option)) return false
  return true
}

export function scoreQuiz(
  quiz: Quiz,
  answers: readonly (readonly number[])[],
): { score: number; total: number } {
  let score = 0
  quiz.questions.forEach((question, index) => {
    if (isCorrect(question, answers[index] ?? [])) score += 1
  })
  return { score, total: quiz.questions.length }
}
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/core/quiz.test.ts`
Expected: PASS, десять тестов.

- [ ] **Step 5: Создать скелет квиза раздела 5**

Create `src/data/quizzes/05.ts`:

```ts
import type { Quiz } from '../../core/quiz'

export const quiz05: Quiz = {
  sectionId: 'solution-classes',
  questions: [
    { id: '05-documents-or-database', optionCount: 4, correct: [1] },
    { id: '05-rag-does-not-train', optionCount: 4, correct: [2] },
    { id: '05-when-an-agent-earns-its-keep', optionCount: 4, correct: [3] },
    { id: '05-assistant-versus-agent', optionCount: 4, correct: [0] },
    { id: '05-multi-agent-overkill', optionCount: 4, correct: [2] },
  ],
} as const
```

- [ ] **Step 6: Создать `src/data/quizzes/index.ts`**

```ts
import type { Quiz } from '../../core/quiz'
import { quiz05 } from './05'

export const quizzes: Record<string, Quiz> = {
  'solution-classes': quiz05,
}

export function quizFor(sectionId: string): Quiz | undefined {
  return quizzes[sectionId]
}
```

- [ ] **Step 7: Создать тексты вопросов**

Формулировки на каждом языке свои. Обязательное правило: у каждого варианта есть собственное объяснение, включая правильный.

Create `src/data/quizzes/text.types.ts`:

```ts
export interface QuestionText {
  readonly prompt: string
  readonly options: readonly string[]
  readonly explanations: readonly string[]
}
```

Create `src/data/quizzes/text.en.ts`:

```ts
import type { QuestionText } from './text.types'

export const en: Record<string, QuestionText> = {
  '05-documents-or-database': {
    prompt:
      'A retailer asks: "how much did we sell in the north-west region last quarter, by category?" Where does that question belong?',
    options: [
      'RAG over the company wiki',
      'Text2SQL over the data warehouse',
      'An assistant with a longer context window',
      'An agent that reads the quarterly report',
    ],
    explanations: [
      'The wiki holds prose about process, not the transaction rows the question asks about. Retrieval would return pages describing how sales are reported, not the number.',
      'Correct. The answer is an aggregate over rows in a database, which is exactly what a generated query returns — and it can be re-run tomorrow with fresh data.',
      'Context size is not the constraint. The figure does not exist in any document until somebody queries the database for it.',
      'An agent could fetch the report, but the report is a stale snapshot. The question is about numbers that live in the warehouse.',
    ],
  },
  '05-rag-does-not-train': {
    prompt:
      'A client says: "so once we feed our contracts into RAG, the model will have learned our contracts." What is wrong with that sentence?',
    options: [
      'Nothing — that is what retrieval does',
      'Only the word "contracts"; RAG works on any document type',
      'RAG supplies passages as context at question time; the model weights never change',
      'RAG does train the model, but only on the documents you upload',
    ],
    explanations: [
      'Retrieval finds passages and puts them in front of the model at the moment of the question. Nothing is learned or retained.',
      'Document type is not the issue. The misconception is about learning versus retrieval.',
      'Correct. Indexing is not training. Remove a document from the index and the system stops knowing it — which is also why access control and freshness are configuration, not retraining.',
      'No training happens at any point. The model that answers tomorrow is bit-for-bit the model that answered yesterday.',
    ],
  },
  '05-when-an-agent-earns-its-keep': {
    prompt: 'Which of these actually calls for an agent rather than a workflow?',
    options: [
      'Every incoming invoice is parsed, validated and filed, always in that order',
      'A weekly report is generated from three fixed queries',
      'New employees get a welcome email followed by three onboarding tasks',
      'A support case may need the CRM, the billing system or neither, depending on what the customer wrote',
    ],
    explanations: [
      'Fixed steps in a fixed order is the definition of a workflow. An agent adds cost and non-determinism for nothing.',
      'Three fixed queries on a schedule is a scheduled job. There is no decision to make.',
      'The sequence never varies, so this is a workflow with a trigger.',
      'Correct. The path is not known in advance and depends on the content of the request — deciding which systems to touch is the work an agent does.',
    ],
  },
  '05-assistant-versus-agent': {
    prompt:
      'A sales team wants help drafting proposals from past deals. Nothing is sent without a human reading it. What is this?',
    options: [
      'An assistant',
      'An agent, because it uses CRM data',
      'A workflow, because proposals follow a template',
      'Text2SQL, because deal data lives in the CRM',
    ],
    explanations: [
      'Correct. It produces a draft for a person who stays in control of what happens next. That is an assistant, regardless of how many systems it reads from.',
      'Reading data does not make something an agent. Taking action on its own does, and here a person always sends.',
      'A template shapes the output, but the interesting work is drafting from unstructured past deals, not filling fixed fields.',
      'Some deal facts do live in the CRM, but the deliverable is a written proposal, not a number.',
    ],
  },
  '05-multi-agent-overkill': {
    prompt:
      'A vendor proposes five specialised agents — a researcher, a writer, a critic, a formatter and a coordinator — to answer support emails. What should you ask first?',
    options: [
      'Which model each agent uses',
      'Whether the agents run in parallel',
      'What one agent, or a plain retrieval step, fails to do here',
      'How many tokens the coordinator consumes',
    ],
    explanations: [
      'Model choice is downstream of whether the architecture is needed at all.',
      'Parallelism is an implementation detail of a design you have not yet agreed is warranted.',
      'Correct. Multi-agent designs multiply cost, latency and failure modes. The burden of proof is on the extra agents, and support email is usually retrieval plus one drafting step.',
      'Token accounting matters, but it measures the cost of a decision rather than testing it.',
    ],
  },
}
```

Create `src/data/quizzes/text.ru.ts` (импортирует `QuestionText` из `./text.types`) — те же пять идентификаторов, но формулировки и примеры русские, написанные независимо. Требования к содержанию:

- `05-documents-or-database` — сценарий про вопрос к цифрам, ответ «text2SQL», объяснения показывают, почему RAG по вики не даст числа;
- `05-rag-does-not-train` — реплика клиента «модель выучит наши договоры», правильный вариант объясняет, что индексация не является обучением;
- `05-when-an-agent-earns-its-keep` — три случая с фиксированными шагами и один с ветвлением по содержанию обращения;
- `05-assistant-versus-agent` — подготовка коммерческого предложения с обязательной проверкой человеком;
- `05-multi-agent-overkill` — предложение вендора из пяти агентов, правильный вопрос «что здесь не делает один агент».

У каждого из четырёх вариантов каждого вопроса — своё объяснение, включая правильный. Объяснение неверного варианта обязано называть конкретную причину, а не повторять «это неверно».

Create `src/data/quizzes/text.ts`:

```ts
import type { Locale } from '../../core/locale'
import type { QuestionText } from './text.types'
import { en } from './text.en'
import { ru } from './text.ru'

export type { QuestionText }

export const quizText: Record<Locale, Record<string, QuestionText>> = { en, ru }
```

- [ ] **Step 8: Написать тест целостности данных квиза**

Create `src/data/quizzes/quizzes.test.ts`:

```ts
import { describe, expect, test } from 'vitest'
import { quizzes } from './index'
import { quizText } from './text'

const LOCALES = ['en', 'ru'] as const

describe('quiz data integrity', () => {
  test('every question has at least two options', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        expect(question.optionCount, `${question.id}`).toBeGreaterThanOrEqual(2)
      }
    }
  })

  test('every correct index is inside the option range', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const index of question.correct) {
          expect(index, `${question.id}`).toBeLessThan(question.optionCount)
          expect(index, `${question.id}`).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })

  test('every question has at least one correct answer', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        expect(question.correct.length, `${question.id}`).toBeGreaterThan(0)
      }
    }
  })

  test('question ids are unique across all quizzes', () => {
    const ids = Object.values(quizzes).flatMap((q) => q.questions.map((x) => x.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('every question is written in both locales', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          expect(quizText[locale][question.id], `${locale} is missing ${question.id}`).toBeDefined()
        }
      }
    }
  })

  test('option and explanation counts match the skeleton in both locales', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          const text = quizText[locale][question.id]
          expect(text.options, `${locale}/${question.id} options`).toHaveLength(question.optionCount)
          expect(
            text.explanations,
            `${locale}/${question.id} explanations`,
          ).toHaveLength(question.optionCount)
        }
      }
    }
  })

  test('every option carries a non-trivial explanation', () => {
    for (const quiz of Object.values(quizzes)) {
      for (const question of quiz.questions) {
        for (const locale of LOCALES) {
          for (const [index, explanation] of quizText[locale][question.id].explanations.entries()) {
            expect(
              explanation.trim().length,
              `${locale}/${question.id} option ${index} has a stub explanation`,
            ).toBeGreaterThan(40)
          }
        }
      }
    }
  })
})
```

- [ ] **Step 9: Запустить тесты**

Run: `npm test`
Expected: PASS. Если русские тексты ещё не написаны, тесты падают с точным указанием, какого идентификатора не хватает — это и есть их работа.

- [ ] **Step 10: Коммит**

```bash
git add src/core/quiz.ts src/core/quiz.test.ts src/data/quizzes
git commit -m "feat: add the quiz engine and section 5 questions

The answer key lives once in the skeleton while wording is per-locale, so a
Russian rewrite can change the example but not which option is right."
```

---

### Task 10: Остров квиза

**Files:**
- Create: `src/islands/Quiz.tsx`
- Modify: `src/pages/[locale]/section/[slug].astro`
- Test: `src/islands/Quiz.test.tsx`, `tests/setup.ts`
- Modify: `vitest.config.ts`

**Interfaces:**
- Consumes: `quizFor`, `quizText`, `isCorrect`, `scoreQuiz`, `recordQuiz`, `t`.
- Produces: React-компонент `Quiz` с пропсами `{ sectionId: string; locale: Locale }`.

- [ ] **Step 1: Добавить настройку тестов**

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Modify `vitest.config.ts` — добавить `setupFiles`:

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
  },
})
```

- [ ] **Step 2: Написать падающий тест острова**

Create `src/islands/Quiz.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test } from 'vitest'
import Quiz from './Quiz'
import { readProgress } from '../core/progress'

beforeEach(() => {
  window.localStorage.clear()
})

describe('Quiz island', () => {
  test('shows the first question of the section', () => {
    render(<Quiz sectionId="solution-classes" locale="en" />)
    expect(screen.getByText(/north-west region/i)).toBeInTheDocument()
  })

  test('explains the answer as soon as an option is chosen', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    await user.click(screen.getByRole('radio', { name: /RAG over the company wiki/i }))
    await user.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByText(/does not exist in any document|prose about process/i)).toBeInTheDocument()
  })

  test('explains why the correct option is correct, not only that it is', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    await user.click(screen.getByRole('radio', { name: /Text2SQL over the data warehouse/i }))
    await user.click(screen.getByRole('button', { name: /check answer/i }))

    expect(screen.getByText(/aggregate over rows/i)).toBeInTheDocument()
  })

  test('records the finished quiz in progress', async () => {
    const user = userEvent.setup()
    render(<Quiz sectionId="solution-classes" locale="en" />)

    for (let i = 0; i < 5; i += 1) {
      const options = screen.getAllByRole('radio')
      await user.click(options[0])
      await user.click(screen.getByRole('button', { name: /check answer|next question/i }))
    }

    const stored = readProgress(window.localStorage)
    expect(stored.quizResults['solution-classes']?.total).toBe(5)
  })

  test('renders nothing when the section has no quiz', () => {
    const { container } = render(<Quiz sectionId="no-such-section" locale="en" />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 3: Установить `@testing-library/user-event`**

Run: `npm install --save-dev @testing-library/user-event`

- [ ] **Step 4: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/islands/Quiz.test.tsx`
Expected: FAIL — модуль `./Quiz` не найден.

- [ ] **Step 5: Создать `src/islands/Quiz.tsx`**

```tsx
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

    if (nextIndex === quiz.questions.length) {
      recordQuiz(window.localStorage, sectionId, {
        ...scoreQuiz(quiz, nextAnswers),
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
```

- [ ] **Step 6: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/islands/Quiz.test.tsx`
Expected: PASS, пять тестов. Если тест «records the finished quiz» падает из-за подписи кнопки, привести подпись в компоненте и селектор в тесте в соответствие — менять надо один раз, а не подгонять тест под баг.

- [ ] **Step 7: Подключить остров на странице раздела**

Modify `src/pages/[locale]/section/[slug].astro` — добавить импорт и вставить остров после `<Content />`:

```astro
import Quiz from '../../../islands/Quiz'
```

```astro
      <article class="prose max-w-none">
        <Content />
      </article>
      {section?.widget === 'quiz' && entry.data.status === 'ready' && (
        <Quiz sectionId={section.sectionId} locale={locale} client:visible />
      )}
```

Квиз показывается только на готовом разделе: спрашивать по черновику нечестно.

- [ ] **Step 8: Прогнать всё**

Run: `npm test && npm run typecheck && npm run build`
Expected: PASS, 0 ошибок, сборка проходит.

- [ ] **Step 9: Коммит**

```bash
git add src/islands vitest.config.ts tests/setup.ts src/pages package.json package-lock.json
git commit -m "feat: add the quiz island

Feedback lands the moment an option is checked, and every option carries its
own reasoning — including the correct one, where the reasoning is the lesson."
```

---

### Task 11: Титульная страница и автоопределение языка

**Files:**
- Create: `src/data/home-copy.ts`
- Modify: `src/pages/index.astro`, `src/pages/[locale]/index.astro`
- Test: `src/data/home-copy.test.ts`

**Interfaces:**
- Consumes: `sections`, `parseEntryId`, `homeCopy`, коллекцию `sections`.
- Produces: `interface HomeCopy`, `const homeCopy: Record<Locale, HomeCopy>` и титульная страница локали с позиционированием методички и оглавлением.

- [ ] **Step 1: Написать падающий тест текста титульной страницы**

Титульная страница вызывает `getCollection`, а Container API в юните не поднимает хранилище
контента. Поэтому проверяем текст как данные, а саму страницу — сборкой на шаге 6. Заодно это
подчиняется общему правилу проекта: текст отделён от представления.

Create `src/data/home-copy.test.ts`:

```ts
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
```

- [ ] **Step 2: Запустить тест и убедиться, что он падает**

Run: `npx vitest run src/data/home-copy.test.ts`
Expected: FAIL — модуль `./home-copy` не найден.

- [ ] **Step 3: Создать `src/data/home-copy.ts`**

```ts
import type { Locale } from '../core/locale'

export interface HomeCopy {
  readonly title: string
  readonly lede: string
  readonly forWhom: string
  readonly notFor: string
}

export const homeCopy: Record<Locale, HomeCopy> = {
  en: {
    title: 'AI for Business: from an idea to a solution',
    lede: 'This handbook will not teach you to write code, train models or design architecture. It teaches you to read the AI market, speak the same language as clients and engineers, find real business cases, and tell a working solution from a marketing promise.',
    forWhom: 'Written for AI presales, business development, product owners, delivery managers, heads of practice, founders and consultants.',
    notFor: 'Not for data scientists, AI engineers, ML researchers or people building models.',
  },
  ru: {
    title: 'AI для бизнеса: от идеи до решения',
    lede: 'Эта методичка не научит вас писать код, обучать модели или проектировать архитектуру. Её цель другая: научить понимать рынок AI, разговаривать на одном языке с заказчиками и инженерами, находить реальные бизнес-кейсы и отличать работающие решения от маркетинговых обещаний.',
    forWhom: 'Для AI presales, business development, product owners, delivery managers, руководителей направлений, предпринимателей и консультантов.',
    notFor: 'Не для data scientists, AI engineers, ML researchers и разработчиков моделей.',
  },
}
```

- [ ] **Step 4: Запустить тест и убедиться, что он проходит**

Run: `npx vitest run src/data/home-copy.test.ts`
Expected: PASS, четыре теста.

- [ ] **Step 5: Переписать `src/pages/[locale]/index.astro`**

```astro
---
import { getCollection } from 'astro:content'
import Layout from '../../components/Layout.astro'
import Sidebar from '../../components/Sidebar.astro'
import LocaleSwitcher from '../../components/LocaleSwitcher.astro'
import type { Locale } from '../../core/locale'
import { parseEntryId } from '../../core/content-id'
import { homeCopy } from '../../data/home-copy'

export function getStaticPaths() {
  return [{ params: { locale: 'en' } }, { params: { locale: 'ru' } }]
}

const { locale } = Astro.params as { locale: Locale }
const copy = homeCopy[locale]

const entries = await getCollection('sections')
const titles = Object.fromEntries(
  entries.flatMap((entry) => {
    const parsed = parseEntryId(entry.id)
    return parsed?.locale === locale ? [[parsed.slug, entry.data.title]] : []
  }),
)
---

<Layout title={copy.title} locale={locale} description={copy.lede}>
  <div class="mx-auto max-w-4xl px-6 py-16">
    <div class="mb-8 flex justify-end">
      <LocaleSwitcher locale={locale} path="" />
    </div>
    <h1 class="mb-6 text-4xl font-semibold">{copy.title}</h1>
    <p class="mb-6 text-lg">{copy.lede}</p>
    <p class="mb-2 text-slate-700 dark:text-slate-300">{copy.forWhom}</p>
    <p class="mb-12 text-slate-700 dark:text-slate-300">{copy.notFor}</p>
    <Sidebar locale={locale} titles={titles} />
  </div>
</Layout>
```

- [ ] **Step 6: Добавить автоопределение языка на корневую страницу**

Modify `src/pages/index.astro`:

```astro
---
const base = import.meta.env.BASE_URL.replace(/\/$/, '')
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex" />
    <title>AI for Business</title>
    <script is:inline define:vars={{ base }}>
      // Runs before the redirect below so a returning reader keeps the language
      // they picked, and a first-time Russian-speaking visitor lands on /ru/.
      var stored = null
      try {
        stored = window.localStorage.getItem('afb:locale')
      } catch (error) {
        stored = null
      }

      var locale = stored === 'en' || stored === 'ru' ? stored : 'en'
      if (stored === null) {
        var languages = navigator.languages && navigator.languages.length
          ? navigator.languages
          : [navigator.language || 'en']
        for (var i = 0; i < languages.length; i += 1) {
          var subtag = String(languages[i]).toLowerCase().split('-')[0]
          if (subtag === 'ru' || subtag === 'en') {
            locale = subtag
            break
          }
        }
      }

      window.location.replace(base + '/' + locale + '/')
    </script>
    <meta http-equiv="refresh" content={`1; url=${base}/en/`} />
  </head>
  <body>
    <a href={`${base}/en/`}>Continue to the handbook</a>
    <a href={`${base}/ru/`}>Читать по-русски</a>
  </body>
</html>
```

Логика продублирована на простом JavaScript намеренно: страница обязана работать до загрузки любого модуля. `core/locale.ts` остаётся источником правды для острова переключателя и покрыт тестами; здесь повторяется только правило выбора, и это единственное место дублирования во всём проекте.

- [ ] **Step 7: Проверить вручную**

Run: `npm run build && npm run preview`
Expected: `http://localhost:4321/ai-for-business-tutorial/` уводит на `/en/`; после перехода на русскую версию и записи выбора повторный заход на корень уводит на `/ru/`. Проверить в приватном окне с русским языком браузера, что первый заход уводит на `/ru/`.

- [ ] **Step 8: Коммит**

```bash
git add src/pages src/data/home-copy.ts src/data/home-copy.test.ts
git commit -m "feat: add the landing page and language detection

Detection lives only at the root: a script that re-routes readers on an
arbitrary section would break shared links and the back button."
```

---

### Task 12: Раздел 5 — полный текст на обоих языках

**Files:**
- Modify: `src/content/en/05-solution-classes.mdx`, `src/content/ru/05-solution-classes.mdx`
- Create: `scripts/wordcount.mjs`
- Modify: `src/data/quizzes/text.ru.ts` (если не завершён в Задаче 9)

**Interfaces:**
- Consumes: `Callout`, `Flow`, `T`, `Facts`.
- Produces: два готовых раздела со `status: ready`.

**Требования к тексту.** Объём каждой языковой версии — 1000–1500 слов. Английский и русский пишутся независимо от общего плана: свои примеры, своя интонация. Совпадать обязаны только идентификатор раздела, набор глав и выводы.

План раздела, общий для обоих языков:

- **Вступление (~120 слов).** Почему именно этот раздел ключевой: бизнес-люди смешивают ассистента, RAG, text2SQL и агента, и из этой путаницы рождаются проекты, которые невозможно принять.
- **5.1 Ассистенты (~180 слов).** Когда нужен: поиск информации, написание текста, анализ документов, помощь сотруднику. Признак: результат отдаётся человеку, человек решает, что дальше. Примеры продуктов назвать, но без версий и цен.
- **5.2 RAG (~220 слов).** Когда нужен: корпоративная база знаний, поиск по документам, ответы по внутренним данным. Главная мысль вынести в `<Callout kind="note">`: RAG не обучает модель, а предоставляет ей контекст. Показать схему через `<Flow steps={[...]}/>`: вопрос → поиск фрагментов → фрагменты в контекст → ответ со ссылкой на источник.
- **5.3 Text2SQL (~250 слов).** Различение с RAG — сердце главы: RAG отвечает по неструктурированным документам, text2SQL по базе и цифрам. Пара вопросов-близнецов («сколько продали в марте» против «что написано в договоре») в `<Callout kind="note">`. Где ломается: схема без описаний, отсутствие витрин, вопросы, на которые в данных нет ответа. Отдельным абзацем — почему цифру из такого ответа нельзя нести в отчёт без проверки.
- **5.4 Агенты и мультиагентные схемы (~250 слов).** Когда нужны: многошаговые процессы, принятие решений, работа с несколькими системами. Схема через `<Flow>`: письмо → проверить CRM → создать задачу → отправить ответ. Мультиагентность ввести как вариант, а не как следующую ступень эволюции.
- **5.5 Когда агент не нужен (~350 слов).** Десять кейсов списком, каждый одной-двумя фразами: что предлагают, чем на деле обходится, что достаточно вместо. Обязательно включить мультиагентную схему там, где хватило бы одного агента, и случай, где «агент не нужен» на самом деле означает «агенту нельзя столько прав» — со ссылкой на раздел 7.
- **Итог (~100 слов).** Четыре вопроса, по которым класс решения определяется на встрече за минуту.

Термины `RAG`, `text2SQL`, `agent`, `workflow`, `tool-calling` при первом появлении размечаются как `<T id="rag" locale={...}>`.

- [ ] **Step 1: Написать английскую версию**

Заменить содержимое `src/content/en/05-solution-classes.mdx`. Каркас файла:

```mdx
---
section: solution-classes
title: "Assistants, RAG, text2SQL and agents"
summary: "The four solution classes business people mix up most, and the questions that tell them apart."
status: ready
---

import Callout from '../../components/Callout.astro'
import Flow from '../../components/Flow.astro'
import T from '../../components/T.astro'

…текст по плану выше…

<Callout kind="note" title="The one sentence to remember">
  RAG does not train the model. It hands the model the right passages at the moment of the question.
</Callout>

<Flow steps={["A question arrives", "Relevant passages are retrieved", "Passages go into the prompt", "The model answers, citing them"]} />
```

- [ ] **Step 2: Проверить объём английской версии**

Пакет объявлен как `"type": "module"`, поэтому `require` в `node -e` не работает. Создать
`scripts/wordcount.mjs`:

```js
import { readFileSync } from 'node:fs'

const file = process.argv[2]
const words = readFileSync(file, 'utf8')
  .replace(/^---[\s\S]*?---/, '')
  .replace(/^import .*$/gm, '')
  .replace(/<[^>]+>/g, ' ')
  .split(/\s+/)
  .filter(Boolean).length

console.log(`${file}: ${words} words`)
if (words < 1000 || words > 1500) {
  console.error('Outside the 1000-1500 word budget agreed in the spec.')
  process.exit(1)
}
```

Run: `node scripts/wordcount.mjs src/content/en/05-solution-classes.mdx`
Expected: число между 1000 и 1500, код возврата 0.

- [ ] **Step 3: Написать русскую версию**

Заменить содержимое `src/content/ru/05-solution-classes.mdx` по тому же плану, но с собственными примерами. `status: ready`.

- [ ] **Step 4: Проверить объём русской версии**

Run: `node scripts/wordcount.mjs src/content/ru/05-solution-classes.mdx`
Expected: число между 1000 и 1500, код возврата 0.

- [ ] **Step 5: Дописать русские тексты квиза**

Завершить `src/data/quizzes/text.ru.ts` по требованиям из Задачи 9, шаг 7.

- [ ] **Step 6: Прогнать всё**

Run: `npm test && npm run typecheck && npm run build`
Expected: PASS, 0 ошибок. Тест паритета подтверждает наличие обоих языков, тест данных квиза — наличие русских формулировок.

- [ ] **Step 7: Просмотреть глазами обе версии**

Run: `npm run preview`
Expected: на `/en/section/05-solution-classes/` и `/ru/section/05-solution-classes/` нет плашки черновика, виден квиз, термины подчёркнуты пунктиром и показывают определение, схемы читаются.

- [ ] **Step 8: Коммит**

```bash
git add src/content src/data/quizzes/text.ru.ts
git commit -m "feat: write section 5 in both languages

Section 5 is the pilot: it carries all four solution classes and every prose
component, so approving its tone approves the shape of the other ten."
```

---

### Task 13: Документация и публикация

**Files:**
- Create: `README.md`, `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `.github/workflows/deploy.yml`
- Test: ручная проверка развёрнутого сайта

**Interfaces:**
- Consumes: всё предыдущее.
- Produces: опубликованный сайт на `https://kryadov.github.io/ai-for-business-tutorial/`.

- [ ] **Step 1: Создать `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Test
        run: npm test

      - name: Typecheck
        run: npm run typecheck

      - name: Build and upload the site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

`cancel-in-progress: false` намеренно: отменённый на середине деплой оставляет Pages API в половинчатом состоянии.

- [ ] **Step 2: Создать `LICENSE`**

Файл лицензии MIT, правообладатель `Konstantin Ryadov`, год `2026`.

- [ ] **Step 3: Создать `README.md`**

Разделы: что это и для кого (позиционирование из ТЗ), ссылка на живой сайт, оговорка про два языка и про то, что они пишутся нативно, состояние разделов (какие готовы, какие черновики), как запустить локально, как устроен репозиторий (проза в `src/content`, структура в `src/data`, логика в `src/core`), правило про факты и `verifiedOn`, ссылка на [Inference TCO Calculator](https://kryadov.github.io/llm-hardware-calculator/) как на инструмент к разделу об экономике.

- [ ] **Step 4: Создать `AGENTS.md`**

Содержание: правило «структура одна, текст нативный» с перечнем того, что роняет паритет-тест; запрет писать факты о вендорах, моделях и ценах по памяти; требование помечать `verifiedOn` и обновлять дату при пересмотре; порядок добавления нового раздела (запись в `sections.ts` → два MDX → квиз-скелет → тексты на двух языках); напоминание, что `src/core/` не знает ни о React, ни о языке.

- [ ] **Step 5: Создать `CLAUDE.md`**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Guidance lives in `AGENTS.md`, so every agent reads the same document. It is imported
below — read it before making changes.

@AGENTS.md
```

- [ ] **Step 6: Прогнать всё локально перед публикацией**

Run: `npm ci && npm test && npm run typecheck && npm run build`
Expected: всё зелёное. Это ровно то, что выполнит CI.

- [ ] **Step 7: Коммит и публикация**

```bash
git add README.md AGENTS.md CLAUDE.md LICENSE .github
git commit -m "docs: add project guidance and the Pages deployment

AGENTS.md carries the two rules that are invisible in the code: structure is
shared while prose is not, and no vendor fact is written from memory."
git push -u origin main
```

- [ ] **Step 8: Проверить развёрнутый сайт**

Открыть `https://kryadov.github.io/ai-for-business-tutorial/`.
Expected: корень уводит на `/en/`; раздел 5 читается на обоих языках; переключатель языка остаётся на том же разделе; квиз отвечает на клики; остальные десять разделов показаны в оглавлении серым как ненаписанные.

Если job `deploy` падает с сообщением о правилах защиты окружения, а `build` при этом зелёный — проверить политики окружения `github-pages`, а не workflow:

```bash
gh api repos/kryadov/ai-for-business-tutorial/environments/github-pages/deployment-branch-policies
```

---

## Что дальше

После утверждения тона и объёма Раздела 5 пишется второй план: остальные десять разделов на двух языках, тренажёр выбора решения, discovery-опросник, экзамен и `PricingTable` с проверенными ценами для Раздела 8.
