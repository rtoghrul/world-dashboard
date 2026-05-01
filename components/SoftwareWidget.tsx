'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Smartphone, Monitor, Apple, Globe, Download, ExternalLink, Shield, Star } from 'lucide-react'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Software & Apps', az: 'Proqramlar & Tətbiqlər', ru: 'Софт и приложения', tr: 'Yazılım & Uygulamalar', de: 'Software & Apps', fr: 'Logiciels & Apps', es: 'Software & Apps', zh: '软件和应用', ar: 'برامج وتطبيقات', ja: 'ソフトウェア&アプリ', it: 'Software & App', pt: 'Software & Apps' },
  free: { en: 'Free', az: 'Pulsuz', ru: 'Бесплатно', tr: 'Ücretsiz', de: 'Kostenlos', fr: 'Gratuit', es: 'Gratis', zh: '免费', ar: 'مجاني', ja: '無料', it: 'Gratuito', pt: 'Grátis' },
  visit: { en: 'Visit Site', az: 'Sayta keç', ru: 'Перейти', tr: 'Siteye git', de: 'Seite besuchen', fr: 'Visiter', es: 'Visitar', zh: '访问', ar: 'زيارة', ja: '訪問', it: 'Visita', pt: 'Visitar' },
  all: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tous', es: 'Todos', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' },
  disclaimer: { en: '⚠️ Use at your own risk. We don\'t host any files.', az: '⚠️ Öz riskinizlə istifadə edin. Biz fayl saxlamırıq.', ru: '⚠️ Используйте на свой риск. Мы не храним файлы.', tr: '⚠️ Kendi riskinizle kullanın. Dosya barındırmıyoruz.', de: '⚠️ Nutzung auf eigene Gefahr.', fr: '⚠️ Utilisez à vos risques.', es: '⚠️ Úselo bajo su propio riesgo.', zh: '⚠️ 使用风险自负', ar: '⚠️ استخدم على مسؤوليتك', ja: '⚠️ 自己責任でご利用ください', it: '⚠️ Usa a tuo rischio.', pt: '⚠️ Use por sua conta e risco.' },
}

