'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { ExternalLink, Landmark, Home, GraduationCap, Briefcase, CalendarClock, Globe2, Wrench, FileText, Baby, Scale, Heart, Car, Banknote } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Life in Germany 🇩🇪', az: 'Almaniyada Həyat 🇩🇪', ru: 'Жизнь в Германии 🇩🇪', de: 'Leben in Deutschland 🇩🇪', tr: 'Almanya\u2019da Ya\u015fam 🇩🇪' },
  subtitle: { en: 'Government, housing, education, work & more', az: 'Dövlət, mənzil, təhsil, iş və daha çox', ru: 'Государство, жильё, образование, работа', de: 'Behörden, Wohnung, Bildung, Arbeit & mehr', tr: 'Devlet, konut, e\u011fitim, i\u015f ve daha fazlas\u0131' },
}

const tabs = [
  { id: 'behoerden', label: { en: 'Government', az: 'Dövlət', de: 'Beh\u00f6rden', ru: 'Гос. органы', tr: 'Devlet' }, icon: Landmark },
  { id: 'wohnung', label: { en: 'Housing', az: 'Mənzil', de: 'Wohnung', ru: 'Жильё', tr: 'Konut' }, icon: Home },
  { id: 'bildung', label: { en: 'Education', az: 'Təhsil', de: 'Bildung', ru: 'Образование', tr: 'E\u011fitim' }, icon: GraduationCap },
  { id: 'arbeit', label: { en: 'Work', az: 'İş', de: 'Arbeit', ru: 'Работа', tr: '\u0130\u015f' }, icon: Briefcase },
  { id: 'aenderungen', label: { en: 'Changes 2025', az: 'Dəyişikliklər 2025', de: '\u00c4nderungen 2025', ru: 'Изменения 2025', tr: 'De\u011fi\u015fiklikler 2025' }, icon: CalendarClock },
  { id: 'tools', label: { en: 'Tools', az: 'Alətlər', de: 'Tools', ru: 'Инструменты', tr: 'Ara\u00e7lar' }, icon: Wrench },
]

interface GermanyItem {
  name: string
  tab: string
  url: string
  desc: Record<string, string>
  type: 'gov' | 'portal' | 'tool' | 'news' | 'app'
  important?: boolean
  free?: boolean
}

