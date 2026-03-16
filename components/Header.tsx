'use client'

import { Shuffle } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-surface-border/50 sticky top-0 z-50 backdrop-blur-md bg-surface-DEFAULT/80">
      <div className="px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.4)]">
            <Shuffle size={16} className="text-black" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Keyword<span className="text-brand-400">Mixer</span>
          </span>
        </Link>
        <span className="text-slate-600 text-sm hidden sm:block">— 무료 SEO 도구 모음</span>
      </div>
    </header>
  )
}
