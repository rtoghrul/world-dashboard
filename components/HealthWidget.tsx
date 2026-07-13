'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Pill, Stethoscope, ShieldPlus, Dumbbell, ExternalLink, Star } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Health', az: 'Sağlamlıq', ru: 'Здоровье', de: 'Gesundheit', tr: 'Sağlık' },
  subtitle: { en: 'Pharmacy prices, symptoms, insurance & fitness', az: 'Aptek qiymətləri, simptomlar, sığorta və fitness', ru: 'Цены в аптеках, симптомы, страхование и фитнес', de: 'Apothekenpreise, Symptome, Versicherung & Fitness', tr: 'Eczane fiyatları, belirtiler, sigorta ve fitness' },
}

const tabs = [
  { id: 'all', label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü' }, icon: Star },
  { id: 'pharmacy', label: { en: 'Pharmacy', az: 'Aptek', de: 'Apotheke', ru: 'Аптека', tr: 'Eczane' }, icon: Pill },
  { id: 'symptoms', label: { en: 'Symptoms & Info', az: 'Simptomlar', de: 'Symptome', ru: 'Симптомы', tr: 'Belirtiler' }, icon: Stethoscope },
  { id: 'insurance', label: { en: 'Insurance', az: 'Sığorta', de: 'Versicherung', ru: 'Страхование', tr: 'Sigorta' }, icon: ShieldPlus },
  { id: 'fitness', label: { en: 'Fitness & Wellness', az: 'Fitness', de: 'Fitness', ru: 'Фитнес', tr: 'Fitness' }, icon: Dumbbell },
]

interface HealthItem {
  name: string
  category: string
  desc: Record<string, string>
  url: string
  type: 'app' | 'site' | 'tool' | 'shop'
  rating: number
  popular?: boolean
  free?: boolean
}

const items: HealthItem[] = [
  // Pharmacy — price comparison & online pharmacies (Germany-focused, since much of the audience is DE-based)
  { name: 'Medizinfuchs', category: 'pharmacy', desc: { en: 'Compare medicine prices across German pharmacies', az: 'Alman apteklərində dərman qiymətlərini müqayisə et', de: 'Medikamentenpreise deutschlandweit vergleichen', ru: 'Сравнение цен на лекарства в аптеках Германии' }, url: 'https://www.medizinfuchs.de', type: 'tool', rating: 4.6, popular: true, free: true },
  { name: 'Shop Apotheke', category: 'pharmacy', desc: { en: 'Large online pharmacy, frequent discounts', az: 'Böyük onlayn aptek, tez-tez endirimlər', de: 'Große Online-Apotheke, häufige Rabatte', ru: 'Крупная онлайн-аптека, частые скидки' }, url: 'https://www.shop-apotheke.com', type: 'shop', rating: 4.5, popular: true },
  { name: 'DocMorris', category: 'pharmacy', desc: { en: 'Online pharmacy with EU-wide delivery', az: 'AB üzrə çatdırılma ilə onlayn aptek', de: 'Online-Apotheke mit EU-weiter Lieferung', ru: 'Онлайн-аптека с доставкой по ЕС' }, url: 'https://www.docmorris.de', type: 'shop', rating: 4.4 },
  { name: 'Apotheken-Notdienst', category: 'pharmacy', desc: { en: 'Find the nearest 24h emergency pharmacy in Germany', az: 'Almaniyada ən yaxın 24 saatlıq növbətçi apteki tap', de: 'Nächste Notdienst-Apotheke finden', ru: 'Найти ближайшую дежурную аптеку в Германии' }, url: 'https://www.aponet.de/apotheke/notdienstsuche', type: 'tool', rating: 4.7, popular: true, free: true },
  { name: 'GoodRx', category: 'pharmacy', desc: { en: 'US prescription discount cards & price comparison', az: 'ABŞ resept endirimi kartları və qiymət müqayisəsi', de: 'US-Rezeptrabatte & Preisvergleich', ru: 'Скидочные карты на рецепты в США' }, url: 'https://www.goodrx.com', type: 'tool', rating: 4.6, free: true },
  // Symptoms & general medical info — reputable sources only
  { name: 'NetDoktor', category: 'symptoms', desc: { en: 'German medical info site, symptom checker', az: 'Alman tibbi məlumat saytı, simptom yoxlayıcı', de: 'Medizinisches Info-Portal mit Symptom-Checker', ru: 'Немецкий медицинский портал с проверкой симптомов' }, url: 'https://www.netdoktor.de', type: 'site', rating: 4.5, free: true },
  { name: 'Mayo Clinic', category: 'symptoms', desc: { en: 'Trusted symptom checker & disease database (English)', az: 'Etibarlı simptom yoxlayıcı və xəstəlik bazası', de: 'Vertrauenswürdiger Symptom-Checker (Englisch)', ru: 'Надёжная база симптомов и болезней (англ.)' }, url: 'https://www.mayoclinic.org/symptom-checker', type: 'tool', rating: 4.8, popular: true, free: true },
  { name: 'NHS Symptom Checker', category: 'symptoms', desc: { en: 'UK health service — free, no-nonsense symptom guide', az: 'Böyük Britaniya səhiyyəsi — pulsuz simptom bələdçisi', de: 'Britischer Gesundheitsdienst — kostenloser Symptom-Guide', ru: 'Служба здравоохранения Великобритании — гид по симптомам' }, url: 'https://www.nhs.uk/symptom-checkers/', type: 'tool', rating: 4.7, free: true },
  { name: '116117 (Germany)', category: 'symptoms', desc: { en: 'German non-emergency medical appointment & advice line', az: 'Almaniyada təcili olmayan tibbi məsləhət xətti', de: 'Ärztlicher Bereitschaftsdienst — Terminvermittlung & Rat', ru: 'Немецкая линия неотложной медицинской помощи' }, url: 'https://www.116117.de', type: 'site', rating: 4.5, popular: true, free: true },
  { name: 'Ada Health', category: 'symptoms', desc: { en: 'AI symptom assessment app, used by millions', az: 'AI simptom qiymətləndirmə tətbiqi, milyonlarla istifadəçi', de: 'KI-Symptom-Check-App, Millionen Nutzer', ru: 'ИИ-приложение для оценки симптомов' }, url: 'https://ada.com', type: 'app', rating: 4.6, free: true },
  // Insurance
  { name: 'CHECK24 Krankenversicherung', category: 'insurance', desc: { en: 'Compare German health insurance plans (GKV/PKV)', az: 'Alman tibbi sığorta planlarını müqayisə et', de: 'Kranken­versicherungen vergleichen (GKV/PKV)', ru: 'Сравнение медстраховок в Германии' }, url: 'https://www.check24.de/krankenversicherung/', type: 'tool', rating: 4.5, popular: true, free: true },
  { name: 'Tarifcheck Krankenkasse', category: 'insurance', desc: { en: 'Compare statutory health insurance (Krankenkasse) rates', az: 'Dövlət tibbi sığorta tariflərini müqayisə et', de: 'Krankenkassen-Beiträge & Bonusprogramme vergleichen', ru: 'Сравнение тарифов государственной страховки' }, url: 'https://www.tarifcheck.de/krankenversicherung', type: 'tool', rating: 4.3, free: true },
  { name: 'TK (Techniker Krankenkasse)', category: 'insurance', desc: { en: 'Germany\'s largest statutory health insurer, strong app & bonus program', az: 'Almaniyanın ən böyük dövlət sığortası, güclü bonus proqramı', de: 'Größte gesetzliche Krankenkasse, starke App & Bonusprogramm', ru: 'Крупнейшая госстраховка Германии' }, url: 'https://www.tk.de', type: 'site', rating: 4.6, popular: true },
  { name: 'Expat health insurance (Feather)', category: 'insurance', desc: { en: 'English-language private/public insurance for expats in Germany', az: 'Almaniyada mühacirlər üçün ingilis dilli sığorta', de: 'Englischsprachige Versicherung für Expats', ru: 'Страхование для экспатов на английском' }, url: 'https://www.feather-insurance.com', type: 'site', rating: 4.5, popular: true },
  // Fitness & Wellness
  { name: 'Nike Training Club', category: 'fitness', desc: { en: '200+ free workouts, yoga, HIIT, strength', az: '200+ pulsuz məşq, yoga, HIIT', de: '200+ kostenlose Workouts, Yoga, HIIT', ru: '200+ бесплатных тренировок' }, url: 'https://www.nike.com/ntc-app', type: 'app', rating: 4.8, popular: true, free: true },
  { name: 'Yazio', category: 'fitness', desc: { en: 'Calorie tracker + fasting timer, great food database', az: 'Kalori izləyici + oruc taymeri', de: 'Kalorienzähler + Fasten-Timer', ru: 'Счётчик калорий и таймер поста' }, url: 'https://www.yazio.com', type: 'app', rating: 4.6, popular: true, free: true },
  { name: 'Headspace', category: 'fitness', desc: { en: 'Meditation & sleep, mental health basics', az: 'Meditasiya və yuxu, mental sağlamlıq', de: 'Meditation & Schlaf, mentale Gesundheit', ru: 'Медитация и сон, ментальное здоровье' }, url: 'https://www.headspace.com', type: 'app', rating: 4.7 },
  { name: 'Präventionskurse (Krankenkasse)', category: 'fitness', desc: { en: 'Insurance-refunded prevention courses — yoga, back pain, stress', az: 'Sığorta tərəfindən ödənilən profilaktika kursları', de: 'Von der Kasse erstattete Präventionskurse', ru: 'Курсы профилактики, оплачиваемые страховкой' }, url: 'https://www.zentrale-pruefstelle-praevention.de', type: 'site', rating: 4.4, free: true },
]

export default function HealthWidget({ initialCategory }: { initialCategory?: string }) {
  const { lang } = useLang()
  const [tab, setTab] = useState(initialCategory && initialCategory !== 'benefits' ? initialCategory : 'all')
  const [expanded, setExpanded] = useState(false)

  const filtered = tab === 'all' ? items : items.filter(i => i.category === tab)
  const display = expanded ? filtered : filtered.slice(0, 8)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const typeColors: Record<string, string> = {
    app: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
    shop: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    tool: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    site: 'bg-white/[0.06] text-[#a0a0b0] border-white/[0.08]',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{t('title')}</h2>
          <p className="text-[11px] text-[#8b8b9e]">{t('subtitle')}</p>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
        {tabs.map(tb => {
          const Icon = tb.icon
          const active = tab === tb.id
          return (
            <button
              key={tb.id}
              onClick={() => { setTab(tb.id); setExpanded(false) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition ${
                active ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-white/[0.02] text-[#8b8b9e] border-white/[0.06] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tb.label[lang as keyof typeof tb.label] || tb.label.en}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {display.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-3 rounded-lg border border-white/[0.05] bg-white/[0.015] hover:border-rose-500/25 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-xs font-semibold text-white group-hover:text-rose-300 transition-colors leading-tight">{item.name}</h4>
              <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-rose-400 transition shrink-0 mt-0.5" />
            </div>
            <p className="text-[10px] text-[#8b8b9e] mb-2 line-clamp-2">{item.desc[lang as keyof typeof item.desc] || item.desc.en}</p>
            <div className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${typeColors[item.type]}`}>{item.type}</span>
              {item.free && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-300">FREE</span>}
              {item.popular && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 8 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-[11px] font-medium text-rose-400 hover:bg-rose-500/5 border border-white/[0.05] rounded-lg transition-colors"
        >
          {expanded ? '▲' : `▼ ${filtered.length - 8} more`}
        </button>
      )}

      <p className="text-[10px] text-[#5b5b70] px-1">
        {lang === 'az' ? '⚠️ Bu məlumat tibbi məsləhət deyil. Ciddi simptomlarda həkimə müraciət edin.' : lang === 'de' ? '⚠️ Keine medizinische Beratung. Bei ernsten Symptomen einen Arzt aufsuchen.' : lang === 'ru' ? '⚠️ Это не медицинская консультация. При серьёзных симптомах обратитесь к врачу.' : '⚠️ Not medical advice. See a doctor for serious symptoms.'}
      </p>
    </div>
  )
}
