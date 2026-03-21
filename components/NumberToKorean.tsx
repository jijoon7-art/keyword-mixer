'use client'

import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '숫자 → 한글/영문 변환기',
    desc: '숫자를 한글(일억 원), 한자(壹億), 영문(one hundred million)으로 즉시 변환. 금액 표기, 수표, 계약서에 활용.',
    input: '숫자 입력',
    placeholder: '변환할 숫자를 입력하세요 (예: 1234567890)',
    korean: '한글 (Korean)',
    hanja: '한자 (Hanja)',
    english: '영문 (English)',
    formal: '정식 금액 표기',
    won: '원화 표기',
  },
  en: {
    title: 'Number to Korean/English Converter',
    desc: 'Convert numbers to Korean text, Hanja, and English words instantly. For contracts, checks, and formal documents.',
    input: 'Enter Number',
    placeholder: 'Enter a number (e.g. 1234567890)',
    korean: 'Korean (한글)',
    hanja: 'Hanja (한자)',
    english: 'English',
    formal: 'Formal Amount',
    won: 'Won (₩) Format',
  }
}

const UNITS_KO = ['', '만', '억', '조', '경']
const DIGITS_KO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
const DIGITS_HANJA = ['', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']
const UNITS_HANJA = ['', '萬', '億', '兆', '京']

const ONES_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function toKorean(n: bigint): string {
  if (n === 0n) return '영'
  if (n < 0n) return '마이너스 ' + toKorean(-n)

  const groups: number[] = []
  let temp = n
  while (temp > 0n) {
    groups.push(Number(temp % 10000n))
    temp = temp / 10000n
  }

  const groupToStr = (g: number): string => {
    if (g === 0) return ''
    let s = ''
    const t = Math.floor(g / 1000); if (t > 0) s += (t === 1 ? '천' : DIGITS_KO[t] + '천')
    const h = Math.floor((g % 1000) / 100); if (h > 0) s += (h === 1 ? '백' : DIGITS_KO[h] + '백')
    const ten = Math.floor((g % 100) / 10); if (ten > 0) s += (ten === 1 ? '십' : DIGITS_KO[ten] + '십')
    const one = g % 10; if (one > 0) s += DIGITS_KO[one]
    return s
  }

  let result = ''
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) result += groupToStr(groups[i]) + UNITS_KO[i]
  }
  return result
}

function toHanja(n: bigint): string {
  if (n === 0n) return '零'
  if (n < 0n) return '負' + toHanja(-n)

  const groups: number[] = []
  let temp = n
  while (temp > 0n) {
    groups.push(Number(temp % 10000n))
    temp = temp / 10000n
  }

  const groupToStr = (g: number): string => {
    if (g === 0) return ''
    let s = ''
    const t = Math.floor(g / 1000); if (t > 0) s += DIGITS_HANJA[t] + '千'
    const h = Math.floor((g % 1000) / 100); if (h > 0) s += DIGITS_HANJA[h] + '百'
    const ten = Math.floor((g % 100) / 10); if (ten > 0) s += DIGITS_HANJA[ten] + '拾'
    const one = g % 10; if (one > 0) s += DIGITS_HANJA[one]
    return s
  }

  let result = ''
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] > 0) result += groupToStr(groups[i]) + UNITS_HANJA[i]
  }
  return result
}

function toEnglish(n: bigint): string {
  if (n === 0n) return 'zero'
  if (n < 0n) return 'negative ' + toEnglish(-n)

  const chunks: number[] = []
  let temp = n
  while (temp > 0n) {
    chunks.push(Number(temp % 1000n))
    temp = temp / 1000n
  }

  const SCALE = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']

  const chunkToEn = (c: number): string => {
    if (c === 0) return ''
    let s = ''
    if (c >= 100) { s += ONES_EN[Math.floor(c / 100)] + ' hundred'; c %= 100; if (c > 0) s += ' ' }
    if (c >= 20) { s += TENS_EN[Math.floor(c / 10)]; if (c % 10 > 0) s += '-' + ONES_EN[c % 10] }
    else if (c > 0) s += ONES_EN[c]
    return s
  }

  const parts: string[] = []
  for (let i = chunks.length - 1; i >= 0; i--) {
    if (chunks[i] > 0) {
      const part = chunkToEn(chunks[i])
      parts.push(SCALE[i] ? part + ' ' + SCALE[i] : part)
    }
  }
  return parts.join(', ')
}

const PRESETS = [
  { label: '1만', val: '10000' },
  { label: '10만', val: '100000' },
  { label: '100만', val: '1000000' },
  { label: '1천만', val: '10000000' },
  { label: '1억', val: '100000000' },
  { label: '10억', val: '1000000000' },
  { label: '100억', val: '10000000000' },
  { label: '1조', val: '1000000000000' },
]

