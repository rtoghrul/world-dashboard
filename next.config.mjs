// Baseline security headers for every route, plus a Content-Security-Policy in REPORT-ONLY mode:
// browsers log (and POST to /api/csp-report) anything the policy would block, but nothing is blocked.
// Once reports from production are clean, switch the header name to 'Content-Security-Policy'.
const isDev = process.env.NODE_ENV !== 'production'
const supabase = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').host } catch { return '' }
})()

const csp = [
  "default-src 'self'",
  // Next.js App Router streams inline bootstrap scripts and we inline the no-flash theme script;
  // without per-request nonces these need 'unsafe-inline'. Dev (React Refresh) also needs eval.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  // News, Horizon, crypto and media widgets show images from many publishers/CDNs.
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    'https://api.open-meteo.com', 'https://ipapi.co', 'https://nominatim.openstreetmap.org', 'https://api.coingecko.com',
    supabase ? `https://${supabase} wss://${supabase}` : 'https://*.supabase.co wss://*.supabase.co',
    isDev ? 'ws: http://localhost:*' : '',
  ].filter(Boolean).join(' '),
  // Embeds: YouTube player (Viral) and the OpenStreetMap map (/nearby).
  'frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.openstreetmap.org',
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'report-uri /api/csp-report',
  'report-to csp',
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Geolocation is used by the weather widget and /nearby; everything else is off.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'Reporting-Endpoints', value: 'csp="/api/csp-report"' },
  { key: 'Content-Security-Policy-Report-Only', value: csp },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // No remote image config: the app renders third-party images with plain <img> (lazy-loaded),
  // not next/image, so allowing every host ('**') only exposed the image optimizer to abuse.
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
