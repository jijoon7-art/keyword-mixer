'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '월급 실수령액 계산기', desc: '연봉·월급 입력 시 4대보험·소득세 공제 후 실수령액 즉시 계산. 2024년 최신 기준.' },
  en: { title: 'Net Salary Calculator', desc: 'Calculate take-home pay after taxes and social insurance deductions. 2024 Korean standards.' }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

function calcIncomeTax(annual: number, dependents: number): number {
  let employDeduct = 0
  if (annual <= 5000000) employDeduct = annual * 0.7
  else if (annual <= 15000000) employDeduct = 3500000 + (annual - 5000000) * 0.4
  else if (annual <= 45000000) employDeduct = 7500000 + (annual - 15000000) * 0.15
  else if (annual <= 100000000) employDeduct = 12000000 + (annual - 45000000) * 0.05
  else employDeduct = 14750000

  const personalDeduct = 1500000 * dependents + 1500000
  const taxable = Math.max(0, annual - employDeduct - personalDeduct)

  const BRACKETS = [
    { limit: 14000000, rate: 0.06, deduct: 0 },
    { limit: 50000000, rate: 0.15, deduct: 1260000 },
    { limit: 88000000, rate: 0.24, deduct: 5760000 },
    { limit: 150000000, rate: 0.35, deduct: 15440000 },
    { limit: Infinity, rate: 0.38, deduct: 19940000 },
  ]
  for (const b of BRACKETS) {
    if (taxable <= b.limit) return Math.max(0, taxable * b.rate - b.deduct)
  }
  return 0
}

