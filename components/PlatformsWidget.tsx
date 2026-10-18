'use client'
import { useState } from 'react'
import { useLang } from '@/lib/LanguageContext'
import { pickLabel } from '@/lib/translations'
import { ExternalLink, Store, ShoppingBag, Package, Truck, Cpu, CircleDot, Home, Globe2, Search } from 'lucide-react'
import SectionNews from './SectionNews'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Online Platforms — Germany 🇩🇪', az: 'Onlayn Platformalar — Almaniya 🇩🇪', ru: 'Онлайн-платформы — Германия 🇩🇪', de: 'Online-Plattformen — Deutschland 🇩🇪', tr: 'Online Platformlar — Almanya 🇩🇪', fr: 'Plateformes en ligne — Allemagne 🇩🇪', es: 'Plataformas online — Alemania 🇩🇪', zh: '在线平台 — 德国 🇩🇪', ar: 'المنصات الإلكترونية — ألمانيا 🇩🇪', ja: 'オンライン通販 — ドイツ 🇩🇪', it: 'Piattaforme online — Germania 🇩🇪', pt: 'Plataformas online — Alemanha 🇩🇪' },
  subtitle: { en: 'All platforms delivering to Germany (domestic & international)', az: 'Almaniyaya çatdırma edən bütün platformalar', ru: 'Все платформы с доставкой в Германию', de: 'Alle Plattformen mit Lieferung nach Deutschland', tr: 'Almanya’ya teslimat yapan tüm platformlar', fr: 'Toutes les plateformes livrant en Allemagne (nationales & internationales)', es: 'Todas las plataformas con envío a Alemania (nacionales e internacionales)', zh: '所有可配送至德国的平台（国内与国际）', ar: 'جميع المنصات التي توصل إلى ألمانيا (محلية ودولية)', ja: 'ドイツに配送する全サイト（国内・海外）', it: 'Tutte le piattaforme che consegnano in Germania (nazionali e internazionali)', pt: 'Todas as plataformas que entregam na Alemanha (nacionais e internacionais)' },
  visit: { en: 'Visit', az: 'Keç', ru: 'Перейти', de: 'Besuchen', tr: 'Git', fr: 'Visiter', es: 'Visitar', zh: '访问', ar: 'زيارة', ja: '開く', it: 'Visita', pt: 'Visitar' },
  all: { en: 'All', az: 'Hamısı', ru: 'Все', de: 'Alle', tr: 'Tümü', fr: 'Tout', es: 'Todo', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' },
  delivery: { en: 'Delivers to DE', az: 'DE-yə çatdırır', ru: 'Доставка в DE', de: 'Lieferung nach DE', tr: 'DE’ye teslimat', fr: 'Livre en DE', es: 'Envía a DE', zh: '配送至德国', ar: 'يوصل إلى ألمانيا', ja: 'ドイツへ配送', it: 'Consegna in DE', pt: 'Entrega na DE' },
  free_shipping: { en: 'Free shipping', az: 'Pulsuz çatdırılma', ru: 'Бесплатная доставка', de: 'Kostenloser Versand', tr: 'Ücretsiz kargo', fr: 'Livraison gratuite', es: 'Envío gratis', zh: '免运费', ar: 'شحن مجاني', ja: '送料無料', it: 'Spedizione gratuita', pt: 'Frete grátis' },
}

