'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Bell, Plus, X, TrendingUp, TrendingDown, Trash2, AlertTriangle } from 'lucide-react'
import { useLang } from '@/lib/LanguageContext'

const COPY: Record<string, Record<string, string>> = {
  title: { en: 'Notifications', az: 'Bildirişlər', ru: 'Уведомления', de: 'Benachrichtigungen', tr: 'Bildirimler', fr: 'Notifications', es: 'Notificaciones', it: 'Notifiche', pt: 'Notificações', zh: '通知', ar: 'الإشعارات', ja: '通知' },
  clear: { en: 'Clear', az: 'Təmizlə', ru: 'Очистить', de: 'Leeren', tr: 'Temizle', fr: 'Effacer', es: 'Limpiar', it: 'Cancella', pt: 'Limpar', zh: '清除', ar: 'مسح', ja: 'クリア' },
  empty: { en: 'No notifications yet', az: 'Hələ bildiriş yoxdur', ru: 'Пока нет уведомлений', de: 'Noch keine Benachrichtigungen', tr: 'Henüz bildirim yok', fr: 'Aucune notification', es: 'Sin notificaciones', it: 'Nessuna notifica', pt: 'Sem notificações', zh: '暂无通知', ar: 'لا توجد إشعارات بعد', ja: '通知なし' },
  emptyHint: { en: 'Set price alerts to get notified', az: 'Bildiriş almaq üçün qiymət alarmı qur', ru: 'Настройте ценовые оповещения', de: 'Preisalarme einrichten', tr: 'Fiyat uyarısı kurun', fr: 'Créez des alertes de prix', es: 'Crea alertas de precio', it: 'Imposta avvisi di prezzo', pt: 'Crie alertas de preço', zh: '设置价格提醒', ar: 'أنشئ تنبيهات الأسعار', ja: '価格アラートを設定' },
  newAlert: { en: 'New Price Alert', az: 'Yeni qiymət alarmı', ru: 'Новое ценовое оповещение', de: 'Neuer Preisalarm', tr: 'Yeni fiyat uyarısı', fr: 'Nouvelle alerte de prix', es: 'Nueva alerta de precio', it: 'Nuovo avviso di prezzo', pt: 'Novo alerta de preço', zh: '新建价格提醒', ar: 'تنبيه سعر جديد', ja: '新しい価格アラート' },
  coin: { en: 'Coin', az: 'Coin', ru: 'Монета', de: 'Coin', tr: 'Coin', fr: 'Crypto', es: 'Moneda', it: 'Moneta', pt: 'Moeda', zh: '币种', ar: 'العملة', ja: 'コイン' },
  condition: { en: 'Condition', az: 'Şərt', ru: 'Условие', de: 'Bedingung', tr: 'Koşul', fr: 'Condition', es: 'Condición', it: 'Condizione', pt: 'Condição', zh: '条件', ar: 'الشرط', ja: '条件' },
  above: { en: 'Goes Above', az: 'Yuxarı keçərsə', ru: 'Поднимается выше', de: 'Steigt über', tr: 'Üzerine çıkarsa', fr: 'Dépasse', es: 'Supera', it: 'Sale sopra', pt: 'Sobe acima de', zh: '高于', ar: 'يتجاوز لأعلى', ja: '上回り' },
  below: { en: 'Goes Below', az: 'Aşağı düşərsə', ru: 'Опускается ниже', de: 'Fällt unter', tr: 'Altına düşerse', fr: 'En dessous', es: 'Baja de', it: 'Scende sotto', pt: 'Cai abaixo de', zh: '低于', ar: 'ينخفض لأدنى', ja: '下回り' },
  targetPrice: { en: 'Target Price ($)', az: 'Hədəf qiymət ($)', ru: 'Целевая цена ($)', de: 'Zielpreis ($)', tr: 'Hedef fiyat ($)', fr: 'Prix cible ($)', es: 'Precio objetivo ($)', it: 'Prezzo target ($)', pt: 'Preço-alvo ($)', zh: '目标价格 ($)', ar: 'السعر المستهدف ($)', ja: '目標価格 ($)' },
  setAlert: { en: 'Set Alert', az: 'Alarm qur', ru: 'Создать оповещение', de: 'Alarm erstellen', tr: 'Uyarı kur', fr: 'Créer l\'alerte', es: 'Crear alerta', it: 'Imposta avviso', pt: 'Criar alerta', zh: '设置提醒', ar: 'تعيين التنبيه', ja: 'アラート設定' },
}

interface PriceAlert {
  id: string
  coin: string
  condition: 'above' | 'below'
  target: number
  createdAt: number
}

interface Notification {
  id: string
  message: string
  type: 'alert' | 'info'
  timestamp: number
  read: boolean
}

