import type { Metadata } from 'next'
import { menus } from '@/lib/menus'
import { pageMetadata } from '@/lib/seo'

// Drop emoji/flags from menu labels for <title> text (surrogate pairs, symbols, joiners).
const stripEmoji = (s: string) => s.replace(/[\uD800-\uDFFF\u2600-\u27BF\uFE0F\u200D]/g, '').replace(/\s+/g, ' ').trim()

type Params = { params: Promise<{ main: string; sub: string }> }

// Titles come from the same menu data as the header, so every section gets a real title
// and description instead of the generic site-wide one.
export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const path = `/section/${params.main}/${params.sub}`
  for (const [id, section] of Object.entries(menus)) {
    const item = section.items.find(i => (i.section || id) === params.main && i.id === params.sub)
    if (item) {
      const group = stripEmoji(section.label.en)
      const label = stripEmoji(item.label.en)
      const title = label === group ? label : `${label} — ${group}`
      return pageMetadata(path, title, `${label}: live ${group.toLowerCase()} updates, links and tools on World Dashboard.`)
    }
  }
  const fallback = `${params.sub.replace(/-/g, ' ')}`.replace(/^\w/, c => c.toUpperCase())
  return pageMetadata(path, fallback, `${fallback} on World Dashboard.`)
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
