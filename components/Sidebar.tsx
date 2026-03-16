'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shuffle, Type, Youtube, Link2, Hash,
  Menu, X, FileJson, Lock, Palette, Binary,
  Ruler, QrCode, ImageDown, FileText, Clock, GitCompare,
  FilePlus, ImageIcon
} from 'lucide-react'
import { useState } from 'react'

const MENU = [
  {
    category: '키워드/SNS/마케팅',
    items: [
      { href: '/', label: '키워드 조합기', icon: Shuffle },
      { href: '/char-counter', label: '글자수 세기', icon: Type },
      { href: '/youtube-tags', label: '유튜브 태그 생성기', icon: Youtube },
      { href: '/hashtag-generator', label: '해시태그 생성기', icon: Hash },
      { href: '/utm-builder', label: 'UTM Builder', icon: Link2 },
    ],
  },
  {
    category: '이미지/PDF 도구',
    items: [
      { href: '/image-compressor', label: '이미지 압축기', icon: ImageDown },
      { href: '/image-editor', label: '이미지 편집기', icon: ImageIcon },
      { href: '/pdf-tools', label: 'PDF 도구', icon: FilePlus },
    ],
  },
  {
    category: '개발자 도구',
    items: [
      { href: '/json-csv', label: 'JSON ↔ CSV 변환기', icon: FileJson },
      { href: '/base64', label: 'Base64 인코더/디코더', icon: Binary },
      { href: '/markdown-editor', label: '마크다운 에디터', icon: FileText },
      { href: '/text-diff', label: '텍스트 비교기', icon: GitCompare },
    ],
  },
  {
    category: '생활/유틸리티',
    items: [
      { href: '/unit-converter', label: '단위 변환기', icon: Ruler },
      { href: '/timezone-converter', label: '타임존 변환기', icon: Clock },
      { href: '/password-generator', label: '비밀번호 생성기', icon: Lock },
      { href: '/qr-generator', label: 'QR코드 생성기', icon: QrCode },
      { href: '/color-converter', label: '색상 코드 변환기', icon: Palette },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* 모바일 토글 버튼 — 헤더와 같은 높이, 항상 보임 */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-0 left-0 z-50 w-14 h-14 flex items-center justify-center text-slate-300 hover:text-brand-400 transition-all"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 오버레이 */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 사이드바 — 불투명 배경 */}
      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-56px)] w-52
        border-r border-surface-border
        bg-surface-card
        z-40 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="p-3 flex flex-col gap-4 overflow-y-auto h-full">
          {MENU.map((section) => (
            <div key={section.category}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-2">
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
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                          active
                            ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-surface-hover'
                        }`}
                      >
                        <Icon size={13} className={active ? 'text-brand-400' : 'text-slate-500'} />
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
