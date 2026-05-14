import Link from 'next/link'

export default function GlobalFactsNav() {
  return (
    <Link
      href="/facts"
      className="hidden xl:flex fixed top-[126px] left-[250px] z-[2147483000] items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#a5a5b8] hover:text-white hover:bg-white/[0.04] transition-colors bg-[#07070b]/80 backdrop-blur-sm"
      aria-label="Open Facts"
    >
      <span>Facts</span>
      <span className="text-[10px] text-[#6b6b80]">▾</span>
    </Link>
  )
}
