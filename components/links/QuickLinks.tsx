'use client'
import Link from 'next/link'
import { ArrowRight, Link2 } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui } from '@/lib/i18n/ui'
import { LINK_CATEGORIES, hostOf, type LinkItem } from '@/lib/links'
import LinkAvatar from './LinkAvatar'
import { useLinkStore } from './useLinkStore'

const CATALOG = new Map<string, LinkItem>(LINK_CATEGORIES.flatMap(c => c.links).map(l => [l.url, l]))

/** Home strip of pinned links (defaults on first visit; edit on /links). */
export default function QuickLinks() {
  const { lang } = useLang()
  const { pins, mine, ready } = useLinkStore()
  const mineMap = new Map(mine.map(l => [l.url, l]))
  const items = pins.map(u => mineMap.get(u) || CATALOG.get(u) || { name: hostOf(u), url: u })
  return (
    <section aria-labelledby="quick-links" className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 id="quick-links" className="wd-section-title"><Link2 className="w-4 h-4 text-blue-400" aria-hidden="true" />{ui('links.quick', lang)}</h2>
        <Link href="/links" className="wd-link inline-flex items-center gap-1">{ui('common.edit', lang)} · {ui('links.all', lang)}<ArrowRight className="w-3 h-3" aria-hidden="true" /></Link>
      </div>
      <ul className="relative flex gap-2 overflow-x-auto scrollbar-hide pb-1 min-h-[2.75rem]">
        {ready && items.map(l => (
          <li key={l.url} className="shrink-0">
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="relative wd-card wd-card-hover flex items-center gap-2 pl-1.5 pr-3 py-1.5 text-xs font-medium text-ink-2 hover:text-ink-1">
              <LinkAvatar name={l.name} url={l.url} size="sm" />{l.name}<span className="sr-only"> ({ui('common.newTab', lang)})</span>
            </a>
          </li>
        ))}
        {ready && items.length === 0 && <li><Link href="/links" className="wd-chip">{ui('links.pin', lang)}</Link></li>}
      </ul>
    </section>
  )
}
