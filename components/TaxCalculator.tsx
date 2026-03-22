'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '세금 계산기', desc: '부가세·소득세·종합소득세·4대보험을 한번에 계산. 2024년 최신 세율 적용.', tabs: ['부가세', '소득세', '종합소득세', '4대보험'] },
  en: { title: 'Tax Calculator', desc: 'Calculate VAT, income tax, comprehensive income tax, and social insurance. 2024 tax rates applied.', tabs: ['VAT', 'Income Tax', 'Comprehensive', 'Social Insurance'] }
}

const INCOME_BRACKETS = [
  { limit: 14000000, rate: 0.06, deduction: 0 },
  { limit: 50000000, rate: 0.15, deduction: 1260000 },
  { limit: 88000000, rate: 0.24, deduction: 5760000 },
  { limit: 150000000, rate: 0.35, deduction: 15440000 },
  { limit: 300000000, rate: 0.38, deduction: 19940000 },
  { limit: 500000000, rate: 0.40, deduction: 25940000 },
  { limit: 1000000000, rate: 0.42, deduction: 35940000 },
  { limit: Infinity, rate: 0.45, deduction: 65940000 },
]

function calcIncomeTax(income: number): number {
  for (const b of INCOME_BRACKETS) {
    if (income <= b.limit) return Math.max(0, income * b.rate - b.deduction)
  }
  return 0
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function TaxCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  // 부가세
  const [vatAmount, setVatAmount] = useState(1000000)
  const [vatType, setVatType] = useState<'exclusive' | 'inclusive'>('exclusive')

  // 소득세
  const [salary, setSalary] = useState(50000000)
  const [dependents, setDependents] = useState(1)

  // 종합소득세
  const [compIncome, setCompIncome] = useState(80000000)
  const [deductions, setDeductions] = useState(10000000)

  // 4대보험
  const [monthSalary, setMonthSalary] = useState(3000000)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  // 부가세 계산
  const vatCalc = (() => {
    if (vatType === 'exclusive') {
      const vat = vatAmount * 0.1
      return { supply: vatAmount, vat, total: vatAmount + vat }
    } else {
      const supply = Math.round(vatAmount / 1.1)
      const vat = vatAmount - supply
      return { supply, vat, total: vatAmount }
    }
  })()

  // 소득세 계산 (근로소득공제 적용)
  const incomeCalc = (() => {
    // 근로소득공제
    let deduction = 0
    if (salary <= 5000000) deduction = salary * 0.7
    else if (salary <= 15000000) deduction = 3500000 + (salary - 5000000) * 0.4
    else if (salary <= 45000000) deduction = 7500000 + (salary - 15000000) * 0.15
    else if (salary <= 100000000) deduction = 12000000 + (salary - 45000000) * 0.05
    else deduction = 14750000

    const personalDeduction = 1500000 * dependents + 1500000
    const taxableIncome = Math.max(0, salary - deduction - personalDeduction)
    const incomeTax = calcIncomeTax(taxableIncome)
    const localTax = incomeTax * 0.1
    return { deduction, personalDeduction, taxableIncome, incomeTax, localTax, total: incomeTax + localTax }
  })()

  // 종합소득세
  const compCalc = (() => {
    const taxableIncome = Math.max(0, compIncome - deductions)
    const tax = calcIncomeTax(taxableIncome)
    const localTax = tax * 0.1
    return { taxableIncome, tax, localTax, total: tax + localTax, effectiveRate: ((tax / compIncome) * 100).toFixed(2) }
  })()

  // 4대보험 (2024년 기준)
  const insuranceCalc = (() => {
    const national = Math.round(monthSalary * 0.045)          // 국민연금 4.5%
    const health = Math.round(monthSalary * 0.03545)          // 건강보험 3.545%
    const longCare = Math.round(health * 0.1295)              // 장기요양 건보료의 12.95%
    const employment = Math.round(monthSalary * 0.009)        // 고용보험 0.9%
    const total = national + health + longCare + employment
    return { national, health, longCare, employment, total, afterTax: monthSalary - total }
  })()

  const ResultRow = ({ label, val, sub, highlight, copyKey }: { label: string; val: string; sub?: string; highlight?: boolean; copyKey?: string }) => (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-600">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-sm font-bold font-mono ${highlight ? 'text-brand-400' : 'text-slate-200'}`}>{val}</p>
        {copyKey && (
          <button onClick={() => copy(val.replace(/[₩,]/g, ''), copyKey)} className={`p-1.5 rounded border transition-all ${copied === copyKey ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400 hover:border-brand-500/40'}`}>
            {copied === copyKey ? <CheckCheck size={12} /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  )

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
            className={`flex-1 py-2.5 text-xs font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {/* 부가세 */}
      {tab === 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="flex gap-2 mb-4">
              {[['exclusive', lang === 'ko' ? '세금 별도 (공급가액)' : 'Tax Exclusive'], ['inclusive', lang === 'ko' ? '세금 포함 (공급대가)' : 'Tax Inclusive']].map(([v, l]) => (
                <button key={v} onClick={() => setVatType(v as 'exclusive' | 'inclusive')}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${vatType === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
              ))}
            </div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '금액 (원)' : 'Amount (₩)'}</label>
            <input type="number" value={vatAmount} onChange={e => setVatAmount(Number(e.target.value))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <ResultRow label={lang === 'ko' ? '공급가액 (세금 별도)' : 'Supply Amount (excl. tax)'} val={`₩${comma(vatCalc.supply)}`} copyKey="supply" />
            <ResultRow label={lang === 'ko' ? '부가세 (10%)' : 'VAT (10%)'} val={`₩${comma(vatCalc.vat)}`} copyKey="vat" />
            <ResultRow label={lang === 'ko' ? '합계 (세금 포함)' : 'Total (incl. tax)'} val={`₩${comma(vatCalc.total)}`} highlight copyKey="total" />
          </div>
        </div>
      )}

      {/* 소득세 */}
      {tab === 1 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '연봉 (원)' : 'Annual Salary (₩)'}</label>
                <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '부양가족 수' : 'Dependents'}</label>
                <input type="number" min={1} max={10} value={dependents} onChange={e => setDependents(Number(e.target.value))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ResultRow label={lang === 'ko' ? '연봉' : 'Annual Salary'} val={`₩${comma(salary)}`} />
            <ResultRow label={lang === 'ko' ? '근로소득공제' : 'Employment Deduction'} val={`-₩${comma(incomeCalc.deduction)}`} />
            <ResultRow label={lang === 'ko' ? '인적공제' : 'Personal Deduction'} val={`-₩${comma(incomeCalc.personalDeduction)}`} />
            <ResultRow label={lang === 'ko' ? '과세표준' : 'Taxable Income'} val={`₩${comma(incomeCalc.taxableIncome)}`} />
            <ResultRow label={lang === 'ko' ? '소득세' : 'Income Tax'} val={`₩${comma(incomeCalc.incomeTax)}`} copyKey="incomeTax" />
            <ResultRow label={lang === 'ko' ? '지방소득세 (10%)' : 'Local Tax (10%)'} val={`₩${comma(incomeCalc.localTax)}`} />
            <ResultRow label={lang === 'ko' ? '총 세금' : 'Total Tax'} val={`₩${comma(incomeCalc.total)}`} highlight copyKey="totalTax" />
          </div>
        </div>
      )}

      {/* 종합소득세 */}
      {tab === 2 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '총수입금액' : 'Gross Income'}</label>
                <input type="number" value={compIncome} onChange={e => setCompIncome(Number(e.target.value))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '각종 공제합계' : 'Total Deductions'}</label>
                <input type="number" value={deductions} onChange={e => setDeductions(Number(e.target.value))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ResultRow label={lang === 'ko' ? '과세표준' : 'Taxable Income'} val={`₩${comma(compCalc.taxableIncome)}`} />
            <ResultRow label={lang === 'ko' ? '종합소득세' : 'Comprehensive Income Tax'} val={`₩${comma(compCalc.tax)}`} copyKey="compTax" />
            <ResultRow label={lang === 'ko' ? '지방소득세' : 'Local Income Tax'} val={`₩${comma(compCalc.localTax)}`} />
            <ResultRow label={lang === 'ko' ? '실효세율' : 'Effective Tax Rate'} val={`${compCalc.effectiveRate}%`} />
            <ResultRow label={lang === 'ko' ? '총 세금' : 'Total Tax'} val={`₩${comma(compCalc.total)}`} highlight copyKey="compTotal" />
          </div>
        </div>
      )}

      {/* 4대보험 */}
      {tab === 3 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '월급 (원)' : 'Monthly Salary (₩)'}</label>
            <input type="number" value={monthSalary} onChange={e => setMonthSalary(Number(e.target.value))}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <p className="text-xs text-slate-600 mt-1.5">{lang === 'ko' ? '* 근로자 부담분 기준 (2024년)' : '* Employee portion only (2024)'}</p>
          </div>
          <div className="flex flex-col gap-2">
            <ResultRow label={lang === 'ko' ? '국민연금 (4.5%)' : 'National Pension (4.5%)'} val={`₩${comma(insuranceCalc.national)}`} copyKey="np" />
            <ResultRow label={lang === 'ko' ? '건강보험 (3.545%)' : 'Health Insurance (3.545%)'} val={`₩${comma(insuranceCalc.health)}`} copyKey="hi" />
            <ResultRow label={lang === 'ko' ? '장기요양보험 (12.95%)' : 'Long-term Care (12.95%)'} val={`₩${comma(insuranceCalc.longCare)}`} copyKey="lc" />
            <ResultRow label={lang === 'ko' ? '고용보험 (0.9%)' : 'Employment Insurance (0.9%)'} val={`₩${comma(insuranceCalc.employment)}`} copyKey="ei" />
            <ResultRow label={lang === 'ko' ? '4대보험 합계' : 'Total Insurance'} val={`₩${comma(insuranceCalc.total)}`} highlight copyKey="insTotal" />
            <ResultRow label={lang === 'ko' ? '실수령액 (공제 후)' : 'Net Salary (after deductions)'} val={`₩${comma(insuranceCalc.afterTax)}`} highlight copyKey="netSalary" />
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '세금 계산기' : 'Tax Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/tax-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '계산 유형 선택', desc: '부가세, 소득세, 종합소득세, 4대보험 탭 중 하나를 선택하세요.' },
          { step: '금액 입력', desc: '해당 금액을 입력하면 즉시 계산됩니다.' },
          { step: '결과 확인', desc: '세금 항목별로 상세 금액을 확인할 수 있습니다.' },
          { step: '복사하여 활용', desc: '각 금액 옆 복사 버튼으로 클립보드에 복사하세요.' },
        ] : [
          { step: 'Select tax type', desc: 'Choose VAT, income tax, comprehensive, or social insurance.' },
          { step: 'Enter amount', desc: 'Input amount and results calculate instantly.' },
          { step: 'View breakdown', desc: 'See itemized tax amounts for each category.' },
          { step: 'Copy results', desc: 'Use copy buttons to save amounts to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 세금 통합', desc: '부가세·소득세·종합소득세·4대보험을 한 페이지에서 계산합니다.' },
          { title: '2024년 최신 세율', desc: '2024년 기준 최신 세율과 공제 구간이 반영되어 있습니다.' },
          { title: '세금 별도/포함 계산', desc: '부가세는 세금 별도와 포함 방식을 모두 지원합니다.' },
          { title: '실수령액 계산', desc: '4대보험 공제 후 실제 수령액을 즉시 확인할 수 있습니다.' },
        ] : [
          { title: '4 tax types in one', desc: 'VAT, income tax, comprehensive income tax, and social insurance.' },
          { title: '2024 tax rates', desc: 'Up-to-date 2024 Korean tax rates and deduction brackets.' },
          { title: 'Tax exclusive/inclusive', desc: 'VAT calculation supports both exclusive and inclusive modes.' },
          { title: 'Net salary calculation', desc: 'See your actual take-home pay after all deductions.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '부가세 10%는 어떻게 계산하나요?', a: '세금 별도: 공급가액 × 10%. 세금 포함: 총액 ÷ 1.1 = 공급가액, 총액 - 공급가액 = 부가세.' },
          { q: '소득세 계산이 정확한가요?', a: '근로소득공제와 기본 인적공제만 반영한 개략적 계산입니다. 정확한 세금 신고는 국세청 홈택스를 이용하세요.' },
          { q: '4대보험 요율은 매년 바뀌나요?', a: '네, 매년 조정됩니다. 이 도구는 2024년 기준 요율을 사용합니다. 정확한 요율은 국민건강보험공단에서 확인하세요.' },
          { q: '종합소득세 신고 대상은?', a: '프리랜서, 사업소득자, 근로소득 외 소득이 있는 경우 종합소득세 신고를 해야 합니다. 매년 5월이 신고 기간입니다.' },
        ] : [
          { q: 'How is 10% VAT calculated?', a: 'Tax exclusive: supply × 10%. Tax inclusive: total ÷ 1.1 = supply, total - supply = VAT.' },
          { q: 'Is income tax calculation accurate?', a: 'This is an estimate with basic employment and personal deductions only. For official filing, use the NTS Hometax system.' },
          { q: 'Do insurance rates change annually?', a: 'Yes, they are adjusted yearly. This tool uses 2024 rates. Verify exact rates with the National Health Insurance Service.' },
          { q: 'Who needs to file comprehensive income tax?', a: 'Freelancers, business owners, and those with income beyond employment wages. Filing period is May each year.' },
        ]}
        keywords="세금 계산기 · 부가세 계산기 · 소득세 계산기 · 종합소득세 · 4대보험 계산기 · 실수령액 · 세금 계산 · VAT calculator · income tax calculator Korea · 부가가치세 · 근로소득세 · 국민연금 건강보험"
      />
    </div>
  )
}
