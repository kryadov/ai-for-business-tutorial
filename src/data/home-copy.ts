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
