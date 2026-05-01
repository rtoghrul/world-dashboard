'use client'
import { useRef, useState } from 'react'
import { Share2, Download, Copy, Check } from 'lucide-react'

interface ShareAsImageProps {
  targetRef: React.RefObject<HTMLElement>
  title?: string
}

export default function ShareAsImage({ targetRef, title = 'Widget' }: ShareAsImageProps) {
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  const capture = async () => {
    if (!targetRef.current) return null
    setSharing(true)
    try {
      // Use html2canvas dynamically loaded
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#0a0a10',
        scale: 2,
        useCORS: true,
      })
      return canvas
    } catch {
      return null
    } finally {
      setSharing(false)
    }
  }

  const handleDownload = async () => {
    const canvas = await capture()
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopy = async () => {
    const canvas = await capture()
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      })
    } catch {}
  }

  const handleShare = async () => {
    const canvas = await capture()
    if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (blob && navigator.share) {
        const file = new File([blob], `${title}.png`, { type: 'image/png' })
        try {
          await navigator.share({ title, files: [file] })
        } catch {}
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleDownload} className="p-1 rounded hover:bg-white/[0.05] text-[#4a4a5e] hover:text-white transition" title="Download as image">
        <Download className="w-3 h-3" />
      </button>
      <button onClick={handleCopy} className="p-1 rounded hover:bg-white/[0.05] text-[#4a4a5e] hover:text-white transition" title="Copy to clipboard">
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button onClick={handleShare} className="p-1 rounded hover:bg-white/[0.05] text-[#4a4a5e] hover:text-white transition" title="Share">
          <Share2 className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
