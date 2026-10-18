// Small helpers for API routes that call third-party services.

/** Default upper bound for any upstream call, so one slow API can't hang a serverless function. */
export const UPSTREAM_TIMEOUT_MS = 8000

/**
 * `fetch` with a timeout. Works with Next.js' data cache (`next: { revalidate }`); an existing
 * `signal` in `init` wins. Rejects with a TimeoutError when the deadline passes.
 */
export function fetchWithTimeout(input: string | URL, init: RequestInit = {}, timeoutMs = UPSTREAM_TIMEOUT_MS): Promise<Response> {
  return fetch(input, { ...init, signal: init.signal ?? AbortSignal.timeout(timeoutMs) })
}

/** Parse an integer query param and clamp it to [min, max]; falls back for missing/invalid values. */
export function clampInt(value: string | null, fallback: number, min: number, max: number): number {
  const n = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}
