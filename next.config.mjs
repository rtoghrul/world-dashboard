// Baseline security headers for every route. A strict Content-Security-Policy is intentionally
// not set: the dashboard loads images, embeds and widgets from many third-party hosts, and a
// CSP that breaks them would need to be built and tested against the live site first.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Geolocation is used by the weather widget and /nearby; everything else is off.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
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
