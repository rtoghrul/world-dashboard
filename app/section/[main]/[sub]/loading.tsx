export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 relative z-[1]">
      <div className="sticky top-0 z-50 bg-[#07070b]/90 backdrop-blur-xl border-b border-white/[0.04] h-14" />
      <div className="border-b border-white/[0.04] bg-[#07070b]/80 h-10" />
      <main className="max-w-screen-2xl mx-auto px-5 py-6">
        <div className="flex items-center gap-3 mb-6 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
          <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-white/[0.04] rounded" />
            <div className="h-3 w-20 bg-white/[0.04] rounded" />
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-[#0a0a10]/80 p-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-8 bg-white/[0.04] rounded w-full" />
            <div className="h-8 bg-white/[0.04] rounded w-3/4" />
            <div className="h-8 bg-white/[0.04] rounded w-5/6" />
            <div className="h-8 bg-white/[0.04] rounded w-2/3" />
          </div>
        </div>
      </main>
    </div>
  )
}
