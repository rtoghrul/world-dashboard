'use client'
import { useMemo, useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { pickLabel } from '@/lib/translations'
import { Bot, Image, Video, PenTool, Code, Sparkles, ExternalLink, Star, Zap, Music, Brain, Briefcase, Search } from 'lucide-react'
import SectionNews from './SectionNews'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'AI Tools Directory', az: 'AI Alətlər Kataloqu', ru: 'Каталог ИИ инструментов', tr: 'YZ Araçları', de: 'KI-Tools Verzeichnis', fr: 'Répertoire Outils IA', es: 'Directorio Herramientas IA', zh: 'AI工具目录', ar: 'دليل أدوات الذكاء', ja: 'AIツールディレクトリ', it: 'Directory Strumenti IA', pt: 'Diretório Ferramentas IA' },
  free: { en: 'Free', az: 'Pulsuz', ru: 'Бесплатно', tr: 'Ücretsiz', de: 'Kostenlos', fr: 'Gratuit', es: 'Gratis', zh: '免费', ar: 'مجاني', ja: '無料', it: 'Gratuito', pt: 'Grátis' },
  freemium: { en: 'Freemium', az: 'Freemium', ru: 'Фримиум', tr: 'Freemium', de: 'Freemium', fr: 'Freemium', es: 'Freemium', zh: '免费增值', ar: 'فريميوم', ja: 'フリーミアム', it: 'Freemium', pt: 'Freemium' },
  paid: { en: 'Paid', az: 'Ödənişli', ru: 'Платно', tr: 'Ücretli', de: 'Kostenpflichtig', fr: 'Payant', es: 'De pago', zh: '付费', ar: 'مدفوع', ja: '有料', it: 'A pagamento', pt: 'Pago' },
  visit: { en: 'Visit', az: 'Keçid', ru: 'Перейти', tr: 'Ziyaret', de: 'Besuchen', fr: 'Visiter', es: 'Visitar', zh: '访问', ar: 'زيارة', ja: '訪問', it: 'Visita', pt: 'Visitar' },
  all: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tous', es: 'Todos', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' },
  searchPh: { en: 'Search tools…', az: 'Alət axtar…', ru: 'Поиск инструментов…', tr: 'Araç ara…', de: 'Tools suchen…', fr: 'Rechercher…', es: 'Buscar herramientas…', zh: '搜索工具…', ja: 'ツールを検索…', ar: 'ابحث عن الأدوات…', it: 'Cerca strumenti…', pt: 'Pesquisar ferramentas…' },
  none: { en: 'No tools match your search', az: 'Axtarışa uyğun alət yoxdur', ru: 'Ничего не найдено', tr: 'Sonuç bulunamadı', de: 'Keine Tools gefunden', fr: 'Aucun résultat', es: 'Sin resultados', zh: '没有找到工具', ja: '結果なし', ar: 'لا توجد أدوات مطابقة', it: 'Nessuno strumento corrispondente', pt: 'Nenhuma ferramenta encontrada' },
}

