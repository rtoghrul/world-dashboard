'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { pickLabel } from '@/lib/translations'
import { Heart, Sparkles, Baby, Dumbbell, Palette, Apple, ExternalLink, Star } from 'lucide-react'
import SectionNews from './SectionNews'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Women’s Corner', az: 'Qadınlar Bölməsi', ru: 'Женский раздел', de: 'Frauenbereich', tr: 'Kadınlar Köşesi', fr: 'Espace femmes', es: 'Rincón de mujeres', zh: '女性专区', ar: 'ركن المرأة', ja: '女性向けコーナー', it: 'Angolo donna', pt: 'Cantinho da mulher' },
  subtitle: { en: 'Beauty, health, parenting & lifestyle', az: 'Gözəllik, sağlamlıq, uşaq baxımı', ru: 'Красота, здоровье, материнство', de: 'Schönheit, Gesundheit, Elternschaft', tr: 'Güzellik, sağlık, ebeveynlik', fr: 'Beauté, santé, parentalité & lifestyle', es: 'Belleza, salud, crianza y estilo de vida', zh: '美容、健康、育儿与生活', ar: 'الجمال والصحة والأمومة ونمط الحياة', ja: '美容・健康・子育て・ライフスタイル', it: 'Bellezza, salute, genitorialità e lifestyle', pt: 'Beleza, saúde, maternidade e estilo de vida' },
}

const tabs = [
  { id: 'all', label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü', fr: 'Tout', es: 'Todo', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' }, icon: Heart },
  { id: 'beauty', label: { en: 'Beauty', az: 'Gözəllik', de: 'Schönheit', ru: 'Красота', tr: 'Güzellik', fr: 'Beauté', es: 'Belleza', zh: '美容', ar: 'الجمال', ja: '美容', it: 'Bellezza', pt: 'Beleza' }, icon: Sparkles },
  { id: 'diet', label: { en: 'Diet', az: 'Dieta', de: 'Ernährung', ru: 'Диета', tr: 'Diyet', fr: 'Alimentation', es: 'Dieta', zh: '饮食', ar: 'الحمية', ja: 'ダイエット', it: 'Dieta', pt: 'Dieta' }, icon: Apple },
  { id: 'fitness', label: { en: 'Fitness', az: 'Fitness', de: 'Fitness', ru: 'Фитнес', tr: 'Fitness', fr: 'Fitness', es: 'Fitness', zh: '健身', ar: 'اللياقة', ja: 'フィットネス', it: 'Fitness', pt: 'Fitness' }, icon: Dumbbell },
  { id: 'parenting', label: { en: 'Parenting', az: 'Uşaq Baxımı', de: 'Elternschaft', ru: 'Материнство', tr: 'Ebeveynlik', fr: 'Parentalité', es: 'Crianza', zh: '育儿', ar: 'تربية الأطفال', ja: '子育て', it: 'Genitorialità', pt: 'Maternidade' }, icon: Baby },
  { id: 'fashion', label: { en: 'Fashion', az: 'Moda', de: 'Mode', ru: 'Мода', tr: 'Moda', fr: 'Mode', es: 'Moda', zh: '时尚', ar: 'الأزياء', ja: 'ファッション', it: 'Moda', pt: 'Moda' }, icon: Palette },
]

interface WomenItem {
  name: string
  category: string
  desc: Record<string, string>
  url: string
  type: 'app' | 'site' | 'tool' | 'shop'
  rating: number
  popular?: boolean
  free?: boolean
}