const categories = [
  { id: 'all', label: { en: 'All', az: 'Hamısı', de: 'Alle', ru: 'Все', tr: 'Tümü', fr: 'Tout', es: 'Todo', zh: '全部', ar: 'الكل', ja: 'すべて', it: 'Tutti', pt: 'Todos' }, icon: Store },
  { id: 'general', label: { en: 'General', az: 'Ümumi', de: 'Allgemein', ru: 'Общие', tr: 'Genel', fr: 'Général', es: 'General', zh: '综合', ar: 'عام', ja: '総合', it: 'Generale', pt: 'Geral' }, icon: ShoppingBag },
  { id: 'clothes', label: { en: 'Clothing', az: 'Geyim', de: 'Kleidung', ru: 'Одежда', tr: 'Giyim', fr: 'Vêtements', es: 'Ropa', zh: '服装', ar: 'الملابس', ja: '衣料品', it: 'Abbigliamento', pt: 'Roupas' }, icon: ShoppingBag },
  { id: 'pharma', label: { en: 'Pharmacy', az: 'Aptek', de: 'Apotheke', ru: 'Аптека', tr: 'Eczane', fr: 'Pharmacie', es: 'Farmacia', zh: '药店', ar: 'صيدلية', ja: '薬局', it: 'Farmacia', pt: 'Farmácia' }, icon: Package },
  { id: 'food', label: { en: 'Food & Grocery', az: 'Ərzaq', de: 'Lebensmittel', ru: 'Продукты', tr: 'Market', fr: 'Alimentation', es: 'Alimentación', zh: '食品杂货', ar: 'البقالة', ja: '食品・日用品', it: 'Alimentari', pt: 'Mercado' }, icon: Truck },
  { id: 'electronics', label: { en: 'Electronics', az: 'Elektronika', de: 'Elektronik', ru: 'Электроника', tr: 'Elektronik', fr: 'Électronique', es: 'Electrónica', zh: '电子产品', ar: 'الإلكترونيات', ja: '家電', it: 'Elettronica', pt: 'Eletrônicos' }, icon: Cpu },
  { id: 'autoparts', label: { en: 'Auto Parts', az: 'Maşın hissələri', de: 'Autoteile', ru: 'Автозапчасти', tr: 'Oto Parça', fr: 'Pièces auto', es: 'Recambios', zh: '汽车配件', ar: 'قطع غيار السيارات', ja: '自動車部品', it: 'Ricambi auto', pt: 'Autopeças' }, icon: CircleDot },
  { id: 'furniture', label: { en: 'Furniture', az: 'Mebel', de: 'Möbel', ru: 'Мебель', tr: 'Mobilya', fr: 'Meubles', es: 'Muebles', zh: '家具', ar: 'الأثاث', ja: '家具', it: 'Mobili', pt: 'Móveis' }, icon: Home },
  { id: 'international', label: { en: 'International', az: 'Beynəlxalq', de: 'International', ru: 'Международные', tr: 'Uluslararası', fr: 'International', es: 'Internacional', zh: '国际', ar: 'دولية', ja: '海外', it: 'Internazionale', pt: 'Internacional' }, icon: Globe2 },
]

interface Platform {
  name: string
  url: string
  category: string
  desc: Record<string, string>
  origin: string
  freeShipping?: string
  highlight?: boolean
}

