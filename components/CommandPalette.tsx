'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Newspaper, Bitcoin, Film, Zap, Download, GraduationCap, Plane, Cloud, ShoppingBag, Globe2, Gift, Stethoscope } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import { menus } from '@/lib/menus'

const sectionIcons: Record<string, any> = {
  news: Newspaper, markets: Bitcoin, entertainment: Film, viral: Zap,
  aitools: Zap, software: Download, education: GraduationCap,
  travel: Plane, weather: Cloud, women: ShoppingBag, chinese: ShoppingBag,
  germany: Globe2, platforms: ShoppingBag, benefits: Gift, health: Stethoscope,
}

type L10n = Record<string, string>
type PaletteItem = { href: string; label: L10n; group: L10n; section: string }

const PAGES: { href: string; section: string; label: L10n }[] = [
  { href: '/benefits', section: 'benefits', label: { en: 'Benefits Hub — subsidies, discounts & free tools', az: 'Güzəşt Mərkəzi — subsidiyalar, endirimlər və pulsuz alətlər', ru: 'Льготы — субсидии, скидки и бесплатные инструменты', de: 'Vorteile — Zuschüsse, Rabatte & kostenlose Tools', tr: 'Avantajlar — destekler, indirimler ve ücretsiz araçlar', fr: 'Avantages — aides, réductions et outils gratuits', es: 'Beneficios — ayudas, descuentos y herramientas gratis', zh: '福利中心 — 补贴、折扣和免费工具', ar: 'مركز المزايا — دعم وخصومات وأدوات مجانية', ja: '特典ハブ — 補助金・割引・無料ツール', it: 'Vantaggi — sussidi, sconti e strumenti gratuiti', pt: 'Benefícios — subsídios, descontos e ferramentas grátis' } },
  { href: '/crypto', section: 'markets', label: { en: 'Crypto markets', az: 'Kripto bazarları', ru: 'Крипторынки', de: 'Kryptomärkte', tr: 'Kripto piyasaları', fr: 'Marchés crypto', es: 'Mercados cripto', zh: '加密货币市场', ar: 'أسواق العملات المشفرة', ja: '暗号資産市場', it: 'Mercati crypto', pt: 'Mercados cripto' } },
  { href: '/stocks', section: 'markets', label: { en: 'Stock markets', az: 'Səhm bazarları', ru: 'Фондовые рынки', de: 'Aktienmärkte', tr: 'Borsalar', fr: 'Marchés boursiers', es: 'Mercados bursátiles', zh: '股票市场', ar: 'أسواق الأسهم', ja: '株式市場', it: 'Mercati azionari', pt: 'Mercado de ações' } },
  { href: '/polymarket', section: 'markets', label: { en: 'Prediction markets (Polymarket)', az: 'Proqnoz bazarları (Polymarket)', ru: 'Рынки прогнозов (Polymarket)', de: 'Prognosemärkte (Polymarket)', tr: 'Tahmin piyasaları (Polymarket)', fr: 'Marchés de prédiction (Polymarket)', es: 'Mercados de predicción (Polymarket)', zh: '预测市场 (Polymarket)', ar: 'أسواق التنبؤ (Polymarket)', ja: '予測市場 (Polymarket)', it: 'Mercati predittivi (Polymarket)', pt: 'Mercados de previsão (Polymarket)' } },
  { href: '/savings', section: 'benefits', label: { en: 'Food savings & sharing', az: 'Qida qənaəti və paylaşımı', ru: 'Экономия на еде и фудшеринг', de: 'Lebensmittel sparen & teilen', tr: 'Gıda tasarrufu ve paylaşımı', fr: 'Économies et partage alimentaires', es: 'Ahorro y reparto de comida', zh: '食品省钱与分享', ar: 'توفير الطعام ومشاركته', ja: '食費節約とフードシェア', it: 'Risparmio e condivisione di cibo', pt: 'Economia e partilha de comida' } },
  { href: '/nearby', section: 'travel', label: { en: 'Nearby places', az: 'Yaxınlıqdakı yerlər', ru: 'Места поблизости', de: 'In der Nähe', tr: 'Yakındaki yerler', fr: 'À proximité', es: 'Lugares cercanos', zh: '附近地点', ar: 'أماكن قريبة', ja: '近くの場所', it: 'Luoghi vicini', pt: 'Locais próximos' } },
]

const PAGES_GROUP: L10n = { en: 'Pages', az: 'Səhifələr', ru: 'Страницы', de: 'Seiten', tr: 'Sayfalar', fr: 'Pages', es: 'Páginas', zh: '页面', ar: 'الصفحات', ja: 'ページ', it: 'Pagine', pt: 'Páginas' }

// Built from the same menu data as the header, so every entry is translated and links stay in sync.
const allItems: PaletteItem[] = [
  ...PAGES.map(p => ({ ...p, group: PAGES_GROUP })),
  ...Object.entries(menus).flatMap(([id, section]) =>
    section.items.map(item => ({
      href: item.href || `/section/${item.section || id}/${item.id}`,
      label: item.label,
      group: section.label,
      section: item.section || id,
    }))
  ),
]

