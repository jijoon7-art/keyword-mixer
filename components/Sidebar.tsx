'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shuffle, Type, Youtube, Link2, Hash, Menu, X } from 'lucide-react'
import { useState } from 'react'

const MENU = [
  {
    category: '키워드 도구',
    items: [
      { href: '/', label: '키워드 조합기', icon: Shuffle },
    ],
  },
  {
    category: '기타 도구',
    items: [
      { href: '/char-counter', label: '글자수 세기', icon: Type },
      { href: '/youtube-tags', label: '유튜브 태그 생성기', icon: Youtube },
      { href: '/utm-builder', label: 'UTM Builder', icon: Link2 },
      { href: '/hashtag-generator', label: '해시태그 생성기', icon: Hash },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-16 left-4 z-50 w-9 h-9 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-400 transition-all"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-56px)] w-52 border-r border-surface-border bg-surface-card/50 backdrop-blur-md z-40
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 flex flex-col gap-6 overflow-y-auto h-full">
          {MENU.map((section) => (
            <div key={section.category}>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-2">
                {section.category}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400 font-medium'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover'
                        }`}
                      >
                        <Icon size={14} className={active ? 'text-brand-400' : 'text-slate-600'} />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
