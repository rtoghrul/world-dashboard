// Curated, free, official-or-reputable links. Brand names stay untranslated; category titles are in lib/i18n/ui.ts.
export type LinkItem = { name: string; url: string; emoji?: string }
export type LinkCategory = { id: 'azerbaijan' | 'azlife' | 'tools' | 'learning' | 'dev' | 'travel' | 'money' | 'health' | 'science' | 'privacy'; emoji: string; links: LinkItem[] }

export const LINK_CATEGORIES: LinkCategory[] = [
  { id: 'azerbaijan', emoji: '🇦🇿', links: [
    { name: 'e-gov.az', url: 'https://www.e-gov.az' },
    { name: 'myGov', url: 'https://my.gov.az' },
    { name: 'ASAN xidmət', url: 'https://asan.gov.az' },
    { name: 'e-Taxes (Vergilər)', url: 'https://www.e-taxes.gov.az' },
    { name: 'DMX / Migration Service', url: 'https://migration.gov.az' },
    { name: 'ASAN Visa (e-Visa)', url: 'https://evisa.gov.az' },
    { name: 'Customs (DGK)', url: 'https://customs.gov.az' },
    { name: 'Central Bank (CBAR)', url: 'https://www.cbar.az' },
    { name: 'State Statistics', url: 'https://www.stat.gov.az' },
    { name: 'President.az', url: 'https://president.az' },
  ] },
  { id: 'azlife', emoji: '🏙️', links: [
    { name: 'AZAL', url: 'https://www.azal.az' },
    { name: 'ADY (Railways)', url: 'https://ady.az' },
    { name: 'Baku Metro', url: 'https://metro.gov.az' },
    { name: 'Heydar Aliyev Airport (GYD)', url: 'https://www.airportbaku.com' },
    { name: 'Milli Hidrometeorologiya', url: 'https://meteo.az' },
    { name: 'CBAR exchange rates', url: 'https://www.cbar.az/currency/rates' },
    { name: 'Tap.az', url: 'https://tap.az' },
    { name: 'Bina.az', url: 'https://bina.az' },
    { name: 'Turbo.az', url: 'https://turbo.az' },
    { name: 'Boss.az (jobs)', url: 'https://boss.az' },
  ] },
  { id: 'tools', emoji: '🧰', links: [
    { name: 'Google Translate', url: 'https://translate.google.com' },
    { name: 'DeepL', url: 'https://www.deepl.com/translator' },
    { name: 'Time.is', url: 'https://time.is' },
    { name: 'Speedtest', url: 'https://www.speedtest.net' },
    { name: 'Squoosh (image compress)', url: 'https://squoosh.app' },
    { name: 'Photopea', url: 'https://www.photopea.com' },
    { name: 'iLovePDF', url: 'https://www.ilovepdf.com' },
    { name: 'Excalidraw', url: 'https://excalidraw.com' },
    { name: 'Wayback Machine', url: 'https://web.archive.org' },
    { name: 'Windy (weather map)', url: 'https://www.windy.com' },
  ] },
  { id: 'learning', emoji: '🎓', links: [
    { name: 'Khan Academy', url: 'https://www.khanacademy.org' },
    { name: 'Coursera', url: 'https://www.coursera.org' },
    { name: 'edX', url: 'https://www.edx.org' },
    { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu' },
    { name: 'Duolingo', url: 'https://www.duolingo.com' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { name: 'Project Gutenberg', url: 'https://www.gutenberg.org' },
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
  ] },
  { id: 'dev', emoji: '💻', links: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { name: 'Can I use', url: 'https://caniuse.com' },
    { name: 'regex101', url: 'https://regex101.com' },
    { name: 'DevDocs', url: 'https://devdocs.io' },
    { name: 'Hugging Face', url: 'https://huggingface.co' },
    { name: 'roadmap.sh', url: 'https://roadmap.sh' },
  ] },
  { id: 'travel', emoji: '✈️', links: [
    { name: 'Google Flights', url: 'https://www.google.com/travel/flights' },
    { name: 'Skyscanner', url: 'https://www.skyscanner.net' },
    { name: 'Flightradar24', url: 'https://www.flightradar24.com' },
    { name: 'Rome2Rio', url: 'https://www.rome2rio.com' },
    { name: 'Booking.com', url: 'https://www.booking.com' },
    { name: 'Passport Index', url: 'https://www.passportindex.org' },
    { name: 'Wikivoyage', url: 'https://www.wikivoyage.org' },
  ] },
  { id: 'money', emoji: '💱', links: [
    { name: 'XE currency converter', url: 'https://www.xe.com/currencyconverter/' },
    { name: 'TradingView', url: 'https://www.tradingview.com' },
    { name: 'CoinGecko', url: 'https://www.coingecko.com' },
    { name: 'Investing.com calendar', url: 'https://www.investing.com/economic-calendar/' },
    { name: 'World Bank Data', url: 'https://data.worldbank.org' },
    { name: 'IMF Data', url: 'https://www.imf.org/en/Data' },
  ] },
  { id: 'health', emoji: '🩺', links: [
    { name: 'WHO', url: 'https://www.who.int' },
    { name: 'MedlinePlus', url: 'https://medlineplus.gov' },
    { name: 'NHS conditions A–Z', url: 'https://www.nhs.uk/conditions/' },
    { name: 'Drugs.com interaction checker', url: 'https://www.drugs.com/drug_interactions.html' },
    { name: 'TƏBİB (Azerbaijan)', url: 'https://tabib.gov.az' },
  ] },
  { id: 'science', emoji: '🔭', links: [
    { name: 'NASA', url: 'https://www.nasa.gov' },
    { name: 'ESA', url: 'https://www.esa.int' },
    { name: 'arXiv', url: 'https://arxiv.org' },
    { name: 'Our World in Data', url: 'https://ourworldindata.org' },
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com' },
    { name: 'Zoom Earth', url: 'https://zoom.earth' },
    { name: 'USGS Earthquakes', url: 'https://earthquake.usgs.gov/earthquakes/map/' },
  ] },
  { id: 'privacy', emoji: '🛡️', links: [
    { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com' },
    { name: 'Bitwarden', url: 'https://bitwarden.com' },
    { name: 'Proton', url: 'https://proton.me' },
    { name: 'VirusTotal', url: 'https://www.virustotal.com' },
    { name: 'Privacy Guides', url: 'https://www.privacyguides.org' },
    { name: 'uBlock Origin', url: 'https://ublockorigin.com' },
  ] },
]

export const DEFAULT_PINS = ['https://www.e-gov.az', 'https://translate.google.com', 'https://www.cbar.az/currency/rates', 'https://www.google.com/travel/flights', 'https://www.wikipedia.org', 'https://github.com']

export function hostOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url }
}

/** Only http(s) URLs with a dotted host are accepted for user links. */
export function normalizeUserUrl(raw: string): string | null {
  const v = raw.trim()
  if (!v) return null
  try {
    const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`)
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
    if (!u.hostname.includes('.')) return null
    return u.toString()
  } catch { return null }
}