const platforms = [
  { id: 'all', icon: Globe, label: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü' } },
  { id: 'android', icon: Smartphone, label: { en: 'Android', az: 'Android', ru: 'Android', tr: 'Android' } },
  { id: 'ios', icon: Apple, label: { en: 'iOS', az: 'iOS', ru: 'iOS', tr: 'iOS' } },
  { id: 'windows', icon: Monitor, label: { en: 'Windows', az: 'Windows', ru: 'Windows', tr: 'Windows' } },
  { id: 'mac', icon: Apple, label: { en: 'Mac', az: 'Mac', ru: 'Mac', tr: 'Mac' } },
  { id: 'extensions', icon: Globe, label: { en: 'Extensions', az: 'Əlavələr', ru: 'Расширения', tr: 'Eklentiler' } },
]

interface SoftwareItem {
  name: string
  desc: Record<string, string>
  url: string
  platform: string
  type: 'mod' | 'free' | 'tool' | 'jailbreak'
  rating: number
  popular?: boolean
}

const items: SoftwareItem[] = [
  // Android Mod APK Sites
  { name: 'APKMirror', desc: { en: 'Safe APK downloads & updates', az: 'Təhlükəsiz APK yükləmələr', ru: 'Безопасные APK загрузки' }, url: 'https://apkmirror.com', platform: 'android', type: 'free', rating: 4.8, popular: true },
  { name: 'APKPure', desc: { en: 'Alternative app store for Android', az: 'Android üçün alternativ mağaza', ru: 'Альтернативный магазин для Android' }, url: 'https://apkpure.com', platform: 'android', type: 'free', rating: 4.6, popular: true },
  { name: 'Uptodown', desc: { en: 'Free Android apps & games', az: 'Pulsuz Android proqram və oyunlar', ru: 'Бесплатные Android приложения' }, url: 'https://uptodown.com', platform: 'android', type: 'free', rating: 4.5 },
  { name: 'F-Droid', desc: { en: 'Open-source Android apps', az: 'Açıq mənbəli Android tətbiqlər', ru: 'Открытые Android приложения' }, url: 'https://f-droid.org', platform: 'android', type: 'free', rating: 4.7 },
  { name: 'Aurora Store', desc: { en: 'Open-source Google Play client', az: 'Açıq mənbəli Google Play klienti', ru: 'Открытый клиент Google Play' }, url: 'https://auroraoss.com', platform: 'android', type: 'free', rating: 4.4 },
  { name: 'Lucky Patcher', desc: { en: 'App modifier & ad remover', az: 'Tətbiq dəyişdirici və reklam silən', ru: 'Модификатор приложений' }, url: 'https://luckypatcher.com', platform: 'android', type: 'mod', rating: 4.3 },
  { name: 'ReVanced', desc: { en: 'YouTube mod (ad-free, background play)', az: 'YouTube mod (reklamsız, fon)', ru: 'YouTube мод (без рекламы)' }, url: 'https://revanced.app', platform: 'android', type: 'mod', rating: 4.8, popular: true },
  { name: 'Mobilism', desc: { en: 'Modded apps & games community', az: 'Modlanmış tətbiq və oyun icması', ru: 'Сообщество модов' }, url: 'https://mobilism.org', platform: 'android', type: 'mod', rating: 4.4 },
  // iOS Jailbreak & Apps
  { name: 'AltStore', desc: { en: 'Sideload apps without jailbreak', az: 'Jailbreak olmadan tətbiq yüklə', ru: 'Установка без джейлбрейка' }, url: 'https://altstore.io', platform: 'ios', type: 'jailbreak', rating: 4.7, popular: true },
  { name: 'Sideloadly', desc: { en: 'IPA sideloading tool for iOS', az: 'iOS üçün IPA yükləmə aləti', ru: 'Инструмент установки IPA' }, url: 'https://sideloadly.io', platform: 'ios', type: 'jailbreak', rating: 4.6 },
  { name: 'TrollStore', desc: { en: 'Permanent app installer (iOS 14-16)', az: 'Daimi tətbiq yükləyici (iOS 14-16)', ru: 'Постоянная установка (iOS 14-16)' }, url: 'https://github.com/opa334/TrollStore', platform: 'ios', type: 'jailbreak', rating: 4.8, popular: true },
  { name: 'Unc0ver', desc: { en: 'Semi-untethered jailbreak', az: 'Yarı bağımsız jailbreak', ru: 'Полупривязанный джейлбрейк' }, url: 'https://unc0ver.dev', platform: 'ios', type: 'jailbreak', rating: 4.5 },
  { name: 'Dopamine', desc: { en: 'Modern iOS 15-16 jailbreak', az: 'Müasir iOS 15-16 jailbreak', ru: 'Современный джейлбрейк iOS 15-16' }, url: 'https://ellekit.space/dopamine', platform: 'ios', type: 'jailbreak', rating: 4.6 },
  { name: 'AppDB', desc: { en: 'Signed IPA library', az: 'İmzalanmış IPA kitabxanası', ru: 'Библиотека подписанных IPA' }, url: 'https://appdb.to', platform: 'ios', type: 'jailbreak', rating: 4.3 },
  // Windows Free Software
  { name: 'Ninite', desc: { en: 'Install multiple apps at once', az: 'Bir dəfəyə çox proqram qur', ru: 'Установка нескольких программ сразу' }, url: 'https://ninite.com', platform: 'windows', type: 'free', rating: 4.9, popular: true },
  { name: 'FileCR', desc: { en: 'Free software & tools collection', az: 'Pulsuz proqram və alət kolleksiyası', ru: 'Коллекция бесплатного софта' }, url: 'https://filecr.com', platform: 'windows', type: 'free', rating: 4.5 },
  { name: 'Softonic', desc: { en: 'Download software for all platforms', az: 'Bütün platformalar üçün proqram yüklə', ru: 'Софт для всех платформ' }, url: 'https://softonic.com', platform: 'windows', type: 'free', rating: 4.2 },
  { name: 'MAS (Microsoft Activation)', desc: { en: 'Open-source Windows/Office activator', az: 'Açıq mənbəli Windows/Office aktivator', ru: 'Открытый активатор Windows/Office' }, url: 'https://massgrave.dev', platform: 'windows', type: 'tool', rating: 4.8, popular: true },
  { name: 'Chocolatey', desc: { en: 'Package manager for Windows', az: 'Windows üçün paket meneceri', ru: 'Менеджер пакетов для Windows' }, url: 'https://chocolatey.org', platform: 'windows', type: 'tool', rating: 4.7 },
  { name: 'WinGet', desc: { en: 'Official Windows package manager', az: 'Rəsmi Windows paket meneceri', ru: 'Официальный менеджер пакетов' }, url: 'https://github.com/microsoft/winget-cli', platform: 'windows', type: 'tool', rating: 4.6 },
  { name: 'Rufus', desc: { en: 'Create bootable USB drives', az: 'Bootable USB yarat', ru: 'Создание загрузочных USB' }, url: 'https://rufus.ie', platform: 'windows', type: 'free', rating: 4.9 },
  { name: '7-Zip', desc: { en: 'Free file archiver', az: 'Pulsuz fayl arxivləyicisi', ru: 'Бесплатный архиватор' }, url: 'https://7-zip.org', platform: 'windows', type: 'free', rating: 4.8 },
  { name: 'OBS Studio', desc: { en: 'Free streaming & recording', az: 'Pulsuz yayım və yazma', ru: 'Бесплатная запись и стриминг' }, url: 'https://obsproject.com', platform: 'windows', type: 'free', rating: 4.9 },
  // Mac
  { name: 'Homebrew', desc: { en: 'Package manager for macOS', az: 'macOS üçün paket meneceri', ru: 'Менеджер пакетов для macOS' }, url: 'https://brew.sh', platform: 'mac', type: 'tool', rating: 4.9, popular: true },
  { name: 'MacTorrents', desc: { en: 'Free Mac apps & software', az: 'Pulsuz Mac proqramları', ru: 'Бесплатный софт для Mac' }, url: 'https://mactorrents.io', platform: 'mac', type: 'free', rating: 4.3 },
  { name: 'AppShopper', desc: { en: 'Track app price drops', az: 'Qiymət endirimlerini izlə', ru: 'Отслеживание скидок' }, url: 'https://appshopper.com', platform: 'mac', type: 'free', rating: 4.2 },
  // Browser Extensions
  { name: 'uBlock Origin', desc: { en: 'Best ad blocker extension', az: 'Ən yaxşı reklam bloklayıcı', ru: 'Лучший блокировщик рекламы' }, url: 'https://ublockorigin.com', platform: 'extensions', type: 'free', rating: 4.9, popular: true },
  { name: 'Tampermonkey', desc: { en: 'Userscript manager', az: 'İstifadəçi skript meneceri', ru: 'Менеджер пользовательских скриптов' }, url: 'https://tampermonkey.net', platform: 'extensions', type: 'free', rating: 4.7 },
  { name: 'Bitwarden', desc: { en: 'Free password manager', az: 'Pulsuz şifrə meneceri', ru: 'Бесплатный менеджер паролей' }, url: 'https://bitwarden.com', platform: 'extensions', type: 'free', rating: 4.8, popular: true },
  { name: 'Dark Reader', desc: { en: 'Dark mode for every website', az: 'Hər sayt üçün qaranlıq rejim', ru: 'Тёмная тема для сайтов' }, url: 'https://darkreader.org', platform: 'extensions', type: 'free', rating: 4.7 },
  { name: 'Sponsorblock', desc: { en: 'Skip YouTube sponsors auto', az: 'YouTube sponsorları avtomatik keç', ru: 'Пропуск рекламы на YouTube' }, url: 'https://sponsor.ajay.app', platform: 'extensions', type: 'free', rating: 4.8 },
]

export default function SoftwareWidget({ defaultExpanded, initialPlatform }: { defaultExpanded?: boolean; initialPlatform?: string }) {
  const { lang } = useLang()
  const [activePlatform, setActivePlatform] = useState(initialPlatform || 'all')

  const c = (key: string) => COPY[key]?.[lang] || COPY[key]?.en || key

  const filtered = items.filter(item => {
    if (activePlatform !== 'all' && item.platform !== activePlatform) return false
    return true
  })

  const typeColor = (t: string) => {
    if (t === 'free') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    if (t === 'mod') return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    if (t === 'jailbreak') return 'bg-red-500/20 text-red-400 border-red-500/30'
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }

  const typeLabel = (t: string) => {
    if (t === 'free') return c('free')
    if (t === 'mod') return 'MOD'
    if (t === 'jailbreak') return 'Jailbreak'
    return 'Tool'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400" />
          {c('title')}
        </h2>
      </div>

      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-400/80">{c('disclaimer')}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {platforms.map(plat => {
          const Icon = plat.icon
          return (
            <button
              key={plat.id}
              onClick={() => setActivePlatform(plat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition ${activePlatform === plat.id ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-white/[0.03] text-[#8b8b9e] border-white/[0.06] hover:text-white'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {plat.label[lang] || plat.label.en}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-200"
          >
            {item.popular && (
              <div className="absolute top-2 right-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">{item.name}</h3>
              <ExternalLink className="w-3 h-3 text-[#4b4b60] group-hover:text-cyan-400 transition opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-xs text-[#6b6b80] mb-3 line-clamp-2">{item.desc[lang] || item.desc.en}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${typeColor(item.type)}`}>
                {typeLabel(item.type)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-[#8b8b9e]">{item.rating}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
