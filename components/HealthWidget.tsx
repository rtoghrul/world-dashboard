'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Pill, Stethoscope, ShieldPlus, Dumbbell, ExternalLink, Star } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Health', az: 'Sağlamlıq', ru: 'Здоровье', de: 'Gesundheit', tr: 'Sağlık', fr: 'Santé', es: 'Salud', zh: '健康', ar: 'الصحة', ja: '健康', it: 'Salute', pt: 'Saúde' },
  subtitle: { en: 'Pharmacy prices, symptoms, insurance & fitness', az: 'Aptek qiymətləri, simptomlar, sığorta və fitness', ru: 'Цены в аптеках, симптомы, страхование и фитнес', de: 'Apothekenpreise, Symptome, Versicherung & Fitness', tr: 'Eczane fiyatları, belirtiler, sigorta ve fitness', fr: 'Prix en pharmacie, symptômes, assurance & fitness', es: 'Precios de farmacia, síntomas, seguros y fitness', zh: '药价、症状、保险与健身', ar: 'أسعار الصيدليات والأعراض والتأمين واللياقة', ja: '薬の価格・症状・保険・フィットネス', it: 'Prezzi in farmacia, sintomi, assicurazione e fitness', pt: 'Preços de farmácia, sintomas, seguros e fitness' },
}

