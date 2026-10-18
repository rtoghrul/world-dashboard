'use client'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

import { uiAll } from '@/lib/i18n/ui'
type L10n = { en: string } & Partial<Record<string, string>>
const pick = (m: L10n, lang: string) => m[lang] || m.en

const DISCLAIMER: L10n = { en: 'All data from public APIs. Not financial advice.', az: 'Bütün məlumatlar açıq API-lərdəndir. Maliyyə məsləhəti deyil.', ru: 'Все данные из открытых API. Не является финансовой рекомендацией.', de: 'Alle Daten aus öffentlichen APIs. Keine Finanzberatung.', tr: 'Tüm veriler herkese açık API’lerden alınır. Yatırım tavsiyesi değildir.', fr: 'Toutes les données proviennent d’API publiques. Ceci n’est pas un conseil financier.', es: 'Todos los datos provienen de APIs públicas. No es asesoramiento financiero.', zh: '所有数据来自公开 API，不构成投资建议。', ar: 'جميع البيانات من واجهات برمجة عامة. ليست نصيحة مالية.', ja: 'データはすべて公開APIから取得しています。投資助言ではありません。', it: 'Tutti i dati provengono da API pubbliche. Non è una consulenza finanziaria.', pt: 'Todos os dados vêm de APIs públicas. Não é aconselhamento financeiro.' }

