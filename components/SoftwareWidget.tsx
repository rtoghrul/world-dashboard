'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Smartphone, Monitor, Apple, Globe, ExternalLink, Star, Sparkles } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Free Software & Apps', az: 'Pulsuz Proqramlar', ru: 'Бесплатный софт', tr: 'Ücretsiz Yazılım', de: 'Kostenlose Software', fr: 'Logiciels Gratuits', es: 'Software Gratis', zh: '免费软件', ar: 'برامج مجانية', ja: '無料ソフト', it: 'Software Gratuito', pt: 'Software Grátis' },
  subtitle: { en: 'Best free alternatives to paid software', az: 'Ödənişli proqramlara ən yaxşı pulsuz alternativlər', ru: 'Лучшие бесплатные альтернативы', tr: 'Ücretli yazılımlara en iyi ücretsiz alternatifler', de: 'Beste kostenlose Alternativen', fr: 'Meilleures alternatives gratuites', es: 'Mejores alternativas gratuitas', zh: '最佳免费替代品', ar: 'أفضل البدائل المجانية', ja: '有料ソフトの無料代替', it: 'Migliori alternative gratuite', pt: 'Melhores alternativas gratuitas' },
  free: { en: 'Free', az: 'Pulsuz', ru: 'Бесплатно', tr: 'Ücretsiz', de: 'Kostenlos', fr: 'Gratuit', es: 'Gratis', zh: '免费', ar: 'مجاني', ja: '無料', it: 'Gratuito', pt: 'Grátis' },
  openSource: { en: 'Open Source', az: 'Açıq mənbə', ru: 'Открытый код', tr: 'Açık kaynak', de: 'Open Source', fr: 'Open Source', es: 'Código abierto', zh: '开源', ar: 'مفتوح المصدر', ja: 'オープンソース', it: 'Open Source', pt: 'Código aberto' },
  visit: { en: 'Get it free', az: 'Pulsuz al', ru: 'Получить', tr: 'Ücretsiz al', de: 'Kostenlos holen', fr: 'Obtenir', es: 'Obtener gratis', zh: '免费获取', ar: 'احصل عليه', ja: '無料で入手', it: 'Ottieni gratis', pt: 'Obter grátis' },
  all: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tous', es: 'Todos', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' },
  replaces: { en: 'Replaces', az: 'Əvəz edir', ru: 'Заменяет', tr: 'Yerine geçer', de: 'Ersetzt', fr: 'Remplace', es: 'Reemplaza', zh: '替代', ar: 'يحل محل', ja: '代替', it: 'Sostituisce', pt: 'Substitui' },
}

const platforms = [
  { id: 'all', icon: Globe, label: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tous', es: 'Todos', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' } },
  { id: 'android', icon: Smartphone, label: { en: 'Android', az: 'Android', ru: 'Android', tr: 'Android', de: 'Android', fr: 'Android', es: 'Android', zh: 'Android', ar: 'أندرويد', ja: 'Android', it: 'Android', pt: 'Android' } },
  { id: 'ios', icon: Apple, label: { en: 'iOS', az: 'iOS', ru: 'iOS', tr: 'iOS', de: 'iOS', fr: 'iOS', es: 'iOS', zh: 'iOS', ar: 'iOS', ja: 'iOS', it: 'iOS', pt: 'iOS' } },
  { id: 'windows', icon: Monitor, label: { en: 'Windows', az: 'Windows', ru: 'Windows', tr: 'Windows', de: 'Windows', fr: 'Windows', es: 'Windows', zh: 'Windows', ar: 'ويندوز', ja: 'Windows', it: 'Windows', pt: 'Windows' } },
  { id: 'mac', icon: Apple, label: { en: 'Mac', az: 'Mac', ru: 'Mac', tr: 'Mac', de: 'Mac', fr: 'Mac', es: 'Mac', zh: 'Mac', ar: 'ماك', ja: 'Mac', it: 'Mac', pt: 'Mac' } },
  { id: 'extensions', icon: Globe, label: { en: 'Extensions', az: 'Əlavələr', ru: 'Расширения', tr: 'Eklentiler', de: 'Erweiterungen', fr: 'Extensions', es: 'Extensiones', zh: '扩展', ar: 'إضافات', ja: '拡張機能', it: 'Estensioni', pt: 'Extensões' } },
]

