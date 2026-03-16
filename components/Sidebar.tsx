'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shuffle, Type, Youtube, Link2, Hash, Menu, X,
  FileJson, Lock, Palette, Binary, Ruler, QrCode,
  ImageDown, FileText, Clock, GitCompare, FilePlus,
  ImageIcon, Ticket, Smile, AlignLeft, Calculator, Search
} from 'lucide-react'
import { useState, useMemo } from 'react'

const ALL_ITEMS = [
  { href: '/', label: '키워드 조합기', icon: Shuffle, category: '키워드/SNS/마케팅' },
  { href: '/char-counter', label: '글자수 세기', icon: Type, category: '키워드/SNS/마케팅' },
  { href: '/youtube-tags', label: '유튜브 태그 생성기', icon: Youtube, category: '키워드/SNS/마케팅' },
  { href: '/hashtag-generator', label: '해시태그 생성기', icon: Hash, category: '키워드/SNS/마케팅' },
  { href: '/utm-builder', label: 'UTM Builder', icon: Link2, category: '키워드/SNS/마케팅' },
  { href: '/text-tools', label: '텍스트 도구 모음', icon: AlignLeft, category: '텍스트/계산 도구' },
  { href: '/calculators', label: '계산기 모음', icon: Calculator, category: '텍스트/계산 도구' },
  { href: '/lotto', label: '로또 번호 생성기', icon: Ticket, category: '텍스트/계산 도구' },
  { href: '/emoji-search', label: '이모지 검색기', icon: Smile, category: '텍스트/계산 도구' },
  { href: '/image-compressor', label: '이미지 압축기', icon: ImageDown, category: '이미지/PDF 도구' },
  { href: '/image-editor', label: '이미지 편집기', icon: ImageIcon, category: '이미지/PDF 도구' },
  { href: '/pdf-tools', label: 'PDF 도구', icon: FilePlus, category: '이미지/PDF 도구' },
  { href: '/json-csv', label: 'JSON ↔ CSV 변환기', icon: FileJson, category: '개발자 도구' },
  { href: '/base64', label: 'Base64 인코더/디코더', icon: Binary, category: '개발자 도구' },
  { href: '/markdown-editor', label: '마크다운 에디터', icon: FileText, category: '개발자 도구' },
  { href: '/text-diff', label: '텍스트 비교기', icon: GitCompare, category: '개발자 도구' },
  { href: '/css-gradient', label: 'CSS 그라디언트', icon: Palette, category: '개발자 도구' },
  { href: '/regex-tester', label: '정규식 테스터', icon: FileJson, category: '개발자 도구' },
  { href: '/unit-converter', label: '단위 변환기', icon: Ruler, category: '생활/유틸리티' },
  { href: '/timezone-converter', label: '타임존 변환기', icon: Clock, category: '생활/유틸리티' },
  { href: '/password-generator', label: '비밀번호 생성기', icon: Lock, category: '생활/유틸리티' },
  { href: '/qr-generator', label: 'QR코드 생성기', icon: QrCode, category: '생활/유틸리티' },
  { href: '/color-converter', label: '색상 코드 변환기', icon: Palette, category: '생활/유틸리티' },
]

const MENU = [
  { category: '키워드/SNS/마케팅', items: ALL_ITEMS.filter(i => i.category === '키워드/SNS/마케팅') },
  { category: '텍스트/계산 도구', items: ALL_ITEMS.filter(i => i.category === '텍스트/계산 도구') },
  { category: '이미지/PDF 도구', items: ALL_ITEMS.filter(i => i.category === '이미지/PDF 도구') },
  { category: '개발자 도구', items: ALL_ITEMS.filter(i => i.category === '개발자 도구') },
  { category: '생활/유틸리티', items: ALL_ITEMS.filter(i => i.category === '생활/유틸리티') },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return ALL_ITEMS.filter(i => i.label.toLowerCase().includes(q))
  }, [query])

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-0 left-0 z-50 w-14 h-14 flex items-center justify-center text-slate-300 hover:text-brand-400 transition-all"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-52 border-r border-surface-border z-40 transition-transform duration-300 flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: '#1a1d27' }}
      >
        {/* 검색창 */}
        <div className="p-2 border-b border-surface-border flex-shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="도구 검색..."
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300">
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 overflow-y-auto p-2">
          {filtered ? (
            // 검색 결과
            <div>
              <p className="text-xs text-slate-500 px-2 py-1 mb-1">
                {filtered.length > 0 ? `${filtered.length}개 검색됨` : '결과 없음'}
              </p>
              <ul className="space-y-0.5">
                {filtered.map(item => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => { setMobileOpen(false); setQuery('') }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${active ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-surface-hover'}`}>
                        <Icon size={12} className={active ? 'text-brand-400' : 'text-slate-500'} />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            // 일반 메뉴
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
          )}
        </nav>

        {/* 하단 도구 수 */}
        <div className="px-3 py-2 border-t border-surface-border flex-shrink-0">
          <p className="text-xs text-slate-600 text-center">{ALL_ITEMS.length}개 무료 도구</p>
        </div>
      </aside>
    </>
  )
}
