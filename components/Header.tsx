'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Globe, ChevronDown, LogOut, X, Search } from 'lucide-react'
import LanguagePicker from '@/components/LanguagePicker'
import { useLang } from '@/lib/LanguageContext'
import NotificationCenter from '@/components/NotificationCenter'
import ThemeToggle from '@/components/ThemeToggle'
import BookmarksPanel from '@/components/BookmarksPanel'
import FocusMode from '@/components/FocusMode'
import WhatsNew from '@/components/WhatsNew'
import { createClient } from '@/lib/supabase'

const menuStructure: Record<string, { label: Record<string,string>; items: { id: string; label: Record<string,string> }[] }> = {
  news: {
    label: { en: 'News', az: 'Xəbərlər', ru: 'Новости', tr: 'Haberler', de: 'Nachrichten', fr: 'Actualités', es: 'Noticias', zh: '新闻', ar: 'أخبار', ja: 'ニュース', it: 'Notizie', pt: 'Notícias' },
    items: [
      { id: 'top', label: { en: 'Top', az: 'Əsas', ru: 'Главное', tr: 'Öne Çıkan', de: 'Top', fr: 'À la une', es: 'Destacado', zh: '头条', ar: 'رئيسية', ja: 'トップ', it: 'Top', pt: 'Destaque' } },
      { id: 'war', label: { en: 'War & Conflicts', az: 'Müharibə', ru: 'Война', tr: 'Savaş', de: 'Krieg', fr: 'Guerre', es: 'Guerra', zh: '战争', ar: 'حرب', ja: '戦争', it: 'Guerra', pt: 'Guerra' } },
      { id: 'politics', label: { en: 'Politics', az: 'Siyasət', ru: 'Политика', tr: 'Politika', de: 'Politik', fr: 'Politique', es: 'Política', zh: '政治', ar: 'سياسة', ja: '政治', it: 'Politica', pt: 'Política' } },
      { id: 'economy', label: { en: 'Economy', az: 'İqtisadiyyat', ru: 'Экономика', tr: 'Ekonomi', de: 'Wirtschaft', fr: 'Économie', es: 'Economía', zh: '经济', ar: 'اقتصاد', ja: '経済', it: 'Economia', pt: 'Economia' } },
      { id: 'tech', label: { en: 'Technology', az: 'Texnologiya', ru: 'Технологии', tr: 'Teknoloji', de: 'Technik', fr: 'Tech', es: 'Tecnología', zh: '科技', ar: 'تقنية', ja: 'テクノロジー', it: 'Tecnologia', pt: 'Tecnologia' } },
      { id: 'ai', label: { en: 'AI & Tech', az: 'AI & Texno', ru: 'ИИ', tr: 'YZ', de: 'KI', fr: 'IA', es: 'IA', zh: 'AI', ar: 'ذ.ا.', ja: 'AI', it: 'IA', pt: 'IA' } },
      { id: 'science', label: { en: 'Science', az: 'Elm', ru: 'Наука', tr: 'Bilim', de: 'Wissenschaft', fr: 'Science', es: 'Ciencia', zh: '科学', ar: 'علوم', ja: '科学', it: 'Scienza', pt: 'Ciência' } },
      { id: 'sports', label: { en: 'Sports', az: 'İdman', ru: 'Спорт', tr: 'Spor', de: 'Sport', fr: 'Sport', es: 'Deportes', zh: '体育', ar: 'رياضة', ja: 'スポーツ', it: 'Sport', pt: 'Esportes' } },
      { id: 'health', label: { en: 'Health', az: 'Səhiyyə', ru: 'Здоровье', tr: 'Sağlık', de: 'Gesundheit', fr: 'Santé', es: 'Salud', zh: '健康', ar: 'صحة', ja: '健康', it: 'Salute', pt: 'Saúde' } },
      { id: 'industry', label: { en: 'Industry', az: 'Sənaye', ru: 'Индустрия', tr: 'Endüstri', de: 'Industrie', fr: 'Industrie', es: 'Industria', zh: '产业', ar: 'صناعة', ja: '産業', it: 'Industria', pt: 'Indústria' } },
    ]
  },
  markets: {
    label: { en: 'Finance', az: 'Bazarlar', ru: 'Рынки', tr: 'Piyasalar', de: 'Märkte', fr: 'Marchés', es: 'Mercados', zh: '市场', ar: 'أسواق', ja: '市場', it: 'Mercati', pt: 'Mercados' },
    items: [
      { id: 'crypto-top', label: { en: 'Crypto Top', az: 'Kripto Top', ru: 'Крипто Топ', tr: 'Kripto Top', de: 'Krypto Top', fr: 'Crypto Top', es: 'Cripto Top', zh: '加密Top', ar: 'كريبتو', ja: '仮想通貨Top', it: 'Crypto Top', pt: 'Cripto Top' } },
      { id: 'bitcoin', label: { en: 'Bitcoin', az: 'Bitcoin', ru: 'Bitcoin', tr: 'Bitcoin', de: 'Bitcoin', fr: 'Bitcoin', es: 'Bitcoin', zh: 'Bitcoin', ar: 'بيتكوين', ja: 'Bitcoin', it: 'Bitcoin', pt: 'Bitcoin' } },
      { id: 'ethereum', label: { en: 'Ethereum', az: 'Ethereum', ru: 'Ethereum', tr: 'Ethereum', de: 'Ethereum', fr: 'Ethereum', es: 'Ethereum', zh: 'Ethereum', ar: 'إيثيريوم', ja: 'Ethereum', it: 'Ethereum', pt: 'Ethereum' } },
      { id: 'fear-greed', label: { en: 'Fear & Greed', az: 'Qorxu & Tamah', ru: 'Страх & Жадность', tr: 'Korku & Açgöz', de: 'Angst & Gier', fr: 'Peur & Avidité', es: 'Miedo & Codicia', zh: '恐惧与贪婪', ar: 'خوف وطمع', ja: '恐怖と貪欲', it: 'Paura & Avidità', pt: 'Medo & Ganância' } },
      { id: 'whale', label: { en: 'Whale Activity', az: 'Balina', ru: 'Киты', tr: 'Balina', de: 'Wale', fr: 'Baleines', es: 'Ballenas', zh: '鲸鱼', ar: 'حيتان', ja: 'クジラ', it: 'Balene', pt: 'Baleias' } },
      { id: 'stocks-top', label: { en: 'Stocks', az: 'Səhmlər', ru: 'Акции', tr: 'Hisseler', de: 'Aktien', fr: 'Actions', es: 'Acciones', zh: '股票', ar: 'أسهم', ja: '株式', it: 'Azioni', pt: 'Ações' } },
      { id: 'gainers', label: { en: 'Top Gainers', az: 'Qalxanlar', ru: 'Рост', tr: 'Kazananlar', de: 'Gewinner', fr: 'Gagnants', es: 'Ganadores', zh: '涨幅榜', ar: 'رابحون', ja: '上昇', it: 'In rialzo', pt: 'Em alta' } },
      { id: 'losers', label: { en: 'Top Losers', az: 'Düşənlər', ru: 'Падение', tr: 'Kaybedenler', de: 'Verlierer', fr: 'Perdants', es: 'Perdedores', zh: '跌幅榜', ar: 'خاسرون', ja: '下落', it: 'In ribasso', pt: 'Em baixa' } },
    ]
  },
  entertainment: {
    label: { en: 'Entertainment', az: 'Əyləncə', ru: 'Развлечения', tr: 'Eğlence', de: 'Unterhaltung', fr: 'Divertissement', es: 'Entretenimiento', zh: '娱乐', ar: 'ترفيه', ja: 'エンタメ', it: 'Intrattenimento', pt: 'Entretenimento' },
    items: [
      { id: 'movies', label: { en: 'Movies', az: 'Filmlər', ru: 'Фильмы', tr: 'Filmler', de: 'Filme', fr: 'Films', es: 'Películas', zh: '电影', ar: 'أفلام', ja: '映画', it: 'Film', pt: 'Filmes' } },
      { id: 'series', label: { en: 'TV Series', az: 'Seriallar', ru: 'Сериалы', tr: 'Diziler', de: 'Serien', fr: 'Séries', es: 'Series', zh: '剧集', ar: 'مسلسلات', ja: 'ドラマ', it: 'Serie', pt: 'Séries' } },
      { id: 'anime', label: { en: 'Anime', az: 'Anime', ru: 'Аниме', tr: 'Anime', de: 'Anime', fr: 'Anime', es: 'Anime', zh: '动漫', ar: 'أنمي', ja: 'アニメ', it: 'Anime', pt: 'Anime' } },
      { id: 'gaming', label: { en: 'Gaming', az: 'Oyunlar', ru: 'Игры', tr: 'Oyunlar', de: 'Spiele', fr: 'Jeux', es: 'Juegos', zh: '游戏', ar: 'ألعاب', ja: 'ゲーム', it: 'Giochi', pt: 'Jogos' } },
      { id: 'upcoming', label: { en: 'Upcoming', az: 'Gözlənilən', ru: 'Скоро', tr: 'Yakında', de: 'Demnächst', fr: 'À venir', es: 'Próximamente', zh: '即将上映', ar: 'قادم', ja: '近日公開', it: 'In arrivo', pt: 'Em breve' } },
      { id: 'cartoons', label: { en: 'Cartoons', az: 'Cizgi filmlər', ru: 'Мультфильмы', tr: 'Çizgi Film', de: 'Zeichentrick', fr: 'Dessins animés', es: 'Dibujos', zh: '动画', ar: 'رسوم', ja: 'アニメ', it: 'Cartoni', pt: 'Desenhos' } },
    
      { id: 'youtube', section: 'viral', label: { en: 'YouTube', az: 'YouTube', ru: 'YouTube', tr: 'YouTube', de: 'YouTube', fr: 'YouTube', es: 'YouTube', zh: 'YouTube', ar: 'يوتيوب', ja: 'YouTube', it: 'YouTube', pt: 'YouTube' } },
      { id: 'tiktok', section: 'viral', label: { en: 'TikTok', az: 'TikTok', ru: 'TikTok', tr: 'TikTok', de: 'TikTok', fr: 'TikTok', es: 'TikTok', zh: 'TikTok', ar: 'تيك توك', ja: 'TikTok', it: 'TikTok', pt: 'TikTok' } },
      { id: 'instagram', section: 'viral', label: { en: 'Instagram', az: 'Instagram', ru: 'Instagram', tr: 'Instagram', de: 'Instagram', fr: 'Instagram', es: 'Instagram', zh: 'Instagram', ar: 'إنستغرام', ja: 'Instagram', it: 'Instagram', pt: 'Instagram' } },
      { id: 'music', section: 'viral', label: { en: 'Music', az: 'Musiqi', ru: 'Музыка', tr: 'Müzik', de: 'Musik', fr: 'Musique', es: 'Música', zh: '音乐', ar: 'موسيقى', ja: '音楽', it: 'Musica', pt: 'Música' } },
      { id: 'shorts', section: 'viral', label: { en: 'Shorts', az: 'Shorts', ru: 'Shorts', tr: 'Shorts', de: 'Shorts', fr: 'Shorts', es: 'Shorts', zh: '短视频', ar: 'Shorts', ja: 'ショート', it: 'Shorts', pt: 'Shorts' } },
      { id: 'trending', section: 'viral', label: { en: 'Trending', az: 'Trend', ru: 'Тренды', tr: 'Trend', de: 'Trending', fr: 'Tendances', es: 'Tendencias', zh: '热门', ar: 'رائج', ja: 'トレンド', it: 'Tendenze', pt: 'Tendências' } },
    
    ]
  },
  aitools: {
    label: { en: 'Tech & AI', az: 'AI Alətlər', ru: 'ИИ Инструменты', tr: 'YZ Araçları', de: 'KI-Tools', fr: 'Outils IA', es: 'Herramientas IA', zh: 'AI工具', ar: 'أدوات ذ.ا.', ja: 'AIツール', it: 'Strumenti IA', pt: 'Ferramentas IA' },
    items: [
      { id: 'chatbots', label: { en: 'AI Chatbots', az: 'AI Chatbotlar', ru: 'ИИ Чатботы', tr: 'YZ Sohbet', de: 'KI-Chatbots', fr: 'Chatbots IA', es: 'Chatbots IA', zh: 'AI聊天', ar: 'محادثة ذ.ا.', ja: 'AIチャット', it: 'Chatbot IA', pt: 'Chatbots IA' } },
      { id: 'image-gen', label: { en: 'Image Generation', az: 'Şəkil Yaratma', ru: 'Генерация изображений', tr: 'Görsel Üretme', de: 'Bildgenerierung', fr: 'Génération images', es: 'Generación imágenes', zh: 'AI绘画', ar: 'توليد صور', ja: '画像生成', it: 'Generazione immagini', pt: 'Geração de imagens' } },
      { id: 'video-gen', label: { en: 'Video AI', az: 'Video AI', ru: 'Видео ИИ', tr: 'Video YZ', de: 'Video-KI', fr: 'Vidéo IA', es: 'Video IA', zh: 'AI视频', ar: 'فيديو ذ.ا.', ja: '動画AI', it: 'Video IA', pt: 'Vídeo IA' } },
      { id: 'writing', label: { en: 'Writing AI', az: 'Yazı AI', ru: 'Написание ИИ', tr: 'Yazı YZ', de: 'Schreib-KI', fr: 'Écriture IA', es: 'Escritura IA', zh: 'AI写作', ar: 'كتابة ذ.ا.', ja: '文章AI', it: 'Scrittura IA', pt: 'Escrita IA' } },
      { id: 'coding', label: { en: 'Coding AI', az: 'Proqramlaşdırma AI', ru: 'Код ИИ', tr: 'Kodlama YZ', de: 'Coding-KI', fr: 'Code IA', es: 'Código IA', zh: 'AI编程', ar: 'برمجة ذ.ا.', ja: 'コードAI', it: 'Codifica IA', pt: 'Código IA' } },
      { id: 'free-tools', label: { en: 'Free AI Tools', az: 'Pulsuz AI', ru: 'Бесплатные ИИ', tr: 'Ücretsiz YZ', de: 'Kostenlose KI', fr: 'IA Gratuits', es: 'IA Gratis', zh: '免费AI', ar: 'ذ.ا. مجاني', ja: '無料AI', it: 'IA Gratuiti', pt: 'IA Grátis' } },
    
      { id: 'android', section: 'software', label: { en: 'Android Apps', az: 'Android', ru: 'Android', tr: 'Android', de: 'Android', fr: 'Android', es: 'Android', zh: 'Android', ar: 'أندرويد', ja: 'Android', it: 'Android', pt: 'Android' } },
      { id: 'ios', section: 'software', label: { en: 'iOS Apps', az: 'iOS', ru: 'iOS', tr: 'iOS', de: 'iOS', fr: 'iOS', es: 'iOS', zh: 'iOS', ar: 'iOS', ja: 'iOS', it: 'iOS', pt: 'iOS' } },
      { id: 'windows', section: 'software', label: { en: 'Windows Software', az: 'Windows', ru: 'Windows', tr: 'Windows', de: 'Windows', fr: 'Windows', es: 'Windows', zh: 'Windows', ar: 'ويندوز', ja: 'Windows', it: 'Windows', pt: 'Windows' } },
      { id: 'mac', section: 'software', label: { en: 'Mac Apps', az: 'Mac', ru: 'Mac', tr: 'Mac', de: 'Mac', fr: 'Mac', es: 'Mac', zh: 'Mac', ar: 'ماك', ja: 'Mac', it: 'Mac', pt: 'Mac' } },
      { id: 'browser-ext', section: 'software', label: { en: 'Extensions', az: 'Əlavələr', ru: 'Расширения', tr: 'Eklentiler', de: 'Erweiterungen', fr: 'Extensions', es: 'Extensiones', zh: '扩展', ar: 'إضافات', ja: '拡張機能', it: 'Estensioni', pt: 'Extensões' } },
    
    ]
  },
  education: {
    label: { en: 'Lifestyle', az: 'Təhsil', ru: 'Учёба', tr: 'Eğitim', de: 'Lernen', fr: 'Apprendre', es: 'Aprender', zh: '学习', ar: 'تعلم', ja: '学習', it: 'Impara', pt: 'Aprender' },
    items: [
      { id: 'science', label: { en: 'Science', az: 'Elm', ru: 'Наука', tr: 'Bilim', de: 'Wissenschaft', fr: 'Science', es: 'Ciencia', zh: '科学', ar: 'علوم', ja: '科学', it: 'Scienza', pt: 'Ciência' } },
      { id: 'languages', label: { en: 'Languages', az: 'Dillər', ru: 'Языки', tr: 'Diller', de: 'Sprachen', fr: 'Langues', es: 'Idiomas', zh: '语言', ar: 'لغات', ja: '言語', it: 'Lingue', pt: 'Idiomas' } },
      { id: 'courses', label: { en: 'Free Courses', az: 'Pulsuz Kurslar', ru: 'Бесплатные курсы', tr: 'Ücretsiz Kurslar', de: 'Kostenlose Kurse', fr: 'Cours gratuits', es: 'Cursos gratis', zh: '免费课程', ar: 'دورات مجانية', ja: '無料コース', it: 'Corsi gratuiti', pt: 'Cursos grátis' } },
    
      { id: 'beauty', section: 'women', label: { en: 'Beauty & Cosmetics', az: 'Gözəllik', ru: 'Красота', tr: 'Güzellik', de: 'Schönheit', fr: 'Beauté', es: 'Belleza', zh: '美容', ar: 'جمال', ja: '美容', it: 'Bellezza', pt: 'Beleza' } },
      { id: 'diet', section: 'women', label: { en: 'Diet & Nutrition', az: 'Dieta', ru: 'Диета', tr: 'Diyet', de: 'Ernährung', fr: 'Nutrition', es: 'Nutrición', zh: '饮食', ar: 'حمية', ja: 'ダイエット', it: 'Dieta', pt: 'Dieta' } },
      { id: 'fitness', section: 'women', label: { en: 'Fitness', az: 'Fitness', ru: 'Фитнес', tr: 'Fitness', de: 'Fitness', fr: 'Fitness', es: 'Fitness', zh: '健身', ar: 'لياقة', ja: 'フィットネス', it: 'Fitness', pt: 'Fitness' } },
      { id: 'parenting', section: 'women', label: { en: 'Parenting', az: 'Uşaq Baxımı', ru: 'Материнство', tr: 'Ebeveynlik', de: 'Elternschaft', fr: 'Parentalité', es: 'Maternidad', zh: '育儿', ar: 'أمومة', ja: '育児', it: 'Genitorialità', pt: 'Maternidade' } },
      { id: 'fashion', section: 'women', label: { en: 'Fashion', az: 'Moda', ru: 'Мода', tr: 'Moda', de: 'Mode', fr: 'Mode', es: 'Moda', zh: '时尚', ar: 'أزياء', ja: 'ファッション', it: 'Moda', pt: 'Moda' } },
      { id: 'wellness', section: 'women', label: { en: 'Wellness & Health', az: 'Sağlamlıq', ru: 'Здоровье', tr: 'Sağlık', de: 'Wellness', fr: 'Bien-être', es: 'Bienestar', zh: '健康', ar: 'صحة', ja: 'ウェルネス', it: 'Benessere', pt: 'Bem-estar' } },
    
    
      { id: 'current', section: 'weather', label: { en: 'Current', az: 'İndi', ru: 'Сейчас', tr: 'Şimdi', de: 'Aktuell', fr: 'Actuel', es: 'Actual', zh: '当前', ar: 'الحالي', ja: '現在', it: 'Attuale', pt: 'Atual' } },
    
    ]
  },
  travel: {
    label: { en: 'Travel', az: 'Səyahət', ru: 'Путешествия', tr: 'Seyahat', de: 'Reisen', fr: 'Voyages', es: 'Viajes', zh: '旅行', ar: 'سفر', ja: '旅行', it: 'Viaggi', pt: 'Viagens' },
    items: [
      { id: 'flight-hotel', label: { en: 'Flight + Hotel', az: 'Uçuş + Otel', ru: 'Рейс + Отель', tr: 'Uçuş + Otel', de: 'Flug + Hotel', fr: 'Vol + Hôtel', es: 'Vuelo + Hotel', zh: '机票+酒店', ar: 'طيران+فندق', ja: '航空券+ホテル', it: 'Volo + Hotel', pt: 'Voo + Hotel' } },
      { id: 'flight', label: { en: 'Flights', az: 'Uçuşlar', ru: 'Рейсы', tr: 'Uçuşlar', de: 'Flüge', fr: 'Vols', es: 'Vuelos', zh: '机票', ar: 'طيران', ja: '航空券', it: 'Voli', pt: 'Voos' } },
      { id: 'hotel', label: { en: 'Hotels', az: 'Otellər', ru: 'Отели', tr: 'Oteller', de: 'Hotels', fr: 'Hôtels', es: 'Hoteles', zh: '酒店', ar: 'فنادق', ja: 'ホテル', it: 'Hotel', pt: 'Hotéis' } },
      { id: 'last-minute', label: { en: 'Last Minute', az: 'Son Dəqiqə', ru: 'Горящие', tr: 'Son dakika', de: 'Last Minute', fr: 'Dernière minute', es: 'Última hora', zh: '特价', ar: 'عروض أخيرة', ja: '直前割', it: 'Last minute', pt: 'Última hora' } },
    ]
  },
  chinese: {
    label: { en: 'China 🇨🇳', az: 'Çin 🇨🇳', ru: 'Китай 🇨🇳', tr: 'Çin 🇨🇳', de: 'China 🇨🇳', fr: 'Chine 🇨🇳', es: 'China 🇨🇳', zh: '中国 🇨🇳', ar: 'صين 🇨🇳', ja: '中国 🇨🇳', it: 'Cina 🇨🇳', pt: 'China 🇨🇳' },
    items: [
      { id: 'all', label: { en: 'All', az: 'Hamısı', ru: 'Все', tr: 'Tümü', de: 'Alle', fr: 'Tous', es: 'Todos', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' } },
      { id: 'general', label: { en: 'General', az: 'Ümumi', ru: 'Общие', tr: 'Genel', de: 'Allgemein', fr: 'Général', es: 'General', zh: '综合', ar: 'عام', ja: '総合', it: 'Generale', pt: 'Geral' } },
      { id: 'fashion', label: { en: 'Fashion', az: 'Moda', ru: 'Мода', tr: 'Moda', de: 'Mode', fr: 'Mode', es: 'Moda', zh: '时尚', ar: 'أزياء', ja: 'ファッション', it: 'Moda', pt: 'Moda' } },
      { id: 'electronics', label: { en: 'Electronics', az: 'Elektronika', ru: 'Электроника', tr: 'Elektronik', de: 'Elektronik', fr: 'Électronique', es: 'Electrónica', zh: '电子', ar: 'إلكترونيات', ja: '電子機器', it: 'Elettronica', pt: 'Eletrônicos' } },
      { id: 'home', label: { en: 'Home & Garden', az: 'Ev & Bağ', ru: 'Дом и сад', tr: 'Ev & Bahçe', de: 'Haus & Garten', fr: 'Maison', es: 'Hogar', zh: '家居', ar: 'منزل', ja: '家庭', it: 'Casa', pt: 'Casa' } },
      { id: 'kids', label: { en: 'Kids & Baby', az: 'Uşaq', ru: 'Дети', tr: 'Çocuk', de: 'Kinder', fr: 'Enfants', es: 'Niños', zh: '儿童', ar: 'أطفال', ja: '子供', it: 'Bambini', pt: 'Crianças' } },
      { id: 'hobby', label: { en: 'Hobby & Tools', az: 'Hobbi', ru: 'Хобби', tr: 'Hobi', de: 'Hobby', fr: 'Loisirs', es: 'Hobby', zh: '爱好', ar: 'هوايات', ja: '趣味', it: 'Hobby', pt: 'Hobby' } },
    
      { id: 'behoerden', section: 'germany', label: { en: 'Government', az: 'Dövlət', ru: 'Гос. органы', tr: 'Devlet', de: 'Behörden', fr: 'Gouvernement', es: 'Gobierno', zh: '政府', ar: 'حكومة', ja: '行政', it: 'Governo', pt: 'Governo' } },
      { id: 'wohnung', section: 'germany', label: { en: 'Housing', az: 'Mənzil', ru: 'Жильё', tr: 'Konut', de: 'Wohnung', fr: 'Logement', es: 'Vivienda', zh: '住房', ar: 'سكن', ja: '住居', it: 'Alloggio', pt: 'Moradia' } },
      { id: 'bildung', section: 'germany', label: { en: 'Education', az: 'Təhsil', ru: 'Образование', tr: 'Eğitim', de: 'Bildung', fr: 'Éducation', es: 'Educación', zh: '教育', ar: 'تعليم', ja: '教育', it: 'Istruzione', pt: 'Educação' } },
      { id: 'arbeit', section: 'germany', label: { en: 'Work', az: 'İş', ru: 'Работа', tr: 'İş', de: 'Arbeit', fr: 'Travail', es: 'Trabajo', zh: '工作', ar: 'عمل', ja: '仕事', it: 'Lavoro', pt: 'Trabalho' } },
      { id: 'aenderungen', section: 'germany', label: { en: 'Changes 2025', az: 'Dəyişikliklər', ru: 'Изменения', tr: 'Değişiklikler', de: 'Änderungen 2025', fr: 'Changements', es: 'Cambios', zh: '变化', ar: 'تغييرات', ja: '変更', it: 'Modifiche', pt: 'Mudanças' } },
      { id: 'tools', section: 'germany', label: { en: 'Tools', az: 'Alətlər', ru: 'Инструменты', tr: 'Araçlar', de: 'Tools', fr: 'Outils', es: 'Herramientas', zh: '工具', ar: 'أدوات', ja: 'ツール', it: 'Strumenti', pt: 'Ferramentas' } },
      { id: 'auto', section: 'germany', label: { en: 'Auto & Traffic', az: 'Avtomobil & Trafik', ru: 'Авто и ПДД', tr: 'Oto & Trafik', de: 'Auto & Verkehr', fr: 'Auto', es: 'Auto', zh: '汽车', ar: 'سيارات', ja: '車', it: 'Auto', pt: 'Auto' } },
      { id: 'familie', section: 'germany', label: { en: 'Family', az: 'Ailə', ru: 'Семья', tr: 'Aile', de: 'Familie', fr: 'Famille', es: 'Familia', zh: '家庭', ar: 'عائلة', ja: '家族', it: 'Famiglia', pt: 'Família' } },
      { id: 'miete', section: 'germany', label: { en: 'Tenant & Landlord', az: 'Kirayəçi & Ev sahibi', ru: 'Аренда', tr: 'Kiracı', de: 'Mieter & Vermieter', fr: 'Locataire', es: 'Alquiler', zh: '租房', ar: 'إيجار', ja: '賃貸', it: 'Affitto', pt: 'Aluguel' } },
      { id: 'gesundheit', section: 'germany', label: { en: 'Healthcare', az: 'Səhiyyə', ru: 'Здоровье', tr: 'Sağlık', de: 'Gesundheit', fr: 'Santé', es: 'Salud', zh: '健康', ar: 'صحة', ja: '医療', it: 'Salute', pt: 'Saúde' } },
      { id: 'versicherung', section: 'germany', label: { en: 'Insurance', az: 'Sığorta', ru: 'Страхование', tr: 'Sigorta', de: 'Versicherung', fr: 'Assurance', es: 'Seguro', zh: '保险', ar: 'تأمين', ja: '保険', it: 'Assicurazione', pt: 'Seguro' } },
      { id: 'rechte', section: 'germany', label: { en: 'Your Rights', az: 'Hüquqlarınız', ru: 'Ваши права', tr: 'Haklarınız', de: 'Ihre Rechte', fr: 'Vos droits', es: 'Sus derechos', zh: '权利', ar: 'حقوقك', ja: '権利', it: 'I tuoi diritti', pt: 'Seus direitos' } },
      { id: 'deutsch', section: 'germany', label: { en: 'German Language', az: 'Alman dili', ru: 'Немецкий язык', tr: 'Almanca', de: 'Deutsch lernen', fr: 'Allemand', es: 'Alemán', zh: '德语', ar: 'ألمانية', ja: 'ドイツ語', it: 'Tedesco', pt: 'Alemão' } },
    
    ]
  },
  horizon: {
    label: { en: "Horizon", az: "Horizon", ru: "Horizon", tr: "Horizon", de: "Horizon", fr: "Horizon", es: "Horizon", zh: "Horizon", ar: "Horizon", ja: "Horizon", it: "Horizon", pt: "Horizon" },
    items: [
      { id: "hackernews", section: "horizon", label: { en: "Hacker News - Tech Discussions", ru: "Hacker News - Тех Обсуждения", tr: "Hacker News - Tech", de: "Hacker News - Tech Discussions", fr: "Hacker News - Tech Discussions", es: "Hacker News - Tech Discussions", zh: "Hacker News - 技术讨论", ar: "Hacker News - تقنية", ja: "Hacker News - Tech Discussions", az: "Hacker News - Tech Discussions", it: "Hacker News - Tech Discussions", pt: "Hacker News - Tech Discussions" } },
      { id: "reddit-ml", section: "horizon", label: { en: "Reddit - Machine Learning", ru: "Reddit - Машинное обучение", tr: "Reddit - Makine Ogrenmesi", de: "Reddit - Machine Learning", fr: "Reddit - Machine Learning", es: "Reddit - Machine Learning", zh: "Reddit - 机器学习", ar: "Reddit - تعلم الآلة", ja: "Reddit - Machine Learning", az: "Reddit - Machine Learning", it: "Reddit - Machine Learning", pt: "Reddit - Machine Learning" } },
      { id: "reddit-tech", section: "horizon", label: { en: "Reddit - Technology", ru: "Reddit - Технологии", tr: "Reddit - Teknoloji", de: "Reddit - Technology", fr: "Reddit - Technology", es: "Reddit - Technology", zh: "Reddit - 科技", ar: "Reddit - تكنولوجيا", ja: "Reddit - Technology", az: "Reddit - Technology", it: "Reddit - Technology", pt: "Reddit - Technology" } },
      { id: "reddit-ai", section: "horizon", label: { en: "Reddit - Artificial Intelligence", ru: "Reddit - Искусственный интеллект", tr: "Reddit - Yapay Zeka", de: "Reddit - Artificial Intelligence", fr: "Reddit - Artificial Intelligence", es: "Reddit - Artificial Intelligence", zh: "Reddit - 人工智能", ar: "Reddit - ذكاء اصطناعي", ja: "Reddit - Artificial Intelligence", az: "Reddit - Artificial Intelligence", it: "Reddit - Artificial Intelligence", pt: "Reddit - Artificial Intelligence" } },
      { id: "rss-techcrunch", section: "horizon", label: { en: "RSS - TechCrunch (Startups & Tech)", ru: "RSS - TechCrunch (Стартапы)", tr: "RSS - TechCrunch (Girisimler)", de: "RSS - TechCrunch (Startups & Tech)", fr: "RSS - TechCrunch (Startups & Tech)", es: "RSS - TechCrunch (Startups & Tech)", zh: "RSS - TechCrunch (创业科技)", ar: "RSS - TechCrunch (ناشئة)", ja: "RSS - TechCrunch (Startups & Tech)", az: "RSS - TechCrunch (Startups & Tech)", it: "RSS - TechCrunch (Startups & Tech)", pt: "RSS - TechCrunch (Startups & Tech)" } },
      { id: "rss-verge", section: "horizon", label: { en: "RSS - The Verge (Consumer Tech)", ru: "RSS - The Verge (Потреб. технологии)", tr: "RSS - The Verge (Tuketici)", de: "RSS - The Verge (Consumer Tech)", fr: "RSS - The Verge (Consumer Tech)", es: "RSS - The Verge (Consumer Tech)", zh: "RSS - The Verge (消费科技)", ar: "RSS - The Verge (تقنية المستهلك)", ja: "RSS - The Verge (Consumer Tech)", az: "RSS - The Verge (Consumer Tech)", it: "RSS - The Verge (Consumer Tech)", pt: "RSS - The Verge (Consumer Tech)" } },
      { id: "rss-ars", section: "horizon", label: { en: "RSS - Ars Technica (Deep Tech)", ru: "RSS - Ars Technica (Глубокие техно.)", tr: "RSS - Ars Technica (Derin)", de: "RSS - Ars Technica (Deep Tech)", fr: "RSS - Ars Technica (Deep Tech)", es: "RSS - Ars Technica (Deep Tech)", zh: "RSS - Ars Technica (深度科技)", ar: "RSS - Ars Technica (تقنية عميقة)", ja: "RSS - Ars Technica (Deep Tech)", az: "RSS - Ars Technica (Deep Tech)", it: "RSS - Ars Technica (Deep Tech)", pt: "RSS - Ars Technica (Deep Tech)" } },
      { id: "rss-simon", section: "horizon", label: { en: "RSS - Simon Willison (AI & LLMs)", ru: "RSS - Simon Willison (ИИ инструменты)", tr: "RSS - Simon Willison (YZ)", de: "RSS - Simon Willison (AI & LLMs)", fr: "RSS - Simon Willison (AI & LLMs)", es: "RSS - Simon Willison (AI & LLMs)", zh: "RSS - Simon Willison (AI工具)", ar: "RSS - Simon Willison (ادوات ذكاء)", ja: "RSS - Simon Willison (AI & LLMs)", az: "RSS - Simon Willison (AI & LLMs)", it: "RSS - Simon Willison (AI & LLMs)", pt: "RSS - Simon Willison (AI & LLMs)" } },
      { id: "tg-guardian", section: "horizon", label: { en: "Telegram - Guardian (Breaking News)", ru: "Telegram - Guardian (Срочные новости)", tr: "Telegram - Guardian (Son Dakika)", de: "Telegram - Guardian (Breaking News)", fr: "Telegram - Guardian (Breaking News)", es: "Telegram - Guardian (Breaking News)", zh: "Telegram - Guardian (突发新闻)", ar: "Telegram - Guardian (اخبار عاجلة)", ja: "Telegram - Guardian (Breaking News)", az: "Telegram - Guardian (Breaking News)", it: "Telegram - Guardian (Breaking News)", pt: "Telegram - Guardian (Breaking News)" } },
      { id: "tg-hnfeed", section: "horizon", label: { en: "Telegram - HN Feed (Tech Stories)", ru: "Telegram - HN Feed (Тех истории)", tr: "Telegram - HN Feed (Tech)", de: "Telegram - HN Feed (Tech Stories)", fr: "Telegram - HN Feed (Tech Stories)", es: "Telegram - HN Feed (Tech Stories)", zh: "Telegram - HN Feed (科技新闻)", ar: "Telegram - HN Feed (تقنية)", ja: "Telegram - HN Feed (Tech Stories)", az: "Telegram - HN Feed (Tech Stories)", it: "Telegram - HN Feed (Tech Stories)", pt: "Telegram - HN Feed (Tech Stories)" } },
      { id: "tg-wired", section: "horizon", label: { en: "Telegram - Wired (Tech Culture)", ru: "Telegram - Wired (Технокультура)", tr: "Telegram - Wired (Tech Kultur)", de: "Telegram - Wired (Tech Culture)", fr: "Telegram - Wired (Tech Culture)", es: "Telegram - Wired (Tech Culture)", zh: "Telegram - Wired (科技文化)", ar: "Telegram - Wired (ثقافة تقنية)", ja: "Telegram - Wired (Tech Culture)", az: "Telegram - Wired (Tech Culture)", it: "Telegram - Wired (Tech Culture)", pt: "Telegram - Wired (Tech Culture)" } },
      { id: "tg-openai", section: "horizon", label: { en: "Telegram - OpenAI News (AI Updates)", ru: "Telegram - OpenAI (ИИ обновления)", tr: "Telegram - OpenAI (YZ)", de: "Telegram - OpenAI News (AI Updates)", fr: "Telegram - OpenAI News (AI Updates)", es: "Telegram - OpenAI News (AI Updates)", zh: "Telegram - OpenAI (AI更新)", ar: "Telegram - OpenAI (تحديثات ذكاء)", ja: "Telegram - OpenAI News (AI Updates)", az: "Telegram - OpenAI News (AI Updates)", it: "Telegram - OpenAI News (AI Updates)", pt: "Telegram - OpenAI News (AI Updates)" } },
      { id: "tg-bbc", section: "horizon", label: { en: "Telegram - BBC Breaking (World News)", ru: "Telegram - BBC (Мировые новости)", tr: "Telegram - BBC (Dunya)", de: "Telegram - BBC Breaking (World News)", fr: "Telegram - BBC Breaking (World News)", es: "Telegram - BBC Breaking (World News)", zh: "Telegram - BBC (世界新闻)", ar: "Telegram - BBC (اخبار عالمية)", ja: "Telegram - BBC Breaking (World News)", az: "Telegram - BBC Breaking (World News)", it: "Telegram - BBC Breaking (World News)", pt: "Telegram - BBC Breaking (World News)" } },
    ]
  },
  platforms: {
    label: { en: 'Platforms 🇩🇪', az: 'Platformalar 🇩🇪', ru: 'Платформы 🇩🇪', tr: 'Platformlar 🇩🇪', de: 'Plattformen 🇩🇪', fr: 'Plateformes 🇩🇪', es: 'Plataformas 🇩🇪', zh: '平台 🇩🇪', ar: 'منصات 🇩🇪', ja: 'プラットフォーム 🇩🇪', it: 'Piattaforme 🇩🇪', pt: 'Plataformas 🇩🇪' },
    items: [
      { id: 'general', label: { en: 'General', az: 'Ümumi', ru: 'Общие', tr: 'Genel', de: 'Allgemein', fr: 'Général', es: 'General', zh: '综合', ar: 'عام', ja: '総合', it: 'Generale', pt: 'Geral' } },
      { id: 'clothes', label: { en: 'Clothing', az: 'Geyim', ru: 'Одежда', tr: 'Giyim', de: 'Kleidung', fr: 'Vêtements', es: 'Ropa', zh: '服装', ar: 'ملابس', ja: '衣料品', it: 'Abbigliamento', pt: 'Roupas' } },
      { id: 'pharma', label: { en: 'Pharmacy', az: 'Aptek', ru: 'Аптека', tr: 'Eczane', de: 'Apotheke', fr: 'Pharmacie', es: 'Farmacia', zh: '药店', ar: 'صيدلية', ja: '薬局', it: 'Farmacia', pt: 'Farmácia' } },
      { id: 'food', label: { en: 'Food Delivery', az: 'Yemək Çatdırılma', ru: 'Доставка еды', tr: 'Yemek', de: 'Essen', fr: 'Livraison', es: 'Comida', zh: '外卖', ar: 'توصيل طعام', ja: 'フードデリバリー', it: 'Cibo', pt: 'Comida' } },
      { id: 'electronics', label: { en: 'Electronics', az: 'Elektronika', ru: 'Электроника', tr: 'Elektronik', de: 'Elektronik', fr: 'Électronique', es: 'Electrónica', zh: '电子', ar: 'إلكترونيات', ja: '電子機器', it: 'Elettronica', pt: 'Eletrônicos' } },
      { id: 'autoparts', label: { en: 'Auto Parts', az: 'Maşın hissələri', ru: 'Автозапчасти', tr: 'Oto Parça', de: 'Autoteile', fr: 'Auto', es: 'Repuestos', zh: '汽配', ar: 'قطع غيار', ja: '自動車部品', it: 'Ricambi', pt: 'Peças' } },
      { id: 'furniture', label: { en: 'Furniture', az: 'Mebel', ru: 'Мебель', tr: 'Mobilya', de: 'Möbel', fr: 'Meubles', es: 'Muebles', zh: '家具', ar: 'أثاث', ja: '家具', it: 'Mobili', pt: 'Móveis' } },
      { id: 'international', label: { en: 'International', az: 'Beynəlxalq', ru: 'Международные', tr: 'Uluslararası', de: 'International', fr: 'International', es: 'Internacional', zh: '国际', ar: 'دولي', ja: '海外', it: 'Internazionale', pt: 'Internacional' } },
    ]
  },
}

const menuKeys = Object.keys(menuStructure)

interface DropdownPortalProps {
  sectionId: string
  section: typeof menuStructure[string]
  lang: string
  buttonRect: DOMRect
  onClose: () => void
}

function DropdownPortal({ sectionId, section, lang, buttonRect, onClose }: DropdownPortalProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const top = buttonRect.bottom + 4
    let left = buttonRect.left
    if (left + 200 > window.innerWidth) {
      left = buttonRect.right - 200
    }
    setPosition({ top, left: Math.max(8, left) })
  }, [buttonRect])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleScroll(e: Event) {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return
      onClose()
    }
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [onClose])

  return createPortal(
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: position.top, left: position.left, zIndex: 99999 }}
      className="min-w-[200px] max-h-[70vh] overflow-y-auto py-1.5 rounded-xl bg-[#111118] border border-white/[0.08] shadow-2xl shadow-black/60"
    >
      {section.items.map(item => (
        <Link
          key={item.id}
          href={`/section/${(item as any).section || sectionId}/${item.id}`}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-[#a0a0b0] hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {item.label[lang] || item.label.en}
        </Link>
      ))}
    </div>,
    document.body
  )
}

