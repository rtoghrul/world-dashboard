import { NextResponse } from 'next/server'

export const revalidate = 120

type WhaleTx = {
  id: string
  chain: string
  symbol: string
  amount: number
  usdValue: number
  fromWallet: string
  toWallet: string
  txUrl: string
  fromUrl: string
  toUrl: string
  direction: string
  time: string
}

function btcUsdFallback() {
  return 76000
}

async function getBtcPrice() {
  // Binance first: keyless and effectively never rate-limited at this volume
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', { next: { revalidate: 120 } })
    const json = await res.json()
    const price = Number(json?.price)
    if (price > 0) return price
  } catch {}
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { next: { revalidate: 120 } })
    const json = await res.json()
    return Number(json?.bitcoin?.usd) || btcUsdFallback()
  } catch {
    return btcUsdFallback()
  }
}

function shortAddress(addr?: string) {
  if (!addr) return 'Unknown'
  return addr
}

// Latest mined block via mempool.space — a block holds thousands of txs, so a
// 50-tx sample reliably contains genuine whale transfers (the 10-tx unconfirmed
// sample alone almost never does)
async function getBlockTxs(): Promise<any[]> {
  try {
    const tip = await (await fetch('https://mempool.space/api/blocks/tip/hash', { next: { revalidate: 120 } })).text()
    if (!/^[0-9a-f]{64}$/.test(tip)) return []
    const [p1, p2] = await Promise.all([
      fetch(`https://mempool.space/api/block/${tip}/txs/0`, { next: { revalidate: 120 } }).then(r => r.ok ? r.json() : []),
      fetch(`https://mempool.space/api/block/${tip}/txs/25`, { next: { revalidate: 120 } }).then(r => r.ok ? r.json() : []),
    ])
    const rows = [...(Array.isArray(p1) ? p1 : []), ...(Array.isArray(p2) ? p2 : [])]
    // Convert mempool.space shape to the blockchain.info shape mapped below
    return rows.map((tx: any) => ({
      hash: tx.txid,
      time: tx.status?.block_time,
      inputs: (tx.vin || []).map((i: any) => ({ prev_out: { addr: i.prevout?.scriptpubkey_address } })),
      out: (tx.vout || []).map((o: any) => ({ value: o.value, addr: o.scriptpubkey_address })),
    }))
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const [price, res, blockTxs] = await Promise.all([
      getBtcPrice(),
      fetch('https://blockchain.info/unconfirmed-transactions?format=json', { next: { revalidate: 120 } }).catch(() => null),
      getBlockTxs(),
    ])
    const data = res ? await res.json().catch(() => null) : null
    const txs = [...(Array.isArray(data?.txs) ? data.txs : []), ...blockTxs]

    const whales: WhaleTx[] = txs
      .map((tx: any) => {
        const totalOut = Array.isArray(tx.out) ? tx.out.reduce((sum: number, out: any) => sum + Number(out.value || 0), 0) : 0
        const amount = totalOut / 100000000
        const usdValue = amount * price
        const fromWallet = shortAddress(tx.inputs?.[0]?.prev_out?.addr)
        const toWallet = shortAddress(tx.out?.find((o: any) => o.addr)?.addr)
        return {
          id: tx.hash,
          chain: 'Bitcoin',
          symbol: 'BTC',
          amount,
          usdValue,
          fromWallet,
          toWallet,
          txUrl: `https://www.blockchain.com/explorer/transactions/btc/${tx.hash}`,
          fromUrl: fromWallet === 'Unknown' ? '' : `https://blockchair.com/bitcoin/address/${fromWallet}`,
          toUrl: toWallet === 'Unknown' ? '' : `https://blockchair.com/bitcoin/address/${toWallet}`,
          direction: 'wallet → wallet',
          time: new Date((tx.time || Date.now() / 1000) * 1000).toISOString(),
        }
      })
      .filter((tx: WhaleTx) => tx.usdValue >= 250000 && tx.fromWallet !== 'Unknown' && tx.toWallet !== 'Unknown')
      .sort((a: WhaleTx, b: WhaleTx) => b.usdValue - a.usdValue)
      .slice(0, 12)

    return NextResponse.json(whales)
  } catch {
    return NextResponse.json([])
  }
}