export default function NumberToKorean() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('100000000')
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const num = (() => {
    try {
      const clean = input.replace(/[^0-9\-]/g, '')
      if (!clean || clean === '-') return null
      return BigInt(clean)
    } catch { return null }
  })()

  const formatted = num !== null ? num.toLocaleString('ko-KR') : ''
  const korean = num !== null ? toKorean(num) : ''
  const hanja = num !== null ? toHanja(num) : ''
  const english = num !== null ? toEnglish(num) : ''
  const wonFormal = korean ? `금 ${korean}원정` : ''
  const wonHanja = hanja ? `金 ${hanja}圓整` : ''

  const CopyBtn = ({ text, k }: { text: string; k: string }) => (
    <button onClick={() => copy(text, k)} disabled={!text}
      className={`p-1.5 rounded border transition-all flex-shrink-0 ${copied === k ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40 disabled:opacity-30'}`}>
      {copied === k ? <CheckCheck size={13} /> : <Copy size={13} />}
    </button>
  )

  const ResultRow = ({ label, value, k, highlight }: { label: string; value: string; k: string; highlight?: boolean }) => (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className={`text-sm font-bold break-all leading-relaxed ${highlight ? 'text-brand-300' : 'text-slate-200'}`}>
            {value || '—'}
          </p>
        </div>
        <CopyBtn text={value} k={k} />
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <label className="text-xs text-slate-400 mb-2 block font-medium">{tx.input}</label>
        <input
          value={input}
          onChange={e => setInput(e.target.value.replace(/[^0-9\-]/g, ''))}
          placeholder={tx.placeholder}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all"
        />
        {formatted && (
          <p className="text-xs text-slate-500 mt-1.5 font-mono">{formatted}{lang === 'ko' ? ' (숫자 형식)' : ' (formatted)'}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {PRESETS.map(p => (
            <button key={p.val} onClick={() => setInput(p.val)}
              className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all bg-[#0f1117]">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div className="flex flex-col gap-3">
        <ResultRow label={tx.korean} value={korean} k="ko" highlight />
        <ResultRow label={tx.hanja} value={hanja} k="hanja" />
        <ResultRow label={tx.english} value={english} k="en" />
        <ResultRow label={tx.formal} value={wonFormal} k="formal" />
        <ResultRow label={`${tx.formal} (${tx.hanja})`} value={wonHanja} k="formalHanja" />
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '숫자 한글 변환기' : 'Number to Korean Converter'}
        toolUrl="https://keyword-mixer.vercel.app/number-to-korean"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '숫자 입력', desc: '변환할 숫자를 입력하세요. 최대 경(京) 단위까지 지원합니다.' },
          { step: '변환 결과 확인', desc: '한글, 한자, 영문으로 즉시 변환된 결과를 확인하세요.' },
          { step: '금액 표기 확인', desc: '수표·계약서용 정식 금액 표기(금 일억원정)도 자동 생성됩니다.' },
          { step: '복사하여 사용', desc: '각 결과 옆 복사 버튼으로 원하는 형식을 클립보드에 복사하세요.' },
        ] : [
          { step: 'Enter number', desc: 'Type the number you want to convert. Supports up to quadrillions.' },
          { step: 'View conversions', desc: 'See instant conversions in Korean, Hanja, and English.' },
          { step: 'Formal amount', desc: 'Formal check/contract notation is auto-generated.' },
          { step: 'Copy result', desc: 'Use copy buttons to save any format to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '계약서·수표 필수', desc: '공식 문서의 금액 표기는 한글/한자로 써야 합니다. 자동 변환으로 오기를 방지하세요.' },
          { title: '한자 변환 지원', desc: '수표와 공문서에 사용하는 한자 금액(壹億圓整)도 지원합니다.' },
          { title: '영문 변환', desc: '영문 계약서나 해외 서류에 필요한 영문 숫자 표기도 제공합니다.' },
          { title: '조·경 단위 지원', desc: '일반 도구에서 잘 지원하지 않는 조·경 단위까지 완벽 지원합니다.' },
        ] : [
          { title: 'Required for contracts', desc: 'Official documents require amounts written in Korean/Hanja text.' },
          { title: 'Hanja support', desc: 'Supports Hanja numerals (壹億圓整) used in formal checks.' },
          { title: 'English conversion', desc: 'Provides English word form for international contracts.' },
          { title: 'Large numbers', desc: 'Supports up to Korean Gyeong (경) unit — quintillions.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '수표에 금액을 한글로 써야 하는 이유는?', a: '숫자만 쓰면 위조·변조가 쉽습니다. 한글/한자로 병기하면 금액 변조를 방지할 수 있습니다.' },
          { q: '일억은 1 뒤에 0이 몇 개인가요?', a: '1억 = 100,000,000 = 1 뒤에 0이 8개입니다. 1조 = 1,000,000,000,000 = 0이 12개입니다.' },
          { q: '영문 계약서 금액 표기 방법은?', a: 'One hundred million won (₩100,000,000) 형태로 씁니다. 이 도구의 영문 변환 결과를 활용하세요.' },
          { q: '한자 금액 표기가 현대에도 쓰이나요?', a: '수표, 어음, 일부 공문서에서 여전히 사용됩니다. 한국과 일본에서 주로 사용합니다.' },
        ] : [
          { q: 'Why write amounts in Korean text?', a: 'Numeric-only amounts can be easily forged. Writing in Korean/Hanja prevents amount tampering.' },
          { q: 'How many zeros in 1 billion (10억)?', a: '1억 (100 million) = 8 zeros. 1조 (1 trillion) = 12 zeros.' },
          { q: 'How to write amounts in English contracts?', a: 'Format: "One hundred million won (₩100,000,000)". Use the English conversion from this tool.' },
          { q: 'Are Hanja numerals still used today?', a: 'Yes, in checks, promissory notes, and some official documents in Korea and Japan.' },
        ]}
        keywords="숫자 한글 변환 · 금액 한글 변환 · 숫자 읽기 · 일억 한글 · 수표 금액 표기 · 한자 금액 · 숫자 영어로 · number to Korean · number to words Korean · Korean number converter · amount in words · 금액 표기법"
      />
    </div>
  )
}
