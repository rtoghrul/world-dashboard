'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Bell, Plus, X, TrendingUp, TrendingDown, Trash2, AlertTriangle } from 'lucide-react'

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
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({ coin: 'bitcoin', condition: 'above' as const, target: '' })
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
        const ids = [...new Set(alerts.map(a => a.coin))].join(',')
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
        className="relative p-2 rounded-lg text-[#6b6b80] hover:text-white hover:bg-white/[0.04] transition"
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
          className="w-[340px] max-h-[500px] rounded-2xl bg-[#0f0f15] border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-white font-semibold text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddAlert(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-medium border border-indigo-500/20 hover:bg-indigo-500/20 transition"
              >
                <Plus className="w-3 h-3" /> Alert
              </button>
              {notifications.length > 0 && (
                <button onClick={clearNotifications} className="text-[10px] text-[#6b6b80] hover:text-white transition">Clear</button>
              )}
            </div>
          </div>

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <div className="px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.01]">
              <p className="text-[10px] text-[#6b6b80] uppercase tracking-wider font-semibold mb-2">Active Alerts ({alerts.length})</p>
              {alerts.map(a => (
                <div key={a.id} className="flex items-center justify-between py-1.5 group">
                  <span className="text-xs text-[#a0a0b0]">
                    {a.coin.toUpperCase()} {a.condition === 'above' ? '↑' : '↓'} ${a.target.toLocaleString()}
                  </span>
                  <button onClick={() => removeAlert(a.id)} className="opacity-0 group-hover:opacity-100 text-[#5b5b70] hover:text-red-400 transition">
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
                <Bell className="w-6 h-6 text-[#3a3a4a] mx-auto mb-2" />
                <p className="text-xs text-[#5b5b70]">No notifications yet</p>
                <p className="text-[10px] text-[#3a3a4a] mt-1">Set price alerts to get notified</p>
              </div>
            ) : (
              notifications.slice(0, 20).map(notif => (
                <div key={notif.id} className={`px-4 py-3 border-b border-white/[0.03] ${!notif.read ? 'bg-indigo-500/[0.03]' : ''}`}>
                  <p className="text-xs text-[#d0d0e0]">{notif.message}</p>
                  <p className="text-[10px] text-[#4a4a5a] mt-1">
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
          <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-[#0f0f15] border border-white/[0.08] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-sm">New Price Alert</h3>
              <button onClick={() => setShowAddAlert(false)} className="text-[#6b6b80] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#6b6b80] mb-1 block">Coin</label>
                <select
                  value={newAlert.coin}
                  onChange={e => setNewAlert(p => ({ ...p, coin: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm outline-none"
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
                <label className="text-[11px] text-[#6b6b80] mb-1 block">Condition</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewAlert(p => ({ ...p, condition: 'above' }))}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-medium border transition ${newAlert.condition === 'above' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.02] border-white/[0.06] text-[#6b6b80]'}`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" /> Goes Above
                  </button>
                  <button
                    onClick={() => setNewAlert(p => ({ ...p, condition: 'below' }))}
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-xs font-medium border transition ${newAlert.condition === 'below' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/[0.02] border-white/[0.06] text-[#6b6b80]'}`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" /> Goes Below
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#6b6b80] mb-1 block">Target Price ($)</label>
                <input
                  type="number"
                  value={newAlert.target}
                  onChange={e => setNewAlert(p => ({ ...p, target: e.target.value }))}
                  placeholder="100000"
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm outline-none focus:border-indigo-500/30 placeholder:text-[#4a4a5a]"
                />
              </div>
              <button
                onClick={addAlert}
                className="w-full mt-2 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
