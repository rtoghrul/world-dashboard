'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { ExternalLink, ChevronDown, GraduationCap, BookOpen, Bot, Zap, Cog } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import TopicNewsWidget from '@/components/TopicNewsWidget'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Article = {
  title: string
  link: string
  pubDate: string
  description: string
  thumbnail: string | null
  source: string
}

const SUBJECTS = [
  { id: 'math',      label: 'Mathematics', emoji: '📐' },
  { id: 'geometry',  label: 'Geometry',    emoji: '📏' },
  { id: 'physics',   label: 'Physics',     emoji: '⚛️' },
  { id: 'chemistry', label: 'Chemistry',   emoji: '🧪' },
  { id: 'biology',   label: 'Biology',     emoji: '🧬' },
  { id: 'anatomy',   label: 'Anatomy',     emoji: '🫀' },
  { id: 'astronomy', label: 'Astronomy',   emoji: '🔭' },
  { id: 'languages', label: 'Languages',   emoji: '🗣️' },
]

const FREE_COURSES = [
  { name: 'Khan Academy', url: 'https://www.khanacademy.org', desc: 'Free K-12 & university', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', desc: 'Free MIT lectures & materials', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { name: 'Coursera (free)', url: 'https://www.coursera.org/courses?query=free', desc: 'Audit for free', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { name: 'edX', url: 'https://www.edx.org/search?q=free', desc: 'Harvard, MIT & more', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { name: "Paul's Online Math", url: 'https://tutorial.math.lamar.edu', desc: 'Calculus, algebra, DE', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { name: 'Duolingo', url: 'https://www.duolingo.com', desc: 'Learn any language free', color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20' },
  { name: 'arXiv', url: 'https://arxiv.org', desc: 'Free science preprints', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { name: 'OpenStax', url: 'https://openstax.org', desc: 'Free peer-reviewed textbooks', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { name: 'Brilliant.org', url: 'https://brilliant.org', desc: 'Interactive STEM learning', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Wolfram MathWorld', url: 'https://mathworld.wolfram.com', desc: 'Math encyclopedia', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
]

type Mode = 'science' | 'engineering'

export default function EducationWidget() {
  const { tr } = useLang()
  const [collapsed, setCollapsed] = useState(true)
  const [mode, setMode] = useState<Mode>('science')
  const [subject, setSubject] = useState('physics')
  const [activeEngTopic, setActiveEngTopic] = useState<'automation' | 'electrical' | 'mechanical' | null>(null)

  const { data: rawData, isLoading, error } = useSWR<Article[]>(
    mode === 'science' ? `/api/education?subject=${subject}` : null,
    fetcher,
    { refreshInterval: 3600000 }
  )

  const data = Array.isArray(rawData) ? rawData : []
  const currentSubject = SUBJECTS.find(s => s.id === subject)!

  const engineeringTopics = [
    {
      id: 'automation' as const,
      title: tr.automation,
      desc: tr.automationDesc,
      icon: <Bot className="w-4 h-4 text-indigo-300" aria-hidden="true" />,
      styles: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-400/40 hover:bg-indigo-500/15',
    },
    {
      id: 'electrical' as const,
      title: tr.electrical,
      desc: tr.electricalDesc,
      icon: <Zap className="w-4 h-4 text-amber-300" aria-hidden="true" />,
      styles: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-400/40 hover:bg-amber-500/15',
    },
    {
      id: 'mechanical' as const,
      title: tr.mechanical,
      desc: tr.mechanicalDesc,
      icon: <Cog className="w-4 h-4 text-emerald-300" aria-hidden="true" />,
      styles: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-400/40 hover:bg-emerald-500/15',
    },
  ]

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between border-b border-gray-800 cursor-pointer select-none hover:bg-gray-800/20 transition"
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-violet-400" />
          <div>
            <h2 className="text-white font-semibold text-sm">{tr.education}</h2>
            <p className="text-gray-500 text-xs">{tr.educationDesc}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
      </div>

      {/* Collapsed preview */}
      {collapsed && (
        <div className="px-5 py-3 flex items-center gap-3 flex-wrap">
          {SUBJECTS.slice(0, 5).map(s => (
            <span key={s.id} className="text-xs text-gray-400 flex items-center gap-1">
              {s.emoji} {s.label}
            </span>
          ))}
          <span className="text-gray-600 text-xs">· Engineering & more</span>
        </div>
      )}

      {/* Expanded content */}
      {!collapsed && (
        <div className="p-4 space-y-4">

          {/* Mode toggle: Science vs Engineering */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('science')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                mode === 'science'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                  : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'
              }`}
            >
              <BookOpen className="w-3 h-3" /> Science
            </button>
            <button
              onClick={() => { setMode('engineering'); setActiveEngTopic(null) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                mode === 'engineering'
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Cog className="w-3 h-3" /> Engineering
            </button>
          </div>

          {/* Science mode */}
          {mode === 'science' && (
            <>
              {/* Subject Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubject(s.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                      subject === s.id
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                        : 'text-gray-400 hover:text-white border-transparent hover:bg-gray-800'
                    }`}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>

              {/* Latest Research News */}
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> {tr.latestResearch} — {currentSubject.emoji} {currentSubject.label}
                </p>
                <div className="space-y-2">
                  {isLoading && Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-800/40 rounded-xl">
                      <div className="h-3 bg-gray-700 rounded w-3/4 mb-1.5" />
                      <div className="h-2 bg-gray-700 rounded w-full" />
                    </div>
                  ))}
                  {error && <div className="p-4 text-center text-red-400 text-sm">{tr.error}</div>}
                  {data.map((article, i) => (
                    <a
                      key={i}
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/30 hover:border-gray-600/50 transition group"
                    >
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-lg">
                          {currentSubject.emoji}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-violet-300 transition">{article.title}</p>
                        {article.description && (
                          <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{article.description}</p>
                        )}
                        <p className="text-gray-600 text-xs mt-1">{article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''} · {article.source || 'ScienceDaily'}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Engineering mode */}
          {mode === 'engineering' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {engineeringTopics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveEngTopic(prev => prev === topic.id ? null : topic.id)}
                    className={`rounded-xl border p-3 transition group text-left ${topic.styles} ${activeEngTopic === topic.id ? 'ring-1 ring-white/20' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {topic.icon}
                      <ChevronDown className={`w-3 h-3 text-gray-500 group-hover:text-gray-300 flex-shrink-0 transition-transform duration-200 ${activeEngTopic === topic.id ? 'rotate-180' : ''}`} />
                    </div>
                    <p className="text-white text-sm font-semibold mt-2">{topic.title}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{topic.desc}</p>
                  </button>
                ))}
              </div>
              {activeEngTopic === 'automation' && (
                <TopicNewsWidget topic="automation" title={tr.automation} desc={tr.automationDesc} accentClass="text-indigo-300" icon={<Bot className="w-4 h-4" />} defaultCollapsed={false} />
              )}
              {activeEngTopic === 'electrical' && (
                <TopicNewsWidget topic="electrical" title={tr.electrical} desc={tr.electricalDesc} accentClass="text-amber-300" icon={<Zap className="w-4 h-4" />} defaultCollapsed={false} />
              )}
              {activeEngTopic === 'mechanical' && (
                <TopicNewsWidget topic="mechanical" title={tr.mechanical} desc={tr.mechanicalDesc} accentClass="text-emerald-300" icon={<Cog className="w-4 h-4" />} defaultCollapsed={false} />
              )}
            </div>
          )}

          {/* Free Courses */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3" /> {tr.freeCourses}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FREE_COURSES.map(c => (
                <a
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3 rounded-xl border transition hover:opacity-80 group ${c.bg}`}
                >
                  <div>
                    <p className={`text-xs font-semibold ${c.color}`}>{c.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.desc}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
