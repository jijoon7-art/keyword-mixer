'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shuffle, Type, Youtube, Link2, Hash,
  Menu, X, FileJson, Lock, Palette, Binary
} from 'lucide-react'
import { useState } from 'react'

const MENU = [
  {
    category: '키워드/SNS/마케팅 도구',
    items: [
      { href: '/', label: '키워드 조합기', icon: Shuffle },
      { href: '/char-counter', label: '글자수 세기', icon: Type },
      { href: '/youtube-tags', label: '유튜브 태그 생성기', icon: Youtube },
      { href: '/hashtag-generator', label: '해시태그 생성기', icon: Hash },
      { href: '/utm-builder', label: 'UTM Builder', icon: Link2 },
    ],
  },
  {
    category: '개발자 도구',
    items: [
      { href: '/json-csv', label: 'JSON ↔ CSV 변환기', icon: FileJson },
      { href: '/base64', label: 'Base64 인코더/디코더', icon: Binary },
    ],
  },
  {
    category: '생활/디자인 도구',
    items: [
      { href: '/password-generator', label: '비밀번호 생성기', icon: Lock },
      { href: '/color-converter', label: '색상 코드 변환기', icon: Palette },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-16 left-4 z-50 w-9 h-9 bg-surface-card border border-surface-border rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-400 transition-all"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-56px)] w-52 border-r border-surface-border bg-surface-card/50 backdrop-blur-md z-40
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-4 flex flex-col gap-5 overflow-y-auto h-full">
          {MENU.map((section) => (
            <div key={section.category}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
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
                            ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-surface-hover'
                        }`}
                      >
                        <Icon size={14} className={active ? 'text-brand-400' : 'text-slate-500'} />
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
