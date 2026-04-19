export const STOCK_GROUPS: Record<string, { label: string; symbols: string[] }> = {
  indices: {
    label: 'Major Indices',
    symbols: ['^GSPC', '^IXIC', '^DJI', '^RUT', '^VIX', '^FTSE', '^GDAXI', '^N225'],
  },
  tech: {
    label: 'Technology',
    symbols: ['AAPL', 'MSFT', 'NVDA', 'GOOG', 'META', 'AMZN', 'AMD', 'INTC', 'CRM', 'ORCL', 'NFLX', 'ADBE'],
  },
  finance: {
    label: 'Finance',
    symbols: ['JPM', 'BAC', 'GS', 'MS', 'WFC', 'C', 'BLK', 'V', 'MA', 'PYPL'],
  },
  ev_energy: {
    label: 'EV & Energy',
    symbols: ['TSLA', 'RIVN', 'NIO', 'XOM', 'CVX', 'ENPH', 'NEE', 'BE'],
  },
  crypto_stocks: {
    label: 'Crypto-linked',
    symbols: ['COIN', 'MSTR', 'MARA', 'RIOT', 'HUT', 'SQ'],
  },
}
