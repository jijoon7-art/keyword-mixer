
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '진법 변환기', desc: '2진법·8진법·10진법·16진법을 즉시 변환. 컴퓨터 과학 학습에 필수.' },
  en: { title: 'Number Base Converter', desc: 'Convert between binary, octal, decimal, and hexadecimal instantly. Essential for computer science.' }
}

export default function NumberBaseConverter() {
  const { lang } = useLang()
  const tx = T[lang]
  const [decimal, setDecimal] = useState(255)
  const [fromBase, setFromBase] = useState(10)
  const [inputVal, setInputVal] = useState('255')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const handleInput = (val: string, base: number) => {
    setInputVal(val)
    setFromBase(base)
    try {
      const dec = parseInt(val, base)
      if (!isNaN(dec) && dec >= 0) setDecimal(dec)
    } catch {}
  }

  const bin = decimal.toString(2)
  const oct = decimal.toString(8)
  const dec = decimal.toString(10)
  const hex = decimal.toString(16).toUpperCase()

  const CONVERSIONS = [
    { label: lang==='ko'?'2진수 (Binary)':'Binary (Base 2)', val: bin, base: 2, prefix: '0b', color: 'text-brand-400' },
    { label: lang==='ko'?'8진수 (Octal)':'Octal (Base 8)', val: oct, base: 8, prefix: '0o', color: 'text-blue-400' },
    { label: lang==='ko'?'10진수 (Decimal)':'Decimal (Base 10)', val: dec, base: 10, prefix: '', color: 'text-yellow-400' },
    { label: lang==='ko'?'16진수 (Hex)':'Hexadecimal (Base 16)', val: hex, base: 16, prefix: '0x', color: 'text-purple-400' },
  ]

  // 비트 시각화
  const bits = bin.padStart(Math.ceil(bin.length/8)*8, '0').split('')

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Dev Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        {CONVERSIONS.map(c => (
          <div key={c.base} className="border-b border-surface-border last:border-0">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-32 flex-shrink-0">
                <p className="text-xs text-slate-400">{c.label}</p>
                <p className="text-xs font-mono text-slate-600">{c.prefix || '—'}</p>
              </div>
              <input value={c.val} onChange={e => handleInput(e.target.value, c.base)}
                className={`flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-base font-mono font-bold focus:outline-none focus:border-brand-500/50 transition-all ${c.color}`}
                spellCheck={false} />
              <button onClick={() => copy(c.val, String(c.base))} className={`p-2 rounded-lg border transition-all flex-shrink-0 ${copied===String(c.base)?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                {copied===String(c.base)?<CheckCheck size={14}/>:<Copy size={14}/>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 입력 */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {[0,1,2,8,10,16,32,64,127,128,255,256,1023,1024,65535].map(v => (
          <button key={v} onClick={() => { setDecimal(v); setInputVal(String(v)); setFromBase(10) }}
            className={`text-xs px-2.5 py-1 rounded border transition-all ${decimal===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{v}</button>
        ))}
      </div>

      {/* 비트 시각화 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?`비트 시각화 (${bits.length}비트):`:`Bit Visualization (${bits.length}-bit):`}</p>
        <div className="flex flex-wrap gap-1">
          {bits.map((bit, i) => (
            <div key={i} className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-mono font-bold transition-all ${bit==='1'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border bg-[#0f1117] text-slate-600'}`}>
              {bit}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">{lang==='ko'?`MSB → LSB, 10진수: ${decimal}`:`MSB → LSB, Decimal: ${decimal}`}</p>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'진법 변환기':'Number Base Converter'}
        toolUrl="https://keyword-mixer.vercel.app/number-base-converter"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'숫자 입력',desc:'어떤 진법의 입력창에든 값을 입력하면 나머지가 자동으로 변환됩니다.'},{step:'변환 결과 확인',desc:'2진수, 8진수, 10진수, 16진수가 실시간으로 계산됩니다.'},{step:'프리셋 활용',desc:'자주 사용하는 숫자 버튼으로 빠르게 입력하세요.'},{step:'비트 시각화',desc:'입력한 숫자의 비트 패턴을 시각적으로 확인하세요.'}]:[{step:'Enter number',desc:'Type in any base input and all others auto-convert.'},{step:'View results',desc:'Binary, octal, decimal, hex update in real-time.'},{step:'Use presets',desc:'Quick buttons for commonly used numbers.'},{step:'Bit visualization',desc:'See the bit pattern of your number visually.'}]}
        whyUse={lang==='ko'?[{title:'4진법 동시 변환',desc:'2·8·10·16진법을 모두 동시에 변환합니다.'},{title:'어느 입력창에서도 입력',desc:'2진수 입력창에 직접 입력하거나 10진수에 입력해도 됩니다.'},{title:'비트 시각화',desc:'각 비트를 격자로 시각화해 이해를 돕습니다.'},{title:'자주 쓰는 값 프리셋',desc:'0, 255, 1024 등 자주 사용하는 값을 버튼으로 제공합니다.'}]:[{title:'4 bases simultaneously',desc:'Converts binary, octal, decimal, hex all at once.'},{title:'Input from any field',desc:'Type directly in binary field or any other base field.'},{title:'Bit visualization',desc:'Visualizes each bit in a grid for better understanding.'},{title:'Common value presets',desc:'Quick buttons for frequently used values like 0, 255, 1024.'}]}
        faqs={lang==='ko'?[{q:'2진법이란?',a:'0과 1만 사용하는 컴퓨터 기본 수 체계. 모든 컴퓨터 데이터는 내부적으로 2진수로 저장됩니다.'},{q:'16진법은 왜 사용하나요?',a:'2진수를 짧게 표현하기 위해 사용합니다. 4비트=1자리 16진수. 색상(#FF0000), 메모리 주소 등에 사용됩니다.'},{q:'255는 왜 자주 쓰이나요?',a:'8비트(1바이트)의 최댓값. 2진수 11111111 = 8진수 377 = 16진수 FF = 10진수 255.'},{q:'접두사 0b, 0o, 0x란?',a:'0b = 2진수, 0o = 8진수, 0x = 16진수 표시 접두사. 프로그래밍 언어에서 리터럴을 구분하는 데 사용됩니다.'}]:[{q:'What is binary?',a:'Number system using only 0 and 1. All computer data is stored internally in binary.'},{q:'Why use hexadecimal?',a:'Compact representation of binary. 4 bits = 1 hex digit. Used for colors (#FF0000), memory addresses, etc.'},{q:'Why is 255 commonly used?',a:'Maximum value of 8 bits (1 byte). Binary 11111111 = Octal 377 = Hex FF = Decimal 255.'},{q:'What are 0b, 0o, 0x prefixes?',a:'0b = binary, 0o = octal, 0x = hexadecimal literal prefixes used in programming languages.'}]}
        keywords="진법 변환기 · 2진수 변환 · 16진수 변환 · 2진법 10진법 변환 · 이진수 16진수 · number base converter · binary converter · hexadecimal converter · decimal to binary"
      />
    </div>
  )
}
