// Who may open /admin.
//
// Configure with NEXT_PUBLIC_ADMIN_EMAILS (comma-separated, case-insensitive), e.g.
//   NEXT_PUBLIC_ADMIN_EMAILS=you@example.com,teammate@example.com
// It is NEXT_PUBLIC_ because the header and the admin page also check it in the browser
// (to show/hide the Admin link). It is not a secret: the real gate is middleware.ts plus
// your Supabase row-level security policies.
//
// Fallback: if the variable is not set, the original owner address is used so existing
// deployments keep working. Set the variable in Vercel and this fallback is ignored.
const FALLBACK_ADMIN_EMAILS = 'eagleeye385@gmail.com'

export const ADMIN_EMAILS: readonly string[] = (process.env.NEXT_PUBLIC_ADMIN_EMAILS?.trim() || FALLBACK_ADMIN_EMAILS)
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
