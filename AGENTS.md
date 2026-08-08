# Agent guidance

This document is for any agent (human or AI) working in this repository. The
rules below are invisible in the code — nothing in the type system or the
build will stop you from breaking them — so they are written down here
instead.

## Rule 1: structure is shared, prose is native

The site is bilingual (English, Russian). Structure — the set of sections,
their order and IDs, the set of glossary terms, the set of quiz questions,
the set of UI strings — is identical across locales. Prose — the actual
sentences in `src/content/{en,ru}/*.mdx`, the glossary definitions, the quiz
option text, the UI string text — is written natively in each language, not
translated from the other. A Russian sentence should read like something a
Russian speaker wrote, not like an English sentence run through a converter,
and vice versa.

In practice this means every structural file in `src/data/` splits in two:
a shared file that defines IDs, ordering and shape (`sections.ts`,
`glossary.types.ts` + `glossary.ts`, `quizzes/05.ts`, `ui-strings.types.ts` +
`ui-strings.ts`), and per-locale files that supply only text
(`glossary.en.ts` / `glossary.ru.ts`, `quizzes/text.en.ts` /
`quizzes/text.ru.ts`, `ui-strings.en.ts` / `ui-strings.ru.ts`). Never add a
field, a term, a question, or a UI string key to one locale without adding
its counterpart to the other.

`tests/parity.test.ts` is what actually enforces this, and it will fail — for
different, specific reasons — if you skip a step:

- an MDX file that exists in one locale's `src/content/` directory but not
  the other's fails "every written section exists in both locales";
- an MDX file whose slug isn't in `sections.ts` fails "every content file
  corresponds to a registered section";
- a UI string key present in one locale's object but not the other fails
  "both locales define exactly the same keys";
- a UI string with empty text fails "no string is left empty";
- a glossary `TermId` listed in `termIds` but missing a definition in either
  `glossary.en.ts` or `glossary.ru.ts` fails "every registered term id is
  defined in both locales";
- a quiz question `id` present in a `quizzes/NN.ts` file but missing its
  text in either `text.en.ts` or `text.ru.ts` fails "every quiz question is
  defined in both locales".

The parity test only checks that structure lines up — it has no opinion on
whether the wording matches, because it's not supposed to.

## Rule 2: no vendor, model, or price fact from memory

Never write a claim about a specific vendor, model, price, rate limit, or
protocol into the prose from memory or general impression, even if it
sounds plausible. Pricing changes, models get deprecated, and "I'm fairly
sure it's about $X" is exactly the kind of claim this handbook exists to
correct.

Any such fact belongs inside a `<Facts>` block (`src/components/Facts.astro`)
carrying a `verifiedOn="YYYY-MM-DD"` date — the date the fact was actually
checked against a source, not the date the prose was written — and a
non-empty `sources` array. `tests/facts.test.ts` enforces the mechanics:

- a `<Facts>` block without `verifiedOn` fails;
- a `<Facts>` block without at least one source fails;
- a `verifiedOn` date older than 90 days fails the build outright, which is
  intentional — it forces whoever touches that section next to re-check the
  source and either confirm the fact still holds (bump the date) or correct
  it, rather than letting a stale number sit in production indefinitely.

If you revise a fact, update `verifiedOn` to the day you re-verified it, not
the day you edited the surrounding sentence. If you cannot verify a number
right now, do not write it down provisionally "to fix later" — leave the
sentence qualitative instead.

## Adding a new section

Sections are added in this fixed order so nothing is written before its
placeholder exists to be filled:

1. Add an entry to `sections.ts` (id, slug, order, optional widget). This is
   what makes the section appear in the sidebar, initially as unwritten.
2. Create the two MDX files, `src/content/en/NN-slug.mdx` and
   `src/content/ru/NN-slug.mdx`, with `status: draft` in frontmatter until
   the prose is reviewed. `tests/parity.test.ts` requires both to exist
   together.
3. Add the quiz skeleton: a `src/data/quizzes/NN.ts` file exporting a `Quiz`
   (section id, question ids, option counts, correct answers), registered in
   `src/data/quizzes/index.ts`.
4. Fill in the native-language text for both locales: the MDX prose itself,
   and the quiz question text in `quizzes/text.en.ts` and
   `quizzes/text.ru.ts` keyed by the question ids from step 3.

Run `npm test` after each step — parity failures point at exactly which
piece of structure or text is still missing.

## `src/core/` has no opinions

Everything in `src/core/` (locale resolution, content IDs, reading
progress, quiz scoring) is pure logic: no import of React, no import of
Astro, no localized string, no knowledge of which language is active. It is
tested against Node directly, without a DOM. If a change to `src/core/`
would require importing `react`, `astro:content`, or a string that only
makes sense in one locale, that logic belongs in `src/components/` or
`src/islands/` instead, not in `src/core/`.
