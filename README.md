# AI for Business Tutorial

A bilingual (English/Russian) handbook for people who sell, buy or scope AI
projects without being AI engineers — sales engineers, delivery managers,
consultants, and the business stakeholders on the other side of the table.
It exists to fix a specific problem: most "AI strategy" conversations run
aground on four confused words — assistant, RAG, text2SQL, agent — and on
vague claims about cost and risk that nobody checks. This handbook gives the
distinctions, the questions that reveal them on a call, and a discipline for
never asserting a vendor, model or price fact from memory.

**Live site:** https://kryadov.github.io/ai-for-business-tutorial/

## Current state

The site scaffold, navigation, locale switching, quiz engine and content
pipeline are built and tested. Of the eleven planned sections, only
**Section 5 — Assistants, RAG, text2SQL and agents** has prose, in both
English and Russian, with a working quiz. The other ten sections are
registered in the section list and appear in the sidebar, but are unwritten
— they show up greyed out until their MDX files land. That is expected, not
a bug: this repository is deliberately shipped after one pilot section so
the tone and format can be reviewed before the other ten are written.

## Two languages, written natively

English and Russian content is not translated from one to the other — each
locale's prose is written directly in that language, by a person who reads
and writes it, so idiom and register don't come out sounding machine-turned.
What *is* shared between locales is **structure**: the same sections, the
same glossary terms, the same quiz questions, the same UI strings, all
identified by the same stable IDs. `tests/parity.test.ts` enforces that every
piece of shared structure that exists in one locale exists in the other; it
says nothing about whether the wording matches, because it isn't supposed
to.

## Running locally

Requires Node >=22.12.0.

```bash
npm ci
npm run dev        # local dev server
npm test           # vitest — logic, components, content parity, fact freshness
npm run typecheck  # astro check
npm run build      # static build to dist/
```

## How the repository is organised

- `src/content/{en,ru}/` — the handbook prose itself, one MDX file per
  section per locale. This text belongs to the project owner; it is not
  rewritten or "improved" by an assistant in passing.
- `src/data/` — everything structural: the section registry
  (`sections.ts`), UI strings, the glossary, and quizzes. Each of these
  splits into a shared-structure file (IDs, ordering, question shape) and a
  per-locale native-text file, so the same discipline described above
  applies to data as much as to prose.
- `src/core/` — pure logic (locale resolution, content IDs, reading
  progress, quiz scoring) with no dependency on React, Astro, or any
  language's text. It is tested without a DOM.
- `src/components/` — Astro components: `Layout`, `Sidebar`,
  `LocaleSwitcher`, `Callout`, `Flow`, `Facts`, `T` (inline glossary term).
- `src/islands/Quiz.tsx` — the one interactive React island.
- `scripts/wordcount.mjs` — enforces the 1000–1500 word budget per section.

## Facts and `verifiedOn`

Any concrete vendor, model, pricing or protocol claim in the prose is
wrapped in a `<Facts>` block carrying a `verifiedOn` date and a `sources`
list — never written from memory or left to go stale. `tests/facts.test.ts`
fails the build if a `<Facts>` block has no sources, or if `verifiedOn` is
more than 90 days old, which forces a re-check and a date bump on review
rather than letting a claim quietly rot. See `AGENTS.md` for the full rule
and what breaks when it's skipped.

## Related tool

Section 8 (economics) leans on the
[Inference TCO Calculator](https://kryadov.github.io/llm-hardware-calculator/)
for working through inference cost trade-offs — it is a companion tool, not
part of this repository.

## License

MIT, see `LICENSE`.
