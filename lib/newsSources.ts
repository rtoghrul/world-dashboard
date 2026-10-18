// Catalog of free, key-less news feeds. Every entry has the publisher's homepage so the
// UI can link to the real source. Feeds were checked to respond with items (Oct 2026);
// a feed that later goes down simply contributes nothing (see lib/feed.ts loadFeed).

export type NewsRegion = 'world' | 'azerbaijan' | 'caucasus' | 'europe' | 'mideast' | 'asia' | 'africa' | 'americas'
export type NewsTopic = 'top' | 'war' | 'politics' | 'economy' | 'technology' | 'ai' | 'industry' | 'social' | 'cinema' | 'art' | 'sports' | 'science' | 'health'
export type NewsCategory = NewsTopic | NewsRegion | 'local'

export type NewsSource = {
  id: string
  name: string
  url: string
  home: string
  /** language the feed is written in */
  lang: string
  region: NewsRegion
  /** topic / region tabs this feed contributes to */
  tabs: NewsCategory[]
}

const S = (id: string, name: string, url: string, home: string, lang: string, region: NewsRegion, tabs: NewsCategory[]): NewsSource => ({ id, name, url, home, lang, region, tabs })

export const NEWS_SOURCES: NewsSource[] = [
  // ── World ──────────────────────────────────────────────
  S('bbc-world', 'BBC News', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'https://www.bbc.com/news/world', 'en', 'world', ['top', 'war', 'world']),
  S('guardian-world', 'The Guardian', 'https://www.theguardian.com/world/rss', 'https://www.theguardian.com/world', 'en', 'world', ['top', 'world']),
  S('aljazeera', 'Al Jazeera', 'https://www.aljazeera.com/xml/rss/all.xml', 'https://www.aljazeera.com', 'en', 'mideast', ['top', 'war', 'world', 'mideast']),
  S('dw', 'DW', 'https://rss.dw.com/xml/rss-en-all', 'https://www.dw.com/en', 'en', 'europe', ['top', 'world', 'europe']),
  S('france24', 'France 24', 'https://www.france24.com/en/rss', 'https://www.france24.com/en/', 'en', 'europe', ['top', 'world', 'europe']),
  S('un-news', 'UN News', 'https://news.un.org/feed/subscribe/en/news/all/rss.xml', 'https://news.un.org/en/', 'en', 'world', ['world', 'war']),
  S('nyt-world', 'The New York Times', 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'https://www.nytimes.com/section/world', 'en', 'americas', ['world', 'americas']),
  S('sky-world', 'Sky News', 'https://feeds.skynews.com/feeds/rss/world.xml', 'https://news.sky.com/world', 'en', 'europe', ['world']),
  S('abc-au', 'ABC News (Australia)', 'https://www.abc.net.au/news/feed/51120/rss.xml', 'https://www.abc.net.au/news', 'en', 'asia', ['world']),

  // ── Azerbaijan ─────────────────────────────────────────
  S('trend', 'Trend News Agency', 'https://en.trend.az/feeds/index.rss', 'https://en.trend.az', 'en', 'azerbaijan', ['azerbaijan', 'caucasus']),
  S('azernews', 'AzerNews', 'https://www.azernews.az/feed.php', 'https://www.azernews.az', 'en', 'azerbaijan', ['azerbaijan']),
  S('report-az', 'Report.az', 'https://report.az/en/rss', 'https://report.az/en/', 'en', 'azerbaijan', ['azerbaijan']),
  S('apa', 'APA', 'https://apa.az/rss', 'https://apa.az', 'az', 'azerbaijan', ['azerbaijan', 'local']),
  S('bbc-azeri', 'BBC News Azərbaycanca', 'https://feeds.bbci.co.uk/azeri/rss.xml', 'https://www.bbc.com/azeri', 'az', 'azerbaijan', ['azerbaijan', 'local']),
  S('azadliq', 'Azadlıq Radiosu', 'https://www.azadliq.org/api/', 'https://www.azadliq.org', 'az', 'azerbaijan', ['azerbaijan', 'local']),
  S('trend-az', 'Trend (Azərbaycanca)', 'https://az.trend.az/feeds/index.rss', 'https://az.trend.az', 'az', 'azerbaijan', ['azerbaijan', 'local']),

  // ── Caucasus & Central Asia ───────────────────────────
  S('oc-media', 'OC Media', 'https://oc-media.org/feed/', 'https://oc-media.org', 'en', 'caucasus', ['caucasus']),
  S('jam-news', 'JAMnews', 'https://jam-news.net/feed/', 'https://jam-news.net', 'en', 'caucasus', ['caucasus']),
  S('civil-ge', 'Civil.ge', 'https://civil.ge/feed', 'https://civil.ge', 'en', 'caucasus', ['caucasus']),
  S('eurasianet', 'Eurasianet', 'https://eurasianet.org/rss', 'https://eurasianet.org', 'en', 'caucasus', ['caucasus', 'asia']),
  S('rferl', 'RFE/RL', 'https://www.rferl.org/api/', 'https://www.rferl.org', 'en', 'caucasus', ['caucasus', 'europe', 'war']),

  // ── Europe ─────────────────────────────────────────────
  S('euronews', 'Euronews', 'https://www.euronews.com/rss?level=theme&name=news', 'https://www.euronews.com', 'en', 'europe', ['europe']),
  S('politico-eu', 'POLITICO Europe', 'https://www.politico.eu/feed/', 'https://www.politico.eu', 'en', 'europe', ['europe', 'politics']),
  S('guardian-europe', 'The Guardian Europe', 'https://www.theguardian.com/world/europe-news/rss', 'https://www.theguardian.com/world/europe-news', 'en', 'europe', ['europe']),
  S('spiegel-intl', 'DER SPIEGEL International', 'https://www.spiegel.de/international/index.rss', 'https://www.spiegel.de/international/', 'en', 'europe', ['europe']),
  S('lemonde-en', 'Le Monde (English)', 'https://www.lemonde.fr/en/rss/une.xml', 'https://www.lemonde.fr/en/', 'en', 'europe', ['europe']),
  S('elpais-en', 'EL PAÍS English', 'https://elpais.com/rss/elpais/inenglish.xml', 'https://english.elpais.com', 'en', 'europe', ['europe']),
  S('kyiv-independent', 'The Kyiv Independent', 'https://kyivindependent.com/news-archive/rss/', 'https://kyivindependent.com', 'en', 'europe', ['europe', 'war']),
  S('moscow-times', 'The Moscow Times', 'https://www.themoscowtimes.com/rss/news', 'https://www.themoscowtimes.com', 'en', 'europe', ['europe']),

  // ── Middle East ────────────────────────────────────────
  S('times-of-israel', 'The Times of Israel', 'https://www.timesofisrael.com/feed/', 'https://www.timesofisrael.com', 'en', 'mideast', ['mideast']),
  S('daily-sabah', 'Daily Sabah', 'https://www.dailysabah.com/rssFeed/10', 'https://www.dailysabah.com', 'en', 'mideast', ['mideast']),

  // ── Asia & Pacific ─────────────────────────────────────
  S('scmp', 'South China Morning Post', 'https://www.scmp.com/rss/91/feed', 'https://www.scmp.com', 'en', 'asia', ['asia']),
  S('cna', 'CNA', 'https://www.channelnewsasia.com/rssfeeds/8395986', 'https://www.channelnewsasia.com', 'en', 'asia', ['asia']),
  S('diplomat', 'The Diplomat', 'https://thediplomat.com/feed/', 'https://thediplomat.com', 'en', 'asia', ['asia', 'politics']),
  S('bbc-asia', 'BBC News Asia', 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', 'https://www.bbc.com/news/world/asia', 'en', 'asia', ['asia']),
  S('japan-times', 'The Japan Times', 'https://www.japantimes.co.jp/feed/', 'https://www.japantimes.co.jp', 'en', 'asia', ['asia']),
  S('the-hindu', 'The Hindu', 'https://www.thehindu.com/news/international/feeder/default.rss', 'https://www.thehindu.com', 'en', 'asia', ['asia']),

  // ── Africa ─────────────────────────────────────────────
  S('bbc-africa', 'BBC News Africa', 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', 'https://www.bbc.com/news/world/africa', 'en', 'africa', ['africa']),
  S('allafrica', 'AllAfrica', 'https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf', 'https://allafrica.com', 'en', 'africa', ['africa']),
  S('africanews', 'Africanews', 'https://www.africanews.com/feed/rss', 'https://www.africanews.com', 'en', 'africa', ['africa']),

  // ── Americas ───────────────────────────────────────────
  S('npr', 'NPR', 'https://feeds.npr.org/1001/rss.xml', 'https://www.npr.org/sections/news/', 'en', 'americas', ['americas', 'top']),
  S('cbc-world', 'CBC News', 'https://www.cbc.ca/webfeed/rss/rss-world', 'https://www.cbc.ca/news/world', 'en', 'americas', ['americas']),
  S('ba-times', 'Buenos Aires Times', 'https://www.batimes.com.ar/feed', 'https://www.batimes.com.ar', 'en', 'americas', ['americas']),

  // ── Topics ─────────────────────────────────────────────
  S('bbc-politics', 'BBC Politics', 'https://feeds.bbci.co.uk/news/politics/rss.xml', 'https://www.bbc.com/news/politics', 'en', 'europe', ['politics']),
  S('guardian-politics', 'The Guardian Politics', 'https://www.theguardian.com/politics/rss', 'https://www.theguardian.com/politics', 'en', 'europe', ['politics']),
  S('npr-politics', 'NPR Politics', 'https://feeds.npr.org/1014/rss.xml', 'https://www.npr.org/sections/politics/', 'en', 'americas', ['politics']),
  S('bbc-business', 'BBC Business', 'https://feeds.bbci.co.uk/news/business/rss.xml', 'https://www.bbc.com/news/business', 'en', 'europe', ['economy', 'industry']),
  S('cnbc', 'CNBC', 'https://www.cnbc.com/id/100003114/device/rss/rss.html', 'https://www.cnbc.com', 'en', 'americas', ['economy']),
  S('wsj-markets', 'WSJ Markets', 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', 'https://www.wsj.com/finance', 'en', 'americas', ['economy']),
  S('techcrunch', 'TechCrunch', 'https://techcrunch.com/feed/', 'https://techcrunch.com', 'en', 'americas', ['technology']),
  S('verge', 'The Verge', 'https://www.theverge.com/rss/index.xml', 'https://www.theverge.com', 'en', 'americas', ['technology', 'social']),
  S('ars', 'Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index', 'https://arstechnica.com', 'en', 'americas', ['technology']),
  S('techcrunch-ai', 'TechCrunch AI', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'https://techcrunch.com/category/artificial-intelligence/', 'en', 'americas', ['ai']),
  S('venturebeat-ai', 'VentureBeat', 'https://feeds.feedburner.com/venturebeat/SZYF', 'https://venturebeat.com/ai/', 'en', 'americas', ['ai']),
  S('mit-tr', 'MIT Technology Review', 'https://www.technologyreview.com/feed/', 'https://www.technologyreview.com', 'en', 'americas', ['ai', 'technology']),
  S('manufacturing', 'Manufacturing.net', 'https://www.manufacturing.net/rss.xml', 'https://www.manufacturing.net', 'en', 'americas', ['industry']),
  S('tc-social', 'TechCrunch Social', 'https://techcrunch.com/category/social/feed/', 'https://techcrunch.com/category/social/', 'en', 'americas', ['social']),
  S('variety', 'Variety', 'https://variety.com/feed/', 'https://variety.com', 'en', 'americas', ['cinema']),
  S('hollywood-reporter', 'The Hollywood Reporter', 'https://www.hollywoodreporter.com/feed/', 'https://www.hollywoodreporter.com', 'en', 'americas', ['cinema']),
  S('art-newspaper', 'The Art Newspaper', 'https://www.theartnewspaper.com/rss.xml', 'https://www.theartnewspaper.com', 'en', 'europe', ['art']),
  S('smithsonian-arts', 'Smithsonian Magazine', 'https://www.smithsonianmag.com/rss/arts-culture/', 'https://www.smithsonianmag.com/arts-culture/', 'en', 'americas', ['art']),
  S('bbc-sport', 'BBC Sport', 'https://feeds.bbci.co.uk/sport/rss.xml', 'https://www.bbc.com/sport', 'en', 'europe', ['sports']),
  S('espn', 'ESPN', 'https://www.espn.com/espn/rss/news', 'https://www.espn.com', 'en', 'americas', ['sports']),
  S('bbc-science', 'BBC Science', 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', 'https://www.bbc.com/news/science_and_environment', 'en', 'europe', ['science']),
  S('sciencedaily', 'ScienceDaily', 'https://www.sciencedaily.com/rss/all.xml', 'https://www.sciencedaily.com', 'en', 'americas', ['science']),
  S('nasa', 'NASA', 'https://www.nasa.gov/feed/', 'https://www.nasa.gov/news/', 'en', 'americas', ['science']),
  S('bbc-health', 'BBC Health', 'https://feeds.bbci.co.uk/news/health/rss.xml', 'https://www.bbc.com/news/health', 'en', 'europe', ['health']),
  S('who', 'WHO', 'https://www.who.int/rss-feeds/news-english.xml', 'https://www.who.int/news', 'en', 'world', ['health']),

  // ── In your language (shown untranslated on the "In my language" tab) ──
  S('bbc-russian', 'BBC Русская служба', 'https://feeds.bbci.co.uk/russian/rss.xml', 'https://www.bbc.com/russian', 'ru', 'europe', ['local']),
  S('meduza', 'Meduza', 'https://meduza.io/rss/all', 'https://meduza.io', 'ru', 'europe', ['local']),
  S('tagesschau', 'tagesschau', 'https://www.tagesschau.de/xml/rss2/', 'https://www.tagesschau.de', 'de', 'europe', ['local']),
  S('spiegel', 'DER SPIEGEL', 'https://www.spiegel.de/schlagzeilen/index.rss', 'https://www.spiegel.de', 'de', 'europe', ['local']),
  S('dw-de', 'DW Deutsch', 'https://rss.dw.com/xml/rss-de-all', 'https://www.dw.com/de', 'de', 'europe', ['local']),
  S('bbc-turkce', 'BBC News Türkçe', 'https://feeds.bbci.co.uk/turkce/rss.xml', 'https://www.bbc.com/turkce', 'tr', 'mideast', ['local']),
  S('ntv', 'NTV', 'https://www.ntv.com.tr/gundem.rss', 'https://www.ntv.com.tr', 'tr', 'mideast', ['local']),
  S('france24-fr', 'France 24', 'https://www.france24.com/fr/rss', 'https://www.france24.com/fr/', 'fr', 'europe', ['local']),
  S('lemonde', 'Le Monde', 'https://www.lemonde.fr/rss/une.xml', 'https://www.lemonde.fr', 'fr', 'europe', ['local']),
  S('bbc-mundo', 'BBC News Mundo', 'https://feeds.bbci.co.uk/mundo/rss.xml', 'https://www.bbc.com/mundo', 'es', 'americas', ['local']),
  S('elpais', 'EL PAÍS', 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', 'https://elpais.com', 'es', 'europe', ['local']),
  S('bbc-arabic', 'BBC عربي', 'https://feeds.bbci.co.uk/arabic/rss.xml', 'https://www.bbc.com/arabic', 'ar', 'mideast', ['local']),
  S('aljazeera-ar', 'الجزيرة نت', 'https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8cab9', 'https://www.aljazeera.net', 'ar', 'mideast', ['local']),
  S('bbc-chinese', 'BBC 中文', 'https://feeds.bbci.co.uk/zhongwen/simp/rss.xml', 'https://www.bbc.com/zhongwen/simp', 'zh', 'asia', ['local']),
  S('chinanews', '中国新闻网', 'https://www.chinanews.com.cn/rss/scroll-news.xml', 'https://www.chinanews.com.cn', 'zh', 'asia', ['local']),
  S('nhk', 'NHK ニュース', 'https://www3.nhk.or.jp/rss/news/cat0.xml', 'https://www3.nhk.or.jp/news/', 'ja', 'asia', ['local']),
  S('asahi', '朝日新聞', 'https://www.asahi.com/rss/asahi/newsheadlines.rdf', 'https://www.asahi.com', 'ja', 'asia', ['local']),
  S('ansa', 'ANSA', 'https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml', 'https://www.ansa.it', 'it', 'europe', ['local']),
  S('repubblica', 'la Repubblica', 'https://www.repubblica.it/rss/homepage/rss2.0.xml', 'https://www.repubblica.it', 'it', 'europe', ['local']),
  S('bbc-brasil', 'BBC News Brasil', 'https://feeds.bbci.co.uk/portuguese/rss.xml', 'https://www.bbc.com/portuguese', 'pt', 'americas', ['local']),
  S('g1', 'g1', 'https://g1.globo.com/rss/g1/', 'https://g1.globo.com', 'pt', 'americas', ['local']),
  S('npr-en', 'NPR', 'https://feeds.npr.org/1001/rss.xml', 'https://www.npr.org', 'en', 'americas', ['local']),
  S('bbc-en', 'BBC News', 'https://feeds.bbci.co.uk/news/rss.xml', 'https://www.bbc.com/news', 'en', 'europe', ['local']),
]

export const NEWS_REGIONS: NewsRegion[] = ['world', 'azerbaijan', 'caucasus', 'europe', 'mideast', 'asia', 'africa', 'americas']
export const NEWS_TOPICS: NewsTopic[] = ['top', 'war', 'politics', 'economy', 'technology', 'ai', 'industry', 'social', 'cinema', 'art', 'sports', 'science', 'health']

export function isNewsCategory(v: string): v is NewsCategory {
  return v === 'local' || (NEWS_REGIONS as string[]).includes(v) || (NEWS_TOPICS as string[]).includes(v)
}

/** Feeds for a tab. 'local' picks feeds written in the reader's language. */
export function sourcesFor(category: NewsCategory, lang: string): NewsSource[] {
  if (category === 'local') {
    const native = NEWS_SOURCES.filter(s => s.tabs.includes('local') && s.lang === lang)
    return native.length ? native : NEWS_SOURCES.filter(s => s.tabs.includes('local') && s.lang === 'en')
  }
  // Topic/region tabs: English feeds plus feeds already in the reader's language
  // (so an Azerbaijani reader also gets APA, BBC Azərbaycanca, Azadlıq in the original).
  const pool = NEWS_SOURCES.filter(s => s.tabs.includes(category))
  // Enough original-language coverage? Then skip machine translation entirely.
  const native = lang === 'en' ? [] : pool.filter(s => s.lang === lang)
  if (native.length >= 3) return native
  return pool.filter(s => s.lang === 'en' || s.lang === lang)
}

/** Directory used by the Links page: every distinct publisher with its homepage. */
export function publisherDirectory() {
  const seen = new Set<string>()
  return NEWS_SOURCES.filter(s => (seen.has(s.home) ? false : (seen.add(s.home), true)))
}
