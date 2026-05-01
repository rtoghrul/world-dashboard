'use client'
import useSWR from 'swr'
import { useState } from 'react'
import { ExternalLink, ChevronDown, GraduationCap, BookOpen, Bot, Zap, Cog, Wrench } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'
import TopicNewsWidget from '@/components/TopicNewsWidget'
import NewsModal, { type ModalItem } from '@/components/NewsModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type ToolEntry = { name: string; url: string; desc: string; color: string; bg: string }

const USEFUL_TOOLS: Record<string, ToolEntry[]> = {
  math: [
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', desc: 'Compute answers, integrals, equations', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'Desmos', url: 'https://www.desmos.com/calculator', desc: 'Graphing calculator', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'GeoGebra', url: 'https://www.geogebra.org', desc: 'Geometry & algebra combined', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { name: 'Symbolab', url: 'https://www.symbolab.com', desc: 'Step-by-step solver', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { name: 'Mathway', url: 'https://www.mathway.com', desc: 'Algebra, calculus, stats', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  ],
  geometry: [
    { name: 'GeoGebra Geometry', url: 'https://www.geogebra.org/geometry', desc: 'Interactive geometry builder', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { name: 'Desmos Geometry', url: 'https://www.desmos.com/geometry', desc: 'Ruler & compass constructions', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Euclid: The Game', url: 'https://euclidthegame.com', desc: 'Practice geometric constructions', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', desc: 'Geometric calculations', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  ],
  physics: [
    { name: 'PhET Simulations', url: 'https://phet.colorado.edu', desc: 'Interactive physics simulations', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', desc: 'Physics formulas & calculations', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'The Physics Classroom', url: 'https://www.physicsclassroom.com', desc: 'Tutorials & simulations', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu', desc: 'Physics concept maps', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ],
  chemistry: [
    { name: 'Ptable', url: 'https://ptable.com', desc: 'Interactive periodic table', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { name: 'PubChem', url: 'https://pubchem.ncbi.nlm.nih.gov', desc: 'Chemical compound database', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'ChemCollective', url: 'https://chemcollective.org', desc: 'Virtual chemistry labs', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', desc: 'Chemical equations & properties', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  ],
  biology: [
    { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov', desc: 'Biomedical literature search', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { name: 'HHMI BioInteractive', url: 'https://www.biointeractive.org', desc: 'Free biology resources', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { name: 'UniProt', url: 'https://www.uniprot.org', desc: 'Protein & gene database', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'UCSC Genome Browser', url: 'https://genome.ucsc.edu', desc: 'Genome visualization tool', color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20' },
  ],
  anatomy: [
    { name: 'Zygote Body', url: 'https://www.zygotebody.com', desc: 'Free 3D body explorer', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    { name: 'Kenhub', url: 'https://www.kenhub.com', desc: 'Anatomy learning platform', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'Radiopaedia', url: 'https://radiopaedia.org', desc: 'Radiology & anatomy cases', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { name: 'InnerBody', url: 'https://www.innerbody.com', desc: 'Interactive anatomy maps', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  ],
  astronomy: [
    { name: 'Stellarium Web', url: 'https://stellarium-web.org', desc: 'Online planetarium', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { name: 'NASA Eyes', url: 'https://eyes.nasa.gov', desc: '3D solar system explorer', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'NASA APOD', url: 'https://apod.nasa.gov', desc: 'Astronomy picture of the day', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { name: 'Sky Map Online', url: 'https://www.skymaponline.net', desc: 'Real-time star map', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ],
  languages: [
    { name: 'Duolingo', url: 'https://www.duolingo.com', desc: 'Gamified language learning', color: 'text-lime-400', bg: 'bg-lime-500/10 border-lime-500/20' },
    { name: 'Anki', url: 'https://apps.ankiweb.net', desc: 'Spaced repetition flashcards', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'Forvo', url: 'https://forvo.com', desc: 'Native pronunciation guide', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'Linguee', url: 'https://www.linguee.com', desc: 'Translation in context', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ],
  automation: [
    { name: 'n8n', url: 'https://n8n.io', desc: 'Open-source workflow automation', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'Make', url: 'https://www.make.com', desc: 'Visual automation builder', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    { name: 'Simulink', url: 'https://www.mathworks.com/products/simulink.html', desc: 'Model-based design & simulation', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { name: 'ROS', url: 'https://www.ros.org', desc: 'Robot Operating System', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'OpenPLC', url: 'https://openplcproject.com', desc: 'Open-source PLC runtime', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ],
  electrical: [
    { name: 'Falstad Circuit Sim', url: 'https://www.falstad.com/circuit', desc: 'Browser-based circuit simulator', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { name: 'Tinkercad Circuits', url: 'https://www.tinkercad.com/circuits', desc: 'Arduino & circuit simulator', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'LTspice', url: 'https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html', desc: 'Free SPICE circuit simulator', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'All About Circuits', url: 'https://www.allaboutcircuits.com', desc: 'EE reference & tutorials', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { name: 'CircuitLab', url: 'https://www.circuitlab.com', desc: 'Online schematic editor', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ],
  mechanical: [
    { name: 'Onshape', url: 'https://www.onshape.com', desc: 'Free browser-based CAD', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { name: 'FreeCAD', url: 'https://www.freecad.org', desc: 'Open-source 3D parametric CAD', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { name: 'SimScale', url: 'https://www.simscale.com', desc: 'CFD & FEA simulation', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { name: 'eFunda', url: 'https://www.efunda.com', desc: 'Engineering formulas & data', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { name: 'Engineers Edge', url: 'https://www.engineersedge.com', desc: 'Reference calculators & data', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  ],
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

function ToolsSection({ toolKey }: { toolKey: string }) {
  const tools = USEFUL_TOOLS[toolKey] ?? []
  if (!tools.length) return null
  return (
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Wrench className="w-3 h-3" /> Useful Tools
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {tools.map(t => (
          <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer"
            className={`flex items-center justify-between p-3 rounded-xl border transition hover:opacity-80 group ${t.bg}`}>
            <div>
              <p className={`text-xs font-semibold ${t.color}`}>{t.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{t.desc}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}

function ScienceArticleCard({ article }: { article: ModalItem }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left flex gap-3 px-2 py-3 hover:bg-gray-800/40 transition group rounded-xl"
      >
        {article.thumbnail ? (
          <img src={article.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-800 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-xs font-medium line-clamp-2 group-hover:text-violet-300 transition">{article.title}</h3>
          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{article.description}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-600 text-xs">{article.source || 'ScienceDaily'}</span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-gray-600 text-xs">{article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </button>
      {open && <NewsModal item={article} onClose={() => setOpen(false)} />}
    </>
  )
}

export default function EducationWidget({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const { tr, lang } = useLang()
  const [collapsed, setCollapsed] = useState(!defaultExpanded)
  const [mode, setMode] = useState<Mode>('science')
  const [subject, setSubject] = useState('physics')
  const [activeEngTopic, setActiveEngTopic] = useState<'automation' | 'electrical' | 'mechanical' | null>(null)
  const { data: rawData, isLoading, error } = useSWR<ModalItem[]>(
    mode === 'science' ? `/api/education?subject=${subject}&lang=${lang}` : null,
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

          {/* Mode toggle */}
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
                    <ScienceArticleCard key={i} article={article} />
                  ))}
                </div>
              </div>

              {/* Useful Tools for current subject */}
              <ToolsSection toolKey={subject} />
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
                <div className="space-y-3">
                  <TopicNewsWidget topic="automation" title={tr.automation} desc={tr.automationDesc} accentClass="text-indigo-300" icon={<Bot className="w-4 h-4" />} defaultCollapsed={false} />
                  <ToolsSection toolKey="automation" />
                </div>
              )}
              {activeEngTopic === 'electrical' && (
                <div className="space-y-3">
                  <TopicNewsWidget topic="electrical" title={tr.electrical} desc={tr.electricalDesc} accentClass="text-amber-300" icon={<Zap className="w-4 h-4" />} defaultCollapsed={false} />
                  <ToolsSection toolKey="electrical" />
                </div>
              )}
              {activeEngTopic === 'mechanical' && (
                <div className="space-y-3">
                  <TopicNewsWidget topic="mechanical" title={tr.mechanical} desc={tr.mechanicalDesc} accentClass="text-emerald-300" icon={<Cog className="w-4 h-4" />} defaultCollapsed={false} />
                  <ToolsSection toolKey="mechanical" />
                </div>
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
