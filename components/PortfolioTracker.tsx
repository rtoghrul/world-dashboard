'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, PieChart, Wallet, X } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Portfolio', az: 'Portfel', ru: 'Портфель', de: 'Portfolio', tr: 'Portföy', fr: 'Portefeuille', es: 'Cartera', it: 'Portafoglio', pt: 'Carteira', zh: '投资组合', ar: 'المحفظة', ja: 'ポートフォリオ' },
  add: { en: 'Add', az: 'Əlavə et', ru: 'Добавить', de: 'Hinzufügen', tr: 'Ekle', fr: 'Ajouter', es: 'Añadir', it: 'Aggiungi', pt: 'Adicionar', zh: '添加', ar: 'إضافة', ja: '追加' },
  empty: { en: 'No holdings yet', az: 'Hələ aktiv yoxdur', ru: 'Пока нет активов', de: 'Noch keine Bestände', tr: 'Henüz varlık yok', fr: 'Aucune position', es: 'Sin posiciones', it: 'Nessuna posizione', pt: 'Sem posições', zh: '暂无持仓', ar: 'لا توجد أصول بعد', ja: '保有資産なし' },
  addHolding: { en: 'Add Holding', az: 'Aktiv əlavə et', ru: 'Добавить актив', de: 'Bestand hinzufügen', tr: 'Varlık ekle', fr: 'Ajouter une position', es: 'Añadir posición', it: 'Aggiungi posizione', pt: 'Adicionar posição', zh: '添加持仓', ar: 'إضافة أصل', ja: '保有資産を追加' },
  coinId: { en: 'Coin ID (coingecko)', az: 'Coin ID (coingecko)', ru: 'ID монеты (coingecko)', de: 'Coin-ID (coingecko)', tr: 'Coin ID (coingecko)', fr: 'ID crypto (coingecko)', es: 'ID de moneda (coingecko)', it: 'ID moneta (coingecko)', pt: 'ID da moeda (coingecko)', zh: '币种ID (coingecko)', ar: 'معرف العملة (coingecko)', ja: 'コインID (coingecko)' },
  displayName: { en: 'Display Name', az: 'Göstərilən ad', ru: 'Отображаемое имя', de: 'Anzeigename', tr: 'Görünen ad', fr: 'Nom affiché', es: 'Nombre visible', it: 'Nome visualizzato', pt: 'Nome exibido', zh: '显示名称', ar: 'الاسم المعروض', ja: '表示名' },
  amount: { en: 'Amount', az: 'Miqdar', ru: 'Количество', de: 'Menge', tr: 'Miktar', fr: 'Quantité', es: 'Cantidad', it: 'Quantità', pt: 'Quantidade', zh: '数量', ar: 'الكمية', ja: '数量' },
  buyPrice: { en: 'Buy Price ($)', az: 'Alış qiyməti ($)', ru: 'Цена покупки ($)', de: 'Kaufpreis ($)', tr: 'Alış fiyatı ($)', fr: 'Prix d\'achat ($)', es: 'Precio de compra ($)', it: 'Prezzo d\'acquisto ($)', pt: 'Preço de compra ($)', zh: '买入价 ($)', ar: 'سعر الشراء ($)', ja: '購入価格 ($)' },
  totalValue: { en: 'Total portfolio value', az: 'Portfelin ümumi dəyəri', ru: 'Общая стоимость портфеля', de: 'Gesamtwert des Portfolios', tr: 'Portföyün toplam değeri', fr: 'Valeur totale du portefeuille', es: 'Valor total de la cartera', it: 'Valore totale del portafoglio', pt: 'Valor total da carteira', zh: '投资组合总值', ar: 'إجمالي قيمة المحفظة', ja: 'ポートフォリオ総額' },
  costBasis: { en: 'Cost basis', az: 'Xərc bazası', ru: 'Базовая стоимость', de: 'Einstandswert', tr: 'Maliyet', fr: 'Prix de revient', es: 'Coste base', it: 'Costo base', pt: 'Custo base', zh: '成本基础', ar: 'أساس التكلفة', ja: '取得原価' },
  emptyHint: { en: 'Add your first crypto holding to track value & profit in real time', az: 'Dəyəri və gəliri real vaxtda izləmək üçün ilk kripto aktivinizi əlavə edin', ru: 'Добавьте первый криптоактив, чтобы следить за стоимостью и прибылью в реальном времени', de: 'Füge deinen ersten Krypto-Bestand hinzu, um Wert und Gewinn live zu verfolgen', tr: 'Değeri ve kârı anlık izlemek için ilk kripto varlığınızı ekleyin', fr: 'Ajoutez votre première crypto pour suivre valeur et gains en temps réel', es: 'Añade tu primera cripto para seguir valor y beneficio en tiempo real', it: 'Aggiungi la tua prima crypto per seguire valore e profitto in tempo reale', pt: 'Adicione sua primeira cripto para acompanhar valor e lucro em tempo real', zh: '添加第一笔加密资产，实时跟踪价值与收益', ar: 'أضف أول أصل مشفر لتتبع القيمة والربح لحظياً', ja: '最初の暗号資産を追加して、評価額と損益をリアルタイムで確認' },
  addFirst: { en: 'Add first holding', az: 'İlk aktivi əlavə et', ru: 'Добавить первый актив', de: 'Ersten Bestand hinzufügen', tr: 'İlk varlığı ekle', fr: 'Ajouter une première position', es: 'Añadir primera posición', it: 'Aggiungi la prima posizione', pt: 'Adicionar primeira posição', zh: '添加第一笔持仓', ar: 'أضف أول أصل', ja: '最初の資産を追加' },
}