export default function Header() {
  const { lang } = useLang()
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setIsAdmin(user.email === 'eagleeye385@gmail.com')
      } catch {}
    }
    init()
  }, [])

  const toggleMenu = useCallback((id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (openMenu === id) {
      setOpenMenu(null)
      setButtonRect(null)
    } else {
      setOpenMenu(id)
      setButtonRect(e.currentTarget.getBoundingClientRect())
    }
  }, [openMenu])

  const closeMenu = useCallback(() => {
    setOpenMenu(null)
    setButtonRect(null)
  }, [])

  const handleLogout = async () => {
    try { const supabase = createClient(); await supabase.auth.signOut() } catch {}
    router.push('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#07070b]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-[15px] tracking-tight hidden xl:block">World Dashboard</span>
            </Link>

            <nav className="hidden md:flex items-center mx-2 flex-1 overflow-x-auto scrollbar-thin">
              {menuKeys.map((id) => {
                const section = menuStructure[id]
                return (
                  <button
                    key={id}
                    onClick={(e) => toggleMenu(id, e)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap transition-colors ${openMenu === id ? 'text-white bg-white/[0.06]' : 'text-[#8b8b9e] hover:text-white'}`}
                  >
                    {section.label[lang] || section.label.en}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openMenu === id ? 'rotate-180' : ''}`} />
                  </button>
                )
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#6b6b80] hover:text-white hover:border-white/[0.1] transition"
              >
                <Search className="w-3.5 h-3.5" />
                <kbd className="ml-1 px-1 py-0.5 rounded bg-white/[0.06] text-[10px]">⌘K</kbd>
              </button>
              <LanguagePicker />
              <ThemeToggle />
              <BookmarksPanel />
              <FocusMode />
              <WhatsNew />
              {isAdmin && (
                <Link href="/admin" className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition">
                  Admin
                </Link>
              )}
              <NotificationCenter />
              <button onClick={handleLogout} className="p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
              <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {mounted && openMenu && buttonRect && (
        <DropdownPortal
          sectionId={openMenu}
          section={menuStructure[openMenu]}
          lang={lang}
          buttonRect={buttonRect}
          onClose={closeMenu}
        />
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[99998] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-xs bg-[#0a0a10] border-l border-white/[0.04] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.04]">
              <span className="text-white font-semibold text-sm">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-[#6b6b80] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-2">
              {Object.entries(menuStructure).map(([id, section]) => (
                <div key={id}>
                  <button
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === id ? null : id)}
                    className="w-full flex items-center justify-between px-5 py-3 text-sm text-[#a0a0b0] hover:text-white hover:bg-white/[0.03] transition"
                  >
                    {section.label[lang] || section.label.en}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileExpandedSection === id ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpandedSection === id && (
                    <div className="pb-2 pl-5">
                      {section.items.map(item => (
                        <Link
                          key={item.id}
                          href={`/section/${(item as any).section || id}/${item.id}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2.5 text-xs text-[#6b6b80] hover:text-white transition"
                        >
                          {item.label[lang] || item.label.en}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