const items: WomenItem[] = [
  // Beauty & Cosmetics
  { name: 'Sephora', category: 'beauty', desc: { en: 'Premium beauty products & tutorials', az: 'Premium gözəllik məhsulları', de: 'Premium-Beauty & Tutorials', ru: 'Премиум косметика и туториалы', tr: 'Premium güzellik ürünleri ve eğitimler', fr: 'Produits de beauté premium et tutoriels', es: 'Productos de belleza premium y tutoriales', zh: '高端美妆产品与教程', ar: 'منتجات تجميل فاخرة ودروس', ja: 'プレミアムな美容製品とチュートリアル', it: 'Prodotti di bellezza premium e tutorial', pt: 'Produtos de beleza premium e tutoriais' }, url: 'https://sephora.de', type: 'shop', rating: 4.8, popular: true },
  { name: 'Douglas', category: 'beauty', desc: { en: 'Perfume, makeup, skincare (DE #1)', az: 'Ətir, makiyaj, dəri baxımı (DE №1)', de: 'Parfum, Make-up, Hautpflege (DE #1)', ru: 'Парфюм, макияж, уход (DE №1)', tr: 'Parfüm, makyaj, cilt bakımı (Almanya\'da 1 numara)', fr: 'Parfum, maquillage, soins (n°1 en Allemagne)', es: 'Perfume, maquillaje y cuidado de la piel (n.º 1 en Alemania)', zh: '香水、彩妆、护肤（德国第一）', ar: 'عطور ومكياج وعناية بالبشرة (الأول في ألمانيا)', ja: '香水・メイク・スキンケア（ドイツ No.1）', it: 'Profumi, make-up, skincare (n.1 in Germania)', pt: 'Perfumes, maquiagem, skincare (nº 1 na Alemanha)' }, url: 'https://douglas.de', type: 'shop', rating: 4.7, popular: true },
  { name: 'Flaconi', category: 'beauty', desc: { en: 'Online perfumery, great deals', az: 'Onlayn ətirxana, əla təkliflər', de: 'Online-Parfümerie, tolle Angebote', ru: 'Онлайн-парфюмерия, выгодно', tr: 'Çevrim içi parfümeri, harika fırsatlar', fr: 'Parfumerie en ligne, super promos', es: 'Perfumería online con grandes ofertas', zh: '网上香水店，优惠多多', ar: 'متجر عطور إلكتروني بعروض رائعة', ja: 'オンライン香水店、お得なセール', it: 'Profumeria online, ottime offerte', pt: 'Perfumaria online, ótimas ofertas' }, url: 'https://flaconi.de', type: 'shop', rating: 4.6 },
  { name: 'Paula’s Choice', category: 'beauty', desc: { en: 'Science-based skincare, no nonsense', az: 'Elmi əsaslı dəri baxımı', de: 'Wissenschaftlich fundierte Hautpflege', ru: 'Научный уход за кожей', tr: 'Bilime dayalı, sade cilt bakımı', fr: 'Soins de la peau fondés sur la science, sans fioritures', es: 'Cuidado de la piel basado en la ciencia, sin rodeos', zh: '基于科学的护肤，实在不花哨', ar: 'عناية بالبشرة قائمة على العلم وبلا مبالغة', ja: '科学に基づく、無駄のないスキンケア', it: 'Skincare basata sulla scienza, senza fronzoli', pt: 'Skincare baseado em ciência, sem enrolação' }, url: 'https://paulaschoice.de', type: 'shop', rating: 4.8 },
  { name: 'The Ordinary', category: 'beauty', desc: { en: 'Affordable clinical skincare', az: 'Əlçatan klinik dəri baxımı', de: 'Erschwingliche klinische Pflege', ru: 'Доступный клинический уход', tr: 'Uygun fiyatlı klinik cilt bakımı', fr: 'Soins de la peau cliniques abordables', es: 'Cuidado de la piel clínico asequible', zh: '平价功效型护肤', ar: 'عناية سريرية بالبشرة بأسعار معقولة', ja: 'お手頃な医療系スキンケア', it: 'Skincare clinica a prezzi accessibili', pt: 'Skincare clínico acessível' }, url: 'https://theordinary.com', type: 'shop', rating: 4.7, popular: true },
  { name: 'Think Dirty', category: 'beauty', desc: { en: 'Scan cosmetics for toxic ingredients', az: 'Kosmetikada zərərli maddələri yoxla', de: 'Kosmetik auf Giftstoffe prüfen', ru: 'Проверка косметики на токсичность', tr: 'Kozmetikleri zararlı içerikler için tarayın', fr: 'Scannez les cosmétiques pour repérer les ingrédients toxiques', es: 'Escanea cosméticos en busca de ingredientes tóxicos', zh: '扫描化妆品中的有害成分', ar: 'افحص مستحضرات التجميل بحثًا عن مكونات سامة', ja: '化粧品の有害成分をスキャン', it: 'Scansiona i cosmetici alla ricerca di ingredienti tossici', pt: 'Escaneie cosméticos em busca de ingredientes tóxicos' }, url: 'https://thinkdirtyapp.com', type: 'app', rating: 4.5, free: true },
  { name: 'INCI Beauty', category: 'beauty', desc: { en: 'Ingredient analyzer for skincare', az: 'Dəri baxımı tərkib analizatoru', de: 'Inhaltsstoff-Analyzer', ru: 'Анализ состава косметики', tr: 'Cilt bakımı için içerik çözümleyici', fr: 'Analyseur d\'ingrédients pour les soins', es: 'Analizador de ingredientes para cuidado de la piel', zh: '护肤品成分分析器', ar: 'محلل مكونات منتجات العناية بالبشرة', ja: 'スキンケアの成分アナライザー', it: 'Analizzatore di ingredienti per la skincare', pt: 'Analisador de ingredientes de skincare' }, url: 'https://incibeauty.com', type: 'app', rating: 4.4, free: true },
  // Diet & Nutrition
  { name: 'MyFitnessPal', category: 'diet', desc: { en: 'Calorie counter & food diary (14M+ foods)', az: 'Kalori sayğacı (14M+ qida)', de: 'Kalorienzähler & Ernährungstagebuch', ru: 'Счётчик калорий и дневник (14M+ продуктов)', tr: 'Kalori sayacı ve beslenme günlüğü (14 milyon+ besin)', fr: 'Compteur de calories et journal alimentaire (plus de 14 M d\'aliments)', es: 'Contador de calorías y diario de comidas (más de 14 M de alimentos)', zh: '卡路里计算与饮食日记（1400 万+ 食物）', ar: 'عداد سعرات ومفكرة طعام (أكثر من 14 مليون صنف)', ja: 'カロリー計算＆食事日記（1,400万点以上の食品）', it: 'Conta calorie e diario alimentare (oltre 14 mln di alimenti)', pt: 'Contador de calorias e diário alimentar (mais de 14 mi de alimentos)' }, url: 'https://myfitnesspal.com', type: 'app', rating: 4.7, popular: true, free: true },
  { name: 'Yazio', category: 'diet', desc: { en: 'German calorie tracker + fasting timer', az: 'Alman kalori izləyicisi + oruc taymeri', de: 'Deutscher Kalorien-Tracker + Fasten-Timer', ru: 'Немецкий трекер калорий + таймер поста', tr: 'Alman kalori takibi + oruç zamanlayıcı', fr: 'Compteur de calories allemand + minuteur de jeûne', es: 'Contador de calorías alemán + temporizador de ayuno', zh: '德国卡路里记录 + 断食计时', ar: 'متتبع سعرات ألماني مع مؤقت صيام', ja: 'ドイツ発のカロリー記録＋ファスティングタイマー', it: 'Conta calorie tedesco + timer per il digiuno', pt: 'Contador de calorias alemão + timer de jejum' }, url: 'https://yazio.com', type: 'app', rating: 4.6, popular: true, free: true },
  { name: 'Lifesum', category: 'diet', desc: { en: 'Personalized meal plans & recipes', az: 'Fərdi yemək planları və reseptlər', de: 'Personalisierte Mahlzeitenpläne', ru: 'Персональные планы питания', tr: 'Kişiselleştirilmiş beslenme planları ve tarifler', fr: 'Plans de repas et recettes personnalisés', es: 'Planes de comidas y recetas personalizados', zh: '个性化饮食计划与食谱', ar: 'خطط وجبات ووصفات مخصصة', ja: 'パーソナライズされた食事プランとレシピ', it: 'Piani alimentari e ricette personalizzati', pt: 'Planos de refeição e receitas personalizados' }, url: 'https://lifesum.com', type: 'app', rating: 4.5, free: true },
  { name: 'Eat This Much', category: 'diet', desc: { en: 'Auto meal planner based on calories/macros', az: 'Kaloriyə görə avtomatik yemək planı', de: 'Auto-Mahlzeitenplaner nach Kalorien', ru: 'Автоматический планировщик питания', tr: 'Kalori/makrolara göre otomatik yemek planlayıcı', fr: 'Planificateur de repas automatique selon calories/macros', es: 'Planificador de comidas automático según calorías/macros', zh: '根据卡路里/宏量营养素自动规划饮食', ar: 'مخطط وجبات تلقائي حسب السعرات والمغذيات', ja: 'カロリー／PFC に基づく自動献立作成', it: 'Pianificatore automatico dei pasti in base a calorie/macro', pt: 'Planejador de refeições automático por calorias/macros' }, url: 'https://eatthismuch.com', type: 'tool', rating: 4.4, free: true },
  { name: 'Foodspring', category: 'diet', desc: { en: 'Premium nutrition & protein (German brand)', az: 'Premium qida və protein (Alman brendi)', de: 'Premium-Nutrition & Protein (deutsch)', ru: 'Премиум-питание (немецкий бренд)', tr: 'Premium beslenme ve protein (Alman markası)', fr: 'Nutrition et protéines premium (marque allemande)', es: 'Nutrición y proteína premium (marca alemana)', zh: '高端营养与蛋白粉（德国品牌）', ar: 'تغذية وبروتين فاخر (علامة ألمانية)', ja: 'プレミアム栄養＆プロテイン（ドイツブランド）', it: 'Nutrizione e proteine premium (marchio tedesco)', pt: 'Nutrição e proteína premium (marca alemã)' }, url: 'https://foodspring.de', type: 'shop', rating: 4.6 },
  // Fitness
  { name: 'Nike Training Club', category: 'fitness', desc: { en: '200+ free workouts, yoga, HIIT, strength', az: '200+ pulsuz məşq, yoga, HIIT', de: '200+ kostenlose Workouts, Yoga, HIIT', ru: '200+ бесплатных тренировок, йога, HIIT', tr: '200+ ücretsiz antrenman: yoga, HIIT, kuvvet', fr: 'Plus de 200 séances gratuites : yoga, HIIT, musculation', es: 'Más de 200 entrenamientos gratis: yoga, HIIT y fuerza', zh: '200+ 免费训练：瑜伽、HIIT、力量', ar: 'أكثر من 200 تمرين مجاني: يوغا وHIIT وقوة', ja: '200以上の無料ワークアウト：ヨガ、HIIT、筋トレ', it: 'Oltre 200 allenamenti gratuiti: yoga, HIIT, forza', pt: 'Mais de 200 treinos grátis: ioga, HIIT, força' }, url: 'https://nike.com/ntc-app', type: 'app', rating: 4.8, popular: true, free: true },
  { name: 'Sweat (Kayla Itsines)', category: 'fitness', desc: { en: 'Women’s fitness app, BBG & PWR programs', az: 'Qadın fitness app, BBG & PWR proqramları', de: 'Frauen-Fitness-App, BBG & PWR', ru: 'Женское фитнес-приложение, BBG & PWR', tr: 'Kadınlar için fitness uygulaması, BBG ve PWR programları', fr: 'Appli fitness pour femmes, programmes BBG et PWR', es: 'App de fitness para mujeres, programas BBG y PWR', zh: '女性健身应用，BBG 与 PWR 计划', ar: 'تطبيق لياقة للنساء ببرامج BBG وPWR', ja: '女性向けフィットネスアプリ、BBG＆PWR プログラム', it: 'App di fitness per donne, programmi BBG e PWR', pt: 'App de fitness feminino, programas BBG e PWR' }, url: 'https://sweat.com', type: 'app', rating: 4.7, popular: true },
  { name: 'Freeletics', category: 'fitness', desc: { en: 'AI personal trainer, no equipment needed', az: 'AI şəxsi məşqçi, avadanlıq lazım deyil', de: 'KI-Personal-Trainer, kein Equipment', ru: 'ИИ-тренер, без оборудования', tr: 'Yapay zekâ kişisel antrenör, ekipman gerekmez', fr: 'Coach personnel IA, sans matériel', es: 'Entrenador personal con IA, sin material', zh: 'AI 私教，无需器械', ar: 'مدرب شخصي بالذكاء الاصطناعي دون معدات', ja: 'AI パーソナルトレーナー、器具不要', it: 'Personal trainer IA, senza attrezzi', pt: 'Personal trainer com IA, sem equipamentos' }, url: 'https://freeletics.com', type: 'app', rating: 4.5, free: true },
  { name: 'Down Dog Yoga', category: 'fitness', desc: { en: 'Personalized yoga sessions, never same twice', az: 'Fərdi yoga sessiyaları, heç vaxt eyni deyil', de: 'Personalisierte Yoga-Sessions', ru: 'Персонализированная йога', tr: 'Kişiselleştirilmiş yoga seansları, hiçbiri aynı değil', fr: 'Séances de yoga personnalisées, jamais deux fois les mêmes', es: 'Sesiones de yoga personalizadas, nunca iguales', zh: '个性化瑜伽课程，每次都不同', ar: 'جلسات يوغا مخصصة لا تتكرر أبدًا', ja: 'パーソナライズされたヨガ、毎回違う内容', it: 'Sessioni di yoga personalizzate, mai uguali', pt: 'Sessões de ioga personalizadas, nunca repetidas' }, url: 'https://downdogapp.com', type: 'app', rating: 4.9, free: true },
  { name: 'FitOn', category: 'fitness', desc: { en: 'Free celebrity trainer workouts', az: 'Pulsuz məşhur trener məşqləri', de: 'Kostenlose Promi-Trainer-Workouts', ru: 'Бесплатные тренировки от звёзд', tr: 'Ünlü antrenörlerden ücretsiz antrenmanlar', fr: 'Séances gratuites de coachs de stars', es: 'Entrenamientos gratis de entrenadores de famosos', zh: '名人教练的免费训练', ar: 'تمارين مجانية من مدربي المشاهير', ja: 'セレブトレーナーの無料ワークアウト', it: 'Allenamenti gratuiti dei trainer delle star', pt: 'Treinos grátis de personal trainers de celebridades' }, url: 'https://fitonapp.com', type: 'app', rating: 4.7, free: true },
  // Parenting
  { name: 'BabyCenter', category: 'parenting', desc: { en: 'Pregnancy tracker & baby development', az: 'Hamiləlik izləyicisi və körpə inkişafı', de: 'Schwangerschafts-Tracker & Baby-Entwicklung', ru: 'Трекер беременности и развитие ребёнка', tr: 'Hamilelik takibi ve bebek gelişimi', fr: 'Suivi de grossesse et développement du bébé', es: 'Seguimiento del embarazo y desarrollo del bebé', zh: '孕期追踪与宝宝发育', ar: 'متتبع الحمل وتطوّر الطفل', ja: '妊娠トラッカー＆赤ちゃんの成長', it: 'Monitoraggio della gravidanza e sviluppo del bambino', pt: 'Acompanhamento da gravidez e desenvolvimento do bebê' }, url: 'https://babycenter.de', type: 'app', rating: 4.7, popular: true, free: true },
  { name: 'Hipp', category: 'parenting', desc: { en: 'German organic baby food & advice', az: 'Alman orqanik körpə qidası', de: 'Deutsche Bio-Babynahrung & Beratung', ru: 'Немецкое органическое детское питание', tr: 'Alman organik bebek maması ve tavsiyeler', fr: 'Alimentation bio allemande pour bébé et conseils', es: 'Comida ecológica alemana para bebés y consejos', zh: '德国有机婴儿食品与育儿建议', ar: 'أغذية أطفال عضوية ألمانية ونصائح', ja: 'ドイツのオーガニックベビーフード＆アドバイス', it: 'Alimenti biologici tedeschi per neonati e consigli', pt: 'Papinhas orgânicas alemãs e dicas' }, url: 'https://hipp.de', type: 'shop', rating: 4.6 },
  { name: 'Kinder.de', category: 'parenting', desc: { en: 'German parenting portal, tips & events', az: 'Alman valideynlik portalı, məsləhətlər', de: 'Deutsches Elternportal, Tipps & Events', ru: 'Немецкий портал для родителей', tr: 'Alman ebeveynlik portalı, ipuçları ve etkinlikler', fr: 'Portail parental allemand, conseils et événements', es: 'Portal alemán para padres, consejos y eventos', zh: '德国育儿门户，建议与活动', ar: 'بوابة ألمانية للأهل ونصائح وفعاليات', ja: 'ドイツの子育てポータル、ヒント＆イベント', it: 'Portale tedesco per genitori, consigli ed eventi', pt: 'Portal alemão para pais, dicas e eventos' }, url: 'https://kinder.de', type: 'site', rating: 4.3, free: true },
  { name: 'Windeln.de', category: 'parenting', desc: { en: 'Baby products, diapers, toys (DE shop)', az: 'Uşaq məhsulları, bezi, oyuncaqlar', de: 'Babyprodukte, Windeln, Spielzeug', ru: 'Товары для малышей, подгузники', tr: 'Bebek ürünleri, bez, oyuncak (Alman mağazası)', fr: 'Produits bébé, couches, jouets (boutique allemande)', es: 'Productos de bebé, pañales y juguetes (tienda alemana)', zh: '婴儿用品、纸尿裤、玩具（德国商店）', ar: 'منتجات أطفال وحفاضات وألعاب (متجر ألماني)', ja: 'ベビー用品、おむつ、おもちゃ（ドイツのショップ）', it: 'Prodotti per neonati, pannolini, giocattoli (negozio tedesco)', pt: 'Produtos de bebê, fraldas, brinquedos (loja alemã)' }, url: 'https://windeln.de', type: 'shop', rating: 4.4 },
  { name: 'Pampers Club', category: 'parenting', desc: { en: 'Earn rewards, baby development tracker', az: 'Mükafat qazan, körpə inkişaf izləyicisi', de: 'Prämien sammeln, Baby-Entwicklungs-Tracker', ru: 'Бонусы, трекер развития малыша', tr: 'Ödül kazanın, bebek gelişimini takip edin', fr: 'Gagnez des récompenses, suivez le développement de bébé', es: 'Gana recompensas y sigue el desarrollo del bebé', zh: '赚取奖励，追踪宝宝发育', ar: 'اكسب مكافآت وتابع تطوّر طفلك', ja: '特典を獲得、赤ちゃんの成長を記録', it: 'Guadagna premi, segui lo sviluppo del bambino', pt: 'Ganhe recompensas, acompanhe o desenvolvimento do bebê' }, url: 'https://pampers.de', type: 'app', rating: 4.5, free: true },
  // Fashion
  { name: 'Zalando', category: 'fashion', desc: { en: 'Europe’s #1 fashion, free returns', az: 'Avropanın №1 moda, pulsuz geri qaytarma', de: 'Europas Nr.1 Mode, kostenlose Retoure', ru: 'Мода №1 в Европе, бесплатный возврат', tr: 'Avrupa\'nın 1 numaralı modası, ücretsiz iade', fr: 'N°1 de la mode en Europe, retours gratuits', es: 'N.º 1 de la moda en Europa, devoluciones gratis', zh: '欧洲第一时尚平台，免费退货', ar: 'الأول في الأزياء بأوروبا مع إرجاع مجاني', ja: 'ヨーロッパ No.1 ファッション、返品無料', it: 'N.1 della moda in Europa, resi gratuiti', pt: 'Nº 1 em moda na Europa, devoluções grátis' }, url: 'https://zalando.de', type: 'shop', rating: 4.8, popular: true },
  { name: 'About You', category: 'fashion', desc: { en: 'Personalized fashion discovery', az: 'Fərdi moda kəşfi', de: 'Personalisierte Mode-Entdeckung', ru: 'Персонализированный подбор моды', tr: 'Kişiselleştirilmiş moda keşfi', fr: 'Découverte de mode personnalisée', es: 'Descubrimiento de moda personalizado', zh: '个性化时尚发现', ar: 'اكتشاف أزياء مخصص', ja: 'パーソナライズされたファッション発見', it: 'Scoperta della moda personalizzata', pt: 'Descoberta de moda personalizada' }, url: 'https://aboutyou.de', type: 'shop', rating: 4.7, popular: true },
  { name: 'Pinterest', category: 'fashion', desc: { en: 'Style inspiration & outfit ideas', az: 'Stil ilhamı və geyim ideyaları', de: 'Stil-Inspiration & Outfit-Ideen', ru: 'Стильные идеи и вдохновение', tr: 'Stil ilhamı ve kombin fikirleri', fr: 'Inspiration style et idées de tenues', es: 'Inspiración de estilo e ideas de outfits', zh: '穿搭灵感与搭配创意', ar: 'إلهام للأناقة وأفكار للإطلالات', ja: 'スタイルのヒント＆コーデのアイデア', it: 'Ispirazione di stile e idee outfit', pt: 'Inspiração de estilo e ideias de looks' }, url: 'https://pinterest.com', type: 'app', rating: 4.7, free: true },
  { name: 'Vinted', category: 'fashion', desc: { en: 'Buy & sell second-hand fashion', az: 'İkinci əl moda al və sat', de: 'Second-Hand-Mode kaufen & verkaufen', ru: 'Покупка и продажа б/у моды', tr: 'İkinci el moda alın ve satın', fr: 'Achetez et vendez de la mode d\'occasion', es: 'Compra y vende moda de segunda mano', zh: '买卖二手时尚', ar: 'اشترِ وبِع الأزياء المستعملة', ja: '古着を売買', it: 'Compra e vendi moda di seconda mano', pt: 'Compre e venda moda de segunda mão' }, url: 'https://vinted.de', type: 'app', rating: 4.5, popular: true, free: true },
  { name: 'Lookiero', category: 'fashion', desc: { en: 'Personal stylist box delivered to you', az: 'Şəxsi stilist qutusu sizə çatdırılır', de: 'Persönliche Stylist-Box geliefert', ru: 'Персональный стилист, доставка', tr: 'Kişisel stilist kutusu kapınıza teslim', fr: 'Box de styliste personnel livrée chez vous', es: 'Caja de estilista personal entregada en casa', zh: '私人造型师搭配盒送货上门', ar: 'صندوق منسق أزياء شخصي يصل إليك', ja: 'パーソナルスタイリストのボックスをお届け', it: 'Box dello stylist personale consegnata a casa', pt: 'Caixa de personal stylist entregue na sua casa' }, url: 'https://lookiero.de', type: 'shop', rating: 4.3 },
]

