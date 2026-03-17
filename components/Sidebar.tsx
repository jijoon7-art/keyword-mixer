'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shuffle, Type, Youtube, Link2, Hash, Menu, X,
  FileJson, Lock, Palette, Binary, Ruler, QrCode,
  ImageDown, FileText, Clock, GitCompare, FilePlus,
  ImageIcon, Ticket, Smile, AlignLeft, Calculator,
  Baby, Calendar, DollarSign, Timer, Home, TrendingUp,
  Globe, Keyboard, Wifi, Wand2
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
    category: '계산/생활 도구',
    items: [
      { href: '/calculators', label: '계산기 모음', icon: Calculator },
      { href: '/age-calculator', label: '나이 계산기', icon: Baby },
      { href: '/dday-calculator', label: 'D-day 계산기', icon: Calendar },
      { href: '/exchange-rate', label: '환율 계산기', icon: DollarSign },
      { href: '/pyeongsu-calculator', label: '평수 계산기', icon: Home },
      { href: '/interest-calculator', label: '이자 계산기', icon: TrendingUp },
      { href: '/lotto', label: '로또 번호 생성기', icon: Ticket },
    ],
  },
  {
    category: '텍스트 도구',
    items: [
      { href: '/text-tools', label: '텍스트 도구 모음', icon: AlignLeft },
      { href: '/text-diff', label: '텍스트 비교기', icon: GitCompare },
      { href: '/typing-speed', label: '타이핑 속도 측정', icon: Keyboard },
      { href: '/emoji-search', label: '이모지 검색기', icon: Smile },
      { href: '/ascii-art', label: 'ASCII 아트 생성기', icon: Wand2 },
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
      { href: '/json-formatter', label: 'JSON 포맷터', icon: FileJson },
      { href: '/json-csv', label: 'JSON ↔ CSV 변환기', icon: FileJson },
      { href: '/base64', label: 'Base64 인코더/디코더', icon: Binary },
      { href: '/url-encoder', label: 'URL 인코더/디코더', icon: Globe },
      { href: '/markdown-editor', label: '마크다운 에디터', icon: FileText },
      { href: '/css-gradient', label: 'CSS 그라디언트', icon: Palette },
      { href: '/regex-tester', label: '정규식 테스터', icon: FileJson },
      { href: '/ip-lookup', label: 'IP 주소 조회', icon: Wifi },
    ],
  },
  {
    category: '생활/유틸리티',
    items: [
      { href: '/unit-converter', label: '단위 변환기', icon: Ruler },
      { href: '/timezone-converter', label: '타임존 변환기', icon: Clock },
      { href: '/timer', label: '타이머 / 스톱워치', icon: Timer },
      { href: '/password-generator', label: '비밀번호 생성기', icon: Lock },
      { href: '/qr-generator', label: 'QR코드 생성기', icon: QrCode },
      { href: '/color-palette', label: '색상 팔레트 생성기', icon: Palette },
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
        className="lg:hidden fixed top-0 left-0 z-50 w-11 h-11 flex items-center justify-center text-slate-300 hover:text-brand-400 transition-all"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-11 left-0 h-[calc(100vh-44px)] w-52 border-r border-surface-border z-40 transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: '#1a1d27' }}
      >
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="flex flex-col gap-3">
            {MENU.map((section) => (
              <div key={section.category}>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 px-2">
                  {section.category}
                </p>
                <ul className="space-y-0">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${active ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-surface-hover'}`}>
                          <Icon size={12} className={active ? 'text-brand-400' : 'text-slate-500'} />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