const items: GermanyItem[] = [
  // Behörden (Government)
  { name: 'Ausländerbehörde (ABH)', tab: 'behoerden', url: 'https://service.berlin.de/dienstleistung/121864/', desc: { en: 'Immigration office - residence permits, visa extensions', az: 'Miqrasiya idarəsi - yaşayış icazəsi, viza uzadılması', de: 'Aufenthaltstitel, Visaverlängerung', ru: 'Иммиграционная служба - ВНЖ, продление визы' }, type: 'gov', important: true },
  { name: 'Bürgeramt (Anmeldung)', tab: 'behoerden', url: 'https://service.berlin.de/dienstleistung/120686/', desc: { en: 'City registration office - mandatory address registration', az: 'Şəhər qeydiyyat idarəsi - məcburi ünvan qeydiyyatı', de: 'Wohnsitzanmeldung - Pflicht bei Umzug', ru: 'Регистрация по месту жительства (Anmeldung)' }, type: 'gov', important: true },
  { name: 'Finanzamt', tab: 'behoerden', url: 'https://www.elster.de', desc: { en: 'Tax office - tax returns, tax ID, Steuerklasse', az: 'Vergi idarəsi - bəyannamə, vergi ID, Steuerklasse', de: 'Steuererklärung, Steuer-ID, Steuerklasse', ru: 'Налоговая - декларация, ИНН, налоговый класс' }, type: 'gov', important: true },
  { name: 'Jobcenter / Arbeitsagentur', tab: 'behoerden', url: 'https://www.arbeitsagentur.de', desc: { en: 'Employment agency - Bürgergeld, job placement, ALG', az: 'Məşğulluq agentliyi - Bürgergeld, iş yerləşdirmə', de: 'Bürgergeld, Arbeitsvermittlung, ALG I/II', ru: 'Центр занятости - Bürgergeld, трудоустройство' }, type: 'gov', important: true },
  { name: 'Kindergeldkasse (Familienkasse)', tab: 'behoerden', url: 'https://www.arbeitsagentur.de/familie-und-kinder/kindergeld', desc: { en: 'Child benefits office - €250/month per child', az: 'Uşaq müavinəti - hər uşağa aylıq €250', de: 'Kindergeld - 250€/Monat pro Kind', ru: 'Детское пособие - €250/мес на ребёнка' }, type: 'gov', important: true },
  { name: 'Elterngeld (ZBFS/L-Bank)', tab: 'behoerden', url: 'https://familienportal.de/familienportal/familienleistungen/elterngeld', desc: { en: 'Parental leave pay - 65-67% of salary, 12-14 months', az: 'Valideyn məzuniyyəti - maaşın 65-67%, 12-14 ay', de: 'Elterngeld - 65-67% des Gehalts, 12-14 Monate', ru: 'Родительское пособие - 65-67% от зарплаты' }, type: 'gov' },
  { name: 'BAföG-Amt', tab: 'behoerden', url: 'https://www.bafög.de', desc: { en: 'Student financial aid - up to €934/month', az: 'Tələbə maliyyə yardımı - aylıq €934-ə qədər', de: 'Studienfinanzierung - bis 934€/Monat', ru: 'Стипендия студентам - до €934/мес' }, type: 'gov' },
  { name: 'Standesamt', tab: 'behoerden', url: 'https://service.berlin.de/standesamt/', desc: { en: 'Civil registry - marriage, birth certificates, name changes', az: 'VVAQ - nikah, doğum şəhadətnaməsi, ad dəyişikliyi', de: 'Eheschließung, Geburtsurkunde, Namensänderung', ru: 'ЗАГС - брак, свидетельство о рождении' }, type: 'gov' },
  { name: 'KFZ-Zulassungsstelle', tab: 'behoerden', url: 'https://service.berlin.de/dienstleistung/121598/', desc: { en: 'Vehicle registration office - car registration, plates', az: 'Nəqliyyat qeydiyyatı - maşın qeydiyyatı, nömrə', de: 'Fahrzeug-Zulassung, Kennzeichen, Ummeldung', ru: 'Регистрация авто, номерные знаки' }, type: 'gov' },

  // Wohnung (Housing)
  { name: 'ImmoScout24', tab: 'wohnung', url: 'https://immobilienscout24.de', desc: { en: 'Germany\u2019s #1 housing portal - rent & buy', az: 'Almaniyanın №1 mənzil portalı - kirayə & alış', de: 'Deutschlands Nr.1 Immobilienportal', ru: 'Портал №1 для поиска жилья в Германии' }, type: 'portal', important: true, free: true },
  { name: 'WG-Gesucht', tab: 'wohnung', url: 'https://wg-gesucht.de', desc: { en: 'Shared apartment listings (WG) - best for students', az: 'Paylaşımlı mənzil elanları (WG) - tələbələr üçün', de: 'WG-Zimmer & Wohnungen - ideal für Studenten', ru: 'Совместное жильё (WG) - лучшее для студентов' }, type: 'portal', important: true, free: true },
  { name: 'Immowelt', tab: 'wohnung', url: 'https://immowelt.de', desc: { en: 'Large housing marketplace - apartments & houses', az: 'Böyük mənzil bazarı - mənzillər & evlər', de: 'Großer Immobilienmarktplatz', ru: 'Крупный рынок недвижимости' }, type: 'portal', free: true },
  { name: 'eBay Kleinanzeigen', tab: 'wohnung', url: 'https://kleinanzeigen.de', desc: { en: 'Classifieds - apartments, furniture, everything', az: 'Elanlar - mənzillər, mebel, hər şey', de: 'Kleinanzeigen - Wohnungen, Möbel, alles', ru: 'Объявления - квартиры, мебель, всё' }, type: 'portal', important: true, free: true },
  { name: 'Studierendenwerk (Wohnheim)', tab: 'wohnung', url: 'https://studentenwerke.de/de/wohnen', desc: { en: 'Student dormitories - cheap, long waitlist', az: 'Tələbə yataqxanaları - ucuz, uzun növbə', de: 'Studentenwohnheime - günstig, lange Warteliste', ru: 'Студенческие общежития - дёшево, длинная очередь' }, type: 'portal', free: true },
  { name: 'Mieterschutzbund', tab: 'wohnung', url: 'https://mieterschutzbund.de', desc: { en: 'Tenant protection association - legal help for renters', az: 'Kirayəçi müdafiə birliyi - hüquqi yardım', de: 'Mieterschutzverein - Rechtsberatung für Mieter', ru: 'Союз защиты арендаторов - юр. помощь' }, type: 'tool' },

  // Bildung (Education)
  { name: 'Kita-Navigator', tab: 'bildung', url: 'https://kita-navigator.berlin.de', desc: { en: 'Kindergarten finder - search & apply for Kita spots', az: 'Uşaq bağçası axtarışı - Kita yerləri tap və müraciət et', de: 'Kita-Platz suchen & beantragen', ru: 'Поиск места в детском саду (Kita)' }, type: 'portal', important: true, free: true },
  { name: 'Schulfinder (Senatsverwaltung)', tab: 'bildung', url: 'https://www.berlin.de/sen/bildung/schule/berliner-schulen/schulverzeichnis/', desc: { en: 'School directory - find schools by district', az: 'Məktəb kataloqu - rayona görə məktəb tap', de: 'Schulverzeichnis - Schulen nach Bezirk finden', ru: 'Справочник школ - поиск по району' }, type: 'gov', free: true },
  { name: 'Volkshochschule (VHS)', tab: 'bildung', url: 'https://www.vhs.de', desc: { en: 'Adult education - German courses, integration courses', az: 'Böyüklər təhsili - Alman dili, inteqrasiya kursları', de: 'Deutschkurse, Integrationskurse, Weiterbildung', ru: 'Курсы немецкого, интеграционные курсы' }, type: 'portal', important: true, free: true },
  { name: 'BAMF Integrationskurse', tab: 'bildung', url: 'https://www.bamf.de/DE/Themen/Integration/ZuijuagewAndere/Integrationskurse/integrationskurse-node.html', desc: { en: 'Official integration courses - German A1-B1 + orientation', az: 'Rəsmi inteqrasiya kursları - Alman dili A1-B1', de: 'Offizielle Integrationskurse - Deutsch A1-B1', ru: 'Официальные интеграционные курсы - A1-B1' }, type: 'gov', important: true },
  { name: 'Anerkennung (anabin)', tab: 'bildung', url: 'https://anabin.kmk.org', desc: { en: 'Foreign diploma recognition - check your degree equivalence', az: 'Xarici diplom tanınması - dərəcə ekvivalentliyini yoxla', de: 'Anerkennung ausländischer Abschlüsse', ru: 'Признание иностранных дипломов' }, type: 'tool', important: true, free: true },
  { name: 'Studienkolleg', tab: 'bildung', url: 'https://www.studienkollegs.de', desc: { en: 'Foundation year for university admission', az: 'Universitetə qəbul üçün hazırlıq ili', de: 'Vorbereitungsjahr für die Uni-Zulassung', ru: 'Подготовительный год для поступления' }, type: 'portal', free: true },
  { name: 'DAAD', tab: 'bildung', url: 'https://www.daad.de', desc: { en: 'Scholarships & university info for internationals', az: 'Beynəlxalq tələbələr üçün təqaüdlər', de: 'Stipendien & Uni-Infos für Internationale', ru: 'Стипендии и информация для иностранцев' }, type: 'portal', important: true, free: true },

  // Arbeit (Work)
  { name: 'StepStone', tab: 'arbeit', url: 'https://stepstone.de', desc: { en: 'Premium job board - salary info, 70K+ listings', az: 'Premium iş portalı - maaş məlumatı, 70K+ elan', de: 'Premium-Jobbörse mit Gehaltsinfos', ru: 'Премиум вакансии - зарплаты, 70K+ объявлений' }, type: 'portal', important: true, free: true },
  { name: 'Indeed.de', tab: 'arbeit', url: 'https://indeed.de', desc: { en: 'Largest job aggregator in Germany', az: 'Almaniyanın ən böyük iş aqreqatoru', de: 'Größter Job-Aggregator in Deutschland', ru: 'Крупнейший агрегатор вакансий' }, type: 'portal', important: true, free: true },
  { name: 'LinkedIn', tab: 'arbeit', url: 'https://linkedin.com', desc: { en: 'Professional network - especially for skilled jobs', az: 'Peşəkar şəbəkə - xüsusilə ixtisaslı işlər üçün', de: 'Berufliches Netzwerk - besonders für Fachkräfte', ru: 'Профессиональная сеть - для квалифицированных' }, type: 'portal', important: true, free: true },
  { name: 'XING', tab: 'arbeit', url: 'https://xing.com', desc: { en: 'German professional network (DACH region)', az: 'Alman peşəkar şəbəkəsi (DACH regionu)', de: 'Deutsches Berufsnetzwerk (DACH)', ru: 'Немецкая проф. сеть (регион DACH)' }, type: 'portal', free: true },
  { name: 'Arbeitsagentur Jobbörse', tab: 'arbeit', url: 'https://jobboerse.arbeitsagentur.de', desc: { en: 'Official government job portal', az: 'Rəsmi dövlət iş portalı', de: 'Offizielle staatliche Jobbörse', ru: 'Официальный гос. портал вакансий' }, type: 'gov', free: true },
  { name: 'Gehalt.de', tab: 'arbeit', url: 'https://gehalt.de', desc: { en: 'Salary comparison tool - check your worth', az: 'Maaş müqayisə aləti - dəyərini yoxla', de: 'Gehaltsvergleich - was verdienst du?', ru: 'Сравнение зарплат - проверь свою стоимость' }, type: 'tool', free: true },
  { name: 'Make-it-in-Germany', tab: 'arbeit', url: 'https://make-it-in-germany.com', desc: { en: 'Official portal for skilled workers from abroad', az: 'Xaricdən gələn ixtisaslı işçilər üçün rəsmi portal', de: 'Offizielles Portal für Fachkräfte aus dem Ausland', ru: 'Официальный портал для специалистов из-за рубежа' }, type: 'gov', important: true, free: true },

  // Änderungen 2025 (Changes)
  { name: 'Bürgergeld Erhöhung 2025', tab: 'aenderungen', url: 'https://www.bmas.de/DE/Soziales/Buergergeld/buergergeld.html', desc: { en: 'Bürgergeld frozen at €563 in 2025 (no increase)', az: 'Bürgergeld 2025-də €563-də dondurulub (artım yoxdur)', de: 'Bürgergeld bleibt 2025 bei 563€ (keine Erhöhung)', ru: 'Bürgergeld заморожен на €563 в 2025 (без повышения)' }, type: 'news', important: true },
  { name: 'Mindestlohn 2025: €12.82', tab: 'aenderungen', url: 'https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html', desc: { en: 'Minimum wage increases to €12.82/hour (Jan 2025)', az: 'Minimum əmək haqqı €12.82/saat-a artır (Yanvar 2025)', de: 'Mindestlohn steigt auf 12,82€/Stunde (Jan 2025)', ru: 'Минимальная зарплата €12.82/час (Январь 2025)' }, type: 'news', important: true },
  { name: 'Grundfreibetrag Erhöhung', tab: 'aenderungen', url: 'https://www.bundesfinanzministerium.de', desc: { en: 'Tax-free allowance rises to €12,084 (was €11,604)', az: 'Vergidən azad məbləğ €12,084-ə artır', de: 'Grundfreibetrag steigt auf 12.084€', ru: 'Необлагаемый минимум вырос до €12,084' }, type: 'news', important: true },
  { name: 'Deutschlandticket: €58', tab: 'aenderungen', url: 'https://deutschlandticket.de', desc: { en: 'Monthly public transport pass now €58 (was €49)', az: 'Aylıq ictimai nəqliyyat bileti indi €58 (əvvəl €49)', de: 'Deutschlandticket kostet jetzt 58€ (vorher 49€)', ru: 'Проездной Deutschlandticket теперь €58 (было €49)' }, type: 'news', important: true },
  { name: 'CO2-Preis steigt', tab: 'aenderungen', url: 'https://www.umweltbundesamt.de/daten/klima/treibhausgas-emissionen', desc: { en: 'CO2 price rises to €55/ton - higher heating & fuel costs', az: 'CO2 qiyməti €55/ton-a artır - istilik və yanacaq bahalaşır', de: 'CO2-Preis steigt auf 55€/Tonne - Heizen & Tanken teurer', ru: 'Цена CO2 выросла до €55/тонну - отопление дороже' }, type: 'news' },
  { name: 'Neue Meldepflicht für Plattformen', tab: 'aenderungen', url: 'https://www.bzst.de/DE/Unternehmen/Intern_Informationsaustausch/DAC7/dac7_node.html', desc: { en: 'Online platforms must report sellers to tax office (DAC7)', az: 'Onlayn platformlar satıcıları vergi idarəsinə bildirməlidir', de: 'Plattformen melden Verkäufer ans Finanzamt (DAC7)', ru: 'Платформы обязаны сообщать о продавцах (DAC7)' }, type: 'news' },
  { name: 'Heizungsgesetz (GEG)', tab: 'aenderungen', url: 'https://www.bmwk.de/Redaktion/DE/Dossier/gebaeudeenergiegesetz.html', desc: { en: 'New heating law - 65% renewable energy for new heaters', az: 'Yeni istilik qanunu - yeni qızdırıcılar üçün 65% yenilenebilir enerji', de: 'Heizungsgesetz - 65% erneuerbare Energie bei Neubau', ru: 'Закон об отоплении - 65% возобновляемой энергии' }, type: 'news' },

  // Tools
  { name: 'ELSTER', tab: 'tools', url: 'https://elster.de', desc: { en: 'Online tax filing - mandatory for all taxpayers', az: 'Onlayn vergi bəyannaməsi - bütün vergi ödəyicilər üçün məcburi', de: 'Online-Steuererklärung - Pflicht für alle', ru: 'Онлайн подача налоговой - обязательно для всех' }, type: 'tool', important: true, free: true },
  { name: 'DeepL', tab: 'tools', url: 'https://deepl.com', desc: { en: 'Best German-English translator (AI-powered)', az: 'Ən yaxşı Alman-İngilis tərcüməçi (AI)', de: 'Bester Deutsch-Übersetzer (KI-basiert)', ru: 'Лучший переводчик немецкий-русский (ИИ)' }, type: 'tool', important: true, free: true },
  { name: 'Taxfix', tab: 'tools', url: 'https://taxfix.de', desc: { en: 'Easy tax return app - average €1,063 refund', az: 'Asan vergi bəyannaməsi app - orta €1,063 geri ödəmə', de: 'Einfache Steuererklärung - ø 1.063€ Erstattung', ru: 'Простая декларация - в среднем €1,063 возврат' }, type: 'app', important: true },
  { name: 'SCHUFA BonitätsCheck', tab: 'tools', url: 'https://schufa.de', desc: { en: 'Credit score check - needed for apartment applications', az: 'Kredit reytinqi yoxlaması - mənzil müraciətləri üçün lazım', de: 'Bonitätsauskunft - nötig für Wohnungsbewerbungen', ru: 'Кредитная история - нужно для аренды жилья' }, type: 'tool', important: true },
  { name: 'Wundertax', tab: 'tools', url: 'https://wundertax.de', desc: { en: 'Tax return in 30 minutes, English interface', az: 'Vergi bəyannaməsi 30 dəqiqədə, İngilis interfeysi', de: 'Steuererklärung in 30 Minuten, auch auf Englisch', ru: 'Налоговая за 30 минут, англ. интерфейс' }, type: 'app', free: true },
  { name: 'Check24', tab: 'tools', url: 'https://check24.de', desc: { en: 'Compare insurance, energy, internet, mobile plans', az: 'Sığorta, enerji, internet, mobil planları müqayisə et', de: 'Versicherungen, Strom, Internet vergleichen', ru: 'Сравнить страховки, энергию, интернет' }, type: 'tool', important: true, free: true },
  { name: 'Kontist / N26', tab: 'tools', url: 'https://n26.com', desc: { en: 'Digital bank accounts - no SCHUFA needed for N26', az: 'Rəqəmsal bank hesabları - N26 üçün SCHUFA lazım deyil', de: 'Digitale Bankkonten - kein SCHUFA nötig bei N26', ru: 'Цифровые банки - N26 без SCHUFA' }, type: 'tool', free: true },
  { name: 'Deutsche Post / DHL Tracking', tab: 'tools', url: 'https://www.dhl.de/de/privatkunden.html', desc: { en: 'Package tracking, Packstation, mail forwarding', az: 'Bağlama izləmə, Packstation, poçt yönləndirmə', de: 'Sendungsverfolgung, Packstation, Nachsendeauftrag', ru: 'Отслеживание посылок, Packstation' }, type: 'tool', free: true },
]