export default function NotificationCenter() {
  const { lang } = useLang()
  const c = (k: string) => COPY[k]?.[lang] || COPY[k]?.en || k
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({ coin: 'bitcoin', condition: 'above' as 'above' | 'below', target: '' })
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedAlerts = localStorage.getItem('price-alerts')
    const savedNotifs = localStorage.getItem('notifications')
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts))
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs))
  }, [])

  useEffect(() => {
    localStorage.setItem('price-alerts', JSON.stringify(alerts))
  }, [alerts])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // Check alerts every 30 seconds
  useEffect(() => {
    if (alerts.length === 0) return

    async function checkAlerts() {
      try {
        const ids = Array.from(new Set(alerts.map(a => a.coin))).join(',')
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
        const prices = await res.json()

        alerts.forEach(alert => {
          const price = prices[alert.coin]?.usd
          if (!price) return

          const triggered = alert.condition === 'above' ? price >= alert.target : price <= alert.target

          if (triggered) {
            const notif: Notification = {
              id: Date.now().toString() + Math.random(),
              message: `🚨 ${alert.coin.toUpperCase()} is ${alert.condition} $${alert.target.toLocaleString()} (now $${price.toLocaleString()})`,
              type: 'alert',
              timestamp: Date.now(),
              read: false,
            }
            setNotifications(prev => [notif, ...prev].slice(0, 50))
            // Remove triggered alert
            setAlerts(prev => prev.filter(a => a.id !== alert.id))
          }
        })
      } catch {}
    }

    checkAlerts()
    const interval = setInterval(checkAlerts, 30000)
    return () => clearInterval(interval)
  }, [alerts])

  // Click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowPanel(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const addAlert = () => {
    if (!newAlert.target) return
    const alert: PriceAlert = {
      id: Date.now().toString(),
      coin: newAlert.coin,
      condition: newAlert.condition,
      target: parseFloat(newAlert.target),
      createdAt: Date.now(),
    }
    setAlerts(prev => [...prev, alert])
    setNewAlert({ coin: 'bitcoin', condition: 'above', target: '' })
    setShowAddAlert(false)

    const notif: Notification = {
      id: Date.now().toString() + 'info',
      message: `✅ Alert set: ${alert.coin.toUpperCase()} ${alert.condition} $${alert.target.toLocaleString()}`,
      type: 'info',
      timestamp: Date.now(),
      read: true,
    }
    setNotifications(prev => [notif, ...prev].slice(0, 50))
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const clearNotifications = () => {
    setNotifications([])
    localStorage.removeItem('notifications')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <>
      {/* Bell button - rendered inline in header */}
      <button
        ref={bellRef}
        onClick={() => { setShowPanel(!showPanel); markAllRead() }}
        className="relative p-2 rounded-lg text-ink-4 hover:text-ink-1 hover:bg-fg/[0.04] transition"
        title="Notifications & Alerts"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {mounted && showPanel && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: 60, right: 16, zIndex: 99998 }}
          className="w-[340px] max-h-[500px] rounded-2xl bg-surface-1 border border-line-strong shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <h3 className="text-ink-1 font-semibold text-sm">{c('title')}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddAlert(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition"
              >
                <Plus className="w-3 h-3" /> Alert
              </button>
              {notifications.length > 0 && (
          <button onClick={clearNotifications} className="text-[10px] text-ink-4 hover:text-ink-1 transition">{c('clear')}</button>
              )}
            </div>
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <div className="px-4 py-2.5 border-b border-line bg-fg/[0.01]">
              <p className="text-[10px] text-ink-4 uppercase tracking-wider font-semibold mb-2">Active Alerts ({alerts.length})</p>
              {alerts.map(a => (
                <div key={a.id} className="flex items-center justify-between py-1.5 group">
                  <span className="text-xs text-ink-3">
                    {a.coin.toUpperCase()} {a.condition === 'above' ? '↑' : '↓'} ${a.target.toLocaleString()}
                  </span>
                  <button onClick={() => removeAlert(a.id)} className="opacity-0 group-hover:opacity-100 text-ink-4 hover:text-red-400 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Notifications list */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="w-6 h-6 text-ink-4 mx-auto mb-2" />
          <p className="text-xs text-ink-4">{c('empty')}</p>
          <p className="text-[10px] text-ink-4 mt-1">{c('emptyHint')}</p>
              </div>
            ) : (
              notifications.slice(0, 20).map(notif => (
                <div key={notif.id} className={`px-4 py-3 border-b border-line ${!notif.read ? 'bg-indigo-500/[0.03]' : ''}`}>
                  <p className="text-xs text-ink-2">{notif.message}</p>
                  <p className="text-[10px] text-ink-4 mt-1">
                    {new Date(notif.timestamp).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Add Alert Modal */}
      {showAddAlert && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddAlert(false)} />
          <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-surface-1 border border-line-strong p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
          <h3 className="text-ink-1 font-semibold text-sm">{c('newAlert')}</h3>
              <button onClick={() => setShowAddAlert(false)} className="text-ink-4 hover:text-ink-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                        <label className="text-[11px] text-ink-4 mb-1 block">{c('coin')}</label>
                <select
                  value={newAlert.coin}
                  onChange={e => setNewAlert(p => ({ ...p, coin: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-fg/[0.04] border border-line text-ink-1 text-sm outline-none"
                >
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="solana">Solana (SOL)</option>
                  <option value="binancecoin">BNB</option>
                  <option value="ripple">XRP</option>
                  <option value="dogecoin">Dogecoin (DOGE)</option>
                  <option value="cardano">Cardano (ADA)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-ink-4 mb-1 block">{c('condition')}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewAlert(p => ({ ...p, condition: 'above' }))}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-medium border transition ${newAlert.condition === 'above' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-fg/[0.02] border-line text-ink-4'}`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> {c('above')}
                  </button>
                  <button
                    onClick={() => setNewAlert(p => ({ ...p, condition: 'below' }))}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-medium border transition ${newAlert.condition === 'below' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-fg/[0.02] border-line text-ink-4'}`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" /> {c('below')}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-ink-4 mb-1 block">{c('targetPrice')}</label>
                <input
                  type="number"
                  value={newAlert.target}
                  onChange={e => setNewAlert(p => ({ ...p, target: e.target.value }))}
                  placeholder="100000"
                  className="w-full px-3 py-2.5 rounded-lg bg-fg/[0.04] border border-line text-ink-1 text-sm outline-none focus:border-indigo-500/30 placeholder-ink-4"
                />
              </div>
              <button
                onClick={addAlert}
                className="w-full mt-2 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
              >
                {c('setAlert')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