export default function SalaryCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<'annual' | 'monthly'>('annual')
  const [amount, setAmount] = useState(40000000)
  const [dependents, setDependents] = useState(1)
  const [nonTaxable, setNonTaxable] = useState(200000)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const annual = mode === 'annual' ? amount : amount * 12
  const monthly = annual / 12
  const taxableMonthly = Math.max(0, monthly - nonTaxable)
  const taxableAnnual = taxableMonthly * 12

  // 4대보험 (월)
  const nationalPension = Math.min(Math.round(taxableMonthly * 0.045), 265500) // 상한 있음
  const healthInsurance = Math.round(taxableMonthly * 0.03545)
  const longTermCare = Math.round(healthInsurance * 0.1295)
  const employmentInsurance = Math.round(taxableMonthly * 0.009)
  const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance

  // 소득세 (월)
  const annualIncomeTax = calcIncomeTax(taxableAnnual, dependents)
  const monthlyIncomeTax = Math.round(annualIncomeTax / 12)
  const localTax = Math.round(monthlyIncomeTax * 0.1)
  const totalTax = monthlyIncomeTax + localTax

  const totalDeduction = totalInsurance + totalTax
  const netMonthly = Math.round(monthly - totalDeduction)
  const netAnnual = netMonthly * 12

  const deductionRate = ((totalDeduction / monthly) * 100).toFixed(1)

  const rows = [
    { label: lang === 'ko' ? '월 총급여' : 'Monthly Gross', val: `₩${comma(monthly)}`, key: 'gross' },
    { label: lang === 'ko' ? '국민연금' : 'National Pension', val: `-₩${comma(nationalPension)}`, key: 'np' },
    { label: lang === 'ko' ? '건강보험' : 'Health Insurance', val: `-₩${comma(healthInsurance)}`, key: 'hi' },
    { label: lang === 'ko' ? '장기요양보험' : 'Long-term Care', val: `-₩${comma(longTermCare)}`, key: 'lc' },
    { label: lang === 'ko' ? '고용보험' : 'Employment Insurance', val: `-₩${comma(employmentInsurance)}`, key: 'ei' },
    { label: lang === 'ko' ? '소득세' : 'Income Tax', val: `-₩${comma(monthlyIncomeTax)}`, key: 'it' },
    { label: lang === 'ko' ? '지방소득세' : 'Local Income Tax', val: `-₩${comma(localTax)}`, key: 'lt' },
  ]

  const PRESETS = [24, 30, 36, 40, 50, 60, 80, 100].map(n => ({ label: `${n}${lang === 'ko' ? '만' : 'M'}`, val: n * 1000000 }))

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
        <div className="flex gap-2 mb-4">
          {[['annual', lang === 'ko' ? '연봉' : 'Annual'], ['monthly', lang === 'ko' ? '월급' : 'Monthly']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v as 'annual' | 'monthly')}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${mode === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="mb-3">
          <label className="text-xs text-slate-400 mb-1.5 block">{mode === 'annual' ? (lang === 'ko' ? '연봉 (원)' : 'Annual Salary (₩)') : (lang === 'ko' ? '월급 (원)' : 'Monthly Salary (₩)')}</label>
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <button key={p.val} onClick={() => setAmount(mode === 'annual' ? p.val : p.val / 12)}
                className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '부양가족 수' : 'Dependents'}</label>
            <input type="number" min={1} max={10} value={dependents} onChange={e => setDependents(Number(e.target.value))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '비과세 (식대 등, 월)' : 'Non-taxable (meal etc.)'}</label>
            <input type="number" value={nonTaxable} onChange={e => setNonTaxable(Number(e.target.value))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>
      </div>

      {/* 실수령액 하이라이트 */}
      <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '월 실수령액' : 'Monthly Take-home'}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(netMonthly)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `연 ${comma(netAnnual)}원 · 공제율 ${deductionRate}%` : `Annual ₩${comma(netAnnual)} · ${deductionRate}% deduction`}</p>
          </div>
          <button onClick={() => copy(String(netMonthly), 'net')} className={`p-2.5 rounded-xl border transition-all ${copied === 'net' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40'}`}>
            {copied === 'net' ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="mt-3 h-2 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${100 - parseFloat(deductionRate)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>{lang === 'ko' ? '실수령' : 'Take-home'} {(100 - parseFloat(deductionRate)).toFixed(1)}%</span>
          <span>{lang === 'ko' ? '공제' : 'Deductions'} {deductionRate}%</span>
        </div>
      </div>

      {/* 공제 상세 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-surface-border">
          <p className="text-sm font-semibold text-slate-200">{lang === 'ko' ? '공제 항목 상세' : 'Deduction Breakdown'}</p>
        </div>
        <div className="divide-y divide-surface-border">
          {rows.map(r => (
            <div key={r.key} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-slate-400">{r.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-200">{r.val}</span>
                <button onClick={() => copy(r.val.replace(/[-₩,]/g, ''), r.key)} className={`p-1 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                  {copied === r.key ? <CheckCheck size={11} /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f1117]">
            <span className="text-xs font-bold text-slate-300">{lang === 'ko' ? '총 공제액' : 'Total Deductions'}</span>
            <span className="text-sm font-bold font-mono text-red-400">-₩{comma(totalDeduction)}</span>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '월급 실수령액 계산기' : 'Net Salary Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/salary-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '연봉/월급 선택', desc: '연봉 또는 월급 기준 중 편한 방식을 선택하세요.' },
          { step: '금액 입력', desc: '급여 금액을 입력하거나 프리셋 버튼을 클릭하세요.' },
          { step: '부양가족 입력', desc: '부양가족 수를 입력하면 소득세 공제에 반영됩니다.' },
          { step: '실수령액 확인', desc: '4대보험·소득세 공제 후 실수령액이 즉시 계산됩니다.' },
        ] : [
          { step: 'Select annual/monthly', desc: 'Choose whether to enter annual or monthly salary.' },
          { step: 'Enter amount', desc: 'Type salary amount or click preset buttons.' },
          { step: 'Enter dependents', desc: 'Input number of dependents for income tax deduction.' },
          { step: 'View net salary', desc: 'Take-home pay after all deductions is calculated instantly.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '공제 항목별 상세', desc: '국민연금·건강보험·소득세 등 항목별 공제액을 한눈에 확인합니다.' },
          { title: '공제율 시각화', desc: '공제 비율을 그래프로 직관적으로 표현합니다.' },
          { title: '비과세 반영', desc: '식대 등 비과세 금액을 입력해 더 정확한 계산이 가능합니다.' },
          { title: '연봉/월급 양방향', desc: '연봉과 월급 기준 모두 지원합니다.' },
        ] : [
          { title: 'Itemized deductions', desc: 'See each deduction (pension, health, tax) separately.' },
          { title: 'Deduction rate visualization', desc: 'Visual bar showing take-home vs deduction ratio.' },
          { title: 'Non-taxable allowances', desc: 'Enter meal allowances etc. for more accurate calculation.' },
          { title: 'Annual/monthly modes', desc: 'Supports both annual salary and monthly salary input.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '연봉 4000만원의 실수령액은?', a: '부양가족 1인 기준 약 290~300만원/월 정도입니다. 비과세 금액, 부양가족 수에 따라 달라집니다.' },
          { q: '국민연금 상한선이 있나요?', a: '네, 2024년 기준 월 기준소득월액 상한은 590만원으로, 최대 265,500원까지 납부합니다.' },
          { q: '비과세 금액이란?', a: '식대(월 20만원), 차량 유지비 등 세금이 붙지 않는 급여 항목입니다. 이를 제외한 금액에만 세금이 부과됩니다.' },
          { q: '실수령액이 예상보다 적은 이유는?', a: '4대보험(약 9%)과 소득세·지방세가 공제되기 때문입니다. 연봉 대비 실수령액은 보통 85~90% 수준입니다.' },
        ] : [
          { q: 'What is take-home for ₩40M annual salary?', a: 'Approximately ₩2.9~3.0M/month for 1 dependent. Varies by non-taxable allowances and dependents.' },
          { q: 'Is there a national pension cap?', a: 'Yes, the 2024 income cap is ₩5.9M/month, so maximum pension is ₩265,500.' },
          { q: 'What are non-taxable allowances?', a: 'Meal allowances (up to ₩200K/month), vehicle maintenance etc. that are exempt from taxation.' },
          { q: 'Why is take-home less than expected?', a: 'Social insurance (~9%) plus income and local taxes are deducted. Net salary is typically 85-90% of gross.' },
        ]}
        keywords="월급 실수령액 · 연봉 실수령액 · 실수령액 계산기 · 급여 계산기 · 4대보험 계산 · 소득세 공제 · net salary calculator · take-home pay Korea · salary after tax · 연봉계산기 · 월급계산기"
      />
    </div>
  )
}
