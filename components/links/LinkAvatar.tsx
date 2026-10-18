import { hostOf } from '@/lib/links'

const HUES = ['bg-indigo-500/15 text-indigo-300', 'bg-emerald-500/15 text-emerald-300', 'bg-amber-500/15 text-amber-300', 'bg-rose-500/15 text-rose-300', 'bg-sky-500/15 text-sky-300', 'bg-violet-500/15 text-violet-300', 'bg-teal-500/15 text-teal-300']

/** Letter avatar (no third-party favicon requests). */
export default function LinkAvatar({ name, url, size = 'md' }: { name: string; url: string; size?: 'sm' | 'md' }) {
  const host = hostOf(url)
  let h = 0
  for (let i = 0; i < host.length; i++) h = (h * 31 + host.charCodeAt(i)) >>> 0
  const letter = (Array.from(name).find(ch => ch.toLowerCase() !== ch.toUpperCase() || /\d/.test(ch)) || '•').toUpperCase()
  return (
    <span aria-hidden="true" className={`inline-flex items-center justify-center rounded-lg font-bold shrink-0 ${HUES[h % HUES.length]} ${size === 'sm' ? 'w-6 h-6 text-[11px]' : 'w-8 h-8 text-sm'}`}>{letter}</span>
  )
}