const tabs = [
  { id: 'all', label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü', fr: 'Tout', es: 'Todo', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' }, icon: Star },
  { id: 'pharmacy', label: { en: 'Pharmacy', az: 'Aptek', de: 'Apotheke', ru: 'Аптека', tr: 'Eczane', fr: 'Pharmacie', es: 'Farmacia', zh: '药店', ar: 'صيدلية', ja: '薬局', it: 'Farmacia', pt: 'Farmácia' }, icon: Pill },
  { id: 'symptoms', label: { en: 'Symptoms & Info', az: 'Simptomlar', de: 'Symptome', ru: 'Симптомы', tr: 'Belirtiler', fr: 'Symptômes & infos', es: 'Síntomas e información', zh: '症状与信息', ar: 'الأعراض والمعلومات', ja: '症状と情報', it: 'Sintomi e info', pt: 'Sintomas e informações' }, icon: Stethoscope },
  { id: 'insurance', label: { en: 'Insurance', az: 'Sığorta', de: 'Versicherung', ru: 'Страхование', tr: 'Sigorta', fr: 'Assurance', es: 'Seguros', zh: '保险', ar: 'التأمين', ja: '保険', it: 'Assicurazione', pt: 'Seguros' }, icon: ShieldPlus },
  { id: 'fitness', label: { en: 'Fitness & Wellness', az: 'Fitness', de: 'Fitness', ru: 'Фитнес', tr: 'Fitness', fr: 'Fitness & bien-être', es: 'Fitness y bienestar', zh: '健身与养生', ar: 'اللياقة والعافية', ja: 'フィットネス・ウェルネス', it: 'Fitness e benessere', pt: 'Fitness e bem-estar' }, icon: Dumbbell },
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
  { name: 'Medizinfuchs', category: 'pharmacy', desc: { en: 'Compare medicine prices across German pharmacies', az: 'Alman apteklərində dərman qiymətlərini müqayisə et', de: 'Medikamentenpreise deutschlandweit vergleichen', ru: 'Сравнение цен на лекарства в аптеках Германии', tr: 'Alman eczanelerinde ilaç fiyatlarını karşılaştırın', fr: 'Comparez les prix des médicaments dans les pharmacies allemandes', es: 'Compara precios de medicamentos en farmacias alemanas', zh: '比较德国各药房的药价', ar: 'قارن أسعار الأدوية في الصيدليات الألمانية', ja: 'ドイツの薬局で薬の価格を比較', it: 'Confronta i prezzi dei farmaci nelle farmacie tedesche', pt: 'Compare preços de remédios em farmácias alemãs' }, url: 'https://www.medizinfuchs.de', type: 'tool', rating: 4.6, popular: true, free: true },
  { name: 'Shop Apotheke', category: 'pharmacy', desc: { en: 'Large online pharmacy, frequent discounts', az: 'Böyük onlayn aptek, tez-tez endirimlər', de: 'Große Online-Apotheke, häufige Rabatte', ru: 'Крупная онлайн-аптека, частые скидки', tr: 'Büyük çevrim içi eczane, sık indirimler', fr: 'Grande pharmacie en ligne, remises fréquentes', es: 'Gran farmacia online con descuentos frecuentes', zh: '大型网上药房，经常打折', ar: 'صيدلية إلكترونية كبيرة بخصومات متكررة', ja: '大手オンライン薬局、割引多数', it: 'Grande farmacia online, sconti frequenti', pt: 'Grande farmácia online, descontos frequentes' }, url: 'https://www.shop-apotheke.com', type: 'shop', rating: 4.5, popular: true },
  { name: 'DocMorris', category: 'pharmacy', desc: { en: 'Online pharmacy with EU-wide delivery', az: 'AB üzrə çatdırılma ilə onlayn aptek', de: 'Online-Apotheke mit EU-weiter Lieferung', ru: 'Онлайн-аптека с доставкой по ЕС', tr: 'AB genelinde teslimatlı çevrim içi eczane', fr: 'Pharmacie en ligne livrant dans toute l\'UE', es: 'Farmacia online con envíos a toda la UE', zh: '可配送至全欧盟的网上药房', ar: 'صيدلية إلكترونية بتوصيل لكل دول الاتحاد الأوروبي', ja: 'EU 全域に配送するオンライン薬局', it: 'Farmacia online con consegna in tutta l\'UE', pt: 'Farmácia online com entrega em toda a UE' }, url: 'https://www.docmorris.de', type: 'shop', rating: 4.4 },
  { name: 'Apotheken-Notdienst', category: 'pharmacy', desc: { en: 'Find the nearest 24h emergency pharmacy in Germany', az: 'Almaniyada ən yaxın 24 saatlıq növbətçi apteki tap', de: 'Nächste Notdienst-Apotheke finden', ru: 'Найти ближайшую дежурную аптеку в Германии', tr: 'Almanya\'da en yakın 24 saat nöbetçi eczaneyi bulun', fr: 'Trouvez la pharmacie de garde la plus proche en Allemagne', es: 'Encuentra la farmacia de guardia 24 h más cercana en Alemania', zh: '查找德国最近的 24 小时急诊药房', ar: 'اعثر على أقرب صيدلية طوارئ 24 ساعة في ألمانيا', ja: 'ドイツで最寄りの24時間救急薬局を探す', it: 'Trova la farmacia di turno più vicina in Germania', pt: 'Encontre a farmácia de plantão 24 h mais próxima na Alemanha' }, url: 'https://www.aponet.de/apotheke/notdienstsuche', type: 'tool', rating: 4.7, popular: true, free: true },
  { name: 'GoodRx', category: 'pharmacy', desc: { en: 'US prescription discount cards & price comparison', az: 'ABŞ resept endirimi kartları və qiymət müqayisəsi', de: 'US-Rezeptrabatte & Preisvergleich', ru: 'Скидочные карты на рецепты в США', tr: 'ABD reçete indirim kartları ve fiyat karşılaştırma', fr: 'Cartes de réduction sur ordonnance aux États-Unis et comparateur', es: 'Tarjetas de descuento en recetas de EE. UU. y comparador de precios', zh: '美国处方药折扣卡与比价', ar: 'بطاقات خصم الوصفات الطبية الأمريكية ومقارنة الأسعار', ja: '米国の処方薬割引カードと価格比較', it: 'Carte sconto per farmaci con ricetta negli USA e confronto prezzi', pt: 'Cartões de desconto em receitas nos EUA e comparação de preços' }, url: 'https://www.goodrx.com', type: 'tool', rating: 4.6, free: true },
  // Symptoms & general medical info — reputable sources only
  { name: 'NetDoktor', category: 'symptoms', desc: { en: 'German medical info site, symptom checker', az: 'Alman tibbi məlumat saytı, simptom yoxlayıcı', de: 'Medizinisches Info-Portal mit Symptom-Checker', ru: 'Немецкий медицинский портал с проверкой симптомов', tr: 'Almanca tıbbi bilgi sitesi, semptom kontrolü', fr: 'Site d\'information médicale allemand, vérificateur de symptômes', es: 'Web alemana de información médica con comprobador de síntomas', zh: '德国医疗信息网站，症状自查', ar: 'موقع معلومات طبية ألماني مع فاحص للأعراض', ja: 'ドイツの医療情報サイト、症状チェッカー', it: 'Sito tedesco di informazione medica, verifica dei sintomi', pt: 'Site alemão de informação médica, verificador de sintomas' }, url: 'https://www.netdoktor.de', type: 'site', rating: 4.5, free: true },
  { name: 'Mayo Clinic', category: 'symptoms', desc: { en: 'Trusted symptom checker & disease database (English)', az: 'Etibarlı simptom yoxlayıcı və xəstəlik bazası', de: 'Vertrauenswürdiger Symptom-Checker (Englisch)', ru: 'Надёжная база симптомов и болезней (англ.)', tr: 'Güvenilir semptom kontrolü ve hastalık veritabanı (İngilizce)', fr: 'Vérificateur de symptômes fiable et base de maladies (anglais)', es: 'Comprobador de síntomas fiable y base de datos de enfermedades (inglés)', zh: '可靠的症状自查与疾病数据库（英文）', ar: 'فاحص أعراض موثوق وقاعدة بيانات للأمراض (بالإنجليزية)', ja: '信頼できる症状チェッカーと疾患データベース（英語）', it: 'Verifica sintomi affidabile e database delle malattie (inglese)', pt: 'Verificador de sintomas confiável e banco de doenças (inglês)' }, url: 'https://www.mayoclinic.org/symptom-checker', type: 'tool', rating: 4.8, popular: true, free: true },
  { name: 'NHS Symptom Checker', category: 'symptoms', desc: { en: 'UK health service — free, no-nonsense symptom guide', az: 'Böyük Britaniya səhiyyəsi — pulsuz simptom bələdçisi', de: 'Britischer Gesundheitsdienst — kostenloser Symptom-Guide', ru: 'Служба здравоохранения Великобритании — гид по симптомам', tr: 'İngiltere sağlık hizmeti – ücretsiz, net semptom rehberi', fr: 'Service de santé britannique – guide des symptômes gratuit et clair', es: 'Servicio de salud británico: guía de síntomas gratuita y clara', zh: '英国医疗服务——免费、简明的症状指南', ar: 'هيئة الصحة البريطانية – دليل أعراض مجاني وواضح', ja: '英国の保健サービス：無料でわかりやすい症状ガイド', it: 'Servizio sanitario britannico – guida ai sintomi gratuita e chiara', pt: 'Serviço de saúde britânico – guia de sintomas gratuito e direto' }, url: 'https://www.nhs.uk/symptom-checkers/', type: 'tool', rating: 4.7, free: true },
  { name: '116117 (Germany)', category: 'symptoms', desc: { en: 'German non-emergency medical appointment & advice line', az: 'Almaniyada təcili olmayan tibbi məsləhət xətti', de: 'Ärztlicher Bereitschaftsdienst — Terminvermittlung & Rat', ru: 'Немецкая линия неотложной медицинской помощи', tr: 'Almanya acil olmayan tıbbi randevu ve danışma hattı', fr: 'Ligne allemande de rendez-vous et conseils médicaux non urgents', es: 'Línea alemana de citas y consejo médico no urgente', zh: '德国非急诊医疗预约与咨询热线', ar: 'خط ألماني للمواعيد والاستشارات الطبية غير الطارئة', ja: 'ドイツの救急以外の医療予約・相談窓口', it: 'Linea tedesca per appuntamenti e consigli medici non urgenti', pt: 'Linha alemã de consultas e orientação médica não emergencial' }, url: 'https://www.116117.de', type: 'site', rating: 4.5, popular: true, free: true },
  { name: 'Ada Health', category: 'symptoms', desc: { en: 'AI symptom assessment app, used by millions', az: 'AI simptom qiymətləndirmə tətbiqi, milyonlarla istifadəçi', de: 'KI-Symptom-Check-App, Millionen Nutzer', ru: 'ИИ-приложение для оценки симптомов', tr: 'Milyonların kullandığı yapay zekâ semptom değerlendirme uygulaması', fr: 'Appli d\'évaluation des symptômes par IA, utilisée par des millions', es: 'App de evaluación de síntomas con IA, usada por millones', zh: 'AI 症状评估应用，数百万人在用', ar: 'تطبيق تقييم أعراض بالذكاء الاصطناعي يستخدمه الملايين', ja: '数百万人が使う AI 症状評価アプリ', it: 'App di valutazione dei sintomi con IA, usata da milioni di persone', pt: 'App de avaliação de sintomas com IA, usado por milhões' }, url: 'https://ada.com', type: 'app', rating: 4.6, free: true },
  // Insurance
  { name: 'CHECK24 Krankenversicherung', category: 'insurance', desc: { en: 'Compare German health insurance plans (GKV/PKV)', az: 'Alman tibbi sığorta planlarını müqayisə et', de: 'Kranken­versicherungen vergleichen (GKV/PKV)', ru: 'Сравнение медстраховок в Германии', tr: 'Alman sağlık sigortası planlarını karşılaştırın (GKV/PKV)', fr: 'Comparez les assurances santé allemandes (GKV/PKV)', es: 'Compara seguros de salud alemanes (GKV/PKV)', zh: '比较德国医保方案（GKV/PKV）', ar: 'قارن خطط التأمين الصحي الألمانية (GKV/PKV)', ja: 'ドイツの健康保険を比較（GKV/PKV）', it: 'Confronta le assicurazioni sanitarie tedesche (GKV/PKV)', pt: 'Compare planos de saúde alemães (GKV/PKV)' }, url: 'https://www.check24.de/krankenversicherung/', type: 'tool', rating: 4.5, popular: true, free: true },
  { name: 'Tarifcheck Krankenkasse', category: 'insurance', desc: { en: 'Compare statutory health insurance (Krankenkasse) rates', az: 'Dövlət tibbi sığorta tariflərini müqayisə et', de: 'Krankenkassen-Beiträge & Bonusprogramme vergleichen', ru: 'Сравнение тарифов государственной страховки', tr: 'Kamu sağlık sigortası (Krankenkasse) primlerini karşılaştırın', fr: 'Comparez les cotisations des caisses publiques (Krankenkasse)', es: 'Compara las cuotas de los seguros públicos (Krankenkasse)', zh: '比较法定医保（Krankenkasse）费率', ar: 'قارن أسعار التأمين الصحي القانوني (Krankenkasse)', ja: '公的健康保険（Krankenkasse）の保険料を比較', it: 'Confronta le aliquote delle casse malattia pubbliche (Krankenkasse)', pt: 'Compare as taxas dos planos públicos (Krankenkasse)' }, url: 'https://www.tarifcheck.de/krankenversicherung', type: 'tool', rating: 4.3, free: true },
  { name: 'TK (Techniker Krankenkasse)', category: 'insurance', desc: { en: 'Germany\'s largest statutory health insurer, strong app & bonus program', az: 'Almaniyanın ən böyük dövlət sığortası, güclü bonus proqramı', de: 'Größte gesetzliche Krankenkasse, starke App & Bonusprogramm', ru: 'Крупнейшая госстраховка Германии', tr: 'Almanya\'nın en büyük kamu sağlık sigortası, güçlü uygulama ve bonus programı', fr: 'La plus grande caisse publique d\'Allemagne, bonne appli et programme de bonus', es: 'La mayor aseguradora pública de Alemania, buena app y programa de bonificaciones', zh: '德国最大的法定医保公司，App 与奖励计划出色', ar: 'أكبر شركة تأمين صحي قانوني في ألمانيا، تطبيق قوي وبرنامج مكافآت', ja: 'ドイツ最大の公的健康保険、充実したアプリとボーナス制度', it: 'La più grande cassa malattia pubblica tedesca, ottima app e programma bonus', pt: 'O maior plano de saúde público da Alemanha, ótimo app e programa de bônus' }, url: 'https://www.tk.de', type: 'site', rating: 4.6, popular: true },
  { name: 'Expat health insurance (Feather)', category: 'insurance', desc: { en: 'English-language private/public insurance for expats in Germany', az: 'Almaniyada mühacirlər üçün ingilis dilli sığorta', de: 'Englischsprachige Versicherung für Expats', ru: 'Страхование для экспатов на английском', tr: 'Almanya\'daki yabancılar için İngilizce özel/kamu sigortası', fr: 'Assurance privée/publique en anglais pour expatriés en Allemagne', es: 'Seguro privado/público en inglés para expatriados en Alemania', zh: '面向在德外籍人士的英文私立/公立保险', ar: 'تأمين خاص/عام باللغة الإنجليزية للمغتربين في ألمانيا', ja: 'ドイツ在住外国人向けの英語対応保険（民間／公的）', it: 'Assicurazione privata/pubblica in inglese per expat in Germania', pt: 'Seguro privado/público em inglês para expatriados na Alemanha' }, url: 'https://www.feather-insurance.com', type: 'site', rating: 4.5, popular: true },
  // Fitness & Wellness
  { name: 'Nike Training Club', category: 'fitness', desc: { en: '200+ free workouts, yoga, HIIT, strength', az: '200+ pulsuz məşq, yoga, HIIT', de: '200+ kostenlose Workouts, Yoga, HIIT', ru: '200+ бесплатных тренировок', tr: '200+ ücretsiz antrenman: yoga, HIIT, kuvvet', fr: 'Plus de 200 séances gratuites : yoga, HIIT, musculation', es: 'Más de 200 entrenamientos gratis: yoga, HIIT y fuerza', zh: '200+ 免费训练：瑜伽、HIIT、力量', ar: 'أكثر من 200 تمرين مجاني: يوغا وHIIT وقوة', ja: '200以上の無料ワークアウト：ヨガ、HIIT、筋トレ', it: 'Oltre 200 allenamenti gratuiti: yoga, HIIT, forza', pt: 'Mais de 200 treinos grátis: ioga, HIIT, força' }, url: 'https://www.nike.com/ntc-app', type: 'app', rating: 4.8, popular: true, free: true },
  { name: 'Yazio', category: 'fitness', desc: { en: 'Calorie tracker + fasting timer, great food database', az: 'Kalori izləyici + oruc taymeri', de: 'Kalorienzähler + Fasten-Timer', ru: 'Счётчик калорий и таймер поста', tr: 'Kalori takibi + oruç zamanlayıcı, harika besin veritabanı', fr: 'Compteur de calories + minuteur de jeûne, excellente base d\'aliments', es: 'Contador de calorías + temporizador de ayuno, gran base de alimentos', zh: '卡路里记录 + 断食计时，食物数据库出色', ar: 'متتبع سعرات + مؤقت صيام وقاعدة بيانات أطعمة ممتازة', ja: 'カロリー記録＋ファスティングタイマー、充実の食品データベース', it: 'Conta calorie + timer per il digiuno, ottimo database alimentare', pt: 'Contador de calorias + timer de jejum, ótimo banco de alimentos' }, url: 'https://www.yazio.com', type: 'app', rating: 4.6, popular: true, free: true },
  { name: 'Headspace', category: 'fitness', desc: { en: 'Meditation & sleep, mental health basics', az: 'Meditasiya və yuxu, mental sağlamlıq', de: 'Meditation & Schlaf, mentale Gesundheit', ru: 'Медитация и сон, ментальное здоровье', tr: 'Meditasyon ve uyku, ruh sağlığının temelleri', fr: 'Méditation et sommeil, bases de la santé mentale', es: 'Meditación y sueño, lo básico de la salud mental', zh: '冥想与睡眠，心理健康基础', ar: 'التأمل والنوم وأساسيات الصحة النفسية', ja: '瞑想と睡眠、メンタルヘルスの基本', it: 'Meditazione e sonno, basi della salute mentale', pt: 'Meditação e sono, noções de saúde mental' }, url: 'https://www.headspace.com', type: 'app', rating: 4.7 },
  { name: 'Präventionskurse (Krankenkasse)', category: 'fitness', desc: { en: 'Insurance-refunded prevention courses — yoga, back pain, stress', az: 'Sığorta tərəfindən ödənilən profilaktika kursları', de: 'Von der Kasse erstattete Präventionskurse', ru: 'Курсы профилактики, оплачиваемые страховкой', tr: 'Sigortanın geri ödediği önleme kursları – yoga, bel ağrısı, stres', fr: 'Cours de prévention remboursés par l\'assurance – yoga, mal de dos, stress', es: 'Cursos de prevención reembolsados por el seguro: yoga, espalda, estrés', zh: '医保报销的预防课程——瑜伽、背痛、减压', ar: 'دورات وقائية يستردها التأمين – يوغا وآلام الظهر والتوتر', ja: '保険で払い戻される予防コース：ヨガ、腰痛、ストレス', it: 'Corsi di prevenzione rimborsati dall\'assicurazione – yoga, mal di schiena, stress', pt: 'Cursos preventivos reembolsados pelo plano – ioga, dor nas costas, estresse' }, url: 'https://www.zentrale-pruefstelle-praevention.de', type: 'site', rating: 4.4, free: true },
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
    site: 'bg-fg/[0.06] text-ink-3 border-line-strong',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-ink-1">{t('title')}</h2>
          <p className="text-[11px] text-ink-3">{t('subtitle')}</p>
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
                active ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-fg/[0.02] text-ink-3 border-line hover:text-ink-1'
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
            className="group block p-3 rounded-lg border border-line bg-fg/[0.015] hover:border-rose-500/25 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-xs font-semibold text-ink-1 group-hover:text-rose-300 transition-colors leading-tight">{item.name}</h4>
              <ExternalLink className="w-3 h-3 text-ink-1/20 group-hover:text-rose-400 transition shrink-0 mt-0.5" />
            </div>
            <p className="text-[10px] text-ink-3 mb-2 line-clamp-2">{item.desc[lang as keyof typeof item.desc] || item.desc.en}</p>
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
          className="w-full py-2 text-[11px] font-medium text-rose-400 hover:bg-rose-500/5 border border-line rounded-lg transition-colors"
        >
          {expanded ? '▲' : `▼ ${filtered.length - 8} more`}
        </button>
      )}

      <p className="text-[10px] text-ink-4 px-1">
        {lang === 'az' ? '⚠️ Bu məlumat tibbi məsləhət deyil. Ciddi simptomlarda həkimə müraciət edin.' : lang === 'de' ? '⚠️ Keine medizinische Beratung. Bei ernsten Symptomen einen Arzt aufsuchen.' : lang === 'ru' ? '⚠️ Это не медицинская консультация. При серьёзных симптомах обратитесь к врачу.' : '⚠️ Not medical advice. See a doctor for serious symptoms.'}
      </p>
    </div>
  )
}
