'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '적금 만기금액 계산기', desc: '적금 만기 시 수령액을 즉시 계산. 세전/세후, 단리/복리, 이자 지급 방식별 비교.' },
  en: { title: 'Savings Maturity Calculator', desc: 'Calculate savings account maturity amount instantly. Compare pre/after-tax, simple/compound interest.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function SavingsCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [monthly, setMonthly] = useState(500000)
  const [rate, setRate] = useState(4.0)
  const [months, setMonths] = useState(12)
  const [taxFree, setTaxFree] = useState(false)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const r = rate / 100 / 12
  // 단리 적금 이자 (첫 달은 months개월, 마지막 달은 1개월)
  let simpleInterest = 0
  for (let i = 1; i <= months; i++) {
    simpleInterest += monthly * (rate / 100) * ((months - i + 1) / 12)
  }
  const taxRate = taxFree ? 0 : 0.154
  const netSimple = simpleInterest * (1 - taxRate)
  const totalPrincipal = monthly * months
  const maturitySimple = totalPrincipal + netSimple

  // 복리 적금
  let compoundTotal = 0
  for (let i = 1; i <= months; i++) {
    compoundTotal += monthly * Math.pow(1 + r, months - i + 1)
  }
  const compoundInterest = compoundTotal - totalPrincipal
  const netCompound = compoundInterest * (1 - taxRate)
  const maturityCompound = totalPrincipal + netCompound

  const MONTH_PRESETS = [6, 12, 24, 36]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '월 납입액 (원)' : 'Monthly Deposit (₩)'}</label>
            <input type="number" value={monthly} step={50000} onChange={e => setMonthly(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <div className="flex gap-1 mt-1.5">
              {[100000,200000,300000,500000,1000000].map(v => (
                <button key={v} onClick={() => setMonthly(v)}
                  className={`flex-1 py-1 rounded border text-xs transition-all ${monthly === v ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>
                  {v >= 1000000 ? '100만' : `${v/10000}만`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '연이율 (%)' : 'Annual Rate (%)'}</label>
            <input type="number" value={rate} step={0.1} min={0.1} max={20} onChange={e => setRate(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <input type="range" min={0.5} max={10} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-green-500 mt-2" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '납입 기간' : 'Term'}</label>
            <div className="flex gap-1.5">
              {MONTH_PRESETS.map(m => (
                <button key={m} onClick={() => setMonths(m)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${months === m ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                  {m}{lang === 'ko' ? '개월' : 'mo'}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <div onClick={() => setTaxFree(!taxFree)} className={`w-9 h-5 rounded-full relative transition-all ${taxFree ? 'bg-brand-500' : 'bg-surface-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${taxFree ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className="text-xs text-slate-300">{lang === 'ko' ? '비과세' : 'Tax-free'}</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: lang === 'ko' ? '단리 만기금액' : 'Simple Interest Maturity', val: maturitySimple, interest: netSimple, key: 'simple' },
          { label: lang === 'ko' ? '복리 만기금액' : 'Compound Interest Maturity', val: maturityCompound, interest: netCompound, key: 'compound' },
        ].map(r => (
          <div key={r.key} className={`rounded-xl border p-4 ${r.key === 'compound' ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
            <p className="text-xs text-slate-400 mb-1">{r.label}</p>
            <p className={`text-2xl font-bold font-mono ${r.key === 'compound' ? 'text-brand-400' : 'text-slate-200'}`}>₩{comma(r.val)}</p>
            <p className="text-xs text-slate-500 mt-0.5">{lang === 'ko' ? `세후 이자: ₩${comma(r.interest)}` : `After-tax interest: ₩${comma(r.interest)}`}</p>
            <button onClick={() => copy(String(Math.round(r.val)), r.key)} className={`mt-2 p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={13}/> : <Copy size={13}/>}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        {[
          { label: lang === 'ko' ? '총 납입금' : 'Total Principal', val: `₩${comma(totalPrincipal)}` },
          { label: lang === 'ko' ? '납입 기간' : 'Term', val: `${months}${lang === 'ko' ? '개월' : ' months'}` },
          { label: lang === 'ko' ? '연이율' : 'Annual Rate', val: `${rate}%` },
          { label: lang === 'ko' ? `이자과세 (${taxFree ? '비과세' : '15.4%'})` : `Tax (${taxFree ? 'exempt' : '15.4%'})`, val: taxFree ? (lang === 'ko' ? '비과세' : 'Exempt') : '15.4%' },
        ].map(r => (
          <div key={r.label} className="flex justify-between py-1.5 border-b border-surface-border last:border-0 text-xs">
            <span className="text-slate-400">{r.label}</span>
            <span className="text-slate-200 font-medium">{r.val}</span>
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '적금 만기금액 계산기' : 'Savings Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/savings-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '월 납입액 입력', desc: '매월 납입할 금액을 입력하거나 프리셋을 선택하세요.' },
          { step: '이율과 기간 설정', desc: '연이율을 슬라이더로 조절하고 납입 기간을 선택하세요.' },
          { step: '비과세 여부 설정', desc: '비과세 적금이라면 비과세 토글을 켜세요.' },
          { step: '만기금액 확인', desc: '단리와 복리 만기금액을 비교해 유리한 상품을 선택하세요.' },
        ] : [
          { step: 'Enter monthly deposit', desc: 'Input monthly amount or use preset buttons.' },
          { step: 'Set rate and term', desc: 'Adjust annual rate with slider and select term.' },
          { step: 'Set tax exemption', desc: 'Toggle tax-free if your account is exempt.' },
          { step: 'Compare maturity amounts', desc: 'Compare simple vs compound interest maturity amounts.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '단리/복리 비교', desc: '단리와 복리 방식의 만기금액을 나란히 비교합니다.' },
          { title: '세후 수익 계산', desc: '15.4% 이자소득세를 자동 반영한 실제 수령액을 보여줍니다.' },
          { title: '비과세 지원', desc: 'ISA, 청년희망적금 등 비과세 적금 계산도 지원합니다.' },
          { title: '직관적인 UI', desc: '슬라이더와 프리셋으로 빠르게 시뮬레이션할 수 있습니다.' },
        ] : [
          { title: 'Simple vs compound comparison', desc: 'Compare both interest methods side by side.' },
          { title: 'After-tax calculation', desc: '15.4% interest tax automatically applied for real maturity amount.' },
          { title: 'Tax-free support', desc: 'Supports ISA and tax-exempt savings account calculations.' },
          { title: 'Intuitive sliders', desc: 'Quick simulation with sliders and preset buttons.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '적금은 단리인가요 복리인가요?', a: '대부분의 국내 은행 정기적금은 단리입니다. 복리 적금 상품은 일부 있으나 일반적이지 않습니다. 이 계산기에서 두 방식을 비교해보세요.' },
          { q: '적금 이자에 세금이 붙나요?', a: '네, 이자소득세 14%와 지방소득세 1.4%, 합계 15.4%가 원천징수됩니다. ISA, 청년희망적금 등은 비과세 혜택이 있습니다.' },
          { q: '적금 이자 계산 공식은?', a: '단리: 월납입금 × 연이율 × (잔여개월/12)의 합산. 첫 달 납입금은 전체 기간, 마지막 달은 1개월 이자만 붙습니다.' },
          { q: '적금 중도해지 시 이율은?', a: '중도해지 시 약정 금리보다 낮은 중도해지 이율이 적용됩니다. 일반적으로 약정 금리의 20~50% 수준입니다.' },
        ] : [
          { q: 'Simple or compound interest for savings?', a: 'Most Korean savings accounts use simple interest. Compound interest accounts are rare. Compare both with this calculator.' },
          { q: 'Is savings interest taxed?', a: 'Yes, 15.4% total (14% income + 1.4% local tax) is withheld. ISA and youth savings accounts have tax exemptions.' },
          { q: 'Savings interest formula?', a: 'Simple interest: sum of monthly_deposit × rate × (remaining_months/12). First month earns full-term interest.' },
          { q: 'Early withdrawal rate?', a: 'Early withdrawal applies a lower rate, typically 20-50% of the contracted rate.' },
        ]}
        keywords="적금 계산기 · 적금 만기금액 · 적금 이자 계산 · 월 납입 적금 · 적금 수익 · 비과세 적금 · savings calculator Korea · savings maturity · monthly savings interest · installment savings · 정기적금 이자"
      />
    </div>
  )
}