interface Holding {
  id: string
  symbol: string
  name: string
  amount: number
  buyPrice: number
}

interface PricedHolding extends Holding {
  currentPrice: number
  change24h: number
  value: number
  pnl: number
  pnlPercent: number
}

export default function PortfolioTracker() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [pricedHoldings, setPricedHoldings] = useState<PricedHolding[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newHolding, setNewHolding] = useState({ symbol: '', name: '', amount: '', buyPrice: '' })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-holdings')
    if (saved) setHoldings(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (holdings.length > 0) {
      localStorage.setItem('portfolio-holdings', JSON.stringify(holdings))
    }
  }, [holdings])

  // Fetch current prices
  useEffect(() => {
    if (holdings.length === 0) {
      setPricedHoldings([])
      return
    }

    async function fetchPrices() {
      setLoading(true)
      try {
        const ids = holdings.map(h => h.id).join(',')
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`)
        const data = await res.json()

        if (Array.isArray(data)) {
          const priced = holdings.map(h => {
            const market = data.find((d: any) => d.id === h.id)
            const currentPrice = market?.current_price || h.buyPrice
            const change24h = market?.price_change_percentage_24h || 0
            const value = h.amount * currentPrice
            const cost = h.amount * h.buyPrice
            const pnl = value - cost
            const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0
            return { ...h, currentPrice, change24h, value, pnl, pnlPercent }
          })
          setPricedHoldings(priced)
        }
      } catch { }
      setLoading(false)
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [holdings])

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.amount || !newHolding.buyPrice) return
    const holding: Holding = {
      id: newHolding.symbol.toLowerCase(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name || newHolding.symbol,
      amount: parseFloat(newHolding.amount),
      buyPrice: parseFloat(newHolding.buyPrice),
    }
    setHoldings(prev => [...prev, holding])
    setNewHolding({ symbol: '', name: '', amount: '', buyPrice: '' })
    setShowAddModal(false)
  }

  const removeHolding = (symbol: string) => {
    const updated = holdings.filter(h => h.symbol !== symbol)
    setHoldings(updated)
    localStorage.setItem('portfolio-holdings', JSON.stringify(updated))
  }

  const totalValue = pricedHoldings.reduce((sum, h) => sum + h.value, 0)
  const totalCost = pricedHoldings.reduce((sum, h) => sum + (h.amount * h.buyPrice), 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  return (
    <div className="rounded-2xl bg-surface-1 border border-line overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <h2 className="text-ink-1 font-semibold text-sm">{c('title')}</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition"
        >
          <Plus className="w-3.5 h-3.5" /> {c('add')}
        </button>
      </div>

      {/* Summary */}
      {pricedHoldings.length > 0 && (
        <div className="px-5 py-4 border-b border-line bg-fg/[0.01]">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-ink-1">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className={`text-sm font-medium flex items-center gap-0.5 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnl >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}% (${Math.abs(totalPnl).toLocaleString(undefined, { maximumFractionDigits: 2 })})
            </span>
          </div>
          <p className="text-[11px] text-ink-4 mt-1">{c('totalValue')} • {c('costBasis')}: ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
      )}

      {/* Holdings list */}
      <div className="divide-y divide-line">
        {pricedHoldings.length === 0 && (
          <div className="px-5 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/10 border border-line flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-6 h-6 text-ink-4" />
            </div>
              <p className="text-sm text-ink-4 font-medium">{c('empty')}</p>
            <p className="text-xs text-ink-4 mt-1.5 max-w-[230px] mx-auto leading-relaxed">{c('emptyHint')}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" aria-hidden="true" /> {c('addFirst')}
            </button>
          </div>
        )}
        {pricedHoldings.map(h => (
          <div key={h.symbol} className="flex items-center gap-3 px-5 py-3.5 hover:bg-fg/[0.02] transition group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
              {h.symbol.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-1 font-medium">{h.symbol}</span>
                <span className="text-[11px] text-ink-4">{h.amount} coins</span>
              </div>
              <span className="text-[11px] text-ink-4">Buy: ${h.buyPrice.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink-1 font-mono">${h.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className={`text-[10px] font-medium ${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {h.pnl >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%
              </p>
            </div>
            <button onClick={() => removeHolding(h.symbol)} className="opacity-0 group-hover:opacity-100 p-1 text-ink-4 hover:text-red-400 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-surface-1 border border-line-strong p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
          <h3 className="text-ink-1 font-semibold text-sm">{c('addHolding')}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-ink-4 hover:text-ink-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
            <label className="text-[11px] text-ink-4 mb-1 block">{c('coinId')}</label>
                <input
                  type="text"
                  value={newHolding.symbol}
                  onChange={e => setNewHolding(p => ({ ...p, symbol: e.target.value }))}
                  placeholder="bitcoin, ethereum, solana..."
                  className="w-full px-3 py-2.5 rounded-lg bg-fg/[0.04] border border-line text-ink-1 text-sm outline-none focus:border-indigo-500/30 placeholder-ink-4"
                />
              </div>
              <div>
            <label className="text-[11px] text-ink-4 mb-1 block">{c('displayName')}</label>
                <input
                  type="text"
                  value={newHolding.name}
                  onChange={e => setNewHolding(p => ({ ...p, name: e.target.value }))}
                  placeholder="Bitcoin"
                  className="w-full px-3 py-2.5 rounded-lg bg-fg/[0.04] border border-line text-ink-1 text-sm outline-none focus:border-indigo-500/30 placeholder-ink-4"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
            <label className="text-[11px] text-ink-4 mb-1 block">{c('amount')}</label>
                  <input
                    type="number"
                    value={newHolding.amount}
                    onChange={e => setNewHolding(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.5"
                    className="w-full px-3 py-2.5 rounded-lg bg-fg/[0.04] border border-line text-ink-1 text-sm outline-none focus:border-indigo-500/30 placeholder-ink-4"
                  />
                </div>
                <div>
            <label className="text-[11px] text-ink-4 mb-1 block">{c('buyPrice')}</label>
                  <input
                    type="number"
                    value={newHolding.buyPrice}
                    onChange={e => setNewHolding(p => ({ ...p, buyPrice: e.target.value }))}
                    placeholder="60000"
                    className="w-full px-3 py-2.5 rounded-lg bg-fg/[0.04] border border-line text-ink-1 text-sm outline-none focus:border-indigo-500/30 placeholder-ink-4"
                  />
                </div>
              </div>
              <button
                onClick={addHolding}
                className="w-full mt-2 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
              >
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