interface SoftwareItem {
  name: string
  desc: Record<string, string>
  url: string
  platform: string
  type: 'free' | 'open-source' | 'freemium'
  rating: number
  popular?: boolean
  replaces?: string
}

const items: SoftwareItem[] = [
  // Android - Free & Open Source
  { name: 'Signal', desc: { en: 'Encrypted messaging app', az: 'Şifrələnmiş mesajlaşma', ru: 'Защищённый мессенджер' }, url: 'https://signal.org', platform: 'android', type: 'open-source', rating: 4.8, popular: true, replaces: 'WhatsApp' },
  { name: 'Brave Browser', desc: { en: 'Fast browser with built-in ad blocker', az: 'Daxili reklam blokerli sürətli brauzer', ru: 'Быстрый браузер с блокировкой рекламы' }, url: 'https://brave.com', platform: 'android', type: 'free', rating: 4.8, popular: true, replaces: 'Chrome' },
  { name: 'VLC', desc: { en: 'Universal media player', az: 'Universal media pleyer', ru: 'Универсальный плеер' }, url: 'https://videolan.org', platform: 'android', type: 'open-source', rating: 4.9, popular: true },
  { name: 'NewPipe', desc: { en: 'Lightweight YouTube client (no ads)', az: 'Yüngül YouTube klienti (reklamsız)', ru: 'Лёгкий клиент YouTube (без рекламы)' }, url: 'https://newpipe.net', platform: 'android', type: 'open-source', rating: 4.7, popular: true, replaces: 'YouTube Premium' },
  { name: 'Telegram', desc: { en: 'Fast cloud messaging', az: 'Sürətli bulud mesajlaşma', ru: 'Быстрый облачный мессенджер' }, url: 'https://telegram.org', platform: 'android', type: 'free', rating: 4.8 },
  { name: 'F-Droid', desc: { en: 'Open-source app store', az: 'Açıq mənbəli app store', ru: 'Магазин открытых приложений' }, url: 'https://f-droid.org', platform: 'android', type: 'open-source', rating: 4.7 },
  { name: 'K-9 Mail', desc: { en: 'Free email client (now Thunderbird)', az: 'Pulsuz email klienti', ru: 'Бесплатный почтовый клиент' }, url: 'https://k9mail.app', platform: 'android', type: 'open-source', rating: 4.5, replaces: 'Outlook' },
  { name: 'Aegis Authenticator', desc: { en: 'Free 2FA authenticator', az: 'Pulsuz 2FA doğrulayıcı', ru: 'Бесплатный 2FA аутентификатор' }, url: 'https://getaegis.app', platform: 'android', type: 'open-source', rating: 4.8, replaces: 'Authy' },
  { name: 'Organic Maps', desc: { en: 'Offline maps (privacy-focused)', az: 'Offline xəritələr', ru: 'Офлайн карты' }, url: 'https://organicmaps.app', platform: 'android', type: 'open-source', rating: 4.6, replaces: 'Google Maps' },
  { name: 'Bitwarden', desc: { en: 'Free password manager', az: 'Pulsuz şifrə meneceri', ru: 'Бесплатный менеджер паролей' }, url: 'https://bitwarden.com', platform: 'android', type: 'open-source', rating: 4.8, popular: true, replaces: '1Password / LastPass' },
  { name: 'Syncthing', desc: { en: 'Decentralized file sync', az: 'Desentralizə fayl sinxronizasiya', ru: 'Децентрализованная синхронизация' }, url: 'https://syncthing.net', platform: 'android', type: 'open-source', rating: 4.6, replaces: 'Dropbox' },
  { name: 'Termux', desc: { en: 'Linux terminal for Android', az: 'Android üçün Linux terminal', ru: 'Linux терминал для Android' }, url: 'https://termux.dev', platform: 'android', type: 'open-source', rating: 4.7 },
  // iOS - Free Apps
  { name: 'Signal', desc: { en: 'Encrypted messaging app', az: 'Şifrələnmiş mesajlaşma', ru: 'Защищённый мессенджер' }, url: 'https://signal.org', platform: 'ios', type: 'open-source', rating: 4.8, popular: true, replaces: 'iMessage (cross-platform)' },
  { name: 'Brave Browser', desc: { en: 'Fast browser, blocks ads & trackers', az: 'Sürətli, reklam və izləyiciləri bloklayır', ru: 'Быстрый, блокирует рекламу' }, url: 'https://brave.com', platform: 'ios', type: 'free', rating: 4.7, popular: true, replaces: 'Safari/Chrome' },
  { name: 'VLC', desc: { en: 'Plays any video format', az: 'İstənilən video formatını oxuyur', ru: 'Воспроизводит любой формат' }, url: 'https://videolan.org', platform: 'ios', type: 'open-source', rating: 4.8 },
  { name: 'Telegram', desc: { en: 'Fast cloud messaging with channels', az: 'Kanallı sürətli mesajlaşma', ru: 'Быстрый мессенджер с каналами' }, url: 'https://telegram.org', platform: 'ios', type: 'free', rating: 4.8, popular: true },
  { name: 'Bitwarden', desc: { en: 'Free password manager', az: 'Pulsuz şifrə meneceri', ru: 'Бесплатный менеджер паролей' }, url: 'https://bitwarden.com', platform: 'ios', type: 'open-source', rating: 4.8, replaces: '1Password' },
  { name: 'Organic Maps', desc: { en: 'Offline maps without tracking', az: 'İzləmə olmadan offline xəritə', ru: 'Офлайн карты без слежки' }, url: 'https://organicmaps.app', platform: 'ios', type: 'open-source', rating: 4.6, replaces: 'Google Maps' },
  { name: 'Proton Mail', desc: { en: 'Encrypted email (Swiss privacy)', az: 'Şifrələnmiş email (İsveçrə)', ru: 'Зашифрованная почта' }, url: 'https://proton.me', platform: 'ios', type: 'freemium', rating: 4.7, replaces: 'Gmail' },
  { name: 'DaVinci Resolve (iPad)', desc: { en: 'Professional video editing free', az: 'Professional video montaj pulsuz', ru: 'Профессиональный видеомонтаж' }, url: 'https://blackmagicdesign.com/products/davinciresolve', platform: 'ios', type: 'free', rating: 4.9, replaces: 'LumaFusion' },
  // Windows - Free Alternatives
  { name: 'LibreOffice', desc: { en: 'Full office suite (docs, sheets, slides)', az: 'Tam ofis paketi', ru: 'Полный офисный пакет' }, url: 'https://libreoffice.org', platform: 'windows', type: 'open-source', rating: 4.7, popular: true, replaces: 'Microsoft Office' },
  { name: 'GIMP', desc: { en: 'Professional image editor', az: 'Professional şəkil redaktoru', ru: 'Профессиональный редактор изображений' }, url: 'https://gimp.org', platform: 'windows', type: 'open-source', rating: 4.5, popular: true, replaces: 'Adobe Photoshop' },
  { name: 'DaVinci Resolve', desc: { en: 'Hollywood-grade video editor (free)', az: 'Hollywood səviyyəli video montaj', ru: 'Видеоредактор голливудского уровня' }, url: 'https://blackmagicdesign.com/products/davinciresolve', platform: 'windows', type: 'free', rating: 4.9, popular: true, replaces: 'Adobe Premiere Pro' },
  { name: 'OBS Studio', desc: { en: 'Free streaming & recording', az: 'Pulsuz yayım və video yazma', ru: 'Бесплатная запись и стриминг' }, url: 'https://obsproject.com', platform: 'windows', type: 'open-source', rating: 4.9, popular: true, replaces: 'Streamlabs (paid)' },
  { name: 'Blender', desc: { en: '3D modeling, animation & VFX', az: '3D modelləmə və animasiya', ru: '3D моделирование и анимация' }, url: 'https://blender.org', platform: 'windows', type: 'open-source', rating: 4.9, popular: true, replaces: 'Maya / Cinema 4D' },
  { name: 'Audacity', desc: { en: 'Audio recording & editing', az: 'Səs yazmaq və redaktə', ru: 'Запись и обработка звука' }, url: 'https://audacityteam.org', platform: 'windows', type: 'open-source', rating: 4.6, replaces: 'Adobe Audition' },
  { name: 'Inkscape', desc: { en: 'Vector graphics editor', az: 'Vektor qrafika redaktoru', ru: 'Редактор векторной графики' }, url: 'https://inkscape.org', platform: 'windows', type: 'open-source', rating: 4.5, replaces: 'Adobe Illustrator' },
  { name: '7-Zip', desc: { en: 'Free file archiver (zip, rar, 7z)', az: 'Pulsuz fayl arxivləyici', ru: 'Бесплатный архиватор' }, url: 'https://7-zip.org', platform: 'windows', type: 'open-source', rating: 4.8, replaces: 'WinRAR' },
  { name: 'Rufus', desc: { en: 'Create bootable USB drives', az: 'Bootable USB yarat', ru: 'Создание загрузочных USB' }, url: 'https://rufus.ie', platform: 'windows', type: 'open-source', rating: 4.9 },
  { name: 'Kdenlive', desc: { en: 'Video editor (simpler than DaVinci)', az: 'Video redaktor (daha sadə)', ru: 'Видеоредактор (проще DaVinci)' }, url: 'https://kdenlive.org', platform: 'windows', type: 'open-source', rating: 4.4, replaces: 'Filmora' },
  { name: 'Thunderbird', desc: { en: 'Free email client by Mozilla', az: 'Mozilla-dan pulsuz email klienti', ru: 'Бесплатный почтовый клиент' }, url: 'https://thunderbird.net', platform: 'windows', type: 'open-source', rating: 4.5, replaces: 'Outlook' },
  { name: 'Krita', desc: { en: 'Digital painting & illustration', az: 'Rəqəmsal rəsm və illüstrasiya', ru: 'Цифровое рисование' }, url: 'https://krita.org', platform: 'windows', type: 'open-source', rating: 4.7, replaces: 'Clip Studio Paint' },
  { name: 'Shotcut', desc: { en: 'Simple free video editor', az: 'Sadə pulsuz video redaktor', ru: 'Простой бесплатный видеоредактор' }, url: 'https://shotcut.org', platform: 'windows', type: 'open-source', rating: 4.3, replaces: 'Camtasia' },
  { name: 'Photopea', desc: { en: 'Photoshop in browser (free)', az: 'Brauzerdə Photoshop (pulsuz)', ru: 'Photoshop в браузере' }, url: 'https://photopea.com', platform: 'windows', type: 'free', rating: 4.7, popular: true, replaces: 'Adobe Photoshop' },
  // Mac - Free Alternatives
  { name: 'Homebrew', desc: { en: 'Package manager for macOS', az: 'macOS üçün paket meneceri', ru: 'Менеджер пакетов для macOS' }, url: 'https://brew.sh', platform: 'mac', type: 'open-source', rating: 4.9, popular: true },
  { name: 'Rectangle', desc: { en: 'Window manager (snap windows)', az: 'Pəncərə meneceri', ru: 'Управление окнами' }, url: 'https://rectangleapp.com', platform: 'mac', type: 'open-source', rating: 4.8, popular: true, replaces: 'Magnet' },
  { name: 'IINA', desc: { en: 'Modern media player for macOS', az: 'macOS üçün müasir pleyer', ru: 'Современный плеер для macOS' }, url: 'https://iina.io', platform: 'mac', type: 'open-source', rating: 4.8, replaces: 'Infuse (paid)' },
  { name: 'DaVinci Resolve', desc: { en: 'Professional video editor (free)', az: 'Professional video redaktor', ru: 'Профессиональный видеоредактор' }, url: 'https://blackmagicdesign.com/products/davinciresolve', platform: 'mac', type: 'free', rating: 4.9, popular: true, replaces: 'Final Cut Pro' },
  { name: 'Keka', desc: { en: 'File archiver for macOS', az: 'macOS üçün arxivləyici', ru: 'Архиватор для macOS' }, url: 'https://keka.io', platform: 'mac', type: 'open-source', rating: 4.7, replaces: 'BetterZip' },
  { name: 'Amphetamine', desc: { en: 'Keep Mac awake (official App Store)', az: 'Mac-ı oyaq saxla', ru: 'Предотвращает засыпание Mac' }, url: 'https://apps.apple.com/app/amphetamine/id937984704', platform: 'mac', type: 'free', rating: 4.8, replaces: 'Caffeine' },
  { name: 'HandBrake', desc: { en: 'Video converter & encoder', az: 'Video konvertor', ru: 'Видео конвертер' }, url: 'https://handbrake.fr', platform: 'mac', type: 'open-source', rating: 4.7 },
  { name: 'Stats', desc: { en: 'System monitor in menu bar', az: 'Menyu çubuğunda sistem monitor', ru: 'Системный монитор в меню' }, url: 'https://github.com/exelban/stats', platform: 'mac', type: 'open-source', rating: 4.6, replaces: 'iStat Menus' },
  // Browser Extensions
  { name: 'uBlock Origin', desc: { en: 'Best ad blocker (lightweight)', az: 'Ən yaxşı reklam bloker (yüngül)', ru: 'Лучший блокировщик рекламы' }, url: 'https://ublockorigin.com', platform: 'extensions', type: 'open-source', rating: 4.9, popular: true },
  { name: 'Bitwarden', desc: { en: 'Free password manager extension', az: 'Pulsuz şifrə meneceri', ru: 'Бесплатный менеджер паролей' }, url: 'https://bitwarden.com', platform: 'extensions', type: 'open-source', rating: 4.8, popular: true, replaces: 'LastPass / 1Password' },
  { name: 'Dark Reader', desc: { en: 'Dark mode for every website', az: 'Hər sayt üçün qaranlıq rejim', ru: 'Тёмная тема для сайтов' }, url: 'https://darkreader.org', platform: 'extensions', type: 'open-source', rating: 4.7 },
  { name: 'SponsorBlock', desc: { en: 'Skip YouTube sponsor segments', az: 'YouTube sponsor hissələrini keç', ru: 'Пропуск спонсорских вставок' }, url: 'https://sponsor.ajay.app', platform: 'extensions', type: 'open-source', rating: 4.8, popular: true },
  { name: 'Tampermonkey', desc: { en: 'Userscript manager', az: 'İstifadəçi skript meneceri', ru: 'Менеджер скриптов' }, url: 'https://tampermonkey.net', platform: 'extensions', type: 'free', rating: 4.7 },
  { name: 'Privacy Badger', desc: { en: 'Tracker blocker by EFF', az: 'EFF-dən izləyici bloker', ru: 'Блокировщик трекеров от EFF' }, url: 'https://privacybadger.org', platform: 'extensions', type: 'open-source', rating: 4.6, replaces: 'Ghostery' },
  { name: 'Vimium', desc: { en: 'Keyboard navigation for browser', az: 'Brauzer üçün klaviatura naviqasiyası', ru: 'Клавиатурная навигация' }, url: 'https://vimium.github.io', platform: 'extensions', type: 'open-source', rating: 4.5 },
  { name: 'Refined GitHub', desc: { en: 'Simplifies GitHub interface', az: 'GitHub interfeysini sadələşdirir', ru: 'Упрощает интерфейс GitHub' }, url: 'https://github.com/refined-github/refined-github', platform: 'extensions', type: 'open-source', rating: 4.6 },
]

