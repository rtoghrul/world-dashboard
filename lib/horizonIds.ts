// Kept apart from lib/horizon.ts so client code can import it without the feed fetchers.
/** Old /section/horizon/<id> slugs (incl. retired Reddit/Telegram ones) → current source id or 'all'. */
export const LEGACY_SOURCE_IDS: Record<string, string> = {
  'rss-techcrunch': 'techcrunch', 'rss-verge': 'verge', 'rss-ars': 'ars', 'rss-simon': 'simon',
  'reddit-ml': 'all', 'reddit-tech': 'all', 'reddit-ai': 'all',
  'tg-guardian': 'all', 'tg-hnfeed': 'hackernews', 'tg-wired': 'wired', 'tg-openai': 'openai', 'tg-bbc': 'bbc-tech',
}
