'use client'

import { useState } from 'react'
import useSWR from 'swr'

interface HorizonItem {
  rank: number; title: string; url: string; score: number
  summary: string; source: string; tags: string[]; image?: string | null
}
interface HorizonBriefing {
  date: string; totalFetched: number; totalSelected: number; items: HorizonItem[]
}

const SOURCE_MAP: Record<string, string> = {
  'hackernews':    'hackernews',
  'reddit-ml':     'reddit · r/MachineLearning',
  'reddit-tech':   'reddit · r/technology',
  'reddit-ai':     'reddit · r/artificial',
  'rss-techcrunch':'rss · TechCrunch',
  'rss-verge':     'rss · The Verge',
  'rss-ars':       'rss · Ars Technica',
  'rss-simon':     'rss · Simon Willison',
  'tg-guardian':   'telegram · guardian',
  'tg-hnfeed':     'telegram · hacker_news_feed',
  'tg-wired':      'telegram · wired',
  'tg-openai':     'telegram · openai_news',
  'tg-bbc':        'telegram · bbcbreaking',
}

const SOURCE_LABELS: Record<string, string> = {
  'hackernews':    'Hacker News',
  'reddit-ml':     'Reddit — Machine Learning',
  'reddit-tech':   'Reddit — Technology',
  'reddit-ai':     'Reddit — Artificial Intelligence',
  'rss-techcrunch':'TechCrunch',
  'rss-verge':     'The Verge',
  'rss-ars':       'Ars Technica',
  'rss-simon':     'Simon Willison',
  'tg-guardian':   'Telegram — Guardian',
  'tg-hnfeed':     'Telegram — HN Feed',
  'tg-wired':      'Telegram — Wired',
  'tg-openai':     'Telegram — OpenAI News',
  'tg-bbc':        'Telegram — BBC Breaking',
}

const GIST_URL = 'https://gist.githubusercontent.com/rtoghrul/b6c9ff6f0daf20f33f09edc263dfb328/raw/horizon-briefing.json'
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function HorizonSourceWidget({ source }: { source: string }) {
  const { data, error, isLoading } = useSWR<HorizonBriefing>(GIST_URL, fetcher, { revalidateOnFocus: false })
  const [expanded, setExpanded] = useState<number | null>(null)

  const sourceKey = SOURCE_MAP[source] || ''
  const items = (data?.items ?? []).filter(item =>
    !sourceKey || item.source.toLowerCase().includes(sourceKey.toLowerCase())
  )

  const label = SOURCE_LABELS[source] || 'Horizon Briefing'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📡</span>
        <div>
          <h2 className="text-white font-semibold">{label}</h2>
          {data && <p className="text-gray-500 text-xs">AI-ranked · {data.date} · {items.length} items from this source</p>}
        </div>
      </div>

      {isLoading && [...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
      ))}

      {error && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No briefing available yet</p>
          <p className="text-xs mt-1">Horizon runs daily at 7am UTC</p>
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>No items from this source in today&apos;s briefing</p>
          <p className="text-xs mt-1">This source may not have had high-scoring content today</p>
        </div>
      )}

      {!isLoading && !error && items.map(item => (
        <div key={item.rank} className="rounded-xl border border-white/[0.06] bg-[#0a0a10]/80 overflow-hidden">
          <button
            className="w-full text-left p-4 flex items-start gap-3"
            onClick={() => setExpanded(expanded === item.rank ? null : item.rank)}
          >
            {item.image ? (
              <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-800" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center text-2xl">
                {item.source.includes('reddit') ? '🤖' : item.source.includes('telegram') ? '✈️' : item.source.includes('hackernews') ? '🔥' : '📰'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <p className="text-white text-sm font-medium leading-snug flex-1">{item.title}</p>
                <span className={(item.score >= 8 ? 'bg-emerald-500' : item.score >= 7 ? 'bg-yellow-500' : 'bg-slate-600') + ' text-white text-xs font-bold px-1.5 py-0.5 rounded shrink-0'}>
                  {item.score.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-indigo-400">{item.source}</span>
                {item.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-gray-600 text-xs">#{tag}</span>
                ))}
              </div>
            </div>
          </button>
          {expanded === item.rank && (
            <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
              <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.summary}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 text-sm hover:underline"
              >
                Read full article →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
