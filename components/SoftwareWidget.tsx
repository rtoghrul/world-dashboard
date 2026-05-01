'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Smartphone, Monitor, Apple, Globe, ExternalLink, Star, Sparkles, ArrowRight } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Software & Apps', az: 'Proqramlar', ru: 'Программы', tr: 'Yazılım', de: 'Software', fr: 'Logiciels', es: 'Software', zh: '软件', ar: 'برامج', ja: 'ソフト', it: 'Software', pt: 'Software' },
  official: { en: 'Official + Alternative', az: 'Rəsmi + Alternativ', ru: 'Оригинал + Альтернатива', tr: 'Resmi + Alternatif', de: 'Original + Alternative', fr: 'Officiel + Alternative', es: 'Oficial + Alternativa', zh: '官方+替代', ar: 'رسمي+بديل', ja: '公式+代替', it: 'Ufficiale + Alternativa', pt: 'Oficial + Alternativa' },
  free: { en: 'Free & Open Source', az: 'Pulsuz & Açıq Mənbə', ru: 'Бесплатные', tr: 'Ücretsiz', de: 'Kostenlos', fr: 'Gratuit', es: 'Gratis', zh: '免费', ar: 'مجاني', ja: '無料', it: 'Gratuito', pt: 'Grátis' },
  paid: { en: 'PAID', az: 'ÖDƏNİŞLİ', ru: 'ПЛАТНО', tr: 'ÜCRETLİ', de: 'KOSTENPFLICHTIG', fr: 'PAYANT', es: 'DE PAGO', zh: '付费', ar: 'مدفوع', ja: '有料', it: 'A PAGAMENTO', pt: 'PAGO' },
  freeAlt: { en: 'FREE ALTERNATIVE', az: 'PULSUZ ALTERNATİV', ru: 'БЕСПЛАТНАЯ АЛЬТЕРНАТИВА', tr: 'ÜCRETSİZ ALTERNATİF', de: 'KOSTENLOSE ALTERNATIVE', fr: 'ALTERNATIVE GRATUITE', es: 'ALTERNATIVA GRATIS', zh: '免费替代', ar: 'بديل مجاني', ja: '無料代替', it: 'ALTERNATIVA GRATUITA', pt: 'ALTERNATIVA GRÁTIS' },
  openSource: { en: 'Open Source', az: 'Açıq mənbə', ru: 'Открытый код', tr: 'Açık kaynak', de: 'Open Source', fr: 'Open Source', es: 'Código abierto', zh: '开源', ar: 'مفتوح المصدر', ja: 'オープンソース', it: 'Open Source', pt: 'Código aberto' },
}

