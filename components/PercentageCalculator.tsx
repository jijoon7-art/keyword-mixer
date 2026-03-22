'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '퍼센트 계산기', desc: '퍼센트 계산의 모든 유형을 한 페이지에서. X의 Y%, X는 Y의 몇%, X에서 Y% 변화, 할인가 계산.', tabs: ['X의 Y%', 'X는 Y의 몇%', '변화율', '할인가'] },
  en: { title: 'Percentage Calculator', desc: 'All types of percentage calculations in one page. Y% of X, what % is X of Y, percent change, discount price.', tabs: ['Y% of X', 'X is what % of Y', '% Change', 'Discount'] }
}

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return '—'
  return Number.isInteger(n) ? n.toLocaleString() : parseFloat(n.toFixed(4)).toLocaleString()
}

function copy(text: string, setCopied: (k: string | null) => void, key: string) {
  navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
}

export default function PercentageCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  // 탭1: X의 Y%
  const [a1, setA1] = useState(200)
  const [b1, setB1] = useState(15)
  const r1 = a1 * b1 / 100

  // 탭2: X는 Y의 몇%
  const [a2, setA2] = useState(30)
  const [b2, setB2] = useState(200)
  const r2 = (a2 / b2) * 100

  // 탭3: 변화율
  const [a3, setA3] = useState(100)
  const [b3, setB3] = useState(130)
  const r3 = ((b3 - a3) / Math.abs(a3)) * 100
  const isIncrease = r3 > 0

  // 탭4: 할인가
  const [a4, setA4] = useState(50000)
  const [b4, setB4] = useState(30)
  const discount4 = a4 * b4 / 100
  const r4 = a4 - discount4

  const InputRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div>
      <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
      <input type="number" value={value} onChange={e => onChange(+e.target.value)}
        className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
    </div>
  )

  const ResultBox = ({ label, value, k }: { label: string; value: string; k: string }) => (
    <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-3xl font-extrabold text-brand-400 font-mono">{value}</p>
      </div>
      <button onClick={() => copy(value.replace(/[%₩,]/g, ''), setCopied, k)}
        className={`p-2.5 rounded-xl border transition-all ${copied === k ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
        {copied === k ? <CheckCheck size={16} /> : <Copy size={16} />}
      </button>
    </div>
  )

  const QUICK_PCTS = [5, 10, 15, 20, 25, 30, 50, 75]

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
        {tx.tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 text-xs font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300'}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputRow label={lang === 'ko' ? '기준 값 (X)' : 'Base Value (X)'} value={a1} onChange={setA1} />
              <InputRow label={lang === 'ko' ? '퍼센트 (Y%)' : 'Percent (Y%)'} value={b1} onChange={setB1} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PCTS.map(p => (
                <button key={p} onClick={() => setB1(p)}
                  className={`text-xs px-2.5 py-1 rounded border transition-all ${b1 === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{p}%</button>
              ))}
            </div>
          </div>
          <ResultBox label={lang === 'ko' ? `${a1}의 ${b1}%` : `${b1}% of ${a1}`} value={fmt(r1)} k="r1" />
          <p className="text-xs text-slate-500 text-center">{a1} × {b1}% = <strong className="text-slate-300">{fmt(r1)}</strong></p>
        </div>
      )}

      {tab === 1 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3">
              <InputRow label={lang === 'ko' ? '비교 값 (X)' : 'Part (X)'} value={a2} onChange={setA2} />
              <InputRow label={lang === 'ko' ? '전체 값 (Y)' : 'Whole (Y)'} value={b2} onChange={setB2} />
            </div>
          </div>
          <ResultBox label={lang === 'ko' ? `${a2}는 ${b2}의 몇%?` : `${a2} is what % of ${b2}?`} value={`${fmt(r2)}%`} k="r2" />
          <p className="text-xs text-slate-500 text-center">({a2} ÷ {b2}) × 100 = <strong className="text-slate-300">{fmt(r2)}%</strong></p>
        </div>
      )}

      {tab === 2 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3">
              <InputRow label={lang === 'ko' ? '이전 값' : 'Original Value'} value={a3} onChange={setA3} />
              <InputRow label={lang === 'ko' ? '이후 값' : 'New Value'} value={b3} onChange={setB3} />
            </div>
          </div>
          <div className={`rounded-xl border p-4 flex items-center justify-between ${isIncrease ? 'border-brand-500/40 bg-brand-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
            <div>
              <p className="text-xs text-slate-400">{lang === 'ko' ? '변화율' : '% Change'}</p>
              <p className={`text-3xl font-extrabold font-mono ${isIncrease ? 'text-brand-400' : 'text-red-400'}`}>
                {isIncrease ? '+' : ''}{fmt(r3)}%
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{isIncrease ? (lang === 'ko' ? '▲ 증가' : '▲ Increase') : (lang === 'ko' ? '▼ 감소' : '▼ Decrease')}</p>
            </div>
            <button onClick={() => copy(fmt(r3), setCopied, 'r3')} className={`p-2.5 rounded-xl border transition-all ${copied === 'r3' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied === 'r3' ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p className="text-xs text-slate-500 text-center">({b3} - {a3}) ÷ |{a3}| × 100 = <strong className="text-slate-300">{fmt(r3)}%</strong></p>
        </div>
      )}

      {tab === 3 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputRow label={lang === 'ko' ? '정가' : 'Original Price'} value={a4} onChange={setA4} />
              <InputRow label={lang === 'ko' ? '할인율 (%)' : 'Discount (%)'} value={b4} onChange={setB4} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[5,10,15,20,25,30,40,50,70].map(p => (
                <button key={p} onClick={() => setB4(p)}
                  className={`text-xs px-2.5 py-1 rounded border transition-all ${b4 === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{p}%</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="text-xs text-slate-400">{lang === 'ko' ? '할인 금액' : 'Discount'}</p>
              <p className="text-2xl font-bold text-red-400 font-mono">-₩{discount4.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 text-center">
              <p className="text-xs text-slate-400">{lang === 'ko' ? '할인가' : 'Sale Price'}</p>
              <p className="text-2xl font-bold text-brand-400 font-mono">₩{r4.toLocaleString()}</p>
            </div>
          </div>
          <button onClick={() => copy(r4.toString(), setCopied, 'r4')} className={`text-xs px-4 py-2 rounded-lg border flex items-center gap-1.5 mx-auto transition-all ${copied === 'r4' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied === 'r4' ? <CheckCheck size={12} /> : <Copy size={12} />} {lang === 'ko' ? '할인가 복사' : 'Copy Sale Price'}
          </button>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '퍼센트 계산기' : 'Percentage Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/percentage-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '계산 유형 선택', desc: '상단 탭에서 원하는 퍼센트 계산 유형을 선택하세요.' },
          { step: '값 입력', desc: '해당 계산에 필요한 숫자를 입력하세요.' },
          { step: '결과 확인', desc: '입력 즉시 결과가 계산됩니다.' },
          { step: '결과 복사', desc: '복사 버튼으로 결과를 클립보드에 저장하세요.' },
        ] : [
          { step: 'Select calculation type', desc: 'Choose from the 4 tabs at the top.' },
          { step: 'Enter values', desc: 'Input the required numbers for the calculation.' },
          { step: 'View result', desc: 'Result calculates instantly as you type.' },
          { step: 'Copy result', desc: 'Use copy button to save result to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 퍼센트 계산 통합', desc: 'X의 Y%, 비율 계산, 변화율, 할인가를 한 페이지에서 모두 계산합니다.' },
          { title: '빠른 % 프리셋', desc: '자주 사용하는 5/10/15/20/25/30% 버튼으로 빠르게 선택합니다.' },
          { title: '공식 표시', desc: '계산에 사용된 공식을 함께 표시해 원리를 이해할 수 있습니다.' },
          { title: '변화율 부호 표시', desc: '증가/감소를 + / - 부호와 색상으로 직관적으로 구분합니다.' },
        ] : [
          { title: '4 calculation modes', desc: 'Y% of X, ratio, percent change, and discount in one page.' },
          { title: 'Quick % presets', desc: 'Quick buttons for 5/10/15/20/25/30% rates.' },
          { title: 'Formula display', desc: 'Shows the calculation formula to understand the math.' },
          { title: 'Change direction indicator', desc: 'Increase/decrease shown with +/- and color coding.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '100에서 20% 할인하면 얼마인가요?', a: '100 × 20% = 20 (할인금액), 100 - 20 = 80 (할인가)입니다. 할인가 탭을 사용하면 자동으로 계산됩니다.' },
          { q: '변화율 계산 공식은?', a: '(새 값 - 기존 값) ÷ |기존 값| × 100 = 변화율(%). 양수면 증가, 음수면 감소를 의미합니다.' },
          { q: '30은 150의 몇 퍼센트인가요?', a: '(30 ÷ 150) × 100 = 20%. "X는 Y의 몇%" 탭에서 30과 150을 입력하면 바로 계산됩니다.' },
          { q: '퍼센트와 퍼센트포인트의 차이는?', a: '퍼센트는 상대적 변화(10%→20%는 100% 증가), 퍼센트포인트는 절대적 차이(10→20은 10%p 증가)입니다.' },
        ] : [
          { q: 'What is 20% off 100?', a: '100 × 20% = 20 (discount), 100 - 20 = 80 (sale price). Use the Discount tab for automatic calculation.' },
          { q: 'Percent change formula?', a: '(New - Original) ÷ |Original| × 100. Positive = increase, negative = decrease.' },
          { q: 'What percent is 30 of 150?', a: '(30 ÷ 150) × 100 = 20%. Enter 30 and 150 in the "X is what %" tab.' },
          { q: 'Percent vs percentage point?', a: 'Percent is relative change (10%→20% is 100% increase). Percentage point is absolute difference (10→20 is +10 percentage points).' },
        ]}
        keywords="퍼센트 계산기 · 할인율 계산기 · 비율 계산기 · 변화율 계산 · 퍼센트 구하기 · 할인가 계산 · percentage calculator · percent calculator · discount calculator · percent change · percent of number"
      />
    </div>
  )
}
