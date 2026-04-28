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

export async function GET() {
  try {
    const [price, res] = await Promise.all([
      getBtcPrice(),
      fetch('https://blockchain.info/unconfirmed-transactions?format=json', { next: { revalidate: 120 } }),
    ])
    const data = await res.json()
    const txs = Array.isArray(data?.txs) ? data.txs : []

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
