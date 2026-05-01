export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        <p className="text-sm text-[#6b6b80] animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