const COPY: Record<'placeholder' | 'noResults' | 'navigate' | 'select' | 'close' | 'dialog', L10n> = {
  placeholder: { en: 'Search sections…', az: 'Bölmələrdə axtar…', ru: 'Поиск по разделам…', de: 'Bereiche durchsuchen…', tr: 'Bölümlerde ara…', fr: 'Rechercher des sections…', es: 'Buscar secciones…', zh: '搜索栏目…', ar: 'ابحث في الأقسام…', ja: 'セクションを検索…', it: 'Cerca sezioni…', pt: 'Pesquisar seções…' },
  noResults: { en: 'No results found', az: 'Nəticə tapılmadı', ru: 'Ничего не найдено', de: 'Keine Ergebnisse', tr: 'Sonuç bulunamadı', fr: 'Aucun résultat', es: 'Sin resultados', zh: '未找到结果', ar: 'لا توجد نتائج', ja: '結果が見つかりません', it: 'Nessun risultato', pt: 'Nenhum resultado' },
  navigate: { en: 'navigate', az: 'keçid', ru: 'выбор', de: 'navigieren', tr: 'gezin', fr: 'naviguer', es: 'navegar', zh: '导航', ar: 'تنقل', ja: '移動', it: 'naviga', pt: 'navegar' },
  select: { en: 'open', az: 'aç', ru: 'открыть', de: 'öffnen', tr: 'aç', fr: 'ouvrir', es: 'abrir', zh: '打开', ar: 'فتح', ja: '開く', it: 'apri', pt: 'abrir' },
  close: { en: 'close', az: 'bağla', ru: 'закрыть', de: 'schließen', tr: 'kapat', fr: 'fermer', es: 'cerrar', zh: '关闭', ar: 'إغلاق', ja: '閉じる', it: 'chiudi', pt: 'fechar' },
  dialog: { en: 'Search sections', az: 'Bölmələrdə axtarış', ru: 'Поиск по разделам', de: 'Bereiche durchsuchen', tr: 'Bölümlerde arama', fr: 'Rechercher des sections', es: 'Buscar secciones', zh: '搜索栏目', ar: 'البحث في الأقسام', ja: 'セクション検索', it: 'Cerca sezioni', pt: 'Pesquisar seções' },
}

const pick = (m: L10n, lang: string) => m[lang] || m.en

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { lang } = useLang()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const returnFocusRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    } else if (returnFocusRef.current) {
      // Give focus back to whatever opened the palette (keyboard users don't lose their place).
      returnFocusRef.current.focus?.()
      returnFocusRef.current = null
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8)
    const q = query.trim().toLocaleLowerCase()
    // Match the current language, English (so English keywords always work) and the URL.
    return allItems.filter(item =>
      [pick(item.label, lang), item.label.en, pick(item.group, lang), item.href]
        .some(v => v.toLocaleLowerCase().includes(q))
    ).slice(0, 12)
  }, [query, lang])

  useEffect(() => { setSelectedIndex(0) }, [filtered])

  function navigate(item: PaletteItem) {
    router.push(item.href)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex])
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true" aria-label={pick(COPY.dialog, lang)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-[#111118] border border-white/[0.08] shadow-2xl shadow-black/80 overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <Search className="w-5 h-5 text-[#7c7c92] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={pick(COPY.dialog, lang)}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-results"
            aria-activedescendant={filtered[selectedIndex] ? `command-palette-option-${selectedIndex}` : undefined}
            placeholder={pick(COPY.placeholder, lang)}
            className="flex-1 bg-transparent text-white text-sm placeholder-[#7c7c92] outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-[#7c7c92]">ESC</kbd>
        </div>

        {/* Results */}
        <div id="command-palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="text-center text-[#7c7c92] text-sm py-8">{pick(COPY.noResults, lang)}</p>
          )}
          {filtered.map((item, i) => {
            const Icon = sectionIcons[item.section] || Globe2
            return (
              <button
                key={item.href}
                id={`command-palette-option-${i}`}
                role="option"
                aria-selected={i === selectedIndex}
                tabIndex={-1}
                onClick={() => navigate(item)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === selectedIndex ? 'bg-indigo-500/10 text-white' : 'text-[#a0a0b0] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  i === selectedIndex ? 'bg-indigo-500/20' : 'bg-white/[0.04]'
                }`}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{pick(item.label, lang)}</p>
                  <p className="text-[10px] text-[#8b8b9e]">{pick(item.group, lang)}</p>
                </div>
                <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity ${i === selectedIndex ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-[#8b8b9e]">
          <span>↑↓ {pick(COPY.navigate, lang)}</span>
          <span>↵ {pick(COPY.select, lang)}</span>
          <span>esc {pick(COPY.close, lang)}</span>
        </div>
      </div>
    </div>
  )
}