const footerSections: { title: L10n; links: { label: L10n; href: string }[] }[] = [
  {
    title: { en: 'Markets', az: 'Bazarlar', ru: 'Рынки', de: 'Märkte', tr: 'Piyasalar', fr: 'Marchés', es: 'Mercados', zh: '市场', ar: 'الأسواق', ja: 'マーケット', it: 'Mercati', pt: 'Mercados' },
    links: [
      { label: { en: 'Crypto', az: 'Kripto', ru: 'Крипто', de: 'Krypto', tr: 'Kripto', fr: 'Crypto', es: 'Cripto', zh: '加密货币', ar: 'العملات المشفرة', ja: '暗号資産', it: 'Crypto', pt: 'Cripto' }, href: '/section/markets/crypto-top' },
      { label: { en: 'Stocks', az: 'Səhmlər', ru: 'Акции', de: 'Aktien', tr: 'Hisseler', fr: 'Actions', es: 'Acciones', zh: '股票', ar: 'الأسهم', ja: '株式', it: 'Azioni', pt: 'Ações' }, href: '/section/markets/stocks-top' },
      { label: { en: 'Bitcoin', ar: 'بيتكوين' }, href: '/section/markets/bitcoin' },
      { label: { en: 'Ethereum', ar: 'إيثيريوم' }, href: '/section/markets/ethereum' },
    ]
  },
  {
    title: { en: 'Entertainment', az: 'Əyləncə', ru: 'Развлечения', de: 'Unterhaltung', tr: 'Eğlence', fr: 'Divertissement', es: 'Entretenimiento', zh: '娱乐', ar: 'الترفيه', ja: 'エンタメ', it: 'Intrattenimento', pt: 'Entretenimento' },
    links: [
      { label: { en: 'Movies', az: 'Filmlər', ru: 'Фильмы', de: 'Filme', tr: 'Filmler', fr: 'Films', es: 'Películas', zh: '电影', ar: 'الأفلام', ja: '映画', it: 'Film', pt: 'Filmes' }, href: '/section/entertainment/movies' },
      { label: { en: 'Series', az: 'Seriallar', ru: 'Сериалы', de: 'Serien', tr: 'Diziler', fr: 'Séries', es: 'Series', zh: '剧集', ar: 'المسلسلات', ja: 'ドラマ', it: 'Serie TV', pt: 'Séries' }, href: '/section/entertainment/series' },
      { label: { en: 'Anime', az: 'Anime', ru: 'Аниме', de: 'Anime', tr: 'Anime', fr: 'Anime', es: 'Anime', zh: '动漫', ar: 'الأنمي', ja: 'アニメ', it: 'Anime', pt: 'Anime' }, href: '/section/entertainment/anime' },
      { label: { en: 'Gaming', az: 'Oyunlar', ru: 'Игры', de: 'Gaming', tr: 'Oyun', fr: 'Jeux vidéo', es: 'Videojuegos', zh: '游戏', ar: 'الألعاب', ja: 'ゲーム', it: 'Videogiochi', pt: 'Games' }, href: '/section/entertainment/gaming' },
    ]
  },
  {
    title: { en: 'AI & Tech', az: 'AI & Texno', ru: 'ИИ и технологии', de: 'KI & Tech', tr: 'YZ ve teknoloji', fr: 'IA & tech', es: 'IA y tecnología', zh: 'AI 与科技', ar: 'الذكاء الاصطناعي والتقنية', ja: 'AI・テック', it: 'IA e tech', pt: 'IA e tecnologia' },
    links: [
      { label: { en: 'AI Chatbots', az: 'AI çatbotlar', ru: 'ИИ-чат-боты', de: 'KI-Chatbots', tr: 'YZ sohbet botları', fr: 'Chatbots IA', es: 'Chatbots de IA', zh: 'AI 聊天机器人', ar: 'روبوتات الدردشة الذكية', ja: 'AIチャットボット', it: 'Chatbot IA', pt: 'Chatbots de IA' }, href: '/section/aitools/chatbots' },
      { label: { en: 'Image Gen', az: 'Şəkil yaratma', ru: 'Генерация изображений', de: 'Bildgenerierung', tr: 'Görsel üretme', fr: 'Génération d’images', es: 'Generación de imágenes', zh: 'AI 绘图', ar: 'توليد الصور', ja: '画像生成', it: 'Generazione immagini', pt: 'Geração de imagens' }, href: '/section/aitools/image-gen' },
      { label: { en: 'Software', az: 'Proqramlar', ru: 'Программы', de: 'Software', tr: 'Yazılım', fr: 'Logiciels', es: 'Software', zh: '软件', ar: 'البرامج', ja: 'ソフトウェア', it: 'Software', pt: 'Software' }, href: '/section/software/android' },
      { label: { en: 'Free Courses', az: 'Pulsuz kurslar', ru: 'Бесплатные курсы', de: 'Kostenlose Kurse', tr: 'Ücretsiz kurslar', fr: 'Cours gratuits', es: 'Cursos gratis', zh: '免费课程', ar: 'دورات مجانية', ja: '無料講座', it: 'Corsi gratuiti', pt: 'Cursos grátis' }, href: '/section/education/courses' },
    ]
  },
  {
    title: { en: 'More', az: 'Daha çox', ru: 'Ещё', de: 'Mehr', tr: 'Daha fazla', fr: 'Plus', es: 'Más', zh: '更多', ar: 'المزيد', ja: 'その他', it: 'Altro', pt: 'Mais' },
    links: [
      { label: uiAll('news.title'), href: '/news' },
      { label: uiAll('links.title'), href: '/links' },
      { label: uiAll('home.radar'), href: '/section/horizon/all' },
      { label: { en: 'YouTube', ar: 'يوتيوب' }, href: '/section/viral/youtube' },
      { label: { en: 'Weather', az: 'Hava', ru: 'Погода', de: 'Wetter', tr: 'Hava durumu', fr: 'Météo', es: 'Tiempo', zh: '天气', ar: 'الطقس', ja: '天気', it: 'Meteo', pt: 'Clima' }, href: '/section/weather/current' },
      { label: { en: 'Travel', az: 'Səyahət', ru: 'Путешествия', de: 'Reisen', tr: 'Seyahat', fr: 'Voyages', es: 'Viajes', zh: '旅行', ar: 'السفر', ja: '旅行', it: 'Viaggi', pt: 'Viagens' }, href: '/section/travel/flight' },
      { label: { en: 'Germany 🇩🇪', az: 'Almaniya 🇩🇪', ru: 'Германия 🇩🇪', de: 'Deutschland 🇩🇪', tr: 'Almanya 🇩🇪', fr: 'Allemagne 🇩🇪', es: 'Alemania 🇩🇪', zh: '德国 🇩🇪', ar: 'ألمانيا 🇩🇪', ja: 'ドイツ 🇩🇪', it: 'Germania 🇩🇪', pt: 'Alemanha 🇩🇪' }, href: '/section/germany/behoerden' },
    ]
  },
]

export default function Footer() {
  const { lang } = useLang()

  return (
    <footer className="border-t border-line bg-surface-0 mt-12 pb-20 md:pb-0">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {footerSections.map((section, i) => (
            <div key={i}>
              <h2 className="text-ink-1 text-xs font-semibold mb-3 uppercase tracking-wider">
                {pick(section.title, lang)}
              </h2>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink-3 text-xs hover:text-ink-1 transition-colors">
                      {pick(link.label, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-3 h-3 text-ink-1" aria-hidden="true" />
            </div>
            <span className="text-ink-3 text-xs">World Dashboard</span>
          </div>
          <p className="text-ink-3 text-[10px] text-center sm:text-right">
            © {new Date().getFullYear()} World Dashboard. {pick(DISCLAIMER, lang)}
          </p>
        </div>
      </div>
    </footer>
  )
}
