'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '로마 숫자 변환기', desc: '아라비아 숫자↔로마 숫자 즉시 변환. 영화 제목·시계·연도 표기에 활용.' },
  en: { title: 'Roman Numeral Converter', desc: 'Convert Arabic to Roman numerals and back instantly. Perfect for movie titles, clocks, and year notation.' }
}

const VALS: [number, string][] = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
  [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
  [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
]

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return lang === 'ko' ? '1~3999 범위만 가능' : '1~3999 only'
  let result = ''; let n = Math.floor(num)
  for (const [v, s] of VALS) { while (n >= v) { result += s; n -= v } }
  return result
}

const ROMAN_MAP: Record<string, number> = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 }

function fromRoman(s: string): number | null {
  const upper = s.toUpperCase().trim()
  if (!/^[IVXLCDM]+$/.test(upper)) return null
  let total = 0
  for (let i = 0; i < upper.length; i++) {
    const cur = ROMAN_MAP[upper[i]]
    const next = ROMAN_MAP[upper[i+1]]
    if (next && cur < next) total -= cur
    else total += cur
  }
  return total
}

let lang = 'ko' // will be overridden

export default function RomanNumeral() {
  const { lang: l } = useLang()
  lang = l
  const tx = T[l]
  const [tab, setTab] = useState<'to' | 'from'>('to')
  const [arabic, setArabic] = useState(2024)
  const [romanInput, setRomanInput] = useState('MMXXIV')
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const roman = toRoman(arabic)
  const fromResult = fromRoman(romanInput)

  const PRESETS_ARABIC = [1, 4, 9, 14, 40, 90, 399, 1000, 1999, 2024, 3999]
  const PRESETS_ROMAN = ['I','IV','IX','XL','XC','CD','CM','MM','MMXIV','MMXXIV']

  const TABLE = [
    ['I', 1], ['IV', 4], ['V', 5], ['IX', 9], ['X', 10],
    ['XL', 40], ['L', 50], ['XC', 90], ['C', 100],
    ['CD', 400], ['D', 500], ['CM', 900], ['M', 1000]
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {[['to', l === 'ko' ? '숫자 → 로마' : 'Number → Roman'], ['from', l === 'ko' ? '로마 → 숫자' : 'Roman → Number']].map(([v, label]) => (
          <button key={v} onClick={() => setTab(v as 'to' | 'from')}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === v ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300'}`}>{label}</button>
        ))}
      </div>

      {tab === 'to' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <label className="text-xs text-slate-400 mb-1.5 block">{l === 'ko' ? '아라비아 숫자 (1~3999)' : 'Arabic Number (1~3999)'}</label>
            <input type="number" min={1} max={3999} value={arabic} onChange={e => setArabic(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-3xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS_ARABIC.map(n => (
                <button key={n} onClick={() => setArabic(n)}
                  className={`text-xs px-2.5 py-1 rounded border transition-all ${arabic === n ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{n}</button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">{l === 'ko' ? '로마 숫자' : 'Roman Numeral'}</p>
              <p className="text-4xl font-extrabold text-brand-400 font-mono tracking-widest">{roman}</p>
            </div>
            <button onClick={() => copy(roman, 'roman')} className={`p-3 rounded-xl border transition-all ${copied === 'roman' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied === 'roman' ? <CheckCheck size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      )}

      {tab === 'from' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <label className="text-xs text-slate-400 mb-1.5 block">{l === 'ko' ? '로마 숫자 입력' : 'Enter Roman Numeral'}</label>
            <input type="text" value={romanInput} onChange={e => setRomanInput(e.target.value.toUpperCase())}
              placeholder="MMXXIV"
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-brand-400 text-3xl font-mono text-center tracking-widest focus:outline-none focus:border-brand-500/50 transition-all mb-3 uppercase" />
            <div className="flex flex-wrap gap-1.5">
              {PRESETS_ROMAN.map(r => (
                <button key={r} onClick={() => setRomanInput(r)}
                  className={`text-xs px-2.5 py-1 rounded border transition-all font-mono ${romanInput === r ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{r}</button>
              ))}
            </div>
          </div>
          {fromResult !== null ? (
            <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">{l === 'ko' ? '아라비아 숫자' : 'Arabic Number'}</p>
                <p className="text-5xl font-extrabold text-brand-400 font-mono">{fromResult}</p>
              </div>
              <button onClick={() => copy(String(fromResult), 'arabic')} className={`p-3 rounded-xl border transition-all ${copied === 'arabic' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
                {copied === 'arabic' ? <CheckCheck size={18} /> : <Copy size={18} />}
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-red-400 text-sm">{l === 'ko' ? '유효한 로마 숫자가 아닙니다. I, V, X, L, C, D, M만 사용 가능합니다.' : 'Invalid Roman numeral. Only I, V, X, L, C, D, M are allowed.'}</p>
            </div>
          )}
        </div>
      )}

      {/* 로마 숫자 표 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mt-5">
        <p className="text-xs text-slate-400 font-medium mb-3">{l === 'ko' ? '로마 숫자 기본 표' : 'Roman Numeral Reference Table'}</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {TABLE.map(([r, n]) => (
            <div key={r as string} className="rounded-lg border border-surface-border bg-[#0f1117] p-2 text-center cursor-pointer hover:border-brand-500/40 transition-all"
              onClick={() => { if (tab === 'to') setArabic(n as number); else setRomanInput(r as string) }}>
              <p className="text-sm font-bold text-brand-400 font-mono">{r}</p>
              <p className="text-xs text-slate-400">{n}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={l === 'ko' ? '로마 숫자 변환기' : 'Roman Numeral Converter'}
        toolUrl="https://keyword-mixer.vercel.app/roman-numeral"
        description={tx.desc}
        howToUse={l === 'ko' ? [
          { step: '변환 방향 선택', desc: '숫자→로마 또는 로마→숫자 탭을 선택하세요.' },
          { step: '숫자 입력', desc: '아라비아 숫자(1~3999) 또는 로마 숫자를 입력하세요.' },
          { step: '결과 확인', desc: '입력 즉시 변환 결과가 표시됩니다.' },
          { step: '복사하여 활용', desc: '복사 버튼으로 결과를 클립보드에 복사하세요.' },
        ] : [
          { step: 'Select direction', desc: 'Choose number→Roman or Roman→number tab.' },
          { step: 'Enter number', desc: 'Input Arabic (1-3999) or Roman numeral.' },
          { step: 'View result', desc: 'Conversion result appears instantly.' },
          { step: 'Copy result', desc: 'Use copy button to save to clipboard.' },
        ]}
        whyUse={l === 'ko' ? [
          { title: '양방향 변환', desc: '아라비아→로마, 로마→아라비아 양방향 변환을 모두 지원합니다.' },
          { title: '참조 표', desc: '13가지 기본 로마 숫자를 표로 제공해 학습에 활용하세요.' },
          { title: '빠른 프리셋', desc: '자주 사용하는 숫자/로마 숫자를 버튼으로 빠르게 선택합니다.' },
          { title: '클릭으로 채우기', desc: '참조 표의 항목을 클릭하면 입력란에 자동으로 채워집니다.' },
        ] : [
          { title: 'Bidirectional', desc: 'Both Arabic→Roman and Roman→Arabic conversion.' },
          { title: 'Reference table', desc: '13 basic Roman numerals for learning and reference.' },
          { title: 'Quick presets', desc: 'Quick buttons for frequently used numbers.' },
          { title: 'Click to fill', desc: 'Click reference table items to auto-fill the input.' },
        ]}
        faqs={l === 'ko' ? [
          { q: '로마 숫자는 왜 4를 IV로 쓰나요?', a: '감산법이라고 합니다. 작은 숫자가 큰 숫자 앞에 오면 빼는 방식입니다. IV = 5-1 = 4, IX = 10-1 = 9, XL = 50-10 = 40입니다.' },
          { q: '로마 숫자로 표현할 수 없는 수는?', a: '0은 로마 숫자 체계에 없습니다. 또한 3999 이상은 표준 규칙으로 표현이 어렵습니다. 실용적으로 1~3999 범위를 사용합니다.' },
          { q: '로마 숫자를 어디서 자주 볼 수 있나요?', a: '영화 제작 연도(MCMXCIX), 시계 문자판, 스포츠 이벤트(슈퍼볼 LVIII), 책의 서문 페이지 번호, 건물 준공 연도 등에 사용됩니다.' },
          { q: '2024년은 로마 숫자로?', a: 'MMXXIV입니다. M(1000) + M(1000) + XX(20) + IV(4) = 2024입니다.' },
        ] : [
          { q: 'Why is 4 written as IV in Roman numerals?', a: 'Subtractive notation: a smaller numeral before a larger one means subtraction. IV = 5-1 = 4, IX = 10-1 = 9, XL = 50-10 = 40.' },
          { q: 'What numbers can\'t be represented?', a: 'Zero has no Roman numeral. Numbers above 3999 are impractical. The usable range is 1-3999.' },
          { q: 'Where are Roman numerals commonly used?', a: 'Movie production years (MCMXCIX), clock faces, sporting events (Super Bowl LVIII), book preface page numbers, building inscriptions.' },
          { q: 'What is 2024 in Roman numerals?', a: 'MMXXIV. M(1000) + M(1000) + XX(20) + IV(4) = 2024.' },
        ]}
        keywords="로마 숫자 변환기 · 로마 숫자 계산기 · 아라비아 숫자 로마 · 2024 로마 숫자 · MMXXIV · roman numeral converter · arabic to roman · roman numeral calculator · roman numerals translator"
      />
    </div>
  )
}