const platforms: Platform[] = [
  // General
  { name: 'Amazon.de', url: 'https://amazon.de', category: 'general', desc: { en: 'Everything store, Prime same/next-day delivery', az: 'Hər şey mağazası, Prime sürətli çatdırılma', de: 'Alles-Shop, Prime Lieferung am selben/nächsten Tag', ru: 'Всё в одном, Prime доставка за 1 день' }, origin: '🇩🇪 Germany', freeShipping: '29€+', highlight: true },
  { name: 'eBay.de', url: 'https://ebay.de', category: 'general', desc: { en: 'Marketplace for new & used items, auctions', az: 'Yeni və işlənmiş əşyalar, hərraclar', de: 'Marktplatz für Neues & Gebrauchtes', ru: 'Площадка для новых и б/у товаров' }, origin: '🇩🇪 Germany', highlight: true },
  { name: 'Otto', url: 'https://otto.de', category: 'general', desc: { en: 'German online department store, fashion + home', az: 'Alman universal mağazası, moda + ev', de: 'Deutsches Online-Kaufhaus, Mode + Wohnen', ru: 'Немецкий универмаг, мода + дом' }, origin: '🇩🇪 Germany', freeShipping: '50€+' },
  { name: 'Kaufland.de', url: 'https://kaufland.de', category: 'general', desc: { en: 'Marketplace with millions of products', az: 'Milyonlarla məhsul olan marketplace', de: 'Marktplatz mit Millionen Produkten', ru: 'Маркетплейс с миллионами товаров' }, origin: '🇩🇪 Germany' },
  { name: 'Lidl Online', url: 'https://lidl.de', category: 'general', desc: { en: 'Discounter with online shop + food delivery', az: 'Diskaunter onlayn mağaza', de: 'Discounter mit Online-Shop', ru: 'Дискаунтер с онлайн-магазином' }, origin: '🇩🇪 Germany', freeShipping: '59€+' },
  // Clothes
  { name: 'Zalando', url: 'https://zalando.de', category: 'clothes', desc: { en: 'Europe’s largest fashion platform, free returns', az: 'Avropanın ən böyük moda platforması, pulsuz geri qaytarma', de: 'Europas größte Modeplattform, kostenloser Rückversand', ru: 'Крупнейшая модная платформа Европы' }, origin: '🇩🇪 Germany', freeShipping: 'Always', highlight: true },
  { name: 'About You', url: 'https://aboutyou.de', category: 'clothes', desc: { en: 'Fashion marketplace, personalized shopping', az: 'Moda marketplace, fərdi alış-veriş', de: 'Mode-Marktplatz, personalisiertes Shopping', ru: 'Модный маркетплейс, персональный шопинг' }, origin: '🇩🇪 Germany', freeShipping: 'Always' },
  { name: 'H&M', url: 'https://hm.com/de', category: 'clothes', desc: { en: 'Affordable fashion for all ages', az: 'Bütün yaşlar üçün əlçatan moda', de: 'Erschwingliche Mode für alle', ru: 'Доступная мода для всех возрастов' }, origin: '🇸🇪 Sweden', freeShipping: '25€+' },
  { name: 'ASOS', url: 'https://asos.com/de', category: 'clothes', desc: { en: '850+ brands, youth fashion, free delivery', az: '850+ brend, gənc modası', de: '850+ Marken, Jugendmode', ru: '850+ брендов, молодёжная мода' }, origin: '🇬🇧 UK', freeShipping: '29.99€+' },
  { name: 'Bonprix', url: 'https://bonprix.de', category: 'clothes', desc: { en: 'Budget-friendly fashion & home textiles', az: 'Büdcəyə uyğun moda və ev tekstili', de: 'Günstige Mode & Heimtextilien', ru: 'Бюджетная мода и домашний текстиль' }, origin: '🇩🇪 Germany', freeShipping: '25€+' },
  { name: 'Shein', url: 'https://de.shein.com', category: 'clothes', desc: { en: 'Ultra-fast fashion, very low prices', az: 'Ultra-sürətli moda, çox aşağı qiymətlər', de: 'Ultra-Fast-Fashion, sehr günstig', ru: 'Ультрабыстрая мода, очень дёшево' }, origin: '🇨🇳 China', freeShipping: '19€+' },
  { name: 'C&A', url: 'https://c-and-a.com/de', category: 'clothes', desc: { en: 'Family fashion, sustainable basics', az: 'Ailə modası, davamlı geyimlər', de: 'Familienmode, nachhaltige Basics', ru: 'Семейная мода, базовые вещи' }, origin: '🇩🇪 Germany', freeShipping: '39€+' },
  // Pharmacy
  { name: 'Shop Apotheke', url: 'https://shop-apotheke.com', category: 'pharma', desc: { en: 'Largest EU online pharmacy, Rx + OTC', az: 'AB-nin ən böyük onlayn apteki', de: 'Größte EU-Online-Apotheke, Rx + OTC', ru: 'Крупнейшая онлайн-аптека ЕС' }, origin: '🇩🇪 Germany', freeShipping: '19€+', highlight: true },
  { name: 'DocMorris', url: 'https://docmorris.de', category: 'pharma', desc: { en: 'Online pharmacy, e-prescriptions accepted', az: 'Onlayn aptek, e-resept qəbul edir', de: 'Online-Apotheke, E-Rezepte akzeptiert', ru: 'Онлайн-аптека, электронные рецепты' }, origin: '🇳🇱 Netherlands', freeShipping: '19€+', highlight: true },
  { name: 'Medpex', url: 'https://medpex.de', category: 'pharma', desc: { en: 'Pharmacy with focus on natural medicine', az: 'Təbii dərmanlara fokuslanmış aptek', de: 'Apotheke mit Fokus auf Naturheilmittel', ru: 'Аптека с фокусом на натуральные средства' }, origin: '🇩🇪 Germany', freeShipping: '20€+' },
  { name: 'Aponeo', url: 'https://aponeo.de', category: 'pharma', desc: { en: 'Berlin-based online pharmacy', az: 'Berlin əsaslı onlayn aptek', de: 'Berliner Online-Apotheke', ru: 'Берлинская онлайн-аптека' }, origin: '🇩🇪 Germany', freeShipping: '19€+' },
  { name: 'dm Drogerie', url: 'https://dm.de', category: 'pharma', desc: { en: 'Drugstore: cosmetics, health, baby, household', az: 'Drogeriya: kosmetika, sağlamlıq, uşaq', de: 'Drogerie: Kosmetik, Gesundheit, Baby, Haushalt', ru: 'Дрогери: косметика, здоровье, дети' }, origin: '🇩🇪 Germany', freeShipping: '49€+' },
  { name: 'Rossmann', url: 'https://rossmann.de', category: 'pharma', desc: { en: 'Drugstore chain, affordable health & beauty', az: 'Drogeriya şəbəkəsi, əlçatan sağlamlıq', de: 'Drogeriekette, günstige Gesundheit & Beauty', ru: 'Сеть дрогери, доступная косметика' }, origin: '🇩🇪 Germany', freeShipping: '50€+' },
  // Food & Grocery
  { name: 'REWE Lieferservice', url: 'https://rewe.de', category: 'food', desc: { en: 'Full supermarket delivered to your door', az: 'Tam supermarket qapınıza çatdırılır', de: 'Kompletter Supermarkt an die Haustür', ru: 'Полный супермаркет с доставкой' }, origin: '🇩🇪 Germany', highlight: true },
  { name: 'Flink', url: 'https://goflink.com', category: 'food', desc: { en: '10-minute grocery delivery', az: '10 dəqiqəyə ərzaq çatdırılması', de: '10-Minuten-Lieferung', ru: 'Доставка за 10 минут' }, origin: '🇩🇪 Germany', highlight: true },
  { name: 'Picnic', url: 'https://picnic.app', category: 'food', desc: { en: 'Free delivery, no minimum, Dutch quality', az: 'Pulsuz çatdırılma, minimum yoxdur', de: 'Kostenlose Lieferung, kein Mindestbestellwert', ru: 'Бесплатная доставка, без минимума' }, origin: '🇳🇱 Netherlands', freeShipping: 'Always' },
  { name: 'Lieferando', url: 'https://lieferando.de', category: 'food', desc: { en: 'Restaurant food delivery (Just Eat)', az: 'Restoran yemək çatdırılması', de: 'Restaurant-Lieferung (Just Eat)', ru: 'Доставка из ресторанов' }, origin: '🇳🇱 Netherlands', highlight: true },
  { name: 'Wolt', url: 'https://wolt.com/de', category: 'food', desc: { en: 'Food + grocery delivery in major cities', az: 'Böyük şəhərlərdə yemək + ərzaq', de: 'Essen + Lebensmittel in Großstädten', ru: 'Еда + продукты в крупных городах' }, origin: '🇫🇮 Finland' },
  { name: 'HelloFresh', url: 'https://hellofresh.de', category: 'food', desc: { en: 'Meal kits with recipes delivered weekly', az: 'Həftəlik reseptli yemək dəstləri', de: 'Kochboxen mit Rezepten wöchentlich', ru: 'Наборы для готовки с рецептами' }, origin: '🇩🇪 Germany' },
  // Electronics
  { name: 'MediaMarkt', url: 'https://mediamarkt.de', category: 'electronics', desc: { en: 'Largest electronics retailer in Europe', az: 'Avropanın ən böyük elektronika satıcısı', de: 'Größter Elektronikhändler Europas', ru: 'Крупнейший ритейлер электроники' }, origin: '🇩🇪 Germany', freeShipping: '59€+', highlight: true },
  { name: 'Saturn', url: 'https://saturn.de', category: 'electronics', desc: { en: 'Electronics, same-day delivery in cities', az: 'Elektronika, şəhərlərdə eyni gün çatdırılma', de: 'Elektronik, Lieferung am selben Tag', ru: 'Электроника, доставка в тот же день' }, origin: '🇩🇪 Germany', freeShipping: '59€+' },
  { name: 'Alternate', url: 'https://alternate.de', category: 'electronics', desc: { en: 'PC components, hardware, gaming gear', az: 'PC komponentləri, hardware, gaming', de: 'PC-Komponenten, Hardware, Gaming', ru: 'Компоненты ПК, железо, игровое' }, origin: '🇩🇪 Germany' },
  { name: 'Cyberport', url: 'https://cyberport.de', category: 'electronics', desc: { en: 'Laptops, Apple, networking, smart home', az: 'Noutbuklar, Apple, şəbəkə, smart ev', de: 'Laptops, Apple, Netzwerk, Smart Home', ru: 'Ноутбуки, Apple, сети, умный дом' }, origin: '🇩🇪 Germany', freeShipping: '200€+' },
  { name: 'Mindfactory', url: 'https://mindfactory.de', category: 'electronics', desc: { en: 'Best prices for PC parts, builder paradise', az: 'PC hissələri üçün ən yaxşı qiymətlər', de: 'Beste Preise für PC-Teile', ru: 'Лучшие цены на комплектующие' }, origin: '🇩🇪 Germany' },
  { name: 'Notebooksbilliger', url: 'https://notebooksbilliger.de', category: 'electronics', desc: { en: 'Cheap laptops, tablets, monitors', az: 'Ucuz noutbuklar, planşetlər', de: 'Günstige Laptops, Tablets, Monitore', ru: 'Дешёвые ноутбуки, планшеты' }, origin: '🇩🇪 Germany', freeShipping: '0€' },
  // Auto Parts
  { name: 'Autodoc', url: 'https://autodoc.de', category: 'autoparts', desc: { en: '5M+ parts for all car brands, EU warehouse', az: '5M+ hissə, bütün markalar, AB anbarı', de: '5M+ Teile für alle Marken, EU-Lager', ru: '5M+ запчастей для всех марок' }, origin: '🇩🇪 Germany', freeShipping: '120€+', highlight: true },
  { name: 'kfzteile24', url: 'https://kfzteile24.de', category: 'autoparts', desc: { en: 'Car parts + accessories, same-day Berlin', az: 'Maşın hissələri, Berlin eyni gün', de: 'Autoteile + Zubehör, Taggleich Berlin', ru: 'Запчасти + аксессуары, в тот же день Берлин' }, origin: '🇩🇪 Germany', freeShipping: '50€+' },
  { name: 'ATP Autoteile', url: 'https://atp-autoteile.de', category: 'autoparts', desc: { en: 'Quality OEM parts, fast delivery', az: 'Keyfiyyətli OEM hissələr, sürətli çatdırılma', de: 'Qualitäts-OEM-Teile, schnelle Lieferung', ru: 'Качественные OEM-запчасти, быстро' }, origin: '🇩🇪 Germany', freeShipping: '99€+' },
  { name: 'Mister Auto', url: 'https://mister-auto.de', category: 'autoparts', desc: { en: 'Budget car parts, 1M+ references', az: 'Büdcəli maşın hissələri, 1M+ referans', de: 'Günstige Autoteile, 1M+ Referenzen', ru: 'Бюджетные запчасти, 1M+ артикулов' }, origin: '🇫🇷 France' },
  { name: 'Oscaro', url: 'https://oscaro.de', category: 'autoparts', desc: { en: 'European parts specialist, great prices', az: 'Avropalı hissə mütəxəssisi', de: 'Europäischer Teile-Spezialist', ru: 'Европейский специалист по запчастям' }, origin: '🇫🇷 France' },
  // Furniture
  { name: 'IKEA', url: 'https://ikea.com/de', category: 'furniture', desc: { en: 'Affordable furniture & home decor', az: 'Əlçatan mebel və ev dekoru', de: 'Erschwingliche Möbel & Deko', ru: 'Доступная мебель и декор' }, origin: '🇸🇪 Sweden', freeShipping: '69€+', highlight: true },
  { name: 'Wayfair', url: 'https://wayfair.de', category: 'furniture', desc: { en: 'Millions of home items, all styles', az: 'Milyonlarla ev əşyası, bütün üslublar', de: 'Millionen Artikel für Zuhause', ru: 'Миллионы товаров для дома' }, origin: '🇺🇸 USA', freeShipping: '30€+' },
  { name: 'Home24', url: 'https://home24.de', category: 'furniture', desc: { en: 'German furniture marketplace, 100k+ items', az: 'Alman mebel marketplace, 100k+ əşya', de: 'Deutscher Möbel-Marktplatz, 100k+ Artikel', ru: 'Немецкий мебельный маркетплейс' }, origin: '🇩🇪 Germany', freeShipping: 'Most items' },
  { name: 'Mömax', url: 'https://moemax.de', category: 'furniture', desc: { en: 'Trendy furniture at accessible prices', az: 'Əlçatan qiymətə trendy mebel', de: 'Trendige Möbel zu guten Preisen', ru: 'Модная мебель по доступным ценам' }, origin: '🇦🇹 Austria' },
  { name: 'XXXLutz', url: 'https://xxxlutz.de', category: 'furniture', desc: { en: 'Large furniture store, premium brands', az: 'Böyük mebel mağazası, premium brendlər', de: 'Großes Möbelhaus, Premium-Marken', ru: 'Крупный мебельный, премиум-бренды' }, origin: '🇦🇹 Austria' },
  // International
  { name: 'Temu', url: 'https://temu.com/de', category: 'international', desc: { en: 'Ultra-cheap products from China, fast shipping', az: 'Çindən ultra-ucuz məhsullar', de: 'Ultra-günstige Produkte aus China', ru: 'Сверхдешёвые товары из Китая' }, origin: '🇨🇳 China', freeShipping: '15€+', highlight: true },
  { name: 'AliExpress', url: 'https://aliexpress.com', category: 'international', desc: { en: 'Millions of products, EU warehouse options', az: 'Milyonlarla məhsul, AB anbar seçimləri', de: 'Millionen Produkte, EU-Lager verfügbar', ru: 'Миллионы товаров, склады в ЕС' }, origin: '🇨🇳 China', highlight: true },
  { name: 'Wish', url: 'https://wish.com', category: 'international', desc: { en: 'Budget shopping, hit or miss quality', az: 'Büdcə alış-veriş, keyfiyyət müxtəlif', de: 'Budget-Shopping, Qualität variiert', ru: 'Бюджетный шопинг, качество разное' }, origin: '🇺🇸 USA' },
  { name: 'Banggood', url: 'https://banggood.com', category: 'international', desc: { en: 'Electronics & gadgets from China, EU stock', az: 'Çindən elektronika, AB anbar', de: 'Elektronik & Gadgets aus China, EU-Lager', ru: 'Электроника из Китая, склад в ЕС' }, origin: '🇨🇳 China' },
  { name: 'Joom', url: 'https://joom.com/de', category: 'international', desc: { en: 'Curated marketplace, European warehouses', az: 'Seçilmiş marketplace, Avropa anbarları', de: 'Kuratierter Marktplatz, EU-Lager', ru: 'Курированный маркетплейс, склады в ЕС' }, origin: '🇱🇻 Latvia' },
  // General — extended
  { name: 'Tchibo', url: 'https://www.tchibo.de', category: 'general', desc: { en: 'Coffee + weekly rotating lifestyle deals', az: 'Qəhvə + həftəlik dəyişən təkliflər', ru: 'Кофе и товары недели' }, origin: '🇩🇪 Germany' },
  { name: 'QVC', url: 'https://www.qvc.de', category: 'general', desc: { en: 'Live-shopping TV store, everything category', az: 'Canlı TV mağazası, hər kateqoriya', ru: 'ТВ-магазин, все категории' }, origin: '🇩🇪 Germany' },
  { name: 'Baur', url: 'https://www.baur.de', category: 'general', desc: { en: 'Fashion, home & tech catalog store', az: 'Moda, ev və texnologiya kataloqu', ru: 'Мода, дом и техника' }, origin: '🇩🇪 Germany' },
  { name: 'Zooplus', url: 'https://www.zooplus.de', category: 'general', desc: { en: 'Everything for pets, huge selection', az: 'Evcil heyvanlar üçün hər şey', ru: 'Всё для животных' }, origin: '🇩🇪 Germany' },
  // Clothes — extended
  { name: 'Deichmann', url: 'https://www.deichmann.com', category: 'clothes', desc: { en: 'Europe\'s largest shoe retailer', az: 'Avropanın ən böyük ayaqqabı satıcısı', ru: 'Крупнейшая обувная сеть Европы' }, origin: '🇩🇪 Germany' },
  { name: 'Snipes', url: 'https://www.snipes.com', category: 'clothes', desc: { en: 'Sneakers & streetwear culture', az: 'Sneaker və streetwear mədəniyyəti', ru: 'Кроссовки и стритвир' }, origin: '🇩🇪 Germany' },
  { name: 'Uniqlo', url: 'https://www.uniqlo.com/de', category: 'clothes', desc: { en: 'Japanese basics, LifeWear quality', az: 'Yapon əsas geyimlər, LifeWear', ru: 'Японские базовые вещи' }, origin: '🇯🇵 Japan' },
  // Pharmacy — extended
  { name: 'Zur Rose', url: 'https://www.zurrose.de', category: 'pharma', desc: { en: 'Large online pharmacy, e-prescriptions', az: 'Böyük onlayn aptek, e-reseptlər', ru: 'Крупная онлайн-аптека, е-рецепты' }, origin: '🇨🇭 Switzerland' },
  { name: 'Müller', url: 'https://www.mueller.de', category: 'pharma', desc: { en: 'Drugstore: beauty, toys, home, stationery', az: 'Drogeriya: kosmetika, oyuncaq, ev', ru: 'Дрогери: косметика, игрушки, дом' }, origin: '🇩🇪 Germany' },
  // Food — extended
  { name: 'Knuspr', url: 'https://www.knuspr.de', category: 'food', desc: { en: 'Full supermarket delivery, own brands', az: 'Tam supermarket çatdırılması', ru: 'Доставка продуктов домой' }, origin: '🇩🇪 Germany' },
  { name: 'Alnatura', url: 'https://www.alnatura.de', category: 'food', desc: { en: 'Organic supermarket range', az: 'Organik supermarket məhsulları', ru: 'Органические продукты' }, origin: '🇩🇪 Germany' },
  { name: 'Too Good To Go', url: 'https://toogoodtogo.com', category: 'food', desc: { en: 'Rescue surplus food at low prices', az: 'Artıq qidanı ucuza qurtar', ru: 'Спасение еды со скидкой' }, origin: '🇩🇰 Denmark' },
  // Electronics — extended
  { name: 'Galaxus', url: 'https://www.galaxus.de', category: 'electronics', desc: { en: 'Swiss giant, huge range beyond tech', az: 'İsveçrə nəhəngi, geniş çeşid', ru: 'Швейцарский гигант, огромный выбор' }, origin: '🇨🇭 Switzerland' },
  { name: 'Coolblue', url: 'https://www.coolblue.de', category: 'electronics', desc: { en: 'NL retailer known for top service', az: 'NL satıcısı, mükəmməl servis', ru: 'Нидерландский ритейлер, топ-сервис' }, origin: '🇳🇱 Netherlands' },
  { name: 'Conrad', url: 'https://www.conrad.de', category: 'electronics', desc: { en: 'Electronics & maker supplies since 1923', az: '1923-dən elektronika və maker malları', ru: 'Электроника и товары для мейкеров' }, origin: '🇩🇪 Germany' },
  { name: 'ComputerUniverse', url: 'https://www.computeruniverse.net', category: 'electronics', desc: { en: 'Notebooks, TVs, hi-fi deals', az: 'Noutbuk, TV, hi-fi təklifləri', ru: 'Ноутбуки, ТВ, hi-fi' }, origin: '🇩🇪 Germany' },
  // Auto Parts — extended
  { name: 'Daparto', url: 'https://www.daparto.de', category: 'autoparts', desc: { en: 'Price comparison for car parts', az: 'Maşın hissələri qiymət müqayisəsi', ru: 'Сравнение цен на запчасти' }, origin: '🇩🇪 Germany' },
  // Furniture — extended
  { name: 'Poco', url: 'https://www.poco.de', category: 'furniture', desc: { en: 'Budget furniture & home, huge stores', az: 'Büdcə mebel və ev malları', ru: 'Бюджетная мебель и товары для дома' }, origin: '🇩🇪 Germany' },
  { name: 'Höffner', url: 'https://www.hoeffner.de', category: 'furniture', desc: { en: 'German furniture megastore chain', az: 'Alman mebel megastore şəbəkəsi', ru: 'Немецкая сеть мебельных магазинов' }, origin: '🇩🇪 Germany' },
  { name: 'ManoMano', url: 'https://www.manomano.de', category: 'furniture', desc: { en: 'DIY, garden & home marketplace', az: 'DIY, bağ və ev marketplace', ru: 'Маркетплейс DIY и сада' }, origin: '🇫🇷 France' },
  { name: 'Westwing', url: 'https://www.westwing.de', category: 'furniture', desc: { en: 'Premium home & living inspiration', az: 'Premium ev və yaşam dizaynı', ru: 'Премиум товары для дома' }, origin: '🇩🇪 Germany' },
  // International — extended
  { name: 'Etsy', url: 'https://www.etsy.com', category: 'international', desc: { en: 'Handmade, vintage & craft marketplace', az: 'Əl işləri, vintage və kraft marketplace', ru: 'Хендмейд, винтаж и крафт' }, origin: '🇺🇸 USA' },
  { name: 'bol.com', url: 'https://www.bol.com', category: 'international', desc: { en: 'Netherlands\' biggest marketplace, ships to DE', az: 'NL-nin ən böyük marketplace, DE-yə göndərir', ru: 'Крупнейший маркетплейс Нидерландов' }, origin: '🇳🇱 Netherlands' },
  { name: 'Fruugo', url: 'https://www.fruugo.de', category: 'international', desc: { en: 'Global marketplace with local pricing', az: 'Qlobal marketplace, yerli qiymətlər', ru: 'Глобальный маркетплейс' }, origin: '🇬🇧 UK' },
]

