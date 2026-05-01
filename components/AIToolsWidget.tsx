'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { Bot, Image, Video, PenTool, Code, Sparkles, ExternalLink, Star, Zap } from 'lucide-react'
import SectionNews from './SectionNews'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'AI Tools Directory', az: 'AI Alətlər Kataloqu', ru: 'Каталог ИИ инструментов', tr: 'YZ Araçları', de: 'KI-Tools Verzeichnis', fr: 'Répertoire Outils IA', es: 'Directorio Herramientas IA', zh: 'AI工具目录', ar: 'دليل أدوات الذكاء', ja: 'AIツールディレクトリ', it: 'Directory Strumenti IA', pt: 'Diretório Ferramentas IA' },
  free: { en: 'Free', az: 'Pulsuz', ru: 'Бесплатно', tr: 'Ücretsiz', de: 'Kostenlos', fr: 'Gratuit', es: 'Gratis', zh: '免费', ar: 'مجاني', ja: '無料', it: 'Gratuito', pt: 'Grátis' },
  freemium: { en: 'Freemium', az: 'Freemium', ru: 'Фримиум', tr: 'Freemium', de: 'Freemium', fr: 'Freemium', es: 'Freemium', zh: '免费增值', ar: 'فريميوم', ja: 'フリーミアム', it: 'Freemium', pt: 'Freemium' },
  paid: { en: 'Paid', az: 'Ödənişli', ru: 'Платно', tr: 'Ücretli', de: 'Kostenpflichtig', fr: 'Payant', es: 'De pago', zh: '付费', ar: 'مدفوع', ja: '有料', it: 'A pagamento', pt: 'Pago' },
  visit: { en: 'Visit', az: 'Keçid', ru: 'Перейти', tr: 'Ziyaret', de: 'Besuchen', fr: 'Visiter', es: 'Visitar', zh: '访问', ar: 'زيارة', ja: '訪問', it: 'Visita', pt: 'Visitar' },
  all: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tous', es: 'Todos', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' },
}

