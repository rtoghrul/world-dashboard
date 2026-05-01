'use client'

interface NewsBiasProps {
  bias?: 'left' | 'center-left' | 'center' | 'center-right' | 'right'
}

const biasConfig = {
  left: { label: 'Left', color: 'bg-blue-500', position: '10%' },
  'center-left': { label: 'Center-Left', color: 'bg-blue-400', position: '30%' },
  center: { label: 'Center', color: 'bg-gray-400', position: '50%' },
  'center-right': { label: 'Center-Right', color: 'bg-red-400', position: '70%' },
  right: { label: 'Right', color: 'bg-red-500', position: '90%' },
}

export default function NewsBiasIndicator({ bias = 'center' }: NewsBiasProps) {
  const config = biasConfig[bias]

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-20 h-1.5 bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-white/80 shadow-sm"
          style={{ left: config.position, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      <span className="text-[9px] text-[#4a4a5e]">{config.label}</span>
    </div>
  )
}
