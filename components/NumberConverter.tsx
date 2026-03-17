'use client'

import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '진법 변환기',
    desc: '2진수·8진수·10진수·16진수 즉시 변환. ASCII, 비트 연산, 색상 코드 변환 포함.',
    input: '입력값',
    from: '입력 진법',
    copy: '복사', copied: '복사됨',
    bin: '2진수 (Binary)',
    oct: '8진수 (Octal)',
    dec: '10진수 (Decimal)',
    hex: '16진수 (Hexadecimal)',
    ascii: 'ASCII 변환',
    bitOps: '비트 연산',
    colorHex: '색상 HEX',
    result: '변환 결과',
    steps: '변환 과정',
    presets: '예제',
  },
  en: {
    title: 'Number Base Converter',
    desc: 'Convert between binary, octal, decimal, and hexadecimal instantly. Includes ASCII and bit operations.',
    input: 'Input Value',
    from: 'From Base',
    copy: 'Copy', copied: 'Copied!',
    bin: 'Binary (Base 2)',
    oct: 'Octal (Base 8)',
    dec: 'Decimal (Base 10)',
    hex: 'Hexadecimal (Base 16)',
    ascii: 'ASCII',
    bitOps: 'Bit Operations',
    colorHex: 'Color HEX',
    result: 'Results',
    steps: 'Conversion Steps',
    presets: 'Examples',
  }
}

type Base = 2 | 8 | 10 | 16

const PRESETS = [
  { label: '255', val: '255', base: 10 as Base },
  { label: 'FF', val: 'FF', base: 16 as Base },
  { label: '11111111', val: '11111111', base: 2 as Base },
  { label: '42', val: '42', base: 10 as Base },
  { label: 'A', val: '65', base: 10 as Base },
]