export default function SoftwareWidget({ defaultExpanded, initialPlatform }: { defaultExpanded?: boolean; initialPlatform?: string }) {
  const { lang } = useLang()
  const [platform, setPlatform] = useState(initialPlatform || 'all')
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)

  const filtered = platform === 'all' ? items : items.filter(i => i.platform === platform)
  const display = expanded ? filtered : filtered.slice(0, 8)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-500" />
          {t('title')}
        </h2>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('subtitle')}</p>

      {/* Platform tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {platforms.map(p => {
          const Icon = p.icon
          return (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${platform === p.id ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {p.label[lang] || p.label.en}
            </button>
          )
        })}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {display.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
            className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all bg-white dark:bg-gray-800/50">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{item.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang] || item.desc.en || item.desc.az}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.type === 'open-source' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : item.type === 'freemium' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'}`}>
                  {item.type === 'open-source' ? t('openSource') : t('free')}
                </span>
                {item.popular && <span className="text-[10px]">🔥</span>}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {item.rating}
              </div>
            </div>
            {item.replaces && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 border-t border-gray-100 dark:border-gray-700 pt-1">
                {t('replaces')}: <span className="line-through">{item.replaces}</span>
              </p>
            )}
          </a>
        ))}
      </div>

      {filtered.length > 8 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
          {expanded ? '▲ Show less' : `▼ Show all (${filtered.length})`}
        </button>
      )}
    </div>
  )
}