const categories = [
  { id: 'all', icon: Sparkles, label: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü' } },
  { id: 'chatbots', icon: Bot, label: { en: 'Chatbots', az: 'Chatbotlar', ru: 'Чатботы', tr: 'Sohbet' } },
  { id: 'image', icon: Image, label: { en: 'Image', az: 'Şəkil', ru: 'Изображения', tr: 'Görsel' } },
  { id: 'video', icon: Video, label: { en: 'Video', az: 'Video', ru: 'Видео', tr: 'Video' } },
  { id: 'writing', icon: PenTool, label: { en: 'Writing', az: 'Yazı', ru: 'Текст', tr: 'Yazı' } },
  { id: 'coding', icon: Code, label: { en: 'Coding', az: 'Kod', ru: 'Код', tr: 'Kod' } },
]

interface AITool {
  name: string
  desc: Record<string, string>
  url: string
  category: string
  pricing: 'free' | 'freemium' | 'paid'
  rating: number
  hot?: boolean
}

const tools: AITool[] = [
  { name: 'ChatGPT', desc: { en: 'Powerful AI chatbot by OpenAI', az: 'OpenAI-ın güclü AI chatbotu', ru: 'Мощный ИИ чатбот от OpenAI' }, url: 'https://chat.openai.com', category: 'chatbots', pricing: 'freemium', rating: 4.9, hot: true },
  { name: 'Claude', desc: { en: 'Advanced AI assistant by Anthropic', az: 'Anthropic-in qabaqcıl AI köməkçisi', ru: 'Продвинутый ИИ ассистент от Anthropic' }, url: 'https://claude.ai', category: 'chatbots', pricing: 'freemium', rating: 4.8, hot: true },
  { name: 'Gemini', desc: { en: 'Google\'s multimodal AI model', az: 'Google-un multimodal AI modeli', ru: 'Мультимодальная ИИ модель Google' }, url: 'https://gemini.google.com', category: 'chatbots', pricing: 'free', rating: 4.7, hot: true },
  { name: 'Perplexity', desc: { en: 'AI-powered search engine', az: 'AI ilə işləyən axtarış motoru', ru: 'Поисковик на базе ИИ' }, url: 'https://perplexity.ai', category: 'chatbots', pricing: 'freemium', rating: 4.7 },
  { name: 'Microsoft Copilot', desc: { en: 'AI assistant integrated with Microsoft', az: 'Microsoft ilə inteqrasiya edilmiş AI', ru: 'ИИ помощник Microsoft' }, url: 'https://copilot.microsoft.com', category: 'chatbots', pricing: 'free', rating: 4.5 },
  { name: 'DeepSeek', desc: { en: 'Open-source powerful AI chatbot', az: 'Açıq mənbəli güclü AI chatbot', ru: 'Открытый мощный ИИ чатбот' }, url: 'https://chat.deepseek.com', category: 'chatbots', pricing: 'free', rating: 4.6 },
  { name: 'Grok', desc: { en: 'xAI\'s witty AI assistant', az: 'xAI-ın hazırcavab AI köməkçisi', ru: 'Остроумный ИИ ассистент от xAI' }, url: 'https://grok.x.ai', category: 'chatbots', pricing: 'freemium', rating: 4.4 },
  { name: 'Midjourney', desc: { en: 'Best AI image generation', az: 'Ən yaxşı AI şəkil yaratma', ru: 'Лучшая генерация изображений' }, url: 'https://midjourney.com', category: 'image', pricing: 'paid', rating: 4.9, hot: true },
  { name: 'DALL-E 3', desc: { en: 'OpenAI\'s image generator', az: 'OpenAI-ın şəkil generatoru', ru: 'Генератор изображений OpenAI' }, url: 'https://openai.com/dall-e-3', category: 'image', pricing: 'freemium', rating: 4.7 },
  { name: 'Stable Diffusion', desc: { en: 'Open-source image generation', az: 'Açıq mənbəli şəkil yaratma', ru: 'Открытая генерация изображений' }, url: 'https://stability.ai', category: 'image', pricing: 'free', rating: 4.6 },
  { name: 'Leonardo AI', desc: { en: 'AI art & image generation', az: 'AI sənət və şəkil yaratma', ru: 'ИИ искусство и генерация' }, url: 'https://leonardo.ai', category: 'image', pricing: 'freemium', rating: 4.5 },
  { name: 'Ideogram', desc: { en: 'AI image generation with text', az: 'Mətnli AI şəkil yaratma', ru: 'Генерация изображений с текстом' }, url: 'https://ideogram.ai', category: 'image', pricing: 'freemium', rating: 4.5 },
  { name: 'Adobe Firefly', desc: { en: 'Adobe\'s creative AI tools', az: 'Adobe-un kreativ AI alətləri', ru: 'Креативные ИИ инструменты Adobe' }, url: 'https://firefly.adobe.com', category: 'image', pricing: 'freemium', rating: 4.6 },
  { name: 'Runway ML', desc: { en: 'AI video generation & editing', az: 'AI video yaratma və montaj', ru: 'Генерация и редактирование видео' }, url: 'https://runwayml.com', category: 'video', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Sora', desc: { en: 'OpenAI\'s text-to-video model', az: 'OpenAI-ın text-to-video modeli', ru: 'Текст-в-видео модель OpenAI' }, url: 'https://openai.com/sora', category: 'video', pricing: 'paid', rating: 4.8 },
  { name: 'Pika', desc: { en: 'AI video creation platform', az: 'AI video yaratma platforması', ru: 'Платформа создания видео' }, url: 'https://pika.art', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'HeyGen', desc: { en: 'AI avatar video generator', az: 'AI avatar video generatoru', ru: 'Генератор видео с аватаром' }, url: 'https://heygen.com', category: 'video', pricing: 'freemium', rating: 4.4 },
  { name: 'Kling AI', desc: { en: 'Advanced AI video generation', az: 'Qabaqcıl AI video yaratma', ru: 'Продвинутая генерация видео' }, url: 'https://klingai.com', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'Jasper', desc: { en: 'AI marketing & content writing', az: 'AI marketinq və məzmun yazma', ru: 'ИИ маркетинг и копирайтинг' }, url: 'https://jasper.ai', category: 'writing', pricing: 'paid', rating: 4.5 },
  { name: 'Copy.ai', desc: { en: 'AI copywriting assistant', az: 'AI kopyraytinq köməkçisi', ru: 'ИИ помощник по копирайтингу' }, url: 'https://copy.ai', category: 'writing', pricing: 'freemium', rating: 4.4 },
  { name: 'Writesonic', desc: { en: 'AI writing & SEO tool', az: 'AI yazı və SEO aləti', ru: 'ИИ для написания и SEO' }, url: 'https://writesonic.com', category: 'writing', pricing: 'freemium', rating: 4.3 },
  { name: 'Grammarly', desc: { en: 'AI writing assistant & grammar check', az: 'AI yazı köməkçisi və qrammatika', ru: 'ИИ помощник по грамматике' }, url: 'https://grammarly.com', category: 'writing', pricing: 'freemium', rating: 4.7 },
  { name: 'Notion AI', desc: { en: 'AI-powered workspace writing', az: 'AI ilə iş sahəsi yazısı', ru: 'ИИ в рабочем пространстве' }, url: 'https://notion.so', category: 'writing', pricing: 'freemium', rating: 4.6 },
  { name: 'GitHub Copilot', desc: { en: 'AI code completion & generation', az: 'AI kod tamamlama və yaratma', ru: 'ИИ автодополнение кода' }, url: 'https://github.com/features/copilot', category: 'coding', pricing: 'paid', rating: 4.8, hot: true },
  { name: 'Cursor', desc: { en: 'AI-first code editor', az: 'AI-əsaslı kod redaktoru', ru: 'ИИ-ориентированный редактор' }, url: 'https://cursor.sh', category: 'coding', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Replit AI', desc: { en: 'AI coding in the browser', az: 'Brauzerdə AI kodlaşdırma', ru: 'ИИ кодирование в браузере' }, url: 'https://replit.com', category: 'coding', pricing: 'freemium', rating: 4.5 },
  { name: 'Tabnine', desc: { en: 'AI code assistant for teams', az: 'Komandalar üçün AI kod köməkçisi', ru: 'ИИ помощник для команд' }, url: 'https://tabnine.com', category: 'coding', pricing: 'freemium', rating: 4.4 },
  { name: 'Codeium', desc: { en: 'Free AI code completion', az: 'Pulsuz AI kod tamamlama', ru: 'Бесплатное ИИ автодополнение' }, url: 'https://codeium.com', category: 'coding', pricing: 'free', rating: 4.5 },
  { name: 'v0 by Vercel', desc: { en: 'AI UI component generator', az: 'AI UI komponent generatoru', ru: 'ИИ генератор UI компонентов' }, url: 'https://v0.dev', category: 'coding', pricing: 'freemium', rating: 4.6 },
  { name: 'Bolt.new', desc: { en: 'AI full-stack app builder', az: 'AI full-stack proqram qurucusu', ru: 'ИИ конструктор приложений' }, url: 'https://bolt.new', category: 'coding', pricing: 'freemium', rating: 4.5 },
]

export default function AIToolsWidget({ defaultExpanded, initialCategory }: { defaultExpanded?: boolean; initialCategory?: string }) {
  const { lang } = useLang()
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all')
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  const c = (key: string) => COPY[key]?.[lang] || COPY[key]?.en || key

  const filtered = tools.filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (showFreeOnly && t.pricing === 'paid') return false
    return true
  })

  const pricingColor = (p: string) => {
    if (p === 'free') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    if (p === 'freemium') return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          {c('title')}
        </h2>
        <button
          onClick={() => setShowFreeOnly(!showFreeOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${showFreeOnly ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.03] text-[#8b8b9e] border-white/[0.06] hover:text-white'}`}
        >
          🆓 {c('free')}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition ${activeCategory === cat.id ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-white/[0.03] text-[#8b8b9e] border-white/[0.06] hover:text-white'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label[lang] || cat.label.en}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(tool => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-200"
          >
            {tool.hot && (
              <div className="absolute top-2 right-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
            )}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition">{tool.name}</h3>
              <ExternalLink className="w-3 h-3 text-[#4b4b60] group-hover:text-purple-400 transition opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-xs text-[#6b6b80] mb-3 line-clamp-2">{tool.desc[lang] || tool.desc.en}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${pricingColor(tool.pricing)}`}>
                {c(tool.pricing)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-[#8b8b9e]">{tool.rating}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

    <SectionNews section="aitools" tab={activeCategory} accentColor="purple" darkMode />
    </div>
  )
}
