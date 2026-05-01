'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { ExternalLink, Landmark, Home, GraduationCap, Briefcase, CalendarClock, Wrench, Car, Users, HeartPulse, Umbrella, Scale, BookOpen } from 'lucide-react'
import SectionNews from './SectionNews'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Life in Germany 🇩🇪', az: 'Almaniyada Həyat 🇩🇪', ru: 'Жизнь в Германии 🇩🇪', de: 'Leben in Deutschland 🇩🇪', tr: "Almanya'da Yaşam 🇩🇪" },
  subtitle: { en: 'Government, housing, education, work, healthcare & more', az: 'Dövlət, mənzil, təhsil, iş, səhiyyə və daha çox', ru: 'Государство, жильё, образование, работа, медицина', de: 'Behörden, Wohnung, Bildung, Arbeit, Gesundheit & mehr', tr: 'Devlet, konut, eğitim, iş, sağlık ve daha fazlası' },
}

const tabs = [
  { id: 'behoerden', label: { en: 'Government', az: 'Dövlət', de: 'Behörden', ru: 'Гос. органы', tr: 'Devlet' }, icon: Landmark },
  { id: 'wohnung', label: { en: 'Housing', az: 'Mənzil', de: 'Wohnung', ru: 'Жильё', tr: 'Konut' }, icon: Home },
  { id: 'bildung', label: { en: 'Education', az: 'Təhsil', de: 'Bildung', ru: 'Образование', tr: 'Eğitim' }, icon: GraduationCap },
  { id: 'arbeit', label: { en: 'Work', az: 'İş', de: 'Arbeit', ru: 'Работа', tr: 'İş' }, icon: Briefcase },
  { id: 'aenderungen', label: { en: 'Changes 2025', az: 'Dəyişikliklər 2025', de: 'Änderungen 2025', ru: 'Изменения 2025', tr: 'Değişiklikler 2025' }, icon: CalendarClock },
  { id: 'tools', label: { en: 'Tools', az: 'Alətlər', de: 'Tools', ru: 'Инструменты', tr: 'Araçlar' }, icon: Wrench },
  { id: 'auto', label: { en: 'Auto & Traffic', az: 'Avtomobil & Trafik', de: 'Auto & Verkehr', ru: 'Авто и ПДД', tr: 'Oto & Trafik' }, icon: Car },
  { id: 'familie', label: { en: 'Family', az: 'Ailə', de: 'Familie', ru: 'Семья', tr: 'Aile' }, icon: Users },
  { id: 'miete', label: { en: 'Tenant & Landlord', az: 'Kirayəçi & Ev sahibi', de: 'Mieter & Vermieter', ru: 'Аренда', tr: 'Kiracı & Ev sahibi' }, icon: Home },
  { id: 'gesundheit', label: { en: 'Healthcare', az: 'Səhiyyə', de: 'Gesundheit', ru: 'Здоровье', tr: 'Sağlık' }, icon: HeartPulse },
  { id: 'versicherung', label: { en: 'Insurance', az: 'Sığorta', de: 'Versicherung', ru: 'Страхование', tr: 'Sigorta' }, icon: Umbrella },
  { id: 'rechte', label: { en: 'Your Rights', az: 'Hüquqlarınız', de: 'Ihre Rechte', ru: 'Ваши права', tr: 'Haklarınız' }, icon: Scale },
  { id: 'deutsch', label: { en: 'German Language', az: 'Alman dili', de: 'Deutsch lernen', ru: 'Немецкий язык', tr: 'Almanca' }, icon: BookOpen },
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
  { name: 'ImmoScout24', tab: 'wohnung', url: 'https://immobilienscout24.de', desc: { en: "Germany's #1 housing portal - rent & buy", az: 'Almaniyanın №1 mənzil portalı - kirayə & alış', de: 'Deutschlands Nr.1 Immobilienportal', ru: 'Портал №1 для поиска жилья в Германии' }, type: 'portal', important: true, free: true },
  { name: 'WG-Gesucht', tab: 'wohnung', url: 'https://wg-gesucht.de', desc: { en: 'Shared apartment listings (WG) - best for students', az: 'Paylaşımlı mənzil elanları (WG) - tələbələr üçün', de: 'WG-Zimmer & Wohnungen - ideal für Studenten', ru: 'Совместное жильё (WG) - лучшее для студентов' }, type: 'portal', important: true, free: true },
  { name: 'Immowelt', tab: 'wohnung', url: 'https://immowelt.de', desc: { en: 'Large housing marketplace - apartments & houses', az: 'Böyük mənzil bazarı - mənzillər & evlər', de: 'Großer Immobilienmarktplatz', ru: 'Крупный рынок недвижимости' }, type: 'portal', free: true },
  { name: 'eBay Kleinanzeigen', tab: 'wohnung', url: 'https://kleinanzeigen.de', desc: { en: 'Classifieds - apartments, furniture, everything', az: 'Elanlar - mənzillər, mebel, hər şey', de: 'Kleinanzeigen - Wohnungen, Möbel, alles', ru: 'Объявления - квартиры, мебель, всё' }, type: 'portal', important: true, free: true },
  { name: 'Mieterschutzbund', tab: 'wohnung', url: 'https://mieterschutzbund.de', desc: { en: 'Tenant protection association - legal help for renters', az: 'Kirayəçi müdafiə birliyi - hüquqi yardım', de: 'Mieterschutzverein - Rechtsberatung für Mieter', ru: 'Союз защиты арендаторов - юр. помощь' }, type: 'tool' },

  // Bildung (Education)
  { name: 'Volkshochschule (VHS)', tab: 'bildung', url: 'https://www.vhs.de', desc: { en: 'Adult education - German courses, integration courses', az: 'Böyüklər təhsili - Alman dili, inteqrasiya kursları', de: 'Deutschkurse, Integrationskurse, Weiterbildung', ru: 'Курсы немецкого, интеграционные курсы' }, type: 'portal', important: true, free: true },
  { name: 'BAMF Integrationskurse', tab: 'bildung', url: 'https://www.bamf.de/DE/Themen/Integration/ZuijuagewAndere/Integrationskurse/integrationskurse-node.html', desc: { en: 'Official integration courses - German A1-B1 + orientation', az: 'Rəsmi inteqrasiya kursları - Alman dili A1-B1', de: 'Offizielle Integrationskurse - Deutsch A1-B1', ru: 'Официальные интеграционные курсы - A1-B1' }, type: 'gov', important: true },
  { name: 'Anerkennung (anabin)', tab: 'bildung', url: 'https://anabin.kmk.org', desc: { en: 'Foreign diploma recognition - check your degree equivalence', az: 'Xarici diplom tanınması - dərəcə ekvivalentliyini yoxla', de: 'Anerkennung ausländischer Abschlüsse', ru: 'Признание иностранных дипломов' }, type: 'tool', important: true, free: true },
  { name: 'DAAD', tab: 'bildung', url: 'https://www.daad.de', desc: { en: 'Scholarships & university info for internationals', az: 'Beynəlxalq tələbələr üçün təqaüdlər', de: 'Stipendien & Uni-Infos für Internationale', ru: 'Стипендии и информация для иностранцев' }, type: 'portal', important: true, free: true },

  // Arbeit (Work)
  { name: 'StepStone', tab: 'arbeit', url: 'https://stepstone.de', desc: { en: 'Premium job board - salary info, 70K+ listings', az: 'Premium iş portalı - maaş məlumatı, 70K+ elan', de: 'Premium-Jobbörse mit Gehaltsinfos', ru: 'Премиум вакансии - зарплаты, 70K+ объявлений' }, type: 'portal', important: true, free: true },
  { name: 'Indeed.de', tab: 'arbeit', url: 'https://indeed.de', desc: { en: 'Largest job aggregator in Germany', az: 'Almaniyanın ən böyük iş aqreqatoru', de: 'Größter Job-Aggregator in Deutschland', ru: 'Крупнейший агрегатор вакансий' }, type: 'portal', important: true, free: true },
  { name: 'Make-it-in-Germany', tab: 'arbeit', url: 'https://make-it-in-germany.com', desc: { en: 'Official portal for skilled workers from abroad', az: 'Xaricdən gələn ixtisaslı işçilər üçün rəsmi portal', de: 'Offizielles Portal für Fachkräfte aus dem Ausland', ru: 'Официальный портал для специалистов из-за рубежа' }, type: 'gov', important: true, free: true },
  { name: 'Gehalt.de', tab: 'arbeit', url: 'https://gehalt.de', desc: { en: 'Salary comparison tool - check your worth', az: 'Maaş müqayisə aləti - dəyərini yoxla', de: 'Gehaltsvergleich - was verdienst du?', ru: 'Сравнение зарплат - проверь свою стоимость' }, type: 'tool', free: true },

  // Änderungen 2025 (Changes)
  { name: 'Mindestlohn 2025: €12.82', tab: 'aenderungen', url: 'https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/mindestlohn.html', desc: { en: 'Minimum wage increases to €12.82/hour (Jan 2025)', az: 'Minimum əmək haqqı €12.82/saat-a artır (Yanvar 2025)', de: 'Mindestlohn steigt auf 12,82€/Stunde', ru: 'Минимальная зарплата €12.82/час (Январь 2025)' }, type: 'news', important: true },
  { name: 'Deutschlandticket: €58', tab: 'aenderungen', url: 'https://deutschlandticket.de', desc: { en: 'Monthly public transport pass now €58 (was €49)', az: 'Aylıq ictimai nəqliyyat bileti indi €58 (əvvəl €49)', de: 'Deutschlandticket kostet jetzt 58€ (vorher 49€)', ru: 'Проездной Deutschlandticket теперь €58 (было €49)' }, type: 'news', important: true },
  { name: 'CO2-Preis steigt auf €55', tab: 'aenderungen', url: 'https://www.umweltbundesamt.de', desc: { en: 'CO2 price rises to €55/ton - higher heating & fuel costs', az: 'CO2 qiyməti €55/ton - istilik və yanacaq bahalaşır', de: 'CO2-Preis steigt auf 55€/Tonne', ru: 'Цена CO2 выросла до €55/тонну' }, type: 'news' },

  // Tools
  { name: 'ELSTER', tab: 'tools', url: 'https://elster.de', desc: { en: 'Online tax filing - mandatory for all taxpayers', az: 'Onlayn vergi bəyannaməsi - hamı üçün məcburi', de: 'Online-Steuererklärung - Pflicht für alle', ru: 'Онлайн подача налоговой - обязательно для всех' }, type: 'tool', important: true, free: true },
  { name: 'DeepL', tab: 'tools', url: 'https://deepl.com', desc: { en: 'Best German translator (AI-powered)', az: 'Ən yaxşı Alman tərcüməçi (AI)', de: 'Bester Übersetzer (KI-basiert)', ru: 'Лучший переводчик (ИИ)' }, type: 'tool', important: true, free: true },
  { name: 'Check24', tab: 'tools', url: 'https://check24.de', desc: { en: 'Compare insurance, energy, internet, mobile plans', az: 'Sığorta, enerji, internet planlarını müqayisə et', de: 'Versicherungen, Strom, Internet vergleichen', ru: 'Сравнить страховки, энергию, интернет' }, type: 'tool', important: true, free: true },
  { name: 'SCHUFA BonitätsCheck', tab: 'tools', url: 'https://schufa.de', desc: { en: 'Credit score check - needed for apartment applications', az: 'Kredit reytinqi - mənzil müraciətləri üçün lazım', de: 'Bonitätsauskunft - nötig für Wohnungsbewerbungen', ru: 'Кредитная история - нужно для аренды' }, type: 'tool', important: true },

  // Auto & Traffic (NEW)
  { name: 'ADAC', tab: 'auto', url: 'https://www.adac.de', desc: { en: 'Germany\'s largest auto club - roadside assistance, tips', az: 'Almaniyanın ən böyük avto klubu - yol yardımı', de: 'Größter Automobilclub - Pannenhilfe, Tipps', ru: 'Крупнейший автоклуб - помощь на дороге' }, type: 'portal', important: true },
  { name: 'Bußgeldkatalog', tab: 'auto', url: 'https://www.bussgeldkatalog.org', desc: { en: 'Traffic fines catalog - all penalties & points', az: 'Trafik cərimələri kataloqu - bütün cəzalar', de: 'Alle Bußgelder, Punkte und Fahrverbote', ru: 'Каталог штрафов - все пени и баллы' }, type: 'tool', important: true, free: true },
  { name: 'TÜV/Dekra Termine', tab: 'auto', url: 'https://www.tuev-sued.de/auto', desc: { en: 'Vehicle inspection (HU/AU) - book appointments', az: 'Texniki baxış (HU/AU) - randevu al', de: 'Hauptuntersuchung (HU/AU) - Termin buchen', ru: 'Техосмотр (HU/AU) - запись' }, type: 'tool', important: true },
  { name: 'Führerschein Theorie', tab: 'auto', url: 'https://www.fuehrerschein-bestehen.de', desc: { en: 'Driving theory practice - all questions free', az: 'Sürücülük nəzəriyyəsi - bütün suallar pulsuz', de: 'Theorieprüfung üben - alle Fragen kostenlos', ru: 'Теория вождения - все вопросы бесплатно' }, type: 'tool', free: true },
  { name: 'Umweltplakette / Umweltzone', tab: 'auto', url: 'https://www.umwelt-plakette.de', desc: { en: 'Environmental zones & green sticker info', az: 'Ətraf mühit zonaları & yaşıl stiker', de: 'Umweltzonen & grüne Plakette Infos', ru: 'Экологические зоны и зелёная наклейка' }, type: 'tool', free: true },
  { name: 'Verkehrsmeldungen', tab: 'auto', url: 'https://www.verkehrsinfo.de', desc: { en: 'Live traffic reports - jams, construction, diversions', az: 'Canlı trafik hesabatları - tıxac, tikinti', de: 'Staus, Baustellen, Umleitungen live', ru: 'Пробки, стройки, объезды в реальном времени' }, type: 'tool', free: true },
  { name: 'Wechselkennzeichen / H-Kennzeichen', tab: 'auto', url: 'https://www.kfz-steuer.wiki', desc: { en: 'Car tax calculator & special plate types', az: 'Avtomobil vergisi kalkulyatoru', de: 'KFZ-Steuer-Rechner & Sonderkennzeichen', ru: 'Калькулятор авто-налога и спец. номера' }, type: 'tool', free: true },

  // Familie (Family) (NEW)
  { name: 'Familienportal', tab: 'familie', url: 'https://familienportal.de', desc: { en: 'Official family benefits portal - Kindergeld, Elterngeld', az: 'Rəsmi ailə müavinətləri portalı - Kindergeld, Elterngeld', de: 'Kindergeld, Elterngeld, Kinderzuschlag', ru: 'Официальный портал семейных пособий' }, type: 'gov', important: true, free: true },
  { name: 'Kita-Navigator', tab: 'familie', url: 'https://kita-navigator.berlin.de', desc: { en: 'Kindergarten finder - search & apply for Kita', az: 'Uşaq bağçası axtarışı - Kita tap və müraciət et', de: 'Kita-Platz suchen & beantragen', ru: 'Поиск места в детском саду (Kita)' }, type: 'portal', important: true, free: true },
  { name: 'Kinderzuschlag', tab: 'familie', url: 'https://www.arbeitsagentur.de/familie-und-kinder/kinderzuschlag', desc: { en: 'Extra child supplement - up to €292/month per child', az: 'Əlavə uşaq əlavəsi - hər uşağa aylıq €292-ə qədər', de: 'Kinderzuschlag - bis 292€/Monat pro Kind', ru: 'Доплата на ребёнка - до €292/мес' }, type: 'gov', important: true },
  { name: 'Mutterschutz & Elternzeit', tab: 'familie', url: 'https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/mutterschutz', desc: { en: 'Maternity protection & parental leave rules', az: 'Analıq müdafiəsi və valideyn məzuniyyəti qaydaları', de: 'Mutterschutz & Elternzeit - Ihre Rechte', ru: 'Декретный отпуск и родительский отпуск' }, type: 'gov', important: true },
  { name: 'BabyClubs & Krabbelgruppen', tab: 'familie', url: 'https://www.familienhandbuch.de', desc: { en: 'Find baby groups, play dates, family events', az: 'Körpə qrupları, oyun görüşləri, ailə tədbirləri tap', de: 'Krabbelgruppen, Spieltreffs, Familienevents', ru: 'Группы для малышей, встречи, события' }, type: 'portal', free: true },
  { name: 'Schulanmeldung', tab: 'familie', url: 'https://www.berlin.de/sen/bildung/schule/berliner-schulen/schulverzeichnis/', desc: { en: 'School enrollment - find and register for schools', az: 'Məktəb qeydiyyatı - məktəb tap və qeydiyyatdan keç', de: 'Schulanmeldung - Schule finden und anmelden', ru: 'Запись в школу - найти и записаться' }, type: 'gov', free: true },

  // Miete (Tenant & Landlord) (NEW)
  { name: 'Mietspiegel', tab: 'miete', url: 'https://www.stadtentwicklung.berlin.de/wohnen/mietspiegel/', desc: { en: 'Official rent index - check if your rent is legal', az: 'Rəsmi kirayə indeksi - kirayəniz qanunidir?', de: 'Mietspiegel - ist Ihre Miete angemessen?', ru: 'Индекс аренды - законна ли ваша цена?' }, type: 'tool', important: true, free: true },
  { name: 'Mieterschutzbund', tab: 'miete', url: 'https://mieterschutzbund.de', desc: { en: 'Tenant protection - legal help against landlords', az: 'Kirayəçi müdafiəsi - ev sahiblərinə qarşı hüquqi yardım', de: 'Mieterschutz - Rechtsberatung gegen Vermieter', ru: 'Защита арендаторов - юр. помощь' }, type: 'tool', important: true },
  { name: 'Mietpreisbremse', tab: 'miete', url: 'https://www.bmj.de/DE/themen/gesellschaft_familie/mietrecht/mietpreisbremse.html', desc: { en: 'Rent cap law - your rights against excessive rent', az: 'Kirayə tavanı qanunu - həddindən artıq kirayəyə qarşı hüquqlarınız', de: 'Mietpreisbremse - Rechte bei überhöhter Miete', ru: 'Закон о потолке аренды - ваши права' }, type: 'gov', important: true },
  { name: 'Nebenkostenabrechnung Check', tab: 'miete', url: 'https://www.mineko.de', desc: { en: 'Utility bill checker - find overcharges', az: 'Kommunal xərc yoxlayıcısı - artıq ödənişləri tap', de: 'Nebenkostenabrechnung prüfen lassen', ru: 'Проверка коммунальных счетов' }, type: 'tool', free: true },
  { name: 'Wohnungsübergabeprotokoll', tab: 'miete', url: 'https://www.immobilienscout24.de/wissen/mieten/uebergabeprotokoll.html', desc: { en: 'Apartment handover protocol template', az: 'Mənzil təhvil-təslim protokolu şablonu', de: 'Vorlage Übergabeprotokoll bei Ein-/Auszug', ru: 'Шаблон акта приёма-передачи квартиры' }, type: 'tool', free: true },
  { name: 'Kaution Rückforderung', tab: 'miete', url: 'https://www.finanztip.de/mietkaution/', desc: { en: 'Get your deposit back - deadlines & rights', az: 'Depozitinizi geri alın - müddətlər və hüquqlar', de: 'Kaution zurückfordern - Fristen & Rechte', ru: 'Возврат залога - сроки и права' }, type: 'tool', free: true },

  // Gesundheit (Healthcare) (NEW)
  { name: 'AOK / TK / Barmer', tab: 'gesundheit', url: 'https://www.tk.de', desc: { en: 'Public health insurance companies - compare benefits', az: 'Dövlət tibbi sığorta şirkətləri - müqayisə et', de: 'Gesetzliche Krankenkassen - Leistungen vergleichen', ru: 'Гос. больничные кассы - сравнить' }, type: 'portal', important: true },
  { name: 'Doctolib', tab: 'gesundheit', url: 'https://www.doctolib.de', desc: { en: 'Book doctor appointments online - all specialties', az: 'Onlayn həkim randevusu - bütün ixtisaslar', de: 'Arzttermine online buchen - alle Fachrichtungen', ru: 'Запись к врачу онлайн - все специализации' }, type: 'portal', important: true, free: true },
  { name: 'Jameda', tab: 'gesundheit', url: 'https://www.jameda.de', desc: { en: 'Doctor reviews & ratings - find best doctors', az: 'Həkim rəyləri & reytinqləri - ən yaxşı həkimləri tap', de: 'Arztbewertungen - die besten Ärzte finden', ru: 'Отзывы о врачах - найти лучших' }, type: 'portal', free: true },
  { name: 'Apothekennotdienst', tab: 'gesundheit', url: 'https://www.apotheken.de/notdienst', desc: { en: '24h emergency pharmacy finder', az: '24 saat təcili aptek axtarıcısı', de: 'Notdienst-Apotheke finden - 24h', ru: 'Дежурная аптека - круглосуточно' }, type: 'tool', important: true, free: true },
  { name: 'Krankenkasse wechseln', tab: 'gesundheit', url: 'https://www.krankenkassen.de', desc: { en: 'Compare & switch health insurance - save money', az: 'Tibbi sığortanı müqayisə et & dəyiş - pula qənaət et', de: 'Krankenkasse vergleichen & wechseln', ru: 'Сравнить и сменить больничную кассу' }, type: 'tool', free: true },
  { name: 'ePA (Elektronische Patientenakte)', tab: 'gesundheit', url: 'https://www.bundesgesundheitsministerium.de/elektronische-patientenakte', desc: { en: 'Electronic health record - all your medical data', az: 'Elektron xəstə kartı - bütün tibbi məlumatlarınız', de: 'Elektronische Patientenakte - alle Gesundheitsdaten', ru: 'Электронная медкарта - все данные' }, type: 'gov', free: true },

  // Versicherung (Insurance) (NEW)
  { name: 'Check24 Versicherung', tab: 'versicherung', url: 'https://www.check24.de/versicherungen/', desc: { en: 'Compare all insurance types - best prices', az: 'Bütün sığorta növlərini müqayisə et - ən yaxşı qiymət', de: 'Alle Versicherungen vergleichen - beste Preise', ru: 'Сравнить все виды страховок' }, type: 'tool', important: true, free: true },
  { name: 'Haftpflichtversicherung', tab: 'versicherung', url: 'https://www.finanztip.de/haftpflichtversicherung/', desc: { en: 'Liability insurance - MUST HAVE in Germany (from €3/mo)', az: 'Məsuliyyət sığortası - Almaniyada MÜTLƏQDİR (€3/ay-dan)', de: 'Privathaftpflicht - PFLICHT (ab 3€/Monat)', ru: 'Страховка ответственности - ОБЯЗАТЕЛЬНО (от €3/мес)' }, type: 'tool', important: true },
  { name: 'Hausratversicherung', tab: 'versicherung', url: 'https://www.finanztip.de/hausratversicherung/', desc: { en: 'Home contents insurance - protects your belongings', az: 'Ev əşyaları sığortası - əşyalarınızı qoruyur', de: 'Hausratversicherung - schützt Ihr Hab und Gut', ru: 'Страхование имущества - защита вещей' }, type: 'tool' },
  { name: 'Berufsunfähigkeitsversicherung', tab: 'versicherung', url: 'https://www.finanztip.de/berufsunfaehigkeitsversicherung/', desc: { en: 'Disability insurance - protects your income', az: 'Əlillik sığortası - gəlirinizi qoruyur', de: 'BU-Versicherung - schützt Ihr Einkommen', ru: 'Страховка от нетрудоспособности' }, type: 'tool', important: true },
  { name: 'KFZ-Versicherung', tab: 'versicherung', url: 'https://www.check24.de/kfz-versicherung/', desc: { en: 'Car insurance comparison - mandatory for all drivers', az: 'Avtomobil sığortası müqayisəsi - sürücülər üçün məcburi', de: 'KFZ-Versicherung vergleichen - Pflicht für Fahrer', ru: 'Сравнение авто-страховок - обязательно' }, type: 'tool', important: true, free: true },
  { name: 'Riester / Rürup Rente', tab: 'versicherung', url: 'https://www.finanztip.de/riester/', desc: { en: 'Private pension plans - state-subsidized retirement', az: 'Özəl pensiya planları - dövlət subsidiyalı', de: 'Private Altersvorsorge - staatlich gefördert', ru: 'Частная пенсия - гос. субсидии' }, type: 'tool' },

  // Rechte (Your Rights) (NEW)
  { name: 'Verbraucherzentrale', tab: 'rechte', url: 'https://www.verbraucherzentrale.de', desc: { en: 'Consumer protection center - free legal advice', az: 'İstehlakçı müdafiə mərkəzi - pulsuz hüquqi məsləhət', de: 'Verbraucherschutz - kostenlose Rechtsberatung', ru: 'Защита потребителей - бесплатная консультация' }, type: 'gov', important: true, free: true },
  { name: 'Antidiskriminierungsstelle', tab: 'rechte', url: 'https://www.antidiskriminierungsstelle.de', desc: { en: 'Anti-discrimination office - report discrimination', az: 'Ayrı-seçkiliyə qarşı ofis - ayrı-seçkiliyi bildir', de: 'Diskriminierung melden - Ihre Rechte', ru: 'Анти-дискриминация - сообщить о нарушении' }, type: 'gov', important: true, free: true },
  { name: 'Arbeitsrecht (Kündigung)', tab: 'rechte', url: 'https://www.arbeitsrechte.de', desc: { en: 'Employment law - dismissal protection, rights', az: 'Əmək hüququ - işdən çıxarılma müdafiəsi, hüquqlar', de: 'Kündigungsschutz, Abmahnung, Rechte', ru: 'Трудовое право - защита от увольнения' }, type: 'tool', important: true, free: true },
  { name: 'Mietrecht (Ihre Rechte)', tab: 'rechte', url: 'https://www.mietrecht.com', desc: { en: 'Tenant rights - rent increases, repairs, eviction', az: 'Kirayəçi hüquqları - kirayə artımı, təmir, çıxarılma', de: 'Mieterhöhung, Mängel, Kündigung - Ihre Rechte', ru: 'Права арендатора - повышение, ремонт' }, type: 'tool', free: true },
  { name: 'Aufenthaltsrecht', tab: 'rechte', url: 'https://www.gesetze-im-internet.de/aufenthg_2004/', desc: { en: 'Residence law - your rights as a foreigner', az: 'Yaşayış hüququ - əcnəbi kimi hüquqlarınız', de: 'Aufenthaltsgesetz - Rechte als Ausländer', ru: 'Закон о пребывании - права иностранцев' }, type: 'gov', free: true },
  { name: 'Rechtsschutzversicherung', tab: 'rechte', url: 'https://www.check24.de/rechtsschutzversicherung/', desc: { en: 'Legal protection insurance - covers lawyer costs', az: 'Hüquqi müdafiə sığortası - vəkil xərclərini ödəyir', de: 'Rechtsschutz - deckt Anwaltskosten', ru: 'Страхование правовой защиты' }, type: 'tool' },

  // Deutsch (German Language) (NEW)
  { name: 'Deutsche Welle (DW) Deutsch lernen', tab: 'deutsch', url: 'https://learngerman.dw.com', desc: { en: 'Free German courses A1-C1 by Deutsche Welle', az: 'Deutsche Welle-dən pulsuz Alman dili kursları A1-C1', de: 'Kostenlose Deutschkurse A1-C1 von DW', ru: 'Бесплатные курсы немецкого A1-C1 от DW' }, type: 'portal', important: true, free: true },
  { name: 'Goethe-Institut', tab: 'deutsch', url: 'https://www.goethe.de/de/spr/kup/kur.html', desc: { en: 'Official German language institute - certified exams', az: 'Rəsmi Alman dili institutu - sertifikatlı imtahanlar', de: 'Offizielle Deutschkurse mit Zertifikat', ru: 'Официальный институт немецкого - экзамены' }, type: 'portal', important: true },
  { name: 'telc / TestDaF', tab: 'deutsch', url: 'https://www.testdaf.de', desc: { en: 'German proficiency test for university admission', az: 'Universitetə qəbul üçün Alman dili səviyyə testi', de: 'Deutschtest für Uni-Zulassung', ru: 'Тест немецкого для поступления в вуз' }, type: 'tool', important: true },
  { name: 'VHS Integrationskurse', tab: 'deutsch', url: 'https://www.vhs.de', desc: { en: 'Integration courses at adult education centers - subsidized', az: 'Böyüklər təhsil mərkəzlərində inteqrasiya kursları', de: 'Integrationskurse an der VHS - gefördert', ru: 'Интеграционные курсы в VHS - субсидии' }, type: 'portal', free: true },
  { name: 'Duolingo Deutsch', tab: 'deutsch', url: 'https://www.duolingo.com/course/de/en/Learn-German', desc: { en: 'Gamified German learning - great for beginners', az: 'Oyunlaşdırılmış Alman dili öyrənmə - yeni başlayanlar üçün', de: 'Spielerisch Deutsch lernen - perfekt für Anfänger', ru: 'Геймифицированный немецкий - для начинающих' }, type: 'app', free: true },
  { name: 'Anki / Memrise', tab: 'deutsch', url: 'https://apps.ankiweb.net', desc: { en: 'Flashcard apps - best for vocabulary building', az: 'Kartlar tətbiqi - söz ehtiyatını artırmaq üçün ən yaxşı', de: 'Vokabel-Apps - ideal zum Wörter lernen', ru: 'Карточки - лучшее для словарного запаса' }, type: 'app', free: true },
  { name: 'Berufssprachkurse (DeuFöV)', tab: 'deutsch', url: 'https://www.bamf.de/DE/Themen/Integration/ZuijuagewAndere/DeutschBeruf/deutsch-beruf.html', desc: { en: 'Professional German courses B2-C1 - free for job seekers', az: 'Peşəkar Alman dili kursları B2-C1 - iş axtaranlar üçün pulsuz', de: 'Berufssprachkurse B2-C1 - kostenlos für Arbeitssuchende', ru: 'Профессиональный немецкий B2-C1 - бесплатно' }, type: 'gov', important: true, free: true },
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

      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setExpanded(false) }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label[lang as keyof typeof tab.label] || tab.label.en}
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang as keyof typeof item.desc] || item.desc.en}</p>
            <div className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${typeColors[item.type]}`}>
                {typeLabels[item.type]}
              </span>
              {item.free && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">FREE</span>}
              {item.important && <span className="text-[10px]">⭐</span>}
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 8 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors">
          {expanded ? '▲ Show less' : `▼ Show all (${filtered.length})`}
        </button>
      )}

      <SectionNews section="germany" tab={activeTab} accentColor="yellow" />
    </div>
  )
}
