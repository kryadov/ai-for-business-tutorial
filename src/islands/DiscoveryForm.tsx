import type { Locale } from '../core/locale'
import { t } from '../data/ui-strings'

interface Props {
  locale: Locale
}

// Placeholder: the real discovery checklist is built in a follow-up phase.
// This exists so the section page can mount the widget and the mount-point
// wiring is testable before the tool itself is written.
export default function DiscoveryForm({ locale }: Props) {
  return (
    <section className="my-8 rounded border border-slate-300 p-6" data-widget="discovery">
      <p>{t(locale, 'discovery.intro')}</p>
    </section>
  )
}