const categories = [
  { id: 'all', icon: Sparkles, label: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tout', es: 'Todo', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' } },
  { id: 'chatbots', icon: Bot, label: { en: 'Chatbots', az: 'Chatbotlar', ru: 'Чатботы', tr: 'Sohbet', de: 'Chatbots', fr: 'Chatbots', es: 'Chatbots', zh: '聊天机器人', ar: 'روبوتات الدردشة', ja: 'チャットボット', it: 'Chatbot', pt: 'Chatbots' } },
  { id: 'image', icon: Image, label: { en: 'Image', az: 'Şəkil', ru: 'Изображения', tr: 'Görsel', de: 'Bild', fr: 'Image', es: 'Imagen', zh: '图像', ar: 'الصور', ja: '画像', it: 'Immagini', pt: 'Imagem' } },
  { id: 'video', icon: Video, label: { en: 'Video', az: 'Video', ru: 'Видео', tr: 'Video', de: 'Video', fr: 'Vidéo', es: 'Vídeo', zh: '视频', ar: 'الفيديو', ja: '動画', it: 'Video', pt: 'Vídeo' } },
  { id: 'audio', icon: Music, label: { en: 'Audio & Music', az: 'Audio & Musiqi', ru: 'Аудио и музыка', tr: 'Ses & Müzik', de: 'Audio & Musik', fr: 'Audio & musique', es: 'Audio y música', zh: '音频与音乐', ar: 'الصوت والموسيقى', ja: '音声・音楽', it: 'Audio e musica', pt: 'Áudio e música' } },
  { id: 'writing', icon: PenTool, label: { en: 'Writing', az: 'Yazı', ru: 'Текст', tr: 'Yazı', de: 'Schreiben', fr: 'Rédaction', es: 'Escritura', zh: '写作', ar: 'الكتابة', ja: 'ライティング', it: 'Scrittura', pt: 'Escrita' } },
  { id: 'coding', icon: Code, label: { en: 'Coding', az: 'Kod', ru: 'Код', tr: 'Kod', de: 'Programmieren', fr: 'Code', es: 'Programación', zh: '编程', ar: 'البرمجة', ja: 'コーディング', it: 'Programmazione', pt: 'Programação' } },
  { id: 'productivity', icon: Briefcase, label: { en: 'Productivity', az: 'Məhsuldarlıq', ru: 'Продуктивность', tr: 'Verimlilik', de: 'Produktivität', fr: 'Productivité', es: 'Productividad', zh: '效率', ar: 'الإنتاجية', ja: '生産性', it: 'Produttività', pt: 'Produtividade' } },
  { id: 'agents', icon: Brain, label: { en: 'Agents', az: 'Agentlər', ru: 'Агенты', tr: 'Ajanlar', de: 'Agenten', fr: 'Agents', es: 'Agentes', zh: '智能体', ar: 'الوكلاء', ja: 'エージェント', it: 'Agenti', pt: 'Agentes' } },
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
  // ── Chatbots ──
  { name: 'ChatGPT', desc: { en: 'Powerful AI chatbot by OpenAI', az: 'OpenAI-ın güclü AI chatbotu', ru: 'Мощный ИИ чатбот от OpenAI' }, url: 'https://chat.openai.com', category: 'chatbots', pricing: 'freemium', rating: 4.9, hot: true },
  { name: 'Claude', desc: { en: 'Advanced AI assistant by Anthropic', az: 'Anthropic-in qabaqcıl AI köməkçisi', ru: 'Продвинутый ИИ ассистент от Anthropic' }, url: 'https://claude.ai', category: 'chatbots', pricing: 'freemium', rating: 4.8, hot: true },
  { name: 'Gemini', desc: { en: 'Google\'s multimodal AI model', az: 'Google-un multimodal AI modeli', ru: 'Мультимодальная ИИ модель Google' }, url: 'https://gemini.google.com', category: 'chatbots', pricing: 'free', rating: 4.7, hot: true },
  { name: 'Perplexity', desc: { en: 'AI-powered search engine', az: 'AI ilə işləyən axtarış motoru', ru: 'Поисковик на базе ИИ' }, url: 'https://perplexity.ai', category: 'chatbots', pricing: 'freemium', rating: 4.7 },
  { name: 'Microsoft Copilot', desc: { en: 'AI assistant integrated with Microsoft', az: 'Microsoft ilə inteqrasiya edilmiş AI', ru: 'ИИ помощник Microsoft' }, url: 'https://copilot.microsoft.com', category: 'chatbots', pricing: 'free', rating: 4.5 },
  { name: 'DeepSeek', desc: { en: 'Open-source powerful AI chatbot', az: 'Açıq mənbəli güclü AI chatbot', ru: 'Открытый мощный ИИ чатбот' }, url: 'https://chat.deepseek.com', category: 'chatbots', pricing: 'free', rating: 4.6 },
  { name: 'Grok', desc: { en: 'xAI\'s witty AI assistant', az: 'xAI-ın hazırcavab AI köməkçisi', ru: 'Остроумный ИИ ассистент от xAI' }, url: 'https://grok.x.ai', category: 'chatbots', pricing: 'freemium', rating: 4.4 },
  { name: 'Le Chat (Mistral)', desc: { en: 'Fast European AI assistant', az: 'Sürətli Avropa AI köməkçisi', ru: 'Быстрый европейский ИИ' }, url: 'https://chat.mistral.ai', category: 'chatbots', pricing: 'freemium', rating: 4.6 },
  { name: 'Qwen', desc: { en: 'Alibaba multimodal chatbot', az: 'Alibaba multimodal chatbotu', ru: 'Мультимодальный чат Alibaba' }, url: 'https://chat.qwen.ai', category: 'chatbots', pricing: 'free', rating: 4.6 },
  { name: 'Meta AI', desc: { en: 'Meta assistant with Llama models', az: 'Llama modelli Meta köməkçisi', ru: 'Ассистент Meta на Llama' }, url: 'https://www.meta.ai', category: 'chatbots', pricing: 'free', rating: 4.3 },
  { name: 'Pi', desc: { en: 'Friendly personal AI companion', az: 'Mülayim şəxsi AI yoldaşı', ru: 'Дружелюбный личный ИИ' }, url: 'https://pi.ai', category: 'chatbots', pricing: 'free', rating: 4.4 },
  { name: 'HuggingChat', desc: { en: 'Open-source chat by Hugging Face', az: 'Açıq mənbəli Hugging Face chat', ru: 'Опенсорс-чат от Hugging Face' }, url: 'https://huggingface.co/chat', category: 'chatbots', pricing: 'free', rating: 4.5 },
  { name: 'Character.AI', desc: { en: 'Chat with millions of AI characters', az: 'Milyonlarla AI personajla söhbət', ru: 'Чат с миллионами ИИ-персонажей' }, url: 'https://character.ai', category: 'chatbots', pricing: 'free', rating: 4.5 },
  { name: 'Poe', desc: { en: 'All top models in one app', az: 'Bütün modellər bir tətbiqdə', ru: 'Все топ-модели в одном приложении' }, url: 'https://poe.com', category: 'chatbots', pricing: 'freemium', rating: 4.5 },
  { name: 'You.com', desc: { en: 'AI search with agent modes', az: 'Agent rejimli AI axtarış', ru: 'ИИ-поиск с агентами' }, url: 'https://you.com', category: 'chatbots', pricing: 'freemium', rating: 4.3 },
  // ── Image ──
  { name: 'Midjourney', desc: { en: 'Best AI image generation', az: 'Ən yaxşı AI şəkil yaratma', ru: 'Лучшая генерация изображений' }, url: 'https://midjourney.com', category: 'image', pricing: 'paid', rating: 4.9, hot: true },
  { name: 'DALL-E 3', desc: { en: 'OpenAI\'s image generator', az: 'OpenAI-ın şəkil generatoru', ru: 'Генератор изображений OpenAI' }, url: 'https://openai.com/dall-e-3', category: 'image', pricing: 'freemium', rating: 4.7 },
  { name: 'Stable Diffusion', desc: { en: 'Open-source image generation', az: 'Açıq mənbəli şəkil yaratma', ru: 'Открытая генерация изображений' }, url: 'https://stability.ai', category: 'image', pricing: 'free', rating: 4.6 },
  { name: 'Leonardo AI', desc: { en: 'AI art & image generation', az: 'AI sənət və şəkil yaratma', ru: 'ИИ искусство и генерация' }, url: 'https://leonardo.ai', category: 'image', pricing: 'freemium', rating: 4.5 },
  { name: 'Ideogram', desc: { en: 'AI image generation with text', az: 'Mətnli AI şəkil yaratma', ru: 'Генерация изображений с текстом' }, url: 'https://ideogram.ai', category: 'image', pricing: 'freemium', rating: 4.5 },
  { name: 'Adobe Firefly', desc: { en: 'Adobe\'s creative AI tools', az: 'Adobe-un kreativ AI alətləri', ru: 'Креативные ИИ инструменты Adobe' }, url: 'https://firefly.adobe.com', category: 'image', pricing: 'freemium', rating: 4.6 },
  { name: 'Flux (BFL)', desc: { en: 'State-of-the-art open image model', az: 'Ən güclü açıq şəkil modeli', ru: 'Лучшая открытая модель изображений' }, url: 'https://blackforestlabs.ai', category: 'image', pricing: 'freemium', rating: 4.8, hot: true },
  { name: 'Krea', desc: { en: 'Real-time AI image generation', az: 'Real-time AI şəkil yaratma', ru: 'Генерация изображений в реальном времени' }, url: 'https://www.krea.ai', category: 'image', pricing: 'freemium', rating: 4.7 },
  { name: 'Recraft', desc: { en: 'Vector + AI design generator', az: 'Vektor + AI dizayn generatoru', ru: 'Вектор + ИИ дизайн' }, url: 'https://www.recraft.ai', category: 'image', pricing: 'freemium', rating: 4.7 },
  { name: 'Civitai', desc: { en: 'Community model hub for SD', az: 'SD model icma hubu', ru: 'Хаб моделей сообщества' }, url: 'https://civitai.com', category: 'image', pricing: 'free', rating: 4.5 },
  { name: 'Playground', desc: { en: 'Free AI design tool', az: 'Pulsuz AI dizayn aləti', ru: 'Бесплатный ИИ-дизайн' }, url: 'https://playground.com', category: 'image', pricing: 'freemium', rating: 4.4 },
  { name: 'Freepik AI', desc: { en: 'AI image suite for designers', az: 'Dizaynerlər üçün AI şəkil paketi', ru: 'ИИ-графика для дизайнеров' }, url: 'https://www.freepik.com/ai', category: 'image', pricing: 'freemium', rating: 4.5 },
  { name: 'Magnific', desc: { en: 'AI upscaler & enhancer', az: 'AI upscaler və təkmilləşdirici', ru: 'ИИ-апскейлер' }, url: 'https://magnific.ai', category: 'image', pricing: 'paid', rating: 4.6 },
  { name: 'Bing Image Creator', desc: { en: 'Free DALL-E powered generator', az: 'Pulsuz DALL-E generatoru', ru: 'Бесплатный генератор на DALL-E' }, url: 'https://www.bing.com/images/create', category: 'image', pricing: 'free', rating: 4.5 },
  { name: 'Craiyon', desc: { en: 'Free simple image generator', az: 'Sadə pulsuz şəkil generatoru', ru: 'Простой бесплатный генератор' }, url: 'https://www.craiyon.com', category: 'image', pricing: 'free', rating: 4.0 },
  { name: 'Artbreeder', desc: { en: 'Blend and evolve images', az: 'Şəkilləri qarışdır və inkişaf etdir', ru: 'Смешивание и эволюция изображений' }, url: 'https://www.artbreeder.com', category: 'image', pricing: 'freemium', rating: 4.2 },
  // ── Video ──
  { name: 'Runway ML', desc: { en: 'AI video generation & editing', az: 'AI video yaratma və montaj', ru: 'Генерация и редактирование видео' }, url: 'https://runwayml.com', category: 'video', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Sora', desc: { en: 'OpenAI\'s text-to-video model', az: 'OpenAI-ın text-to-video modeli', ru: 'Текст-в-видео модель OpenAI' }, url: 'https://openai.com/sora', category: 'video', pricing: 'paid', rating: 4.8 },
  { name: 'Pika', desc: { en: 'AI video creation platform', az: 'AI video yaratma platforması', ru: 'Платформа создания видео' }, url: 'https://pika.art', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'HeyGen', desc: { en: 'AI avatar video generator', az: 'AI avatar video generatoru', ru: 'Генератор видео с аватаром' }, url: 'https://heygen.com', category: 'video', pricing: 'freemium', rating: 4.4 },
  { name: 'Kling AI', desc: { en: 'Advanced AI video generation', az: 'Qabaqcıl AI video yaratma', ru: 'Продвинутая генерация видео' }, url: 'https://klingai.com', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'CapCut', desc: { en: 'Free AI video editor with auto-captions', az: 'Avtomatik altyazılı pulsuz video redaktor', ru: 'Бесплатный видеоредактор с автосубтитрами' }, url: 'https://www.capcut.com', category: 'video', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Luma Dream Machine', desc: { en: 'Realistic AI video from text', az: 'Mətndən realistik AI video', ru: 'Реалистичное ИИ-видео из текста' }, url: 'https://lumalabs.ai/dream-machine', category: 'video', pricing: 'freemium', rating: 4.6 },
  { name: 'Hailuo AI', desc: { en: 'MiniMax video generation', az: 'MiniMax video generasiyası', ru: 'Генерация видео MiniMax' }, url: 'https://hailuoai.video', category: 'video', pricing: 'freemium', rating: 4.6 },
  { name: 'Vidu', desc: { en: 'Fast anime & realistic video AI', az: 'Sürətli anime və real video AI', ru: 'Быстрое ИИ-видео, аниме' }, url: 'https://www.vidu.com', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'LTX Studio', desc: { en: 'AI filmmaking studio', az: 'AI film istehsal studiyası', ru: 'Студия ИИ-кинопроизводства' }, url: 'https://ltx.studio', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'Descript', desc: { en: 'Edit videos like text docs', az: 'Videonu mətn kimi redaktə et', ru: 'Монтаж видео как текста' }, url: 'https://www.descript.com', category: 'video', pricing: 'freemium', rating: 4.6 },
  { name: 'Opus Clip', desc: { en: 'Turn long videos into viral clips', az: 'Uzun videodan viral kliplər', ru: 'Длинные видео в вирусные клипы' }, url: 'https://www.opus.pro', category: 'video', pricing: 'freemium', rating: 4.5 },
  { name: 'VEED.io', desc: { en: 'Online video editor with AI tools', az: 'AI alətli onlayn video redaktor', ru: 'Онлайн-редактор с ИИ' }, url: 'https://www.veed.io', category: 'video', pricing: 'freemium', rating: 4.4 },
  { name: 'Synthesia', desc: { en: 'AI avatars for training videos', az: 'Təlim videoları üçün AI avatarlar', ru: 'ИИ-аватары для обучающих видео' }, url: 'https://www.synthesia.io', category: 'video', pricing: 'paid', rating: 4.6 },
  { name: 'InVideo', desc: { en: 'AI video generator from prompts', az: 'Promptdan AI video', ru: 'ИИ-видео из запросов' }, url: 'https://invideo.io', category: 'video', pricing: 'freemium', rating: 4.4 },
  // ── Audio & Music ──
  { name: 'Suno', desc: { en: 'AI music: full songs from text', az: 'Mətndən tam AI mahnılar', ru: 'Полные песни из текста' }, url: 'https://suno.com', category: 'audio', pricing: 'freemium', rating: 4.8, hot: true },
  { name: 'Udio', desc: { en: 'AI music creation, studio quality', az: 'Studio keyfiyyətli AI musiqi', ru: 'ИИ-музыка студийного качества' }, url: 'https://www.udio.com', category: 'audio', pricing: 'freemium', rating: 4.7 },
  { name: 'ElevenLabs', desc: { en: 'Best AI voices & dubbing', az: 'Ən yaxşı AI səslər və dublyaj', ru: 'Лучшие ИИ-голоса и дубляж' }, url: 'https://elevenlabs.io', category: 'audio', pricing: 'freemium', rating: 4.8, hot: true },
  { name: 'Murf', desc: { en: 'Studio voiceovers from text', az: 'Mətndən studio səsləndirmə', ru: 'Студийная озвучка из текста' }, url: 'https://murf.ai', category: 'audio', pricing: 'freemium', rating: 4.5 },
  { name: 'Play.ht', desc: { en: 'Realistic TTS & voice cloning', az: 'Realistik TTS və səs klonlama', ru: 'Реалистичный TTS и клонирование' }, url: 'https://play.ht', category: 'audio', pricing: 'freemium', rating: 4.5 },
  { name: 'Moises', desc: { en: 'Stem separation & practice app', az: 'Treklərin ayrılması üçün tətbiq', ru: 'Разделение треков на дорожки' }, url: 'https://moises.ai', category: 'audio', pricing: 'freemium', rating: 4.6 },
  { name: 'Adobe Podcast', desc: { en: 'Free studio-quality audio cleanup', az: 'Pulsuz studio səs təmizliyi', ru: 'Бесплатная очистка звука' }, url: 'https://podcast.adobe.com', category: 'audio', pricing: 'free', rating: 4.6 },
  { name: 'Krisp', desc: { en: 'AI noise cancellation for calls', az: 'Zənglər üçün AI səs-küy ləğvi', ru: 'ИИ-шумоподавление для звонков' }, url: 'https://krisp.ai', category: 'audio', pricing: 'freemium', rating: 4.5 },
  { name: 'AIVA', desc: { en: 'AI composer for soundtracks', az: 'Soundtrek üçün AI bəstəkar', ru: 'ИИ-композитор саундтреков' }, url: 'https://www.aiva.ai', category: 'audio', pricing: 'freemium', rating: 4.3 },
  // ── Writing ──
  { name: 'Jasper', desc: { en: 'AI marketing & content writing', az: 'AI marketinq və məzmun yazma', ru: 'ИИ маркетинг и копирайтинг' }, url: 'https://jasper.ai', category: 'writing', pricing: 'paid', rating: 4.5 },
  { name: 'Copy.ai', desc: { en: 'AI copywriting assistant', az: 'AI kopyraytinq köməkçisi', ru: 'ИИ помощник по копирайтингу' }, url: 'https://copy.ai', category: 'writing', pricing: 'freemium', rating: 4.4 },
  { name: 'Writesonic', desc: { en: 'AI writing & SEO tool', az: 'AI yazı və SEO aləti', ru: 'ИИ для написания и SEO' }, url: 'https://writesonic.com', category: 'writing', pricing: 'freemium', rating: 4.3 },
  { name: 'Grammarly', desc: { en: 'AI writing assistant & grammar check', az: 'AI yazı köməkçisi və qrammatika', ru: 'ИИ помощник по грамматике' }, url: 'https://grammarly.com', category: 'writing', pricing: 'freemium', rating: 4.7 },
  { name: 'Notion AI', desc: { en: 'AI-powered workspace writing', az: 'AI ilə iş sahəsi yazısı', ru: 'ИИ в рабочем пространстве' }, url: 'https://notion.so', category: 'writing', pricing: 'freemium', rating: 4.6 },
  { name: 'DeepL Write', desc: { en: 'Best translation & rewriting', az: 'Ən yaxşı tərcümə və redaktə', ru: 'Лучший перевод и рерайт' }, url: 'https://www.deepl.com/write', category: 'writing', pricing: 'free', rating: 4.8, hot: true },
  { name: 'QuillBot', desc: { en: 'Paraphrasing & summarizing', az: 'Parafraz və xülasə', ru: 'Парафраз и суммаризация' }, url: 'https://quillbot.com', category: 'writing', pricing: 'freemium', rating: 4.5 },
  { name: 'Wordtune', desc: { en: 'Rewrite sentences with AI', az: 'Cümlələri AI ilə yenidən yaz', ru: 'Переписывание предложений' }, url: 'https://www.wordtune.com', category: 'writing', pricing: 'freemium', rating: 4.4 },
  { name: 'Rytr', desc: { en: 'Quick AI copy for marketing', az: 'Marketinq üçün sürətli AI mətn', ru: 'Быстрый ИИ-копирайтинг' }, url: 'https://rytr.me', category: 'writing', pricing: 'freemium', rating: 4.4 },
  { name: 'Sudowrite', desc: { en: 'AI for creative fiction writing', az: 'Bədii yazı üçün AI', ru: 'ИИ для художественной литературы' }, url: 'https://www.sudowrite.com', category: 'writing', pricing: 'paid', rating: 4.5 },
  { name: 'Hemingway', desc: { en: 'Readability editor, free web app', az: 'Oxunaqlıq redaktoru, pulsuz', ru: 'Редактор читаемости' }, url: 'https://hemingwayapp.com', category: 'writing', pricing: 'free', rating: 4.3 },
  { name: 'Simplified', desc: { en: 'All-in-one AI marketing suite', az: 'AI marketinq paketi', ru: 'ИИ-набор для маркетинга' }, url: 'https://simplified.com', category: 'writing', pricing: 'freemium', rating: 4.3 },
  // ── Coding ──
  { name: 'GitHub Copilot', desc: { en: 'AI code completion & generation', az: 'AI kod tamamlama və yaratma', ru: 'ИИ автодополнение кода' }, url: 'https://github.com/features/copilot', category: 'coding', pricing: 'paid', rating: 4.8, hot: true },
  { name: 'Cursor', desc: { en: 'AI-first code editor', az: 'AI-əsaslı kod redaktoru', ru: 'ИИ-ориентированный редактор' }, url: 'https://cursor.sh', category: 'coding', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Replit AI', desc: { en: 'AI coding in the browser', az: 'Brauzerdə AI kodlaşdırma', ru: 'ИИ кодирование в браузере' }, url: 'https://replit.com', category: 'coding', pricing: 'freemium', rating: 4.5 },
  { name: 'Tabnine', desc: { en: 'AI code assistant for teams', az: 'Komandalar üçün AI kod köməkçisi', ru: 'ИИ помощник для команд' }, url: 'https://tabnine.com', category: 'coding', pricing: 'freemium', rating: 4.4 },
  { name: 'Codeium', desc: { en: 'Free AI code completion', az: 'Pulsuz AI kod tamamlama', ru: 'Бесплатное ИИ автодополнение' }, url: 'https://codeium.com', category: 'coding', pricing: 'free', rating: 4.5 },
  { name: 'v0 by Vercel', desc: { en: 'AI UI component generator', az: 'AI UI komponent generatoru', ru: 'ИИ генератор UI компонентов' }, url: 'https://v0.dev', category: 'coding', pricing: 'freemium', rating: 4.6 },
  { name: 'Bolt.new', desc: { en: 'AI full-stack app builder', az: 'AI full-stack proqram qurucusu', ru: 'ИИ конструктор приложений' }, url: 'https://bolt.new', category: 'coding', pricing: 'freemium', rating: 4.5 },
  { name: 'Windsurf', desc: { en: 'Agentic AI code editor', az: 'Agentik AI kod redaktoru', ru: 'Агентный ИИ-редактор кода' }, url: 'https://windsurf.com', category: 'coding', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Lovable', desc: { en: 'AI app builder from chat', az: 'Söhbətdən AI tətbiq qurucusu', ru: 'Создание приложений из чата' }, url: 'https://lovable.dev', category: 'coding', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Warp', desc: { en: 'AI terminal for developers', az: 'Developerlər üçün AI terminal', ru: 'ИИ-терминал для разработчиков' }, url: 'https://www.warp.dev', category: 'coding', pricing: 'freemium', rating: 4.6 },
  { name: 'Zed', desc: { en: 'Blazing fast open-source editor', az: 'Çox sürətli açıq mənbəli redaktor', ru: 'Быстрый опенсорс-редактор' }, url: 'https://zed.dev', category: 'coding', pricing: 'free', rating: 4.7 },
  { name: 'JetBrains AI', desc: { en: 'AI inside JetBrains IDEs', az: 'JetBrains IDE-lərdə AI', ru: 'ИИ внутри JetBrains IDE' }, url: 'https://www.jetbrains.com/ai', category: 'coding', pricing: 'freemium', rating: 4.5 },
  { name: 'Amazon Q Developer', desc: { en: 'AWS AI coding assistant', az: 'AWS AI kodlaşdırma köməkçisi', ru: 'ИИ-ассистент AWS' }, url: 'https://aws.amazon.com/q/developer', category: 'coding', pricing: 'free', rating: 4.4 },
  { name: 'Aider', desc: { en: 'AI pair programming in terminal', az: 'Terminalda AI cüt proqramlaşdırma', ru: 'ИИ-парное программирование' }, url: 'https://aider.chat', category: 'coding', pricing: 'free', rating: 4.6 },
  { name: 'Cody (Sourcegraph)', desc: { en: 'AI coding with codebase context', az: 'Kod bazası kontekstli AI', ru: 'ИИ с контекстом кодовой базы' }, url: 'https://sourcegraph.com/cody', category: 'coding', pricing: 'freemium', rating: 4.4 },
  { name: 'Phind', desc: { en: 'AI search for developers', az: 'Developerlər üçün AI axtarış', ru: 'ИИ-поиск для разработчиков' }, url: 'https://www.phind.com', category: 'coding', pricing: 'freemium', rating: 4.5 },
  { name: 'Devin', desc: { en: 'Autonomous AI software engineer', az: 'Müstəqil AI proqram mühəndisi', ru: 'Автономный ИИ-инженер' }, url: 'https://devin.ai', category: 'coding', pricing: 'paid', rating: 4.3 },
  // ── Productivity ──
  { name: 'Gamma', desc: { en: 'AI presentations & docs', az: 'AI prezentasiya və sənədlər', ru: 'ИИ-презентации и документы' }, url: 'https://gamma.app', category: 'productivity', pricing: 'freemium', rating: 4.7, hot: true },
  { name: 'Canva AI', desc: { en: 'Magic design for everything', az: 'Hər şey üçün sehrli dizayn', ru: 'Магический дизайн' }, url: 'https://www.canva.com', category: 'productivity', pricing: 'freemium', rating: 4.7 },
  { name: 'Otter.ai', desc: { en: 'AI meeting notes & transcripts', az: 'AI görüş qeydləri və transkript', ru: 'ИИ-заметки и транскрипты встреч' }, url: 'https://otter.ai', category: 'productivity', pricing: 'freemium', rating: 4.5 },
  { name: 'Fireflies', desc: { en: 'Meeting recorder + AI summaries', az: 'Görüş yazıcısı + AI xülasə', ru: 'Запись встреч + ИИ-саммари' }, url: 'https://fireflies.ai', category: 'productivity', pricing: 'freemium', rating: 4.5 },
  { name: 'Beautiful.ai', desc: { en: 'Smart slide design automation', az: 'Ağıllı slayd dizaynı', ru: 'Умный дизайн слайдов' }, url: 'https://www.beautiful.ai', category: 'productivity', pricing: 'paid', rating: 4.4 },
  { name: 'Motion', desc: { en: 'AI calendar & task manager', az: 'AI təqvim və tapşırıq meneceri', ru: 'ИИ-календарь и задачи' }, url: 'https://www.usemotion.com', category: 'productivity', pricing: 'paid', rating: 4.4 },
  { name: 'Mem', desc: { en: 'Self-organizing AI notes', az: 'Öz-özünə düzələn AI qeydlər', ru: 'Самоорганизующиеся ИИ-заметки' }, url: 'https://get.mem.ai', category: 'productivity', pricing: 'freemium', rating: 4.3 },
  { name: 'Raycast AI', desc: { en: 'AI on your macOS hotkey', az: 'macOS hotkey-də AI', ru: 'ИИ по горячей клавише macOS' }, url: 'https://www.raycast.com/ai', category: 'productivity', pricing: 'freemium', rating: 4.6 },
  { name: 'Tome', desc: { en: 'AI storytelling & presentations', az: 'AI hekayə və prezentasiya', ru: 'ИИ-сторителлинг и презентации' }, url: 'https://tome.app', category: 'productivity', pricing: 'freemium', rating: 4.2 },
  // ── Agents ──
  { name: 'Manus', desc: { en: 'Autonomous general AI agent', az: 'Müstəqil universal AI agent', ru: 'Автономный универсальный ИИ-агент' }, url: 'https://manus.im', category: 'agents', pricing: 'freemium', rating: 4.6, hot: true },
  { name: 'n8n', desc: { en: 'Workflow automation with AI agents', az: 'AI agentli workflow avtomatlaşdırma', ru: 'Автоматизация с ИИ-агентами' }, url: 'https://n8n.io', category: 'agents', pricing: 'freemium', rating: 4.7 },
  { name: 'Zapier Agents', desc: { en: 'AI agents across 7000+ apps', az: '7000+ tətbiqdə AI agentlər', ru: 'ИИ-агенты для 7000+ приложений' }, url: 'https://zapier.com/agents', category: 'agents', pricing: 'freemium', rating: 4.4 },
  { name: 'Lindy', desc: { en: 'AI employees for business tasks', az: 'Biznes üçün AI işçilər', ru: 'ИИ-сотрудники для бизнеса' }, url: 'https://www.lindy.ai', category: 'agents', pricing: 'freemium', rating: 4.4 },
  { name: 'Relevance AI', desc: { en: 'Build AI workforce platforms', az: 'AI işçi qüvvəsi platforması', ru: 'Платформы ИИ-работников' }, url: 'https://relevanceai.com', category: 'agents', pricing: 'freemium', rating: 4.4 },
  { name: 'AgentGPT', desc: { en: 'Autonomous agents in browser', az: 'Brauzerdə muxtar agentlər', ru: 'Автономные агенты в браузере' }, url: 'https://agentgpt.reworkd.ai', category: 'agents', pricing: 'free', rating: 4.2 },
  { name: 'LangChain', desc: { en: 'Framework for building AI agents', az: 'AI agent qurma framework-u', ru: 'Фреймворк для ИИ-агентов' }, url: 'https://www.langchain.com', category: 'agents', pricing: 'free', rating: 4.5 },
]

const favicon = (url: string) => {
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64` } catch { return '' }
}

export default function AIToolsWidget({ defaultExpanded, initialCategory }: { defaultExpanded?: boolean; initialCategory?: string }) {
  const { lang } = useLang()
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all')
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [query, setQuery] = useState('')

  const c = (key: string) => COPY[key]?.[lang] || COPY[key]?.en || key

  const countFor = (id: string) => tools.filter(t => id === 'all' || t.category === id).length

  const filtered = useMemo(() => tools.filter(t => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (showFreeOnly && t.pricing === 'paid') return false
    if (query) {
      const q = query.toLowerCase()
      if (!t.name.toLowerCase().includes(q) && !(t.desc.en || '').toLowerCase().includes(q)) return false
    }
    return true
  }), [activeCategory, showFreeOnly, query])

  const pricingColor = (p: string) => {
    if (p === 'free') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    if (p === 'freemium') return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-ink-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          {c('title')}
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[10px] font-semibold text-purple-300">{tools.length}</span>
        </h2>
        <button
          onClick={() => setShowFreeOnly(!showFreeOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${showFreeOnly ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-fg/[0.03] text-ink-3 border-line hover:text-ink-1'}`}
        >
          🆓 {c('free')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-4" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={c('searchPh')}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-fg/[0.03] border border-line-strong text-sm text-ink-1 placeholder-ink-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/30 transition"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => {
          const Icon = cat.icon
          const count = countFor(cat.id)
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition ${activeCategory === cat.id ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-fg/[0.03] text-ink-3 border-line hover:text-ink-1'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {pickLabel(cat.label, lang)}
              <span className={`ml-0.5 px-1.5 rounded-full text-[10px] ${activeCategory === cat.id ? 'bg-purple-500/30 text-purple-200' : 'bg-fg/[0.06] text-ink-4'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center rounded-xl border border-line bg-fg/[0.02]">
          <p className="text-ink-3 text-sm">{c('none')}</p>
          <button onClick={() => { setQuery(''); setActiveCategory('all'); setShowFreeOnly(false) }} className="mt-3 px-4 py-1.5 rounded-lg bg-purple-500/15 text-purple-300 text-xs font-medium hover:bg-purple-500/25 transition">
            ✕ Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(tool => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-xl bg-fg/[0.02] border border-line hover:border-purple-500/30 hover:bg-fg/[0.04] transition-all duration-200"
            >
              {tool.hot && (
                <div className="absolute top-2 right-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
              )}
              <div className="flex items-start gap-3 mb-2">
                <img src={favicon(tool.url)} alt="" loading="lazy" className="w-8 h-8 rounded-lg bg-fg/[0.06] border border-line shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-ink-1 group-hover:text-purple-300 transition truncate">{tool.name}</h3>
                  <p className="text-[10px] text-ink-4 truncate">{new URL(tool.url).hostname.replace('www.', '')}</p>
                </div>
              </div>
              <p className="text-xs text-ink-4 mb-3 line-clamp-2">{tool.desc[lang] || tool.desc.en}</p>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${pricingColor(tool.pricing)}`}>
                  {c(tool.pricing)}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-ink-3">{tool.rating}</span>
                  <ExternalLink className="w-3 h-3 text-ink-4 group-hover:text-purple-400 transition opacity-0 group-hover:opacity-100 ml-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

    <SectionNews section="aitools" tab={activeCategory} accentColor="purple" darkMode />
    </div>
  )
}
