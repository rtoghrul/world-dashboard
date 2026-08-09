// Shared, locale-independent date formatting so every section shows the same style.
// e.g. "9 Aug 2026" instead of "8/9/2026" (US) or "09.08.2026" (DE) or ISO "2026-08-09".

export function formatNewsDate(input?: string | null): string {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
