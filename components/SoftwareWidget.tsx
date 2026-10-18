'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { pickLabel } from '@/lib/translations'
import { Smartphone, Monitor, Apple, Globe, ExternalLink, Star, Sparkles, ArrowRight } from 'lucide-react'
import SectionNews from './SectionNews'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Software & Apps', az: 'Proqramlar', ru: 'Программы', tr: 'Yazılım', de: 'Software', fr: 'Logiciels', es: 'Software', zh: '软件', ar: 'برامج', ja: 'ソフト', it: 'Software', pt: 'Software' },
  official: { en: 'Official + Alternative', az: 'Rəsmi + Alternativ', ru: 'Оригинал + Альтернатива', tr: 'Resmi + Alternatif', de: 'Original + Alternative', fr: 'Officiel + Alternative', es: 'Oficial + Alternativa', zh: '官方+替代', ar: 'رسمي+بديل', ja: '公式+代替', it: 'Ufficiale + Alternativa', pt: 'Oficial + Alternativa' },
  free: { en: 'Free & Open Source', az: 'Pulsuz & Açıq Mənbə', ru: 'Бесплатные', tr: 'Ücretsiz', de: 'Kostenlos', fr: 'Gratuit', es: 'Gratis', zh: '免费', ar: 'مجاني', ja: '無料', it: 'Gratuito', pt: 'Grátis' },
  paid: { en: 'PAID', az: 'ÖDƏNİŞLİ', ru: 'ПЛАТНО', tr: 'ÜCRETLİ', de: 'KOSTENPFLICHTIG', fr: 'PAYANT', es: 'DE PAGO', zh: '付费', ar: 'مدفوع', ja: '有料', it: 'A PAGAMENTO', pt: 'PAGO' },
  freeAlt: { en: 'FREE ALTERNATIVE', az: 'PULSUZ ALTERNATİV', ru: 'БЕСПЛАТНАЯ АЛЬТЕРНАТИВА', tr: 'ÜCRETSİZ ALTERNATİF', de: 'KOSTENLOSE ALTERNATIVE', fr: 'ALTERNATIVE GRATUITE', es: 'ALTERNATIVA GRATIS', zh: '免费替代', ar: 'بديل مجاني', ja: '無料代替', it: 'ALTERNATIVA GRATUITA', pt: 'ALTERNATIVA GRÁTIS' },
  openSource: { en: 'Open Source', az: 'Açıq mənbə', ru: 'Открытый код', tr: 'Açık kaynak', de: 'Open Source', fr: 'Open Source', es: 'Código abierto', zh: '开源', ar: 'مفتوح المصدر', ja: 'オープンソース', it: 'Open Source', pt: 'Código aberto' },
}

