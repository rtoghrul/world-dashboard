import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 8 * 1024

type Report = { directive: string; blocked: string; page: string }

/** Pull the useful fields from either the legacy `report-uri` body or the Reporting API array. */
function summarize(body: unknown): Report[] {
  const list = Array.isArray(body) ? body : [body]
  const out: Report[] = []
  for (const r of list.slice(0, 20) as any[]) {
    const x = r?.['csp-report'] || r?.body || r
    if (!x || typeof x !== 'object') continue
    const clip = (v: unknown) => String(v ?? '').slice(0, 200)
    out.push({
      directive: clip(x['effective-directive'] || x.effectiveDirective || x['violated-directive']),
      blocked: clip(x['blocked-uri'] || x.blockedURL),
      page: clip(x['document-uri'] || x.documentURL || r?.url),
    })
  }
  return out
}

/** Receives CSP violation reports (report-only mode) and logs a compact summary to the server log. */
export async function POST(req: NextRequest) {
  const len = Number(req.headers.get('content-length') || 0)
  if (len > MAX_BYTES) return new NextResponse(null, { status: 413 })
  try {
    const text = await req.text()
    if (text.length > MAX_BYTES) return new NextResponse(null, { status: 413 })
    for (const r of summarize(JSON.parse(text))) console.warn('[csp-report]', r.directive, r.blocked, r.page)
  } catch {}
  return new NextResponse(null, { status: 204 })
}
