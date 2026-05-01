'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { ExternalLink, Gift, Star, Banknote, Sparkles, BadgePercent, Zap } from 'lucide-react'

export interface BenefitItem {
  name: string
  url: string
  desc: Record<string, string>
  saving?: string
  type: 'free' | 'subsidy' | 'discount' | 'tip' | 'earn'
  important?: boolean
}

export interface BenefitsSection {
  id: string
  title: Record<string, string>
  items: BenefitItem[]
}

const typeConfig: Record<string, { label: string; color: string; icon: any }> = {
  free: { label: 'FREE', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: Gift },
  subsidy: { label: 'SUBSIDY', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Banknote },
  discount: { label: 'DISCOUNT', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: BadgePercent },
  tip: { label: 'TIP', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Sparkles },
  earn: { label: 'EARN $', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: Zap },
}

// ═══════════════════════════════════════════
// ALL BENEFITS DATA
// ═══════════════════════════════════════════

export const BENEFITS_DATA: Record<string, BenefitsSection[]> = {
  germany: [
    {
      id: 'housing',
      title: { en: '🏠 Housing & Mortgage', az: '🏠 Mənzil & İpoteka', de: '🏠 Wohnung & Hypothek', ru: '🏠 Жильё и ипотека' },
      items: [
        { name: 'Baukindergeld', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Neubau/', desc: { en: '€12,000 per child for first home buyers from KfW', az: 'KfW-dən ilk ev alanlara hər uşağa €12,000', de: '12.000€ pro Kind für Erstimmobilienkäufer (KfW)', ru: '€12,000 на ребёнка для первого жилья' }, saving: '€12K/child', type: 'subsidy', important: true },
        { name: 'KfW-Förderung (Kredit 300)', url: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Neubau/F%C3%B6rderprodukte/Klimafreundlicher-Neubau-(297-298)/', desc: { en: 'Up to €150,000 low-interest loan for energy-efficient homes', az: 'Enerji-effektiv evlər üçün €150,000-a qədər aşağı faizli kredit', de: 'Bis 150.000€ zinsgünstiges Darlehen für Effizienzhaus', ru: 'До €150,000 льготный кредит на энергоэффективный дом' }, saving: '€150K loan', type: 'subsidy', important: true },
        { name: 'Wohnungsbauprämie', url: 'https://www.bundesfinanzministerium.de', desc: { en: '€70-140/year state bonus for Bausparvertrag savings', az: 'Bausparvertrag yığımı üçün illik €70-140 dövlət bonusu', de: '70-140€/Jahr Staatsprämie für Bausparvertrag', ru: '€70-140/год гос. премия за стройсбережения' }, saving: '€140/yr', type: 'subsidy' },
        { name: 'Wohngeld 2025', url: 'https://www.bmwsb.bund.de/Webs/BMWSB/DE/themen/wohnen/wohnraumfoerderung/wohngeld/wohngeld-node.html', desc: { en: 'Housing allowance - up to €370/month for low income', az: 'Mənzil müavinəti - aşağı gəlir üçün aylıq €370-ə qədər', de: 'Wohngeld - bis 370€/Monat für Geringverdiener', ru: 'Жилищное пособие - до €370/мес' }, saving: '€370/mo', type: 'subsidy', important: true },
        { name: 'Arbeitnehmersparzulage', url: 'https://www.finanztip.de/arbeitnehmersparzulage/', desc: { en: 'Employee savings bonus - up to €80/year state grant for VL', az: 'İşçi yığım bonusu - VL üçün illik €80 dövlət qrantı', de: 'Arbeitnehmer-Sparzulage - bis 80€/Jahr für VL', ru: 'Бонус за накопления - до €80/год от государства' }, saving: '€80/yr', type: 'subsidy' },
        { name: 'Lastenzuschuss (Eigentümer)', url: 'https://www.bmwsb.bund.de/Webs/BMWSB/DE/themen/wohnen/wohnraumfoerderung/wohngeld/wohngeld-node.html', desc: { en: 'Mortgage subsidy for homeowners - reduces monthly burden', az: 'Ev sahibləri üçün ipoteka subsidiyası - aylıq yükü azaldır', de: 'Lastenzuschuss für Eigentümer - monatliche Belastung senken', ru: 'Субсидия на ипотеку для собственников' }, saving: '€300+/mo', type: 'subsidy' },
      ]
    },
    {
      id: 'auto',
      title: { en: '🚗 Car & Transport', az: '🚗 Avtomobil & Nəqliyyat', de: '🚗 Auto & Verkehr', ru: '🚗 Авто и транспорт' },
      items: [
        { name: 'Deutschlandticket €58/mo', url: 'https://deutschlandticket.de', desc: { en: 'Unlimited public transport across Germany - trains, buses, trams', az: 'Bütün Almaniyada limitsiz ictimai nəqliyyat - qatar, avtobus, tramvay', de: 'Unbegrenzt Nahverkehr in ganz Deutschland', ru: 'Безлимитный общ. транспорт по всей Германии' }, saving: '€58/mo', type: 'discount', important: true },
        { name: 'E-Auto Förderung (THG-Quote)', url: 'https://www.umweltbundesamt.de/themen/verkehr-laerm/emissionshandel/thg-quote', desc: { en: 'EV owners earn €250-400/year selling CO2 quota', az: 'Elektromobil sahibləri CO2 kvotası sataraq illik €250-400 qazanır', de: 'E-Auto-Besitzer verdienen 250-400€/Jahr mit THG-Quote', ru: 'Владельцы EV зарабатывают €250-400/год на квотах CO2' }, saving: '€400/yr', type: 'earn', important: true },
        { name: 'Pendlerpauschale', url: 'https://www.finanztip.de/pendlerpauschale/', desc: { en: 'Commuter tax deduction - €0.30/km (€0.38 from 21st km)', az: 'İşə gedən vergi endirimi - km başına €0.30 (21-ci km-dən €0.38)', de: 'Entfernungspauschale - 0,30€/km (ab 21. km: 0,38€)', ru: 'Налоговый вычет за дорогу - €0.30/км' }, saving: '~€1500/yr', type: 'subsidy' },
        { name: 'Jobticket (steuerfrei)', url: 'https://www.haufe.de/personal/entgelt/jobticket-steuerbefreiung_78_472544.html', desc: { en: 'Tax-free employer transit pass - ask your HR!', az: 'Vergisiz işəgötürən nəqliyyat bileti - HR-dan soruş!', de: 'Steuerfreies Jobticket vom Arbeitgeber - HR fragen!', ru: 'Безналоговый проездной от работодателя' }, saving: 'Tax-free', type: 'tip' },
        { name: 'Dienstwagen 0.25% Regel (E-Auto)', url: 'https://www.adac.de/rund-ums-fahrzeug/elektromobilitaet/kaufen-leasing/dienstwagen-elektro/', desc: { en: 'Company EV taxed at only 0.25% - massive tax saving vs 1%', az: 'Şirkət elektromobili yalnız 0.25% vergilənir - 1%-ə nisbətən böyük qənaət', de: 'Dienstwagen E-Auto nur 0,25% - viel weniger als 1%', ru: 'Служебный EV только 0.25% налог - огромная экономия' }, saving: '75% less tax', type: 'tip', important: true },
        { name: 'BahnCard 25/50 Probe', url: 'https://www.bahn.de/angebot/bahncard', desc: { en: 'Trial BahnCard - 25/50% off all DB trains for 3 months', az: 'Sınaq BahnCard - 3 ay bütün DB qatarlarında 25/50% endirim', de: 'Probe BahnCard - 25/50% auf alle DB-Züge für 3 Monate', ru: 'Пробная BahnCard - 25/50% скидка 3 месяца' }, saving: '25-50% off', type: 'discount' },
      ]
    },
    {
      id: 'family',
      title: { en: '👨‍👩‍👧 Family Benefits', az: '👨‍👩‍👧 Ailə Müavinətləri', de: '👨‍👩‍👧 Familienleistungen', ru: '👨‍👩‍👧 Семейные пособия' },
      items: [
        { name: 'Kindergeld: €250/child/mo', url: 'https://www.arbeitsagentur.de/familie-und-kinder/kindergeld', desc: { en: 'Universal child benefit - €250/month per child, no income limit', az: 'Universal uşaq müavinəti - hər uşağa aylıq €250, gəlir limiti yox', de: 'Kindergeld - 250€/Monat pro Kind, keine Einkommensgrenze', ru: '€250/мес на каждого ребёнка, без лимита дохода' }, saving: '€250/mo', type: 'subsidy', important: true },
        { name: 'Elterngeld: 65-67% salary', url: 'https://familienportal.de/familienportal/familienleistungen/elterngeld', desc: { en: 'Parental leave pay - 65-67% of net salary for 12-14 months', az: 'Valideyn məzuniyyəti - xalis maaşın 65-67%-i, 12-14 ay', de: 'Elterngeld - 65-67% des Nettogehalts, 12-14 Monate', ru: 'Родительское пособие - 65-67% от зарплаты, 12-14 мес' }, saving: '~€1800/mo', type: 'subsidy', important: true },
        { name: 'Kinderzuschlag: +€292/mo', url: 'https://www.arbeitsagentur.de/familie-und-kinder/kinderzuschlag', desc: { en: 'Extra supplement for low-income families - up to €292/child/month', az: 'Aşağı gəlirli ailələr üçün əlavə - hər uşağa aylıq €292-ə qədər', de: 'Kinderzuschlag für Geringverdiener - bis 292€/Kind/Monat', ru: 'Доплата малоимущим - до €292/ребёнок/мес' }, saving: '€292/mo', type: 'subsidy', important: true },
        { name: 'Kita kostenlos (Berlin)', url: 'https://www.berlin.de/sen/jugend/familie-und-kinder/kindertagesbetreuung/', desc: { en: 'Free kindergarten in Berlin - €0 from age 1 to school', az: 'Berlində pulsuz uşaq bağçası - 1 yaşdan məktəbə qədər €0', de: 'Kita kostenlos in Berlin - 0€ ab 1 Jahr bis Schulalter', ru: 'Бесплатный детский сад в Берлине' }, saving: '€0 Kita', type: 'free', important: true },
        { name: 'Bildung und Teilhabe (BuT)', url: 'https://www.bmas.de/DE/Arbeit/Grundsicherung-Buergergeld/Bildungspaket/bildungspaket.html', desc: { en: 'Free school supplies, lunch, trips, tutoring for low-income kids', az: 'Aşağı gəlirli uşaqlar üçün pulsuz məktəb ləvazimatı, nahar, ekskursiya', de: 'Kostenlose Schulsachen, Mittagessen, Ausflüge, Nachhilfe', ru: 'Бесплатные школьные принадлежности, обеды, экскурсии' }, saving: '€195+/yr', type: 'free' },
        { name: 'Mutterschaftsgeld', url: 'https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/mutterschaftsleistungen', desc: { en: 'Maternity pay - full salary for 6 weeks before + 8 weeks after birth', az: 'Analıq ödənişi - doğuşdan 6 həftə əvvəl + 8 həftə sonra tam maaş', de: 'Mutterschaftsgeld - volles Gehalt 6 Wo. vor + 8 Wo. nach Geburt', ru: 'Пособие по беременности - полная зарплата 14 недель' }, saving: 'Full salary', type: 'subsidy', important: true },
      ]
    },
    {
      id: 'tax',
      title: { en: '💰 Tax Savings', az: '💰 Vergi Qənaəti', de: '💰 Steuern sparen', ru: '💰 Экономия на налогах' },
      items: [
        { name: 'Homeoffice Pauschale: €1260/yr', url: 'https://www.finanztip.de/homeoffice-pauschale/', desc: { en: 'Work from home tax deduction - €6/day, max €1260/year', az: 'Evdən iş vergi endirimi - gündə €6, maks €1260/il', de: 'Homeoffice-Pauschale - 6€/Tag, max 1260€/Jahr', ru: 'Вычет за домашний офис - €6/день, макс €1260/год' }, saving: '€1260/yr', type: 'subsidy', important: true },
        { name: 'Werbungskosten: €1230 auto', url: 'https://www.finanztip.de/werbungskosten/', desc: { en: 'Automatic €1230 work expense deduction - no receipts needed', az: 'Avtomatik €1230 iş xərci endirimi - qəbz lazım deyil', de: 'Werbungskostenpauschale - 1230€ automatisch', ru: '€1230 автоматический вычет - без чеков' }, saving: '€1230', type: 'tip', important: true },
        { name: 'Steuerberater (1. Jahr kostenlos)', url: 'https://www.lohnsteuercompact.de', desc: { en: 'Online tax software - first year free, avg €1000+ refund', az: 'Onlayn vergi proqramı - ilk il pulsuz, ortalama €1000+ geri ödəmə', de: 'Online-Steuer - 1. Jahr gratis, Ø 1000€+ Erstattung', ru: 'Онлайн налоговая - 1й год бесплатно, ≈€1000+ возврат' }, saving: '€1000+', type: 'free' },
        { name: 'Sonderausgaben (Versicherungen)', url: 'https://www.finanztip.de/vorsorgeaufwendungen/', desc: { en: 'Deduct health & pension insurance - up to €1900 (employed)', az: 'Tibbi & pensiya sığortası endirimi - €1900-a qədər (işçilər)', de: 'Kranken- & Rentenversicherung absetzen - bis 1900€', ru: 'Вычет за медстраховку и пенсию - до €1900' }, saving: '€1900', type: 'subsidy' },
        { name: 'Handwerkerleistungen', url: 'https://www.finanztip.de/handwerkerleistungen/', desc: { en: 'Deduct 20% of craftsman bills - max €1200/year tax back', az: 'Usta xidmətlərinin 20%-ni endir - maks €1200/il vergi geri', de: '20% der Handwerkerrechnung absetzen - max 1200€/Jahr', ru: 'Вычет 20% за ремонтников - до €1200/год назад' }, saving: '€1200/yr', type: 'subsidy' },
      ]
    },
  ],

  aitools: [
    {
      id: 'free-ai',
      title: { en: '🆓 Best Free AI Tools', az: '🆓 Ən Yaxşı Pulsuz AI Alətlər', de: '🆓 Beste kostenlose KI-Tools', ru: '🆓 Лучшие бесплатные ИИ' },
      items: [
        { name: 'ChatGPT Free (GPT-4o mini)', url: 'https://chat.openai.com', desc: { en: 'Free tier includes GPT-4o mini, web browsing, file upload', az: 'Pulsuz plan GPT-4o mini, web axtarış, fayl yükləmə daxildir', de: 'Gratis: GPT-4o mini, Web-Suche, Datei-Upload', ru: 'Бесплатно: GPT-4o mini, веб-поиск, загрузка файлов' }, type: 'free', important: true },
        { name: 'Claude 3.5 Sonnet (Free)', url: 'https://claude.ai', desc: { en: 'Free access to Claude 3.5 - best for coding & analysis', az: 'Claude 3.5-ə pulsuz giriş - kodlaşdırma üçün ən yaxşı', de: 'Gratis Claude 3.5 - ideal für Code & Analyse', ru: 'Бесплатный Claude 3.5 - лучший для кода' }, type: 'free', important: true },
        { name: 'Google Gemini (Free)', url: 'https://gemini.google.com', desc: { en: 'Free Gemini Pro - multimodal, Google integration, unlimited', az: 'Pulsuz Gemini Pro - multimodal, Google inteqrasiya, limitsiz', de: 'Gratis Gemini Pro - multimodal, Google-Integration', ru: 'Бесплатный Gemini Pro - мультимодальный' }, type: 'free', important: true },
        { name: 'Microsoft Copilot (Free)', url: 'https://copilot.microsoft.com', desc: { en: 'GPT-4 powered, DALL-E 3 image gen, free with Microsoft account', az: 'GPT-4, DALL-E 3 şəkil yaratma, Microsoft hesabı ilə pulsuz', de: 'GPT-4, DALL-E 3 Bilder, gratis mit Microsoft-Konto', ru: 'GPT-4, DALL-E 3, бесплатно с аккаунтом Microsoft' }, type: 'free', important: true },
        { name: 'Perplexity AI (Free)', url: 'https://perplexity.ai', desc: { en: 'AI search with sources - 5 Pro searches/day free', az: 'Mənbələrlə AI axtarış - gündə 5 Pro axtarış pulsuz', de: 'KI-Suche mit Quellen - 5 Pro-Suchen/Tag gratis', ru: 'ИИ поиск с источниками - 5 Pro запросов/день' }, type: 'free' },
      ]
    },
    {
      id: 'earn-ai',
      title: { en: '💸 Earn Money with AI', az: '💸 AI ilə Pul Qazanmaq', de: '💸 Mit KI Geld verdienen', ru: '💸 Заработать с ИИ' },
      items: [
        { name: 'Freelance AI Content', url: 'https://www.upwork.com/freelance-jobs/artificial-intelligence/', desc: { en: 'Write AI-generated content on Upwork/Fiverr - $20-100/article', az: 'Upwork/Fiverr-də AI məzmun yaz - məqalə başına $20-100', de: 'KI-Inhalte auf Upwork/Fiverr - $20-100/Artikel', ru: 'AI-контент на Upwork/Fiverr - $20-100/статья' }, saving: '$20-100', type: 'earn', important: true },
        { name: 'AI Automation Agency', url: 'https://www.youtube.com/results?search_query=ai+automation+agency', desc: { en: 'Build AI automations for businesses - $2K-10K/client', az: 'Bizneslər üçün AI avtomatlaşdırma qur - müştəri başına $2K-10K', de: 'KI-Automatisierungen für Firmen - $2K-10K/Kunde', ru: 'AI автоматизация для бизнеса - $2K-10K/клиент' }, saving: '$2K-10K', type: 'earn', important: true },
        { name: 'AI Art & Print-on-Demand', url: 'https://www.printful.com', desc: { en: 'Generate AI art → sell on Redbubble/Etsy/Printful', az: 'AI sənət yarat → Redbubble/Etsy/Printful-da sat', de: 'KI-Kunst → auf Redbubble/Etsy/Printful verkaufen', ru: 'AI арт → продавать на Redbubble/Etsy' }, saving: '$500-5K/mo', type: 'earn' },
        { name: 'YouTube with AI (Faceless)', url: 'https://www.youtube.com/results?search_query=faceless+youtube+channel+ai', desc: { en: 'AI-generated faceless YouTube channels - $1K-20K/month passive', az: 'AI ilə üzsüz YouTube kanalları - aylıq $1K-20K passiv', de: 'KI-YouTube-Kanäle ohne Gesicht - $1K-20K/Monat passiv', ru: 'Безликие YouTube каналы с ИИ - $1K-20K/мес пассив' }, saving: '$1K-20K/mo', type: 'earn', important: true },
        { name: 'AI SaaS Micro Tools', url: 'https://microlaunch.net', desc: { en: 'Build simple AI tools with no-code → charge $9-49/month', az: 'No-code ilə sadə AI alətlər qur → aylıq $9-49 al', de: 'Einfache KI-Tools bauen → $9-49/Monat verlangen', ru: 'Создать простые AI инструменты → $9-49/мес' }, saving: '$9-49/mo', type: 'earn' },
      ]
    },
    {
      id: 'cheap-ai',
      title: { en: '🏷️ Cheapest Premium AI', az: '🏷️ Ən Ucuz Premium AI', de: '🏷️ Günstigste Premium-KI', ru: '🏷️ Самые дешёвые Premium ИИ' },
      items: [
        { name: 'ChatGPT Plus Student: $10/mo', url: 'https://openai.com/chatgpt/pricing', desc: { en: 'Student discount: 50% off ChatGPT Plus ($10 instead of $20)', az: 'Tələbə endirimi: ChatGPT Plus 50% ucuz ($20 əvəzinə $10)', de: 'Studentenrabatt: 50% auf ChatGPT Plus ($10 statt $20)', ru: 'Студенческая скидка: 50% на ChatGPT Plus' }, saving: '50% off', type: 'discount', important: true },
        { name: 'Cursor AI (Free 2 weeks)', url: 'https://cursor.sh', desc: { en: 'Best AI code editor - 2 weeks Pro free trial', az: 'Ən yaxşı AI kod editoru - 2 həftə Pro pulsuz sınaq', de: 'Bester KI-Code-Editor - 2 Wochen Pro gratis', ru: 'Лучший AI-редактор кода - 2 недели Pro бесплатно' }, type: 'free' },
        { name: 'Midjourney via Discord: $10/mo', url: 'https://midjourney.com', desc: { en: 'Best AI image generator - Basic plan ~200 images/month', az: 'Ən yaxşı AI şəkil generatoru - Basic plan aylıq ~200 şəkil', de: 'Beste KI-Bildgenerierung - Basic ~200 Bilder/Monat', ru: 'Лучший генератор изображений - ~200/мес за $10' }, saving: '$10/mo', type: 'discount' },
        { name: 'Leonardo.ai (150 free/day)', url: 'https://leonardo.ai', desc: { en: '150 free image generations per day - no credit card', az: 'Gündə 150 pulsuz şəkil yaratma - kredit kartı lazım deyil', de: '150 kostenlose Bilder/Tag - keine Kreditkarte nötig', ru: '150 бесплатных изображений/день - без карты' }, type: 'free', important: true },
      ]
    },
  ],

  travel: [
    {
      id: 'cheap-flights',
      title: { en: '✈️ Cheapest Flights', az: '✈️ Ən Ucuz Uçuşlar', de: '✈️ Günstigste Flüge', ru: '✈️ Самые дешёвые рейсы' },
      items: [
        { name: 'Skyscanner Everywhere', url: 'https://www.skyscanner.net/transport/flights/from/everywhere/', desc: { en: 'Search "Everywhere" to find cheapest destination from your city', az: '"Hər yerə" axtarış - şəhərindən ən ucuz istiqaməti tap', de: '"Überall hin" suchen - günstigste Ziele finden', ru: 'Искать "Везде" - найти самый дешёвый рейс' }, type: 'tip', important: true },
        { name: 'Google Flights Price Tracking', url: 'https://www.google.com/travel/flights', desc: { en: 'Track prices & get alerts when they drop', az: 'Qiymətləri izlə & düşəndə xəbərdarlıq al', de: 'Preise verfolgen & Benachrichtigung bei Preisfall', ru: 'Отслеживать цены и получать уведомления' }, type: 'free', important: true },
        { name: 'Ryanair/Wizzair from €9.99', url: 'https://www.ryanair.com', desc: { en: 'Budget airlines - Europe from €9.99 one-way', az: 'Büdcə aviaşirkətləri - Avropa €9.99-dan bir tərəf', de: 'Billigflieger - Europa ab 9,99€ einfach', ru: 'Лоукостеры - Европа от €9.99 в одну сторону' }, saving: 'from €9.99', type: 'discount', important: true },
        { name: 'Secret Flying (Error Fares)', url: 'https://www.secretflying.com', desc: { en: 'Airline pricing errors & deal alerts - save 50-90%', az: 'Aviaşirkət qiymət xətaları - 50-90% qənaət', de: 'Airline-Preisfehler & Deals - 50-90% sparen', ru: 'Ошибки в ценах авиа - экономия 50-90%' }, saving: '50-90% off', type: 'tip' },
        { name: 'Kiwi.com Nomad', url: 'https://www.kiwi.com/nomad/', desc: { en: 'Multi-city trips optimized for cheapest route', az: 'Çox şəhərli səyahətlər ən ucuz marşrut üçün optimallaşdırılıb', de: 'Multi-City optimiert für günstigste Route', ru: 'Мульти-город оптимизация по цене' }, type: 'tool' },
      ]
    },
    {
      id: 'cheap-hotels',
      title: { en: '🏨 Budget Accommodation', az: '🏨 Büdcə Yerləşmə', de: '🏨 Günstige Unterkünfte', ru: '🏨 Бюджетное жильё' },
      items: [
        { name: 'Hostelworld (from €8/night)', url: 'https://www.hostelworld.com', desc: { en: 'Hostels worldwide from €8/night - perfect for solo travelers', az: 'Dünya üzrə hostellər gecə €8-dən - tək səyahətçilər üçün ideal', de: 'Hostels weltweit ab 8€/Nacht - ideal für Alleinreisende', ru: 'Хостелы от €8/ночь - идеально для одиночных' }, saving: 'from €8', type: 'discount', important: true },
        { name: 'Couchsurfing (FREE)', url: 'https://www.couchsurfing.com', desc: { en: 'Stay for free with locals - cultural exchange', az: 'Yerlilərdə pulsuz qal - mədəni mübadilə', de: 'Kostenlos bei Einheimischen übernachten', ru: 'Бесплатно у местных - культурный обмен' }, saving: '€0', type: 'free', important: true },
        { name: 'TrustedHousesitters', url: 'https://www.trustedhousesitters.com', desc: { en: 'Free accommodation in exchange for pet/house sitting', az: 'Ev/heyvan baxımı müqabilində pulsuz qalma', de: 'Kostenlose Unterkunft gegen Haus-/Tiersitting', ru: 'Бесплатное жильё за присмотр за домом/питомцем' }, saving: '€0', type: 'free' },
        { name: 'Booking.com Genius (Free)', url: 'https://www.booking.com', desc: { en: 'Free loyalty program - 10-20% off after 2 bookings', az: 'Pulsuz loyallıq proqramı - 2 rezervasiyadan sonra 10-20% endirim', de: 'Gratis Treueprogramm - 10-20% nach 2 Buchungen', ru: 'Бесплатная программа лояльности - 10-20% скидка' }, saving: '10-20% off', type: 'discount' },
      ]
    },
  ],

  software: [
    {
      id: 'free-software',
      title: { en: '🆓 Best Free Alternatives', az: '🆓 Ən Yaxşı Pulsuz Alternativlər', de: '🆓 Beste kostenlose Alternativen', ru: '🆓 Лучшие бесплатные альтернативы' },
      items: [
        { name: 'LibreOffice → replaces MS Office', url: 'https://www.libreoffice.org', desc: { en: 'Full office suite - Word, Excel, PowerPoint equivalent, 100% free', az: 'Tam ofis paketi - Word, Excel, PowerPoint ekvivalenti, 100% pulsuz', de: 'Komplette Office-Suite - Word/Excel/PowerPoint-Ersatz', ru: 'Полный офис - замена Word/Excel/PowerPoint, бесплатно' }, type: 'free', important: true },
        { name: 'DaVinci Resolve → replaces Premiere', url: 'https://www.blackmagicdesign.com/products/davinciresolve', desc: { en: 'Professional video editor - Hollywood-grade, completely free', az: 'Peşəkar video redaktor - Hollywood səviyyəsi, tamamilə pulsuz', de: 'Profi-Videoeditor - Hollywood-Qualität, komplett gratis', ru: 'Проф. видеоредактор - уровень Голливуда, бесплатно' }, type: 'free', important: true },
        { name: 'GIMP → replaces Photoshop', url: 'https://www.gimp.org', desc: { en: 'Advanced image editor - layers, filters, scripting, free', az: 'Qabaqcıl şəkil redaktor - layerlər, filtrlər, pulsuz', de: 'Bildbearbeitung - Ebenen, Filter, Skripting, gratis', ru: 'Редактор изображений - слои, фильтры, бесплатно' }, type: 'free', important: true },
        { name: 'Figma Free (3 projects)', url: 'https://www.figma.com', desc: { en: 'Design tool - 3 projects free, unlimited viewers', az: 'Dizayn aləti - 3 layihə pulsuz, limitsiz baxıcı', de: 'Design-Tool - 3 Projekte gratis, unbegrenzt Zuschauer', ru: 'Дизайн - 3 проекта бесплатно, безлимит просмотров' }, type: 'free' },
        { name: 'Bitwarden → replaces 1Password', url: 'https://bitwarden.com', desc: { en: 'Password manager - unlimited passwords, all devices, free', az: 'Parol meneceri - limitsiz parollar, bütün cihazlar, pulsuz', de: 'Passwort-Manager - unbegrenzt, alle Geräte, gratis', ru: 'Менеджер паролей - безлимит, все устройства, бесплатно' }, type: 'free', important: true },
      ]
    },
    {
      id: 'student-deals',
      title: { en: '🎓 Student & Developer Deals', az: '🎓 Tələbə & Developer Endirimləri', de: '🎓 Studenten- & Entwickler-Deals', ru: '🎓 Скидки для студентов и разработчиков' },
      items: [
        { name: 'GitHub Student Pack (FREE)', url: 'https://education.github.com/pack', desc: { en: '$200K+ in free tools: Copilot, domains, hosting, JetBrains, Azure', az: '$200K+ pulsuz alət: Copilot, domenlər, hosting, JetBrains, Azure', de: '$200K+ in Gratis-Tools: Copilot, Domains, Hosting, JetBrains', ru: '$200K+ бесплатных инструментов: Copilot, домены, хостинг' }, saving: '$200K+', type: 'free', important: true },
        { name: 'JetBrains Free (Students)', url: 'https://www.jetbrains.com/community/education/', desc: { en: 'All JetBrains IDEs free for students - IntelliJ, PyCharm, WebStorm', az: 'Bütün JetBrains IDE-lər tələbələr üçün pulsuz', de: 'Alle JetBrains-IDEs gratis für Studenten', ru: 'Все IDE JetBrains бесплатно для студентов' }, saving: '$249/yr', type: 'free', important: true },
        { name: 'Notion Free (Students)', url: 'https://www.notion.so/product/notion-for-education', desc: { en: 'Notion Plus plan free with .edu email', az: 'Notion Plus plan .edu email ilə pulsuz', de: 'Notion Plus Plan gratis mit .edu-E-Mail', ru: 'Notion Plus план бесплатно с .edu почтой' }, type: 'free' },
        { name: 'Spotify + Hulu Student: $5.99', url: 'https://www.spotify.com/student/', desc: { en: 'Spotify Premium + Hulu + Showtime for $5.99/month (students)', az: 'Spotify Premium + Hulu + Showtime aylıq $5.99 (tələbələr)', de: 'Spotify Premium + Hulu + Showtime für $5,99/Monat', ru: 'Spotify Premium + Hulu + Showtime за $5.99/мес' }, saving: '$5.99/mo', type: 'discount' },
      ]
    },
  ],

  entertainment: [
    {
      id: 'free-streaming',
      title: { en: '🎬 Free & Cheap Streaming', az: '🎬 Pulsuz & Ucuz Streaming', de: '🎬 Gratis & günstig Streamen', ru: '🎬 Бесплатный стриминг' },
      items: [
        { name: 'Tubi (100% FREE)', url: 'https://tubitv.com', desc: { en: 'Completely free streaming - thousands of movies & shows (ad-supported)', az: 'Tamamilə pulsuz streaming - minlərlə film & serial (reklam dəstəkli)', de: 'Komplett gratis streamen - Tausende Filme & Serien', ru: 'Полностью бесплатный стриминг - тысячи фильмов' }, type: 'free', important: true },
        { name: 'Pluto TV (FREE)', url: 'https://pluto.tv', desc: { en: 'Free live TV channels + on-demand movies', az: 'Pulsuz canlı TV kanalları + tələbə filmlər', de: 'Gratis Live-TV + On-Demand-Filme', ru: 'Бесплатное ТВ + фильмы по запросу' }, type: 'free', important: true },
        { name: 'Kanopy (FREE with library)', url: 'https://www.kanopy.com', desc: { en: 'Free with library card - indie films, documentaries, Criterion', az: 'Kitabxana kartı ilə pulsuz - müstəqil filmlər, sənədli', de: 'Gratis mit Bibliotheksausweis - Indie, Dokus, Criterion', ru: 'Бесплатно с читательским билетом - инди, документальные' }, type: 'free' },
        { name: 'YouTube Premium Family: €2.99', url: 'https://www.youtube.com/premium', desc: { en: 'Via Turkey/Argentina VPN trick - family plan €2.99 instead of €17.99', az: 'Türkiyə/Argentina VPN ilə - ailə planı €17.99 əvəzinə €2.99', de: 'Via Türkei-VPN - Familienplan 2,99€ statt 17,99€', ru: 'Через VPN Турции - семейный план €2.99 вместо €17.99' }, saving: '83% off', type: 'tip', important: true },
      ]
    },
  ],

  markets: [
    {
      id: 'free-trading',
      title: { en: '📊 Free Trading & Analysis', az: '📊 Pulsuz Ticarət & Analiz', de: '📊 Gratis Trading & Analyse', ru: '📊 Бесплатная торговля и аналитика' },
      items: [
        { name: 'TradingView Free', url: 'https://www.tradingview.com', desc: { en: 'Professional charts - 1 layout, 3 indicators free forever', az: 'Peşəkar qrafiklər - 1 layout, 3 indikator həmişə pulsuz', de: 'Profi-Charts - 1 Layout, 3 Indikatoren gratis', ru: 'Проф. графики - 1 макет, 3 индикатора бесплатно' }, type: 'free', important: true },
        { name: 'Trade Republic (€0 commission)', url: 'https://traderepublic.com', desc: { en: 'Commission-free stock & crypto trading in Germany', az: 'Almaniyada komisyasız səhm & kripto ticarəti', de: 'Provisionsfreier Aktien- & Kryptohandel in DE', ru: 'Торговля без комиссии в Германии' }, saving: '€0 fees', type: 'free', important: true },
        { name: 'Sparplan ab €1 (ETF free)', url: 'https://www.justetf.com/de/etf-sparplan/', desc: { en: 'Free ETF savings plans from €1/month - compound interest!', az: 'Aylıq €1-dən pulsuz ETF yığım planları - mürəkkəb faiz!', de: 'Kostenlose ETF-Sparpläne ab 1€/Monat - Zinseszins!', ru: 'Бесплатные ETF планы от €1/мес - сложный процент!' }, saving: '€0 fees', type: 'free', important: true },
        { name: 'CoinGecko / CoinMarketCap', url: 'https://www.coingecko.com', desc: { en: 'Free crypto portfolio tracking, alerts, research', az: 'Pulsuz kripto portfel izləmə, xəbərdarlıqlar', de: 'Gratis Krypto-Portfolio-Tracking, Alerts, Research', ru: 'Бесплатное отслеживание крипто-портфеля' }, type: 'free' },
      ]
    },
  ],

  education: [
    {
      id: 'free-courses',
      title: { en: '🎓 Free Certificates & Courses', az: '🎓 Pulsuz Sertifikatlar & Kurslar', de: '🎓 Gratis Zertifikate & Kurse', ru: '🎓 Бесплатные сертификаты и курсы' },
      items: [
        { name: 'Google Career Certificates', url: 'https://grow.google/certificates/', desc: { en: 'Free Google certificates in Data, IT, UX, Marketing (7 days trial)', az: 'Data, IT, UX, Marketinq üzrə pulsuz Google sertifikatları', de: 'Gratis Google-Zertifikate: Data, IT, UX, Marketing', ru: 'Бесплатные сертификаты Google: Data, IT, UX, Marketing' }, type: 'free', important: true },
        { name: 'freeCodeCamp (100% FREE)', url: 'https://www.freecodecamp.org', desc: { en: 'Full-stack web dev curriculum - 3000+ hours of free content', az: 'Full-stack web dev kurikulumu - 3000+ saat pulsuz məzmun', de: 'Full-Stack-Web-Kurs - 3000+ Stunden gratis', ru: 'Full-stack курс - 3000+ часов бесплатно' }, type: 'free', important: true },
        { name: 'CS50 Harvard (FREE)', url: 'https://cs50.harvard.edu', desc: { en: "Harvard's CS50 - world's best intro to CS, free certificate", az: 'Harvardın CS50 - dünyanın ən yaxşı CS girişi, pulsuz sertifikat', de: 'Harvards CS50 - weltbester CS-Einstieg, gratis Zertifikat', ru: 'CS50 Гарварда - лучшее введение в CS, бесплатный серт.' }, type: 'free', important: true },
        { name: 'Coursera Financial Aid (FREE)', url: 'https://www.coursera.org/financial-aid', desc: { en: 'Apply for financial aid → get any course FREE with certificate', az: 'Maliyyə yardımına müraciət et → istənilən kursu sertifikatla PULSUZ al', de: 'Finanzielle Hilfe beantragen → jeden Kurs GRATIS', ru: 'Подать на фин. помощь → любой курс БЕСПЛАТНО' }, type: 'free', important: true },
        { name: 'AWS/Azure/GCP Free Tier', url: 'https://aws.amazon.com/free/', desc: { en: 'Cloud platforms - 12 months free tier + always-free services', az: 'Bulud platformaları - 12 ay pulsuz + həmişə pulsuz xidmətlər', de: 'Cloud-Plattformen - 12 Monate gratis + immer-kostenlose Dienste', ru: 'Облачные платформы - 12 мес бесплатно' }, type: 'free' },
      ]
    },
  ],

  women: [
    {
      id: 'beauty-savings',
      title: { en: '💄 Beauty & Skincare Savings', az: '💄 Gözəllik & Dəriyə Qənaət', de: '💄 Beauty & Hautpflege sparen', ru: '💄 Экономия на красоте' },
      items: [
        { name: 'The Ordinary (from €4)', url: 'https://theordinary.com', desc: { en: 'Lab-quality skincare from €4 - same ingredients as luxury brands', az: 'Laboratoriya keyfiyyətli dəri baxımı €4-dən - lüks brendlərlə eyni inqredientlər', de: 'Labor-Qualität ab 4€ - gleiche Wirkstoffe wie Luxusmarken', ru: 'Лабораторная косметика от €4 - те же ингредиенты что и люкс' }, saving: 'from €4', type: 'discount', important: true },
        { name: 'Rossmann/dm 10% Coupons', url: 'https://www.rossmann.de/de/coupons', desc: { en: 'Regular 10% off coupons via app - stack with sales', az: 'Tətbiq vasitəsilə müntəzəm 10% endirim kuponları', de: 'Regelmäßig 10% Rabatt-Coupons via App - mit Sales kombinierbar', ru: 'Регулярные купоны -10% через приложение' }, saving: '10% off', type: 'discount', important: true },
        { name: 'Parfumdreams (70% off)', url: 'https://www.parfumdreams.de', desc: { en: 'Discounted original perfumes - up to 70% off retail', az: 'Endirimli orijinal ətirlər - pərakəndə qiymətdən 70%-ə qədər ucuz', de: 'Original-Parfüms bis 70% günstiger als im Laden', ru: 'Оригинальные духи - до 70% дешевле розницы' }, saving: '70% off', type: 'discount' },
        { name: 'iHerb (natural, cheap shipping)', url: 'https://www.iherb.com', desc: { en: 'Natural supplements & skincare - free shipping over €40', az: 'Təbii əlavələr & dəri baxımı - €40-dan yuxarı pulsuz çatdırılma', de: 'Natürliche Supplements & Pflege - Gratisversand ab 40€', ru: 'Натуральные добавки & уход - бесплатная доставка от €40' }, saving: 'Free ship 40€+', type: 'discount' },
        { name: 'Treatwell (Beauty-Deals)', url: 'https://www.treatwell.de', desc: { en: 'Book beauty treatments at 30-50% discount', az: 'Gözəllik prosedurlarını 30-50% endirimlə sifariş et', de: 'Beauty-Behandlungen mit 30-50% Rabatt buchen', ru: 'Бьюти-процедуры со скидкой 30-50%' }, saving: '30-50% off', type: 'discount' },
      ]
    },
    {
      id: 'health-wellness',
      title: { en: '🧘 Health & Wellness Free', az: '🧘 Sağlamlıq & Wellness Pulsuz', de: '🧘 Gesundheit & Wellness gratis', ru: '🧘 Здоровье бесплатно' },
      items: [
        { name: 'Nike Training Club (FREE)', url: 'https://www.nike.com/ntc-app', desc: { en: 'Hundreds of free workout videos - yoga, HIIT, strength', az: 'Yüzlərlə pulsuz məşq videosu - yoga, HIIT, güc', de: 'Hunderte kostenlose Workouts - Yoga, HIIT, Kraft', ru: 'Сотни бесплатных тренировок - йога, HIIT, сила' }, type: 'free', important: true },
        { name: 'Yazio Free (Calorie Counter)', url: 'https://www.yazio.com', desc: { en: 'Free calorie counter - German app, great food database', az: 'Pulsuz kalori sayğacı - Alman tətbiqi, geniş qida bazası', de: 'Kostenloser Kalorienzähler - große Lebensmittel-DB', ru: 'Бесплатный счётчик калорий - немецкое приложение' }, type: 'free' },
        { name: 'Krankenkasse Bonus (€150+/yr)', url: 'https://www.tk.de/techniker/leistungen-und-mitgliedschaft/praemien-und-bonusprogramme', desc: { en: 'Health insurance bonus programs - earn €150+/year for healthy habits', az: 'Tibbi sığorta bonus proqramları - sağlam vərdişlərə illik €150+ qazan', de: 'Bonusprogramm der Krankenkasse - 150€+/Jahr für gesundes Verhalten', ru: 'Бонус от страховки - €150+/год за здоровый образ жизни' }, saving: '€150+/yr', type: 'earn', important: true },
        { name: 'Präventionskurse (bis €150 erstattet)', url: 'https://www.zentrale-pruefstelle-praevention.de', desc: { en: 'Prevention courses refunded by insurance - yoga, Pilates, stress mgmt', az: 'Sığorta tərəfindən ödənilən profilaktika kursları - yoga, Pilates', de: 'Präventionskurse von Kasse erstattet - Yoga, Pilates, Stress', ru: 'Курсы профилактики - возмещает страховка' }, saving: '€150 back', type: 'subsidy', important: true },
      ]
    },
    {
      id: 'mom-benefits',
      title: { en: '🤰 Mom & Pregnancy Benefits', az: '🤰 Ana & Hamiləlik Müavinətləri', de: '🤰 Mutter- & Schwangerschafts-Vorteile', ru: '🤰 Пособия для мам' },
      items: [
        { name: 'Baby Welcome Boxes (FREE)', url: 'https://www.pampers.de/registrierung', desc: { en: 'Free baby boxes from Pampers, dm, Rossmann, Amazon - register now!', az: 'Pampers, dm, Rossmann, Amazon-dan pulsuz körpə qutuları - indi qeydiyyatdan keç!', de: 'Gratis Baby-Boxen von Pampers, dm, Rossmann, Amazon', ru: 'Бесплатные baby-боксы от Pampers, dm, Rossmann, Amazon' }, type: 'free', important: true },
        { name: 'Bundesstiftung Mutter & Kind', url: 'https://www.bundesstiftung-mutter-und-kind.de', desc: { en: 'Financial help for pregnant women in need - up to €1500', az: 'Ehtiyacı olan hamilə qadınlara maliyyə yardımı - €1500-ə qədər', de: 'Finanzielle Hilfe für Schwangere in Notlage - bis 1500€', ru: 'Финансовая помощь беременным в нужде - до €1500' }, saving: '€1500', type: 'subsidy', important: true },
        { name: 'Hebamme (kostenlos über Kasse)', url: 'https://www.gkv-spitzenverband.de', desc: { en: 'Midwife visits fully covered by insurance - pre & post birth', az: 'Mamaça ziyarətləri sığorta tərəfindən tam ödənilir', de: 'Hebammenbetreuung komplett von Kasse bezahlt', ru: 'Акушерка полностью оплачивается страховкой' }, saving: '€0 (covered)', type: 'free' },
      ]
    },
  ],

  chinese: [
    {
      id: 'cheap-chinese',
      title: { en: '🇨🇳 Best Deals from China', az: '🇨🇳 Çindən Ən Yaxşı Təkliflər', de: '🇨🇳 Beste China-Deals', ru: '🇨🇳 Лучшие предложения из Китая' },
      items: [
        { name: 'AliExpress Choice (free shipping)', url: 'https://www.aliexpress.com/p/choice/index.html', desc: { en: 'Curated products with FREE fast shipping (5-10 days to EU)', az: 'PULSUZ sürətli çatdırılma ilə seçilmiş məhsullar (AB-yə 5-10 gün)', de: 'Kuratierte Produkte mit GRATIS Schnellversand (5-10 Tage EU)', ru: 'Товары с БЕСПЛАТНОЙ быстрой доставкой (5-10 дней)' }, type: 'free', important: true },
        { name: 'Temu (90% off retail)', url: 'https://www.temu.com', desc: { en: 'Ultra-cheap everything - 90% cheaper than retail, free ship', az: 'Ultra ucuz hər şey - pərakəndədən 90% ucuz, pulsuz çatdırılma', de: 'Ultra-günstig alles - 90% unter Einzelhandel, Gratisversand', ru: 'Ультра-дёшево всё - на 90% дешевле, бесплатная доставка' }, saving: '90% off', type: 'discount', important: true },
        { name: 'New User Coupons (€15-30 off)', url: 'https://www.aliexpress.com', desc: { en: 'New account? Get €15-30 welcome coupon bundle on first purchase', az: 'Yeni hesab? İlk alışda €15-30 xoş gəldin kuponu paketi al', de: 'Neues Konto? 15-30€ Willkommens-Gutschein', ru: 'Новый аккаунт? Купоны €15-30 на первую покупку' }, saving: '€15-30', type: 'discount', important: true },
        { name: 'Banggood Flash Deals', url: 'https://www.banggood.com/marketing-Flash-Deals/tid-1218.html', desc: { en: 'Daily flash deals - electronics & gadgets 50-80% off', az: 'Gündəlik flash təkliflər - elektronika 50-80% endirim', de: 'Tägliche Flash-Deals - Elektronik 50-80% Rabatt', ru: 'Ежедневные акции - электроника 50-80% скидка' }, saving: '50-80% off', type: 'discount' },
        { name: '11.11 / Black Friday Sales', url: 'https://sale.aliexpress.com', desc: { en: 'Biggest sales: 11.11 (Nov), Black Friday - save 50-95%!', az: 'Ən böyük satışlar: 11.11 (Noyabr), Black Friday - 50-95% qənaət!', de: 'Größte Sales: 11.11 (Nov), Black Friday - 50-95% sparen!', ru: 'Главные распродажи: 11.11, Black Friday - 50-95%!' }, saving: '50-95% off', type: 'tip', important: true },
        { name: 'CSSBuy/Sugargoo (rep savings)', url: 'https://www.cssbuy.com', desc: { en: 'Shipping agents - combine parcels, save 40-60% on shipping', az: 'Göndərmə agentləri - bağlamaları birləşdir, göndərmədə 40-60% qənaət', de: 'Versandagenten - Pakete bündeln, 40-60% Versand sparen', ru: 'Агенты доставки - объединить посылки, -40-60% за доставку' }, saving: '40-60% ship', type: 'tip' },
      ]
    },
    {
      id: 'china-tech',
      title: { en: '📱 Cheap Tech from China', az: '📱 Çindən Ucuz Texnologiya', de: '📱 Günstige Technik aus China', ru: '📱 Дешёвая техника из Китая' },
      items: [
        { name: 'Xiaomi Official (EU warranty)', url: 'https://www.mi.com/de', desc: { en: 'Flagship quality at half price - EU warranty & support', az: 'Yarı qiymətə flaqman keyfiyyət - AB zəmanəti & dəstəyi', de: 'Flagship-Qualität zum halben Preis - EU-Garantie', ru: 'Флагманское качество за полцены - гарантия ЕС' }, saving: '50% vs Samsung', type: 'discount', important: true },
        { name: 'AliExpress Tech Week', url: 'https://www.aliexpress.com/category/44/consumer-electronics.html', desc: { en: 'Weekly tech deals - phones, tablets, earbuds from $15', az: 'Həftəlik texno təkliflər - telefonlar, planşetlər, qulaqlıqlar $15-dən', de: 'Wöchentliche Tech-Deals - Phones, Tablets, Earbuds ab $15', ru: 'Еженедельные техно-скидки - от $15' }, saving: 'from $15', type: 'discount' },
        { name: 'Nothing Phone (€299)', url: 'https://nothing.tech', desc: { en: 'Premium design phone from €299 - Glyph lights, stock Android', az: 'Premium dizayn telefon €299-dan - Glyph işıqlar, stock Android', de: 'Premium-Design-Phone ab 299€ - Glyph-Lights, Stock-Android', ru: 'Премиум дизайн телефон от €299 - Glyph, чистый Android' }, saving: '€299', type: 'discount' },
      ]
    },
  ],

  platforms: [
    {
      id: 'platform-deals',
      title: { en: '🛒 German Platform Deals', az: '🛒 Alman Platform Endirimləri', de: '🛒 Deutsche Plattform-Deals', ru: '🛒 Скидки немецких платформ' },
      items: [
        { name: 'Amazon Warehouse (30% off)', url: 'https://www.amazon.de/Amazon-Warehouse/b?node=18726498031', desc: { en: 'Open-box/returned items 20-40% cheaper - Amazon quality checked', az: 'Açılmış/qaytarılmış məhsullar 20-40% ucuz - Amazon keyfiyyət yoxlanılmış', de: 'Geöffnete/retournierte Ware 20-40% günstiger - Amazon geprüft', ru: 'Вскрытые/возвращённые товары -20-40% - проверено Amazon' }, saving: '20-40% off', type: 'discount', important: true },
        { name: 'mydealz.de (Community Deals)', url: 'https://www.mydealz.de', desc: { en: 'Community-curated best deals in Germany - live updated', az: 'Almaniyada icma tərəfindən seçilmiş ən yaxşı təkliflər', de: 'Community-kuratierte Deals in Deutschland - live aktualisiert', ru: 'Лучшие акции Германии от сообщества - live' }, type: 'free', important: true },
        { name: 'idealo Preisalarm', url: 'https://www.idealo.de', desc: { en: 'Price comparison + alerts when price drops - never overpay', az: 'Qiymət müqayisəsi + qiymət düşəndə xəbərdarlıq - əlavə ödəmə', de: 'Preisvergleich + Alarm bei Preisfall - nie zu viel zahlen', ru: 'Сравнение цен + уведомление при снижении' }, type: 'free', important: true },
        { name: 'Payback Points (free money)', url: 'https://www.payback.de', desc: { en: 'Collect points at dm, Rewe, Aral, real → redeem for cash/vouchers', az: 'dm, Rewe, Aral-da xal topla → nağd/kupon ilə dəyiş', de: 'Punkte bei dm, Rewe, Aral sammeln → einlösen', ru: 'Копить баллы в dm, Rewe, Aral → обменять на деньги' }, saving: '€50-100/yr', type: 'earn', important: true },
        { name: 'Deutschland Card', url: 'https://www.deutschlandcard.de', desc: { en: 'Loyalty points at Edeka, Netto, Esso → cashback', az: 'Edeka, Netto, Esso-da loyallıq xalları → cashback', de: 'Treuepunkte bei Edeka, Netto, Esso → Cashback', ru: 'Баллы лояльности в Edeka, Netto, Esso → кэшбэк' }, saving: '€30-80/yr', type: 'earn' },
        { name: 'Kleinanzeigen (Free stuff)', url: 'https://www.kleinanzeigen.de/s-zu-verschenken/k0', desc: { en: '"Zu verschenken" section - free furniture, electronics, clothes', az: '"Zu verschenken" bölməsi - pulsuz mebel, elektronika, paltar', de: '"Zu verschenken" - kostenlose Möbel, Elektronik, Kleidung', ru: 'Раздел "Отдам даром" - мебель, электроника, одежда' }, saving: '€0', type: 'free' },
      ]
    },
    {
      id: 'cashback',
      title: { en: '💸 Cashback & Vouchers', az: '💸 Cashback & Kuponlar', de: '💸 Cashback & Gutscheine', ru: '💸 Кэшбэк и купоны' },
      items: [
        { name: 'TopCashback DE', url: 'https://www.topcashback.de', desc: { en: 'Highest cashback rates in Germany - up to 15% back', az: 'Almaniyada ən yüksək cashback dərəcələri - 15%-ə qədər geri', de: 'Höchste Cashback-Raten in DE - bis 15% zurück', ru: 'Максимальный кэшбэк в Германии - до 15% назад' }, saving: 'up to 15%', type: 'earn', important: true },
        { name: 'Shoop.de', url: 'https://www.shoop.de', desc: { en: 'German cashback portal - 2-10% back on 2000+ shops', az: 'Alman cashback portalı - 2000+ mağazada 2-10% geri', de: 'Deutsches Cashback-Portal - 2-10% bei 2000+ Shops', ru: 'Немецкий кэшбэк - 2-10% в 2000+ магазинах' }, saving: '2-10% back', type: 'earn', important: true },
        { name: 'Gutscheinsammler', url: 'https://www.gutscheinsammler.de', desc: { en: 'All valid German voucher codes in one place', az: 'Bütün etibarlı Alman kupon kodları bir yerdə', de: 'Alle gültigen Gutscheincodes auf einem Blick', ru: 'Все действующие немецкие промокоды' }, type: 'free' },
        { name: 'Honey Browser Extension', url: 'https://www.joinhoney.com', desc: { en: 'Auto-applies best coupon at checkout - works on 30K+ sites', az: 'Ödəmədə avtomatik ən yaxşı kuponu tətbiq edir - 30K+ saytda işləyir', de: 'Wendet automatisch besten Gutschein an - 30K+ Shops', ru: 'Авто-применяет лучший купон - работает на 30K+ сайтах' }, type: 'free', important: true },
      ]
    },
  ],

  shopping: [
    {
      id: 'shopping-hacks',
      title: { en: '🛍️ Shopping Hacks', az: '🛍️ Alış-veriş Hiylələri', de: '🛍️ Shopping-Tricks', ru: '🛍️ Лайфхаки для покупок' },
      items: [
        { name: 'CamelCamelCamel (Amazon)', url: 'https://camelcamelcamel.com', desc: { en: 'Amazon price history - see if deal is real or fake', az: 'Amazon qiymət tarixi - təklifin real və ya saxta olduğunu gör', de: 'Amazon-Preisverlauf - echte oder falsche Deals erkennen', ru: 'История цен Amazon - настоящая ли скидка?' }, type: 'free', important: true },
        { name: 'Keepa (Price Tracker)', url: 'https://keepa.com', desc: { en: 'Amazon price drop alerts - never miss a deal', az: 'Amazon qiymət düşüşü xəbərdarlıqları - heç bir təklifi qaçırma', de: 'Amazon-Preisfall-Alerts - kein Deal verpassen', ru: 'Уведомления о снижении цен Amazon' }, type: 'free', important: true },
        { name: 'Amazon Renewed (refurbished)', url: 'https://www.amazon.de/Amazon-Renewed/b?node=17299808031', desc: { en: 'Certified refurbished electronics 20-50% off + warranty', az: 'Sertifikatlı yenilənmiş elektronika 20-50% ucuz + zəmanət', de: 'Zertifiziert erneuerte Elektronik 20-50% günstiger + Garantie', ru: 'Восстановленная электроника -20-50% + гарантия' }, saving: '20-50% off', type: 'discount' },
        { name: 'Prisjakt / Geizhals', url: 'https://geizhals.de', desc: { en: 'Tech price comparison - find lowest price across all shops', az: 'Texno qiymət müqayisəsi - bütün mağazalarda ən aşağı qiyməti tap', de: 'Technik-Preisvergleich - günstigsten Preis finden', ru: 'Сравнение цен техники - самая низкая цена' }, type: 'free' },
        { name: 'Vinted (Second-hand fashion)', url: 'https://www.vinted.de', desc: { en: 'Buy/sell second-hand clothes - 50-90% off retail, no seller fees', az: 'İkinci əl paltar al/sat - pərakəndədən 50-90% ucuz, satıcı rüsumu yox', de: 'Second-Hand Mode kaufen/verkaufen - 50-90% günstiger', ru: 'Купить/продать б/у одежду - на 50-90% дешевле' }, saving: '50-90% off', type: 'discount', important: true },
      ]
    },
  ],

  viral: [
    {
      id: 'earn-content',
      title: { en: '💰 Earn from Viral Content', az: '💰 Viral Məzmundan Pul Qazan', de: '💰 Mit viralen Inhalten verdienen', ru: '💰 Заработай на вирусном контенте' },
      items: [
        { name: 'YouTube Shorts Fund', url: 'https://support.google.com/youtube/answer/10923658', desc: { en: 'Earn $100-10,000/month from YouTube Shorts views', az: 'YouTube Shorts baxışlarından aylıq $100-10,000 qazan', de: 'Mit YouTube Shorts Views $100-10.000/Monat verdienen', ru: 'Заработай $100-10,000/мес с YouTube Shorts' }, saving: '$100-10K/mo', type: 'earn', important: true },
        { name: 'TikTok Creator Fund', url: 'https://www.tiktok.com/creators/creator-portal/', desc: { en: 'Monetize TikTok - 10K+ followers = $0.02-0.04 per 1K views', az: 'TikTok-u monetizasiya et - 10K+ izləyici = 1K baxışa $0.02-0.04', de: 'TikTok monetarisieren - 10K+ Follower = $0.02-0.04 pro 1K Views', ru: 'Монетизация TikTok - 10K+ подписчиков' }, saving: '$0.02-0.04/1K', type: 'earn', important: true },
        { name: 'Instagram Reels Bonus', url: 'https://help.instagram.com/386810562498740', desc: { en: 'Earn from Reels plays - invite-only but growing', az: 'Reels oynatmalarından qazan - yalnız dəvətlə amma böyüyür', de: 'Mit Reels-Plays verdienen - auf Einladung, aber wachsend', ru: 'Заработок с Reels - по приглашению, растёт' }, type: 'earn' },
        { name: 'Canva Free (Design tool)', url: 'https://www.canva.com', desc: { en: 'Create viral thumbnails & posts for free - no design skills needed', az: 'Pulsuz viral thumbnail & postlar yarat - dizayn bacarığı lazım deyil', de: 'Virale Thumbnails & Posts gratis erstellen - ohne Designkenntnisse', ru: 'Создавай вирусные обложки бесплатно - без навыков' }, type: 'free', important: true },
        { name: 'CapCut (FREE Video Editor)', url: 'https://www.capcut.com', desc: { en: 'Professional video editing free - TikTok/Reels/Shorts optimized', az: 'Peşəkar video montaj pulsuz - TikTok/Reels/Shorts üçün optimize', de: 'Profi-Videoschnitt gratis - für TikTok/Reels/Shorts optimiert', ru: 'Проф. монтаж бесплатно - для TikTok/Reels/Shorts' }, type: 'free', important: true },
      ]
    },
  ],
}

// ═══════════════════════════════════════════
// BENEFITS WIDGET COMPONENT
// ═══════════════════════════════════════════

export default function BenefitsWidget({ section }: { section: string }) {
  const { lang } = useLang()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const benefitsSections = BENEFITS_DATA[section]
  if (!benefitsSections || benefitsSections.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Benefits header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
          <Star className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-amber-300">
            {lang === 'az' ? 'Faydalar & Qənaətlər' : lang === 'ru' ? 'Выгода и экономия' : lang === 'de' ? 'Vorteile & Sparen' : 'Benefits & Savings'}
          </h2>
          <p className="text-[10px] text-amber-300/50">
            {lang === 'az' ? 'Pulsuz resurslar, endirimlər, dövlət yardımları' : lang === 'ru' ? 'Бесплатное, скидки, субсидии' : lang === 'de' ? 'Gratis, Rabatte, Förderungen' : 'Free resources, discounts, subsidies'}
          </p>
        </div>
      </div>

      {benefitsSections.map(sec => {
        const isExpanded = expandedSection === sec.id
        const displayItems = isExpanded ? sec.items : sec.items.slice(0, 4)

        return (
          <div key={sec.id} className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] overflow-hidden">
            <h3 className="text-sm font-semibold text-white px-4 pt-3 pb-2">
              {sec.title[lang as keyof typeof sec.title] || sec.title.en}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-3 pb-3">
              {displayItems.map((item, i) => {
                const config = typeConfig[item.type]
                const TypeIcon = config.icon
                return (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block p-3 rounded-lg border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                      item.important
                        ? 'border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-400/40'
                        : 'border-white/[0.04] bg-white/[0.01] hover:border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">{item.name}</h4>
                      <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-amber-400 transition shrink-0 mt-0.5" />
                    </div>
                    <p className="text-[10px] text-[#8b8b9e] mb-2 line-clamp-2">{item.desc[lang as keyof typeof item.desc] || item.desc.en}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${config.color}`}>
                        <TypeIcon className="w-2.5 h-2.5" />
                        {config.label}
                      </span>
                      {item.saving && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-300">
                          {item.saving}
                        </span>
                      )}
                      {item.important && <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                    </div>
                  </a>
                )
              })}
            </div>

            {sec.items.length > 4 && (
              <button
                onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                className="w-full py-2 text-[11px] font-medium text-amber-400 hover:bg-amber-500/5 border-t border-amber-500/10 transition-colors"
              >
                {isExpanded ? '▲' : `▼ ${sec.items.length - 4} more`}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