export default function NumberConverter() {
  const { lang } = useLang()
  const tx = T[lang]
  const [input, setInput] = useState('255')
  const [fromBase, setFromBase] = useState<Base>(10)
  const [copied, setCopied] = useState<string | null>(null)

  const num = parseInt(input, fromBase)
  const isValid = !isNaN(num) && input.trim() !== ''

  const results = isValid ? {
    bin: num.toString(2),
    oct: num.toString(8),
    dec: num.toString(10),
    hex: num.toString(16).toUpperCase(),
    ascii: num >= 32 && num <= 126 ? String.fromCharCode(num) : '-',
    colorHex: num >= 0 && num <= 16777215 ? `#${num.toString(16).toUpperCase().padStart(6, '0')}` : '-',
  } : null

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  // 비트 연산
  const bitOps = isValid ? {
    not: (~num >>> 0).toString(2),
    leftShift: (num << 1).toString(2),
    rightShift: (num >> 1).toString(2),
    bits: num.toString(2).length,
    bytes: Math.ceil(num.toString(2).length / 8),
  } : null

  // 변환 과정 (10진수 → 2진수 예시)
  const steps: string[] = []
  if (isValid && fromBase !== 2) {
    let n = num
    const remainders: number[] = []
    while (n > 0) { remainders.unshift(n % 2); n = Math.floor(n / 2) }
    steps.push(`${num} ÷ 2 방식으로 2진수 변환:`)
    steps.push(remainders.length > 0 ? remainders.join('') : '0')
  }

  const CopyBtn = ({ val, k }: { val: string; k: string }) => (
    <button onClick={() => copy(val, k)} className={`p-1.5 rounded border transition-all ${copied === k ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400 hover:border-brand-500/40'}`}>
      {copied === k ? <CheckCheck size={11} /> : <Copy size={11} />}
    </button>
  )

  const ResultRow = ({ label, val, k }: { label: string; val: string; k: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f1117] border border-surface-border">
      <span className="text-xs text-slate-400 w-32">{label}</span>
      <span className="flex-1 text-sm font-mono font-bold text-slate-200 text-right mr-2">{val}</span>
      <CopyBtn val={val} k={k} />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-[1fr,auto] gap-3 items-end mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.input}</label>
            <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-xl text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            {!isValid && input && <p className="text-xs text-red-400 mt-1">{lang === 'ko' ? '유효하지 않은 값입니다' : 'Invalid value for selected base'}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.from}</label>
            <div className="flex gap-1.5">
              {([2, 8, 10, 16] as Base[]).map(b => (
                <button key={b} onClick={() => setFromBase(b)}
                  className={`px-3 py-3 rounded-xl border text-sm font-bold font-mono transition-all ${fromBase === b ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 예제 */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => { setInput(p.val); setFromBase(p.base) }}
              className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all font-mono">
              {p.label} ({lang === 'ko' ? `${p.base}진수` : `base ${p.base}`})
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      {results && (
        <>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
            <p className="text-xs text-slate-400 mb-3 font-medium">{tx.result}</p>
            <div className="flex flex-col gap-2">
              <ResultRow label={tx.bin} val={results.bin} k="bin" />
              <ResultRow label={tx.oct} val={results.oct} k="oct" />
              <ResultRow label={tx.dec} val={results.dec} k="dec" />
              <ResultRow label={tx.hex} val={results.hex} k="hex" />
              {results.ascii !== '-' && <ResultRow label={tx.ascii} val={results.ascii} k="ascii" />}
              {results.colorHex !== '-' && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f1117] border border-surface-border">
                  <span className="text-xs text-slate-400 w-32">{tx.colorHex}</span>
                  <div className="flex items-center gap-2 flex-1 justify-end mr-2">
                    <div className="w-6 h-6 rounded border border-surface-border" style={{ backgroundColor: results.colorHex }} />
                    <span className="text-sm font-mono font-bold text-slate-200">{results.colorHex}</span>
                  </div>
                  <CopyBtn val={results.colorHex} k="color" />
                </div>
              )}
            </div>
          </div>

          {/* 비트 연산 */}
          {bitOps && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-xs text-slate-400 mb-3 font-medium">{tx.bitOps}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: lang === 'ko' ? '비트 수' : 'Bit Length', val: String(bitOps.bits) },
                  { label: lang === 'ko' ? '바이트 수' : 'Bytes', val: String(bitOps.bytes) },
                  { label: lang === 'ko' ? '왼쪽 시프트 (×2)' : 'Left Shift (×2)', val: bitOps.leftShift },
                  { label: lang === 'ko' ? '오른쪽 시프트 (÷2)' : 'Right Shift (÷2)', val: bitOps.rightShift },
                ].map(r => (
                  <div key={r.label} className="p-2.5 rounded-lg bg-[#0f1117] border border-surface-border">
                    <p className="text-xs text-slate-500">{r.label}</p>
                    <p className="text-sm font-mono font-bold text-slate-200 mt-0.5">{r.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '진법 변환기' : 'Number Base Converter'}
        toolUrl="https://keyword-mixer.vercel.app/number-converter"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '숫자 입력', desc: '변환할 숫자를 입력하세요. 16진수는 A-F 문자를 사용합니다.' },
          { step: '입력 진법 선택', desc: '2, 8, 10, 16 중 입력값의 진법을 선택하세요.' },
          { step: '변환 결과 확인', desc: '2진수, 8진수, 10진수, 16진수로 변환된 결과를 확인하세요.' },
          { step: '복사 활용', desc: '각 결과 옆 복사 버튼으로 원하는 진법 값을 복사하세요.' },
        ] : [
          { step: 'Enter number', desc: 'Type the number to convert. Use A-F for hexadecimal.' },
          { step: 'Select input base', desc: 'Choose 2, 8, 10, or 16 for the input number base.' },
          { step: 'View results', desc: 'See the number converted to binary, octal, decimal, and hex.' },
          { step: 'Copy values', desc: 'Click copy buttons next to each result to copy the value.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 진법 동시 변환', desc: '2진수, 8진수, 10진수, 16진수를 한 번에 모두 확인할 수 있습니다.' },
          { title: 'ASCII & 색상 변환', desc: '숫자에 해당하는 ASCII 문자와 색상 코드도 함께 확인할 수 있습니다.' },
          { title: '비트 연산 정보', desc: '비트 수, 바이트 수, 시프트 연산 결과를 함께 제공합니다.' },
          { title: '개발 필수 도구', desc: 'CS 수업, 임베디드 개발, 네트워크 설정 등에 필수적인 도구입니다.' },
        ] : [
          { title: 'All bases at once', desc: 'See binary, octal, decimal, and hex simultaneously.' },
          { title: 'ASCII & Color codes', desc: 'View the corresponding ASCII character and CSS color code.' },
          { title: 'Bit operations', desc: 'Shows bit length, byte count, and shift operations.' },
          { title: 'Essential for developers', desc: 'Required for CS courses, embedded development, and networking.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '2진수란?', a: '0과 1만 사용하는 수 체계입니다. 컴퓨터는 내부적으로 모든 데이터를 2진수로 저장합니다.' },
          { q: '16진수는 왜 A-F를 사용하나요?', a: '16진수는 0-15를 한 자리로 표현해야 합니다. 10-15를 A-F로 나타냅니다. 웹 색상 코드(#FF5733)에 많이 쓰입니다.' },
          { q: 'ASCII란?', a: 'American Standard Code for Information Interchange. 문자를 숫자로 표현하는 표준입니다. A=65, a=97, 0=48 등입니다.' },
          { q: '비트와 바이트 차이는?', a: '1비트는 0 또는 1 하나입니다. 8비트 = 1바이트. 1KB = 1024바이트입니다.' },
        ] : [
          { q: 'What is binary (base 2)?', a: 'A number system using only 0 and 1. Computers store all data internally as binary.' },
          { q: 'Why does hex use A-F?', a: 'Hexadecimal needs to represent 0-15 in a single digit. A=10, B=11, ..., F=15. Widely used in CSS color codes like #FF5733.' },
          { q: 'What is ASCII?', a: 'American Standard Code for Information Interchange. Maps characters to numbers. A=65, a=97, 0=48.' },
          { q: 'Bits vs Bytes?', a: '1 bit is a single 0 or 1. 8 bits = 1 byte. 1KB = 1024 bytes.' },
        ]}
        keywords="진법 변환기 · 2진수 변환 · 16진수 변환 · 8진수 변환 · 10진수 변환 · 이진수 계산기 · binary converter · hex converter · number base converter · binary to decimal · decimal to hex · hexadecimal calculator · base conversion"
      />
    </div>
  )
}