export default function WomenWidget({ initialCategory }: { initialCategory?: string }) {
  const { lang } = useLang()
  const [tab, setTab] = useState(initialCategory || 'all')
  const [expanded, setExpanded] = useState(false)

  const filtered = tab === 'all' ? items : items.filter(i => i.category === tab)
  const display = expanded ? filtered : filtered.slice(0, 8)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  const typeColors: Record<string, string> = {
    app: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    shop: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
    tool: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    site: 'bg-gray-100 dark:bg-gray-800 text-ink-3 dark:text-gray-300',
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          {t('title')}
        </h2>
      </div>
      <p className="text-xs text-ink-3 dark:text-gray-400 mb-3">{t('subtitle')}</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {tabs.map(c => {
          const Icon = c.icon
          return (
            <button key={c.id} onClick={() => setTab(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === c.id ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300' : 'bg-gray-100 dark:bg-gray-800 text-ink-3 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {pickLabel(c.label, lang)}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {display.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
            className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-md transition-all bg-white dark:bg-gray-800/50">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm group-hover:text-pink-600 dark:group-hover:text-pink-400">{item.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <p className="text-xs text-ink-3 dark:text-gray-400 mb-2 line-clamp-2">{item.desc[lang] || item.desc.en}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${typeColors[item.type]}`}>
                  {item.type.toUpperCase()}
                </span>
                {item.free && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">FREE</span>}
                {item.popular && <span className="text-[10px]">🔥</span>}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                {item.rating}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 8 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors">
          {expanded ? '▲ Show less' : `▼ Show all (${filtered.length})`}
        </button>
      )}

      <SectionNews section="women" tab={tab} accentColor="pink" />
    </div>
  )
}
