'use client'
import { useMemo, useState } from 'react'
import { ExternalLink, Pin, PinOff, Plus, Search, Trash2 } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { ui, type UiKey } from '@/lib/i18n/ui'
import { LINK_CATEGORIES, hostOf, normalizeUserUrl, type LinkItem } from '@/lib/links'
import { publisherDirectory } from '@/lib/newsSources'
import LinkAvatar from './LinkAvatar'
import { useLinkStore } from './useLinkStore'

export default function LinksHub() {
  const { lang } = useLang()
  const { pins, mine, togglePin, addMine, removeMine } = useLinkStore()
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [invalid, setInvalid] = useState(false)

  const publishers: LinkItem[] = useMemo(() => publisherDirectory().map(s => ({ name: s.name, url: s.home })), [])
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (l: LinkItem) => !q || l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    return [
      ...LINK_CATEGORIES.map(c => ({ id: c.id, title: ui(`links.c.${c.id}` as UiKey, lang), emoji: c.emoji, links: c.links.filter(match) })),
    ].filter(g => g.links.length > 0)
  }, [query, lang])
  const pubMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return publishers.filter(l => !q || l.name.toLowerCase().includes(q) || l.url.toLowerCase().includes(q))
  }, [query, publishers])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const norm = normalizeUserUrl(url)
    if (!norm) { setInvalid(true); return }
    addMine({ name: name.trim().slice(0, 60) || hostOf(norm), url: norm })
    setName(''); setUrl(''); setInvalid(false)
  }

  const Row = ({ link, removable }: { link: LinkItem; removable?: boolean }) => {
    const pinned = pins.includes(link.url)
    return (
      <li className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-fg/[0.04] transition-colors">
        <LinkAvatar name={link.name} url={link.url} />
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-ink-1 truncate group-hover:text-indigo-300">{link.name}</span>
          <span className="block text-[11px] text-ink-4 truncate">{hostOf(link.url)}<span className="sr-only"> ({ui('common.newTab', lang)})</span></span>
        </a>
        <button onClick={() => togglePin(link.url)} aria-pressed={pinned} aria-label={`${pinned ? ui('links.unpin', lang) : ui('links.pin', lang)}: ${link.name}`} title={pinned ? ui('links.unpin', lang) : ui('links.pin', lang)}
          className={`p-1.5 rounded-lg transition ${pinned ? 'text-amber-400' : 'text-ink-4 opacity-100 sm:opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-ink-1'}`}>
          {pinned ? <PinOff className="w-3.5 h-3.5" aria-hidden="true" /> : <Pin className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>
        {removable && (
          <button onClick={() => removeMine(link.url)} aria-label={`${ui('common.remove', lang)}: ${link.name}`} className="p-1.5 rounded-lg text-ink-4 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" aria-hidden="true" /></button>
        )}
      </li>
    )
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-1">{ui('links.title', lang)}</h1>
          <p className="text-sm text-ink-3 mt-1 max-w-2xl">{ui('links.subtitle', lang)}</p>
        </div>
        <label className="relative sm:w-72">
          <span className="sr-only">{ui('links.search', lang)}</span>
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-4" aria-hidden="true" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ui('links.search', lang)} className="wd-input w-full pl-9" />
        </label>
      </header>

      <section aria-labelledby="links-mine" className="wd-card p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h2 id="links-mine" className="wd-section-title">⭐ {ui('links.mine', lang)}</h2>
          <p className="text-[11px] text-ink-4">{ui('links.mineHint', lang)}</p>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2" noValidate>
          <label className="sm:w-48"><span className="sr-only">{ui('links.name', lang)}</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={ui('links.name', lang)} maxLength={60} className="wd-input w-full" />
          </label>
          <label className="flex-1"><span className="sr-only">{ui('links.url', lang)}</span>
            <input value={url} onChange={e => { setUrl(e.target.value); setInvalid(false) }} placeholder={ui('links.url', lang)} inputMode="url" aria-invalid={invalid} aria-describedby={invalid ? 'links-url-err' : undefined} className="wd-input w-full" />
          </label>
          <button type="submit" className="btn-primary inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"><Plus className="w-4 h-4" aria-hidden="true" />{ui('common.add', lang)}</button>
        </form>
        {invalid && <p id="links-url-err" role="alert" className="text-xs text-red-400 mt-2">{ui('links.invalid', lang)}</p>}
        {mine.length > 0 && <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1 mt-3">{mine.map(l => <Row key={l.url} link={l} removable />)}</ul>}
      </section>

      {groups.length === 0 && pubMatches.length === 0 && <p className="wd-card p-8 text-center text-sm text-ink-3">{ui('links.noMatch', lang)}</p>}
      <div className="columns-1 md:columns-2 xl:columns-3 gap-5 [column-fill:_balance]">
        {groups.map(g => (
          <section key={g.id} aria-labelledby={`links-${g.id}`} className="wd-card p-4 mb-5 break-inside-avoid">
            <h2 id={`links-${g.id}`} className="wd-section-title mb-1"><span aria-hidden="true">{g.emoji}</span>{g.title}<span className="text-ink-4 font-normal text-xs">{g.links.length}</span></h2>
            <ul className="mt-2 space-y-0.5">{g.links.map(l => <Row key={l.url} link={l} />)}</ul>
          </section>
        ))}
      </div>
      {pubMatches.length > 0 && (
        <section aria-labelledby="links-news" className="wd-card p-4">
          <h2 id="links-news" className="wd-section-title mb-1"><span aria-hidden="true">📰</span>{ui('links.c.news', lang)}<span className="text-ink-4 font-normal text-xs">{pubMatches.length}</span></h2>
          <p className="text-[11px] text-ink-4 mb-2">{ui('links.c.newsHint', lang)}</p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-0.5">{pubMatches.map(l => <Row key={l.url} link={l} />)}</ul>
        </section>
      )}
      <p className="text-[11px] text-ink-4 flex items-center gap-1"><ExternalLink className="w-3 h-3" aria-hidden="true" />{ui('common.newTab', lang)}</p>
    </div>
  )
}
