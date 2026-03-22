'use client'

import { Shuffle, Search, X, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useLang } from './LangContext'

const ALL_ITEMS = [
  { href: '/', label: '키워드 조합기' },
  { href: '/char-counter', label: '글자수 세기' },
  { href: '/youtube-tags', label: '유튜브 태그 생성기' },
  { href: '/hashtag-generator', label: '해시태그 생성기' },
  { href: '/utm-builder', label: 'UTM Builder' },
  { href: '/text-tools', label: '텍스트 도구 모음' },
  { href: '/calculators', label: '계산기 모음' },
  { href: '/age-calculator', label: '나이 계산기' },
  { href: '/dday-calculator', label: 'D-day 계산기' },
  { href: '/exchange-rate', label: '환율 계산기' },
  { href: '/pyeongsu-calculator', label: '평수 계산기' },
  { href: '/interest-calculator', label: '이자 계산기' },
  { href: '/lotto', label: '로또 번호 생성기' },
  { href: '/timer', label: '타이머 / 스톱워치' },
  { href: '/emoji-search', label: '이모지 검색기' },
  { href: '/ascii-art', label: 'ASCII 아트 생성기' },
  { href: '/hanja-converter', label: '한자 변환기' },
  { href: '/spell-checker', label: '맞춤법 검사기' },
  { href: '/line-break-remover', label: '줄바꿈 제거기' },
  { href: '/typing-speed', label: '타이핑 속도 측정' },
  { href: '/image-compressor', label: '이미지 압축기' },
  { href: '/image-editor', label: '이미지 편집기' },
  { href: '/pdf-tools', label: 'PDF 도구' },
  { href: '/json-formatter', label: 'JSON 포맷터' },
  { href: '/json-csv', label: 'JSON ↔ CSV 변환기' },
  { href: '/base64', label: 'Base64 인코더/디코더' },
  { href: '/url-encoder', label: 'URL 인코더/디코더' },
  { href: '/markdown-editor', label: '마크다운 에디터' },
  { href: '/css-gradient', label: 'CSS 그라디언트' },
  { href: '/regex-tester', label: '정규식 테스터' },
  { href: '/ip-lookup', label: 'IP 주소 조회' },
  { href: '/meta-tag-generator', label: 'SEO 메타태그 생성기' },
  { href: '/jwt-decoder', label: 'JWT 디코더' },
  { href: '/cron-generator', label: 'Cron 생성기' },
  { href: '/number-converter', label: '진법 변환기' },
  { href: '/unit-converter', label: '단위 변환기' },
  { href: '/timezone-converter', label: '타임존 변환기' },
  { href: '/password-generator', label: '비밀번호 생성기' },
  { href: '/qr-generator', label: 'QR코드 생성기' },
  { href: '/color-palette', label: '색상 팔레트 생성기' },
  { href: '/color-converter', label: '색상 코드 변환기' },
  { href: '/color-contrast', label: '색상 대비 검사기' },
  { href: '/id-generator', label: '주민번호 생성기(테스트)' },
]

export default function Header({ onMenuToggle, menuOpen }: { onMenuToggle?: () => void; menuOpen?: boolean }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { lang, setLang } = useLang()

  const results = useMemo(() => {
    if (!query.trim()) return []
    return ALL_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const handleSelect = (href: string) => {
    router.push(href)
    setQuery('')
    setFocused(false)
  }

  return (
    <header
      className="border-b border-surface-border sticky top-0 z-50"
      style={{ backgroundColor: '#1a1d27' }}
    >
      <div className="h-11 flex items-center gap-2 px-3">

        {/* 모바일 메뉴 버튼 — 헤더 안에서 항상 보임 */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-300 hover:text-brand-400 transition-all flex-shrink-0 rounded-lg hover:bg-surface-hover"
          aria-label="메뉴 열기"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.4)]">
            <Shuffle size={13} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight hidden sm:block">
            Keyword<span className="text-brand-400">Mixer</span>
          </span>
        </Link>

        {/* 검색창 */}
        <div className="flex-1 relative max-w-xs">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="도구 검색..."
            className="w-full border border-surface-border rounded-lg pl-7 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500/60 transition-all"
            style={{ backgroundColor: '#0f1117' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={11} />
            </button>
          )}
          {focused && results.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-surface-border overflow-hidden shadow-xl z-50"
              style={{ backgroundColor: '#1a1d27' }}
            >
              {results.map(item => (
                <button key={item.href} onClick={() => handleSelect(item.href)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-brand-500/15 hover:text-brand-300 transition-all flex items-center gap-2">
                  <span className="text-brand-500">→</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {focused && query && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-surface-border p-3 text-xs text-slate-500 shadow-xl z-50" style={{ backgroundColor: '#1a1d27' }}>
              검색 결과 없음
            </div>
          )}
        </div>

        {/* 우측: 도구 수 + KO/EN 토글 */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <span className="text-slate-700 text-xs hidden md:block">80개 무료 도구</span>
          {/* KO/EN 토글 — 불투명 배경 */}
          <div
            className="flex rounded-lg border border-surface-border overflow-hidden"
            style={{ backgroundColor: '#0f1117' }}
          >
            <button
              onClick={() => setLang('ko')}
              className={`px-2.5 py-1 text-xs font-bold transition-all ${lang === 'ko' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >KO</button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs font-bold transition-all ${lang === 'en' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >EN</button>
          </div>
        </div>
      </div>
    </header>
  )
}
