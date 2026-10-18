'use client'
import { useLang } from '@/lib/LanguageContext'
import { ui, type UiKey } from '@/lib/i18n/ui'
import type { NewsCategory } from '@/lib/newsSources'

export const REGION_TABS: NewsCategory[] = ['local', 'world', 'azerbaijan', 'caucasus', 'europe', 'mideast', 'asia', 'africa', 'americas']
export const TOPIC_TABS: NewsCategory[] = ['top', 'war', 'politics', 'economy', 'technology', 'ai', 'science', 'health', 'sports', 'cinema', 'art', 'industry', 'social']

export function tabLabel(id: NewsCategory, lang: string) {
  return ui(`news.${id}` as UiKey, lang)
}

/** A labelled, horizontally scrollable row of tab chips. */
export function TabRow({ label, tabs, value, onChange, controls }: { label: string; tabs: NewsCategory[]; value: string; onChange: (id: NewsCategory) => void; controls?: string }) {
  const { lang } = useLang()
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-wider text-ink-4 w-20 shrink-0">{label}</span>
      <div role="tablist" aria-label={label} className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5 min-w-0">
        {tabs.map(id => (
          <button
            key={id}
            role="tab"
            aria-selected={value === id}
            aria-controls={controls}
            onClick={() => onChange(id)}
            className="wd-chip shrink-0 whitespace-nowrap"
          >
            {id === 'local' && <span aria-hidden="true">🗣️</span>}
            {id === 'azerbaijan' && <span aria-hidden="true">🇦🇿</span>}
            {tabLabel(id, lang)}
          </button>
        ))}
      </div>
    </div>
  )
}