const platformTabs = [
  { id: 'all', icon: Globe, label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü' } },
  { id: 'android', icon: Smartphone, label: { en: 'Android', az: 'Android', de: 'Android', ru: 'Android', tr: 'Android' } },
  { id: 'ios', icon: Apple, label: { en: 'iOS', az: 'iOS', de: 'iOS', ru: 'iOS', tr: 'iOS' } },
  { id: 'windows', icon: Monitor, label: { en: 'Windows', az: 'Windows', de: 'Windows', ru: 'Windows', tr: 'Windows' } },
  { id: 'mac', icon: Apple, label: { en: 'Mac', az: 'Mac', de: 'Mac', ru: 'Mac', tr: 'Mac' } },
  { id: 'extensions', icon: Globe, label: { en: 'Extensions', az: 'Əlavələr', de: 'Erweiterungen', ru: 'Расширения', tr: 'Eklentiler' } },
]

interface OfficialPair {
  platform: string
  official: { name: string; desc: Record<string,string>; url: string; price: string }
  alternative: { name: string; desc: Record<string,string>; url: string; openSource: boolean; rating: number }
}

const pairs: OfficialPair[] = [
  // Windows
  { platform: 'windows', official: { name: 'Microsoft Office', desc: { en: 'Word, Excel, PowerPoint — industry standard office suite', az: 'Word, Excel, PowerPoint — sənaye standartı ofis paketi', de: 'Word, Excel, PowerPoint — Industriestandard', ru: 'Word, Excel, PowerPoint — отраслевой стандарт' }, url: 'https://microsoft.com/microsoft-365', price: '€69/yr' }, alternative: { name: 'LibreOffice', desc: { en: 'Full office suite, 100% free, .docx/.xlsx compatible', az: 'Tam ofis paketi, 100% pulsuz, .docx/.xlsx uyğun', de: 'Vollständiges Office, 100% kostenlos, kompatibel', ru: 'Полный офис, 100% бесплатно, совместим' }, url: 'https://libreoffice.org', openSource: true, rating: 4.7 } },
  { platform: 'windows', official: { name: 'Adobe Photoshop', desc: { en: 'Professional image editing, layers, filters, AI tools', az: 'Professional şəkil redaktəsi, qatlar, filtrlər, AI', de: 'Professionelle Bildbearbeitung, Ebenen, Filter, KI', ru: 'Профессиональная обработка фото, слои, фильтры' }, url: 'https://adobe.com/photoshop', price: '€24/mo' }, alternative: { name: 'GIMP', desc: { en: 'Advanced image editor with Photoshop-like features', az: 'Photoshop-a bənzər funksiyalı təkmil şəkil redaktoru', de: 'Erweiterter Bildeditor mit Photoshop-ähnlichen Features', ru: 'Мощный редактор изображений как Photoshop' }, url: 'https://gimp.org', openSource: true, rating: 4.5 } },
  { platform: 'windows', official: { name: 'Adobe Premiere Pro', desc: { en: 'Professional video editing used by Hollywood', az: 'Hollywood-un istifadə etdiyi professional video montaj', de: 'Professioneller Videoschnitt wie in Hollywood', ru: 'Профессиональный видеомонтаж из Голливуда' }, url: 'https://adobe.com/premiere', price: '€24/mo' }, alternative: { name: 'DaVinci Resolve', desc: { en: 'Hollywood-grade editor, color grading, VFX — completely free', az: 'Hollywood səviyyəli redaktor, rəng, VFX — tam pulsuz', de: 'Hollywood-Editor, Color Grading, VFX — komplett kostenlos', ru: 'Редактор уровня Голливуда, цвет, VFX — бесплатно' }, url: 'https://blackmagicdesign.com/products/davinciresolve', openSource: false, rating: 4.9 } },
  { platform: 'windows', official: { name: 'Adobe Illustrator', desc: { en: 'Vector graphics, logos, icons, professional design', az: 'Vektor qrafika, loqolar, ikonalar, professional dizayn', de: 'Vektorgrafik, Logos, Icons, professionelles Design', ru: 'Векторная графика, логотипы, профессиональный дизайн' }, url: 'https://adobe.com/illustrator', price: '€24/mo' }, alternative: { name: 'Inkscape', desc: { en: 'Full vector editor, SVG native, professional results', az: 'Tam vektor redaktor, SVG dəstəyi, professional nəticə', de: 'Voller Vektor-Editor, SVG-nativ, profi Ergebnisse', ru: 'Полный векторный редактор, SVG, профессионально' }, url: 'https://inkscape.org', openSource: true, rating: 4.5 } },
  { platform: 'windows', official: { name: 'WinRAR', desc: { en: 'File compression, RAR/ZIP archives', az: 'Fayl sıxışdırma, RAR/ZIP arxivlər', de: 'Dateikomprimierung, RAR/ZIP-Archive', ru: 'Сжатие файлов, RAR/ZIP архивы' }, url: 'https://win-rar.com', price: '€30' }, alternative: { name: '7-Zip', desc: { en: 'Supports all formats, better compression, tiny size', az: 'Bütün formatları dəstəkləyir, daha yaxşı sıxışdırma', de: 'Alle Formate, bessere Kompression, winzig', ru: 'Все форматы, лучше сжимает, крошечный' }, url: 'https://7-zip.org', openSource: true, rating: 4.8 } },
  { platform: 'windows', official: { name: 'Adobe Audition', desc: { en: 'Professional audio editing & podcast production', az: 'Professional audio redaktə & podcast istehsalı', de: 'Professionelle Audio-Bearbeitung & Podcast', ru: 'Профессиональная обработка аудио и подкасты' }, url: 'https://adobe.com/audition', price: '€24/mo' }, alternative: { name: 'Audacity', desc: { en: 'Record & edit audio, multi-track, effects, free forever', az: 'Səs yaz və redaktə et, çox treklı, effektlər, həmişə pulsuz', de: 'Audio aufnehmen & bearbeiten, Multi-Track, Effekte', ru: 'Запись и обработка, мульти-трек, эффекты, навсегда бесплатно' }, url: 'https://audacityteam.org', openSource: true, rating: 4.6 } },
  { platform: 'windows', official: { name: 'Camtasia', desc: { en: 'Screen recording & simple video editing', az: 'Ekran yazma və sadə video montaj', de: 'Bildschirmaufnahme & einfacher Videoschnitt', ru: 'Запись экрана и простой видеомонтаж' }, url: 'https://techsmith.com/camtasia', price: '€270' }, alternative: { name: 'OBS Studio', desc: { en: 'Streaming + recording, unlimited, used by pro streamers', az: 'Yayım + yazma, limitsiz, pro streymerlərin istifadə etdiyi', de: 'Streaming + Aufnahme, unbegrenzt, von Pro-Streamern genutzt', ru: 'Стриминг + запись, без лимитов, для профи' }, url: 'https://obsproject.com', openSource: true, rating: 4.9 } },
  { platform: 'windows', official: { name: 'Maya / Cinema 4D', desc: { en: '3D modeling, animation, VFX for film & games', az: '3D modelləmə, animasiya, VFX film və oyunlar üçün', de: '3D-Modellierung, Animation, VFX für Film & Games', ru: '3D-моделирование, анимация, VFX для кино и игр' }, url: 'https://autodesk.com/maya', price: '€1900/yr' }, alternative: { name: 'Blender', desc: { en: 'Industry-standard 3D, used by Netflix & studios — free', az: 'Netflix-in istifadə etdiyi sənaye standartı 3D — pulsuz', de: '3D-Industriestandard, genutzt von Netflix — kostenlos', ru: 'Стандарт индустрии 3D, Netflix использует — бесплатно' }, url: 'https://blender.org', openSource: true, rating: 4.9 } },
  // Mac
  { platform: 'mac', official: { name: 'Final Cut Pro', desc: { en: 'Apple\'s professional video editor for macOS', az: 'Apple-ın macOS üçün professional video redaktoru', de: 'Apples professioneller Videoeditor für macOS', ru: 'Профессиональный видеоредактор Apple для macOS' }, url: 'https://apple.com/final-cut-pro', price: '€350' }, alternative: { name: 'DaVinci Resolve', desc: { en: 'Free professional editor, matches Final Cut quality', az: 'Pulsuz professional redaktor, Final Cut keyfiyyətində', de: 'Kostenloser Profi-Editor, Final Cut Qualität', ru: 'Бесплатный профессиональный, уровень Final Cut' }, url: 'https://blackmagicdesign.com/products/davinciresolve', openSource: false, rating: 4.9 } },
  { platform: 'mac', official: { name: 'Magnet', desc: { en: 'Window manager, snap windows to screen edges', az: 'Pəncərə meneceri, ekranın kənarlarına yapışdır', de: 'Fenstermanager, Fenster an Bildschirmränder', ru: 'Менеджер окон, прикрепление к краям' }, url: 'https://apps.apple.com/app/magnet/id441258766', price: '€5' }, alternative: { name: 'Rectangle', desc: { en: 'Same features as Magnet, keyboard shortcuts, free', az: 'Magnet ilə eyni, klaviatura qısayolları, pulsuz', de: 'Gleiche Features wie Magnet, Tastenkürzel, kostenlos', ru: 'Те же функции как Magnet, горячие клавиши, бесплатно' }, url: 'https://rectangleapp.com', openSource: true, rating: 4.8 } },
  { platform: 'mac', official: { name: 'iStat Menus', desc: { en: 'System monitor in menu bar (CPU, RAM, network)', az: 'Menyu çubuğunda sistem monitor (CPU, RAM, şəbəkə)', de: 'Systemmonitor in der Menüleiste', ru: 'Мониторинг в меню-баре (CPU, RAM, сеть)' }, url: 'https://bjango.com/mac/istatmenus', price: '€12' }, alternative: { name: 'Stats', desc: { en: 'Beautiful system monitor, all sensors, free', az: 'Gözəl sistem monitor, bütün sensorlar, pulsuz', de: 'Schöner Systemmonitor, alle Sensoren, kostenlos', ru: 'Красивый мониторинг, все датчики, бесплатно' }, url: 'https://github.com/exelban/stats', openSource: true, rating: 4.6 } },
  // Android
  { platform: 'android', official: { name: 'YouTube Premium', desc: { en: 'Ad-free YouTube, background play, downloads', az: 'Reklamsız YouTube, fon oynatma, yükləmə', de: 'Werbefreies YouTube, Hintergrund, Downloads', ru: 'YouTube без рекламы, фон, загрузки' }, url: 'https://youtube.com/premium', price: '€13/mo' }, alternative: { name: 'NewPipe', desc: { en: 'Lightweight YouTube, no ads, background play, downloads — free', az: 'Yüngül YouTube, reklamsız, fon, yükləmə — pulsuz', de: 'Leichtes YouTube, keine Werbung, Hintergrund — kostenlos', ru: 'Лёгкий YouTube, без рекламы, фон, загрузки — бесплатно' }, url: 'https://newpipe.net', openSource: true, rating: 4.7 } },
  { platform: 'android', official: { name: '1Password / LastPass', desc: { en: 'Password manager, secure vault, autofill', az: 'Şifrə meneceri, təhlükəsiz anbar, avtodoldurma', de: 'Passwort-Manager, sicherer Tresor, Autofill', ru: 'Менеджер паролей, безопасное хранилище' }, url: 'https://1password.com', price: '€3-5/mo' }, alternative: { name: 'Bitwarden', desc: { en: 'Unlimited passwords, all devices, audited security — free', az: 'Limitsiz şifrə, bütün cihazlar, yoxlanılmış təhlükəsizlik', de: 'Unbegrenzte Passwörter, alle Geräte, geprüfte Sicherheit', ru: 'Безлимит паролей, все устройства, проверено — бесплатно' }, url: 'https://bitwarden.com', openSource: true, rating: 4.8 } },
  { platform: 'android', official: { name: 'Google Maps', desc: { en: 'Navigation, street view, live traffic', az: 'Naviqasiya, küçə görünüşü, canlı trafik', de: 'Navigation, Street View, Live-Verkehr', ru: 'Навигация, просмотр улиц, пробки' }, url: 'https://maps.google.com', price: 'Free (tracks you)' }, alternative: { name: 'Organic Maps', desc: { en: 'Offline maps, zero tracking, fast, privacy-first', az: 'Offline xəritə, sıfır izləmə, sürətli, gizlilik', de: 'Offline-Karten, kein Tracking, schnell, Privacy', ru: 'Офлайн, без слежки, быстро, приватность' }, url: 'https://organicmaps.app', openSource: true, rating: 4.6 } },
  // iOS
  { platform: 'ios', official: { name: 'Spotify Premium', desc: { en: 'Music streaming, no ads, offline, high quality', az: 'Musiqi yayımı, reklamsız, offline, yüksək keyfiyyət', de: 'Musik-Streaming, keine Werbung, offline, HQ', ru: 'Музыка, без рекламы, офлайн, высокое качество' }, url: 'https://spotify.com', price: '€11/mo' }, alternative: { name: 'Spotify Free + SponsorBlock', desc: { en: 'Use free tier + browser extension to skip ads', az: 'Pulsuz versiya + brauzer əlavəsi ilə reklamı keç', de: 'Gratis-Version + Browser-Extension zum Überspringen', ru: 'Бесплатная версия + расширение для пропуска рекламы' }, url: 'https://spotify.com', openSource: false, rating: 4.3 } },
  { platform: 'ios', official: { name: 'Notability / GoodNotes', desc: { en: 'Note-taking with Apple Pencil, handwriting', az: 'Apple Pencil ilə qeyd alma, əlyazması', de: 'Notizen mit Apple Pencil, Handschrift', ru: 'Заметки с Apple Pencil, рукописный ввод' }, url: 'https://goodnotes.com', price: '€9-15' }, alternative: { name: 'Apple Notes + Freeform', desc: { en: 'Built-in free apps, Apple Pencil support, sync', az: 'Daxili pulsuz app-lar, Apple Pencil dəstəyi, sinx', de: 'Eingebaute kostenlose Apps, Pencil-Support, Sync', ru: 'Встроенные приложения, Pencil, синхронизация' }, url: 'https://apple.com', openSource: false, rating: 4.4 } },
  // Extensions
  { platform: 'extensions', official: { name: 'Ghostery (paid tier)', desc: { en: 'Tracker blocker with paid analytics features', az: 'Ödənişli analitika funksiyalı izləyici bloker', de: 'Tracker-Blocker mit bezahlter Analytik', ru: 'Блокировщик трекеров с платной аналитикой' }, url: 'https://ghostery.com', price: '€5/mo' }, alternative: { name: 'uBlock Origin', desc: { en: 'Best ad/tracker blocker, lightweight, community-driven', az: 'Ən yaxşı reklam/izləyici bloker, yüngül', de: 'Bester Werbeblocker, leichtgewichtig', ru: 'Лучший блокировщик, лёгкий, сообщество' }, url: 'https://ublockorigin.com', openSource: true, rating: 4.9 } },
  { platform: 'extensions', official: { name: 'Grammarly Premium', desc: { en: 'AI writing assistant, grammar, tone, plagiarism', az: 'AI yazı köməkçisi, qrammatika, ton, plagiat', de: 'KI-Schreibassistent, Grammatik, Ton, Plagiat', ru: 'ИИ-помощник: грамматика, тон, плагиат' }, url: 'https://grammarly.com', price: '€12/mo' }, alternative: { name: 'LanguageTool', desc: { en: 'Open-source grammar checker, 30+ languages, free tier', az: 'Açıq mənbəli qrammatika yoxlayıcı, 30+ dil, pulsuz', de: 'Open-Source-Grammatikprüfung, 30+ Sprachen, kostenlos', ru: 'Проверка грамматики, 30+ языков, бесплатно' }, url: 'https://languagetool.org', openSource: true, rating: 4.6 } },
]

// Standalone free apps (no paid counterpart or just excellent free tools)
interface FreeApp {
  name: string; desc: Record<string,string>; url: string; platform: string; openSource: boolean; rating: number; popular?: boolean
}
const freeApps: FreeApp[] = [
  { name: 'Signal', desc: { en: 'Encrypted messaging, calls, groups', az: 'Şifrələnmiş mesaj, zəng, qrup', de: 'Verschlüsselte Nachrichten, Anrufe', ru: 'Зашифрованные сообщения, звонки' }, url: 'https://signal.org', platform: 'android', openSource: true, rating: 4.8, popular: true },
  { name: 'VLC', desc: { en: 'Plays any media format, no codecs needed', az: 'İstənilən formatı oxuyur, kodek lazım deyil', de: 'Spielt jedes Format, keine Codecs nötig', ru: 'Играет любой формат без кодеков' }, url: 'https://videolan.org', platform: 'windows', openSource: true, rating: 4.9, popular: true },
  { name: 'Brave Browser', desc: { en: 'Fast browser, built-in ad blocker', az: 'Sürətli brauzer, daxili reklam bloker', de: 'Schneller Browser mit Werbeblocker', ru: 'Быстрый браузер с блокировкой рекламы' }, url: 'https://brave.com', platform: 'android', openSource: true, rating: 4.8, popular: true },
  { name: 'F-Droid', desc: { en: 'App store for free & open-source Android apps', az: 'Pulsuz və açıq mənbəli Android app store', de: 'App-Store für freie Android-Apps', ru: 'Магазин свободных Android-приложений' }, url: 'https://f-droid.org', platform: 'android', openSource: true, rating: 4.7 },
  { name: 'Krita', desc: { en: 'Digital painting, illustration, concept art', az: 'Rəqəmsal rəsm, illüstrasiya, konsept art', de: 'Digitales Malen, Illustration, Concept Art', ru: 'Цифровое рисование, иллюстрации' }, url: 'https://krita.org', platform: 'windows', openSource: true, rating: 4.7 },
  { name: 'Homebrew', desc: { en: 'Package manager, install anything on macOS', az: 'Paket meneceri, macOS-da hər şeyi yüklə', de: 'Paketmanager, alles auf macOS installieren', ru: 'Менеджер пакетов для macOS' }, url: 'https://brew.sh', platform: 'mac', openSource: true, rating: 4.9, popular: true },
  { name: 'Termux', desc: { en: 'Linux terminal for Android, dev tools', az: 'Android üçün Linux terminal, dev alətlər', de: 'Linux-Terminal für Android', ru: 'Linux-терминал для Android' }, url: 'https://termux.dev', platform: 'android', openSource: true, rating: 4.7 },
  { name: 'IINA', desc: { en: 'Modern media player for macOS', az: 'macOS üçün müasir media pleyer', de: 'Moderner Mediaplayer für macOS', ru: 'Современный плеер для macOS' }, url: 'https://iina.io', platform: 'mac', openSource: true, rating: 4.8 },
  { name: 'Rufus', desc: { en: 'Create bootable USB drives instantly', az: 'Dərhal bootable USB yarat', de: 'Bootfähige USB-Sticks sofort erstellen', ru: 'Создание загрузочных USB мгновенно' }, url: 'https://rufus.ie', platform: 'windows', openSource: true, rating: 4.9 },
  { name: 'SponsorBlock', desc: { en: 'Skip YouTube sponsor segments automatically', az: 'YouTube sponsor hissələrini avtomatik keç', de: 'YouTube-Sponsorensegmente automatisch überspringen', ru: 'Автопропуск рекламных вставок на YouTube' }, url: 'https://sponsor.ajay.app', platform: 'extensions', openSource: true, rating: 4.8, popular: true },
  { name: 'Dark Reader', desc: { en: 'Dark mode for every website', az: 'Hər sayt üçün qaranlıq rejim', de: 'Dunkelmodus für jede Webseite', ru: 'Тёмная тема для любого сайта' }, url: 'https://darkreader.org', platform: 'extensions', openSource: true, rating: 4.7 },
  { name: 'Syncthing', desc: { en: 'Sync files between devices, no cloud, encrypted', az: 'Cihazlar arası sinx, bulud yoxdur, şifrəli', de: 'Dateien synchronisieren ohne Cloud, verschlüsselt', ru: 'Синхронизация файлов без облака, шифрование' }, url: 'https://syncthing.net', platform: 'android', openSource: true, rating: 4.6 },
  { name: 'Photopea', desc: { en: 'Photoshop in browser, no install, free', az: 'Brauzerdə Photoshop, yükləmə yoxdur, pulsuz', de: 'Photoshop im Browser, keine Installation', ru: 'Photoshop в браузере, без установки' }, url: 'https://photopea.com', platform: 'windows', openSource: false, rating: 4.7, popular: true },
  { name: 'Telegram', desc: { en: 'Fast messaging, channels, bots, cloud storage', az: 'Sürətli mesajlaşma, kanallar, botlar', de: 'Schnelle Nachrichten, Kanäle, Bots, Cloud', ru: 'Быстрый мессенджер, каналы, боты, облако' }, url: 'https://telegram.org', platform: 'ios', openSource: false, rating: 4.8, popular: true },
  { name: 'Aegis Authenticator', desc: { en: '2FA app, encrypted backups, open source', az: '2FA app, şifrəli ehtiyat, açıq mənbə', de: '2FA-App, verschlüsselte Backups', ru: '2FA-приложение, зашифрованные бэкапы' }, url: 'https://getaegis.app', platform: 'android', openSource: true, rating: 4.8 },
  { name: 'Kdenlive', desc: { en: 'Simple video editor, easier than DaVinci', az: 'Sadə video redaktor, DaVinci-dən asan', de: 'Einfacher Videoeditor, leichter als DaVinci', ru: 'Простой видеоредактор, легче DaVinci' }, url: 'https://kdenlive.org', platform: 'windows', openSource: true, rating: 4.4 },
]

export default function SoftwareWidget({ defaultExpanded, initialPlatform }: { defaultExpanded?: boolean; initialPlatform?: string }) {
  const { lang } = useLang()
  const [mode, setMode] = useState<'official' | 'free'>('official')
  const [platform, setPlatform] = useState(initialPlatform || 'all')
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const filteredPairs = platform === 'all' ? pairs : pairs.filter(p => p.platform === platform)
  const filteredFree = platform === 'all' ? freeApps : freeApps.filter(a => a.platform === platform)
  const displayPairs = expanded ? filteredPairs : filteredPairs.slice(0, 6)
  const displayFree = expanded ? filteredFree : filteredFree.slice(0, 8)

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-500" />
          {t('title')}
        </h2>
      </div>

      {/* Mode toggle: Official vs Free */}
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode('official')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'official' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          {t('official')}
        </button>
        <button onClick={() => setMode('free')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'free' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          {t('free')}
        </button>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {platformTabs.map(p => {
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

      {/* OFFICIAL + ALTERNATIVE mode */}
      {mode === 'official' && (
        <div className="space-y-3">
          {displayPairs.map((pair, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
              {/* Official card */}
              <a href={pair.official.url} target="_blank" rel="noopener noreferrer"
                className="group p-3 rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm">{pair.official.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300">{t('paid')}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{pair.official.desc[lang] || pair.official.desc.en}</p>
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">{pair.official.price}</span>
              </a>
              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-green-500" />
              </div>
              {/* Free alternative card */}
              <a href={pair.alternative.url} target="_blank" rel="noopener noreferrer"
                className="group p-3 rounded-lg border border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/20 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm text-green-700 dark:text-green-300">{pair.alternative.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-200 dark:bg-green-800/50 text-green-700 dark:text-green-300">{t('freeAlt')}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{pair.alternative.desc[lang] || pair.alternative.desc.en}</p>
                <div className="flex items-center gap-2">
                  {pair.alternative.openSource && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">{t('openSource')}</span>}
                  <div className="flex items-center gap-0.5 text-[10px] text-amber-500"><Star className="w-3 h-3 fill-current" />{pair.alternative.rating}</div>
                </div>
              </a>
            </div>
          ))}
          {filteredPairs.length > 6 && (
            <button onClick={() => setExpanded(!expanded)} className="w-full py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
              {expanded ? '▲ Show less' : `▼ Show all (${filteredPairs.length})`}
            </button>
          )}
        </div>
      )}

      {/* FREE mode */}
      {mode === 'free' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {displayFree.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all bg-white dark:bg-gray-800/50">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-sm group-hover:text-green-600 dark:group-hover:text-green-400">{item.name}</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang] || item.desc.en}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {item.openSource && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">{t('openSource')}</span>}
                    {item.popular && <span className="text-[10px]">🔥</span>}
                  </div>
                  <div className="flex items-center gap-0.5 text-[10px] text-amber-500"><Star className="w-3 h-3 fill-current" />{item.rating}</div>
                </div>
              </a>
            ))}
          </div>
          {filteredFree.length > 8 && (
            <button onClick={() => setExpanded(!expanded)} className="mt-3 w-full py-2 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
              {expanded ? '▲ Show less' : `▼ Show all (${filteredFree.length})`}
            </button>
          )}
        </>
      )}
    </div>
  )
}
