import Link from 'next/link'

export default function GlobalFactsNav() {
  return (
    <Link
      href="/facts"
      className="hidden xl:flex fixed top-[101px] right-[620px] z-[10000] items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#a5a5b8] hover:text-white hover:bg-white/[0.04] transition-colors"
      aria-label="Open Facts"
    >
      <span>Facts</span>
    </Link>
  )
}