const platformTabs = [
  { id: 'all', icon: Globe, label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü', fr: 'Tout', es: 'Todo', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' } },
  { id: 'android', icon: Smartphone, label: { en: 'Android', az: 'Android', de: 'Android', ru: 'Android', tr: 'Android', fr: 'Android', es: 'Android', zh: 'Android', ar: 'Android', ja: 'Android', it: 'Android', pt: 'Android' } },
  { id: 'ios', icon: Apple, label: { en: 'iOS', az: 'iOS', de: 'iOS', ru: 'iOS', tr: 'iOS', fr: 'iOS', es: 'iOS', zh: 'iOS', ar: 'iOS', ja: 'iOS', it: 'iOS', pt: 'iOS' } },
  { id: 'windows', icon: Monitor, label: { en: 'Windows', az: 'Windows', de: 'Windows', ru: 'Windows', tr: 'Windows', fr: 'Windows', es: 'Windows', zh: 'Windows', ar: 'Windows', ja: 'Windows', it: 'Windows', pt: 'Windows' } },
  { id: 'mac', icon: Apple, label: { en: 'Mac', az: 'Mac', de: 'Mac', ru: 'Mac', tr: 'Mac', fr: 'Mac', es: 'Mac', zh: 'Mac', ar: 'Mac', ja: 'Mac', it: 'Mac', pt: 'Mac' } },
  { id: 'extensions', icon: Globe, label: { en: 'Extensions', az: 'Əlavələr', de: 'Erweiterungen', ru: 'Расширения', tr: 'Eklentiler', fr: 'Extensions', es: 'Extensiones', zh: '扩展程序', ar: 'الإضافات', ja: '拡張機能', it: 'Estensioni', pt: 'Extensões' } },
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
  { platform: 'mac', official: { name: 'Final Cut Pro', desc: { en: 'Apple’s professional video editor for macOS', az: 'Apple-ın macOS üçün professional video redaktoru', de: 'Apples professioneller Videoeditor für macOS', ru: 'Профессиональный видеоредактор Apple для macOS' }, url: 'https://apple.com/final-cut-pro', price: '€350' }, alternative: { name: 'DaVinci Resolve', desc: { en: 'Free professional editor, matches Final Cut quality', az: 'Pulsuz professional redaktor, Final Cut keyfiyyətində', de: 'Kostenloser Profi-Editor, Final Cut Qualität', ru: 'Бесплатный профессиональный, уровень Final Cut' }, url: 'https://blackmagicdesign.com/products/davinciresolve', openSource: false, rating: 4.9 } },
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
  // Windows — extended
  { platform: 'windows', official: { name: 'AutoCAD', desc: { en: 'Industry-standard 2D/3D CAD drafting', az: 'Sənaye standartı 2D/3D CAD', ru: 'Промышленный САПР 2D/3D' }, url: 'https://www.autodesk.com/products/autocad', price: '€250/mo' }, alternative: { name: 'FreeCAD', desc: { en: 'Parametric 3D CAD, fully free', az: 'Parametrik 3D CAD, tam pulsuz', ru: 'Параметрический 3D CAD, бесплатно' }, url: 'https://www.freecad.org', openSource: true, rating: 4.4 } },
  { platform: 'windows', official: { name: 'Adobe Acrobat Pro', desc: { en: 'PDF editing, signing, OCR', az: 'PDF redaktə, imzalama, OCR', ru: 'Редактор PDF, подписи, OCR' }, url: 'https://www.adobe.com/acrobat', price: '€20/mo' }, alternative: { name: 'PDF24 Creator', desc: { en: 'All PDF tools, free desktop app', az: 'Bütün PDF alətləri, pulsuz tətbiq', ru: 'Все PDF-инструменты, бесплатно' }, url: 'https://tools.pdf24.org', openSource: false, rating: 4.7 } },
  { platform: 'windows', official: { name: 'Internet Download Manager', desc: { en: 'Fast downloads, browser integration', az: 'Sürətli yükləmə, brauzer inteqrasiyası', ru: 'Быстрые загрузки, интеграция с браузером' }, url: 'https://www.internetdownloadmanager.com', price: '€28' }, alternative: { name: 'Free Download Manager', desc: { en: 'Torrents + downloads, cross-platform', az: 'Torrent + yükləmə, çoxplatformalı', ru: 'Торренты + загрузки, кроссплатформа' }, url: 'https://www.freedownloadmanager.org', openSource: true, rating: 4.6 } },
  { platform: 'windows', official: { name: 'Sublime Text', desc: { en: 'Lightning-fast code editor', az: 'İldırım sürətli kod redaktoru', ru: 'Молниеносный редактор кода' }, url: 'https://www.sublimetext.com', price: '$99' }, alternative: { name: 'Notepad++', desc: { en: 'Tiny, powerful, plugin-rich editor', az: 'Kiçik, güclü, plaqinli redaktor', ru: 'Маленький, мощный редактор' }, url: 'https://notepad-plus-plus.org', openSource: true, rating: 4.8 } },
  { platform: 'windows', official: { name: 'Norton 360', desc: { en: 'Antivirus + VPN security suite', az: 'Antivirus + VPN təhlükəsizlik paketi', ru: 'Антивирус + VPN' }, url: 'https://us.norton.com/products/norton-360', price: '€40/yr' }, alternative: { name: 'Malwarebytes Free', desc: { en: 'On-demand scanner, catches what AV misses', az: 'Tələb üzrə skaner, əlavə qoruma', ru: 'Сканер по требованию' }, url: 'https://www.malwarebytes.com', openSource: false, rating: 4.5 } },
  { platform: 'windows', official: { name: 'Sony Vegas Pro', desc: { en: 'Pro video editing for Windows', az: 'Peşəkar video montaj (Windows)', ru: 'Профи видеомонтаж на Windows' }, url: 'https://www.vegascreativesoftware.com', price: '€300' }, alternative: { name: 'Shotcut', desc: { en: 'Open-source multi-track editor', az: 'Açıq mənbəli çoxtrekli redaktor', ru: 'Опенсорсный многодорожечный редактор' }, url: 'https://shotcut.org', openSource: true, rating: 4.4 } },
  // Mac — extended
  { platform: 'mac', official: { name: 'Parallels Desktop', desc: { en: 'Run Windows on macOS smoothly', az: 'macOS-da Windows işə sal', ru: 'Windows на macOS' }, url: 'https://www.parallels.com', price: '€100/yr' }, alternative: { name: 'UTM', desc: { en: 'Virtual machines on Mac, free', az: 'Mac-da virtual maşınlar, pulsuz', ru: 'Виртуальные машины бесплатно' }, url: 'https://mac.getutm.app', openSource: true, rating: 4.5 } },
  { platform: 'mac', official: { name: 'Alfred Powerpack', desc: { en: 'Launcher + custom workflows', az: 'Launcher + fərdi workflowlar', ru: 'Лончер + воркфлоу' }, url: 'https://www.alfredapp.com', price: '£34' }, alternative: { name: 'Raycast', desc: { en: 'Launcher, extensions, window management — free', az: 'Launcher, əlavələr, pəncərə idarəsi — pulsuz', ru: 'Лончер, расширения — бесплатно' }, url: 'https://www.raycast.com', openSource: false, rating: 4.9 } },
  { platform: 'mac', official: { name: 'CleanMyMac X', desc: { en: 'Mac cleanup & optimization suite', az: 'Mac təmizlik və optimallaşdırma', ru: 'Очистка и оптимизация Mac' }, url: 'https://macpaw.com/cleanmymac', price: '€40/yr' }, alternative: { name: 'AppCleaner', desc: { en: 'Fully uninstall apps + leftovers', az: 'Tətbiqləri qalıqları ilə sil', ru: 'Удаление приложений с остатками' }, url: 'https://freemacsoft.net/appcleaner', openSource: true, rating: 4.7 } },
  { platform: 'mac', official: { name: 'DaisyDisk', desc: { en: 'Beautiful disk usage analyzer', az: 'Gözəl disk analizatoru', ru: 'Анализатор диска' }, url: 'https://daisydiskapp.com', price: '€10' }, alternative: { name: 'GrandPerspective', desc: { en: 'Treemap disk analyzer, free', az: 'Disk analizatoru, pulsuz', ru: 'Анализатор диска, бесплатно' }, url: 'https://grandperspectiv.sourceforge.net', openSource: true, rating: 4.5 } },
  { platform: 'mac', official: { name: 'Logic Pro', desc: { en: 'Apple pro music production DAW', az: 'Apple peşəkar musiqi DAW', ru: 'Профи музыкальная DAW Apple' }, url: 'https://www.apple.com/logic-pro', price: '€230' }, alternative: { name: 'LMMS', desc: { en: 'Free DAW for beats & synth', az: 'Pulsuz DAW — bit və sintezator', ru: 'Бесплатная DAW' }, url: 'https://lmms.io', openSource: true, rating: 4.3 } },
  // Android — extended
  { platform: 'android', official: { name: 'Adobe Lightroom Premium', desc: { en: 'Pro mobile photo editing', az: 'Mobil peşəkar foto redaktə', ru: 'Профи редактирование фото' }, url: 'https://lightroom.adobe.com', price: '€12/mo' }, alternative: { name: 'Snapseed', desc: { en: 'Google\'s free full-featured photo editor', az: 'Google-un pulsuz foto redaktoru', ru: 'Бесплатный редактор Google' }, url: 'https://play.google.com/store/apps/details?id=com.niksoftware.snapseed', openSource: false, rating: 4.6 } },
  { platform: 'android', official: { name: 'Tasker', desc: { en: 'Total Android automation', az: 'Tam Android avtomatlaşdırma', ru: 'Полная автоматизация Android' }, url: 'https://tasker.dinglisch.net', price: '€3.5' }, alternative: { name: 'Automate', desc: { en: 'Flowchart automation, free tier', az: 'Flowchart avtomatlaşdırma, pulsuz', ru: 'Автоматизация блок-схемами' }, url: 'https://llamalab.com/automate', openSource: false, rating: 4.5 } },
  { platform: 'android', official: { name: 'Microsoft 365 Mobile', desc: { en: 'Office apps without ads', az: 'Reklamsız Office tətbiqləri', ru: 'Office без рекламы' }, url: 'https://www.microsoft.com/microsoft-365', price: '€7/mo' }, alternative: { name: 'WPS Office', desc: { en: 'Full office suite, free tier', az: 'Tam ofis paketi, pulsuz', ru: 'Полный офис, бесплатно' }, url: 'https://www.wps.com', openSource: false, rating: 4.4 } },
  // iOS — extended
  { platform: 'ios', official: { name: 'Procreate', desc: { en: 'iPad illustration standard', az: 'iPad illüstrasiya standartı', ru: 'Стандарт иллюстрации на iPad' }, url: 'https://procreate.com', price: '€13' }, alternative: { name: 'Sketchbook', desc: { en: 'Pro drawing app, free', az: 'Peşəkar çəkiliş tətbiqi, pulsuz', ru: 'Профи рисование, бесплатно' }, url: 'https://www.sketchbook.com', openSource: false, rating: 4.5 } },
  { platform: 'ios', official: { name: 'Things 3', desc: { en: 'Beautiful task manager', az: 'Gözəl tapşırıq meneceri', ru: 'Красивый менеджер задач' }, url: 'https://culturedcode.com/things', price: '€10-60' }, alternative: { name: 'Microsoft To Do', desc: { en: 'Synced lists & tasks, free', az: 'Sinxron siyahılar, pulsuz', ru: 'Списки и задачи, бесплатно' }, url: 'https://to-do.office.com', openSource: false, rating: 4.5 } },
  { platform: 'ios', official: { name: 'Fantastical Premium', desc: { en: 'Natural-language calendar', az: 'Təbii dil təqvimi', ru: 'Календарь с NLP' }, url: 'https://flexibits.com/fantastical', price: '€5/mo' }, alternative: { name: 'Apple Calendar', desc: { en: 'Built-in, iCloud sync, free', az: 'Daxili, iCloud sinx, pulsuz', ru: 'Встроенный, синхронизация iCloud' }, url: 'https://www.icloud.com/calendar', openSource: false, rating: 4.3 } },
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
  { name: 'PowerToys', desc: { en: 'Microsoft power-user toolbox (FancyZones, PTF)', az: 'Microsoft güclü istifadəçi alətləri', ru: 'Инструменты для опытных пользователей' }, url: 'https://github.com/microsoft/PowerToys', platform: 'windows', openSource: true, rating: 4.8, popular: true },
  { name: 'ShareX', desc: { en: 'Screenshots, recording, upload tools', az: 'Ekran görüntüsü, yazma, yükləmə', ru: 'Скриншоты, запись, загрузка' }, url: 'https://getsharex.com', platform: 'windows', openSource: true, rating: 4.8 },
  { name: 'Everything', desc: { en: 'Instant file search for Windows', az: 'Windows üçün ani fayl axtarışı', ru: 'Мгновенный поиск файлов' }, url: 'https://www.voidtools.com', platform: 'windows', openSource: false, rating: 4.9 },
  { name: 'qBittorrent', desc: { en: 'Clean torrent client, no ads', az: 'Təmiz torrent klient, reklamsız', ru: 'Чистый торрент-клиент' }, url: 'https://www.qbittorrent.org', platform: 'windows', openSource: true, rating: 4.8 },
  { name: 'HandBrake', desc: { en: 'Convert any video, all platforms', az: 'İstənilən videonu çevir', ru: 'Конвертация любого видео' }, url: 'https://handbrake.fr', platform: 'mac', openSource: true, rating: 4.7 },
  { name: 'Maccy', desc: { en: 'Clipboard history for macOS', az: 'macOS bufer tarixçəsi', ru: 'История буфера обмена macOS' }, url: 'https://maccy.app', platform: 'mac', openSource: true, rating: 4.8 },
  { name: 'LocalSend', desc: { en: 'AirDrop-like sharing across all devices', az: 'Bütün cihazlar arası paylaşım', ru: 'Обмен файлами между устройствами' }, url: 'https://localsend.app', platform: 'android', openSource: true, rating: 4.8, popular: true },
  { name: 'Obtainium', desc: { en: 'Install apps straight from developers', az: 'Tətbiqləri birbaşa developerlərdən qur', ru: 'Установка напрямую от разработчиков' }, url: 'https://github.com/ImranR98/Obtainium', platform: 'android', openSource: true, rating: 4.7 },
  { name: 'Joplin', desc: { en: 'Open-source notes with sync', az: 'Açıq mənbəli sinxron qeydlər', ru: 'Опенсорсные заметки с синхронизацией' }, url: 'https://joplinapp.org', platform: 'android', openSource: true, rating: 4.6 },
  { name: 'Obsidian', desc: { en: 'Markdown knowledge base, free personal', az: 'Markdown bilik bazası, pulsuz', ru: 'База знаний на Markdown' }, url: 'https://obsidian.md', platform: 'ios', openSource: false, rating: 4.7 },
  { name: 'Proton Mail', desc: { en: 'Encrypted email, free tier', az: 'Şifrələnmiş e-poçt, pulsuz', ru: 'Шифрованная почта, бесплатно' }, url: 'https://proton.me', platform: 'ios', openSource: true, rating: 4.7 },
  { name: 'Violentmonkey', desc: { en: 'Userscript manager (Tampermonkey alternative)', az: 'Userscript meneceri (Tampermonkey alternativi)', ru: 'Менеджер юзерскриптов' }, url: 'https://violentmonkey.github.io', platform: 'extensions', openSource: true, rating: 4.6 },
  { name: 'SingleFile', desc: { en: 'Save complete pages as one file', az: 'Səhifəni bir fayl kimi saxla', ru: 'Сохранение страницы в один файл' }, url: 'https://github.com/gildas-lormeau/SingleFile', platform: 'extensions', openSource: true, rating: 4.8 },
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
        <button onClick={() => setMode('official')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'official' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700' : 'bg-gray-100 dark:bg-gray-800 text-ink-3 dark:text-gray-400'}`}>
          {t('official')}
        </button>
        <button onClick={() => setMode('free')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'free' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-700' : 'bg-gray-100 dark:bg-gray-800 text-ink-3 dark:text-gray-400'}`}>
          {t('free')}
        </button>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {platformTabs.map(p => {
          const Icon = p.icon
          return (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${platform === p.id ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-ink-3 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {pickLabel(p.label, lang)}
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
                <p className="text-xs text-ink-3 dark:text-gray-400 mb-2 line-clamp-2">{pair.official.desc[lang] || pair.official.desc.en}</p>
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
                <p className="text-xs text-ink-3 dark:text-gray-400 mb-2 line-clamp-2">{pair.alternative.desc[lang] || pair.alternative.desc.en}</p>
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
                  <ExternalLink className="w-3.5 h-3.5 text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-ink-3 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang] || item.desc.en}</p>
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

      <SectionNews section="software" tab={platform} accentColor="emerald" darkMode />
    </div>
  )
}