export default function PlatformsWidget({ initialCategory }: { initialCategory?: string }) {
  const { lang } = useLang()
  const [category, setCategory] = useState(initialCategory || 'all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)

  const filtered = platforms.filter(p => {
    const matchCat = category === 'all' || p.category === category
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })
  const display = expanded ? filtered : filtered.slice(0, 12)
  const t = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-500" />
          {t('title')}
        </h2>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-400 mb-3">{t('subtitle')}</p>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search platforms..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {categories.map(c => {
          const Icon = c.icon
          return (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${category === c.id ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" />
              {pickLabel(c.label, lang)}
            </button>
          )
        })}
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {display.map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
            className={`group block p-3 rounded-lg border transition-all hover:shadow-md bg-white dark:bg-gray-800/50 ${p.highlight ? 'border-blue-200 dark:border-blue-700 ring-1 ring-blue-100 dark:ring-blue-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}`}>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">{p.name}</h3>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-400 mb-2 line-clamp-2">{p.desc[lang] || p.desc.en}</p>
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-[10px] text-gray-400">{p.origin}</span>
              {p.freeShipping && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                  🚚 {p.freeShipping === 'Always' ? t('free_shipping') : `Free ${p.freeShipping}`}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      {filtered.length > 12 && (
        <button onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
          {expanded ? '▲ Show less' : `▼ Show all (${filtered.length})`}
        </button>
      )}

      <SectionNews section="platforms" tab={category} accentColor="blue" />
    </div>
  )
}