export default function GermanyWidget({ initialTab }: { initialTab?: string }) {
  const { lang } = useLang()
  const [activeTab, setActiveTab] = useState(initialTab || 'behoerden')
  const [expanded, setExpanded] = useState(false)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const filtered = items.filter(i => i.tab === activeTab)
  const display = expanded ? filtered : filtered.slice(0, 8)

  const typeColors: Record<string, string> = {
    gov: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    portal: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    tool: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    news: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    app: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
  }

  const typeLabels: Record<string, string> = { gov: 'GOV', portal: 'PORTAL', tool: 'TOOL', news: 'NEWS', app: 'APP' }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Landmark className="w-5 h-5 text-yellow-600" />
          {t('title')}
        </h2>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('subtitle')}</p>

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setExpanded(false) }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label[lang] || tab.label.en}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {display.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
            className={`group block p-3 rounded-lg border transition-all bg-white dark:bg-gray-800/50 ${item.important ? 'border-yellow-200 dark:border-yellow-800/50 hover:border-yellow-400 dark:hover:border-yellow-600' : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-700'} hover:shadow-md`}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm group-hover:text-yellow-700 dark:group-hover:text-yellow-400 leading-tight">{item.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang] || item.desc.en}</p>
            <div className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${typeColors[item.type]}`}>
                {typeLabels[item.type]}
              </span>
              {item.free && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">FREE</span>}
              {item.important && <span className="text-[10px]">\u2b50</span>}
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 8 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors">
          {expanded ? '\u25b2 Show less' : `\u25bc Show all (${filtered.length})`}
        </button>
      )}
    </div>
  )
}
