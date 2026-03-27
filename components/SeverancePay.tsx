'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '퇴직금 계산기',
    desc: '근속연수·평균임금으로 법정 퇴직금을 정확히 계산. 퇴직소득세 공제 후 실수령액과 IRP(개인형 퇴직연금) 세금 혜택도 계산.',
    startDate: '입사일', endDate: '퇴직일',
    monthlySalary: '월 기본급 (원)',
    bonus: '연간 상여금 합계 (원)',
    allowance: '연간 기타수당 합계 (원)',
    result: '퇴직금 계산 결과',
    severance: '법정 퇴직금',
    avgWage: '1일 평균임금',
    workDays: '근속일수',
    workYears: '근속연수',
    taxAmount: '퇴직소득세',
    netAmount: '세후 실수령액',
  },
  en: {
    title: 'Severance Pay Calculator',
    desc: 'Calculate legally required severance pay from tenure and average wage. Includes retirement income tax and IRP benefits.',
    startDate: 'Start Date', endDate: 'End Date',
    monthlySalary: 'Monthly Base Salary (₩)',
    bonus: 'Annual Bonus Total (₩)',
    allowance: 'Annual Allowances Total (₩)',
    result: 'Severance Pay Result',
    severance: 'Legal Severance',
    avgWage: 'Daily Avg Wage',
    workDays: 'Days Worked',
    workYears: 'Years of Service',
    taxAmount: 'Retirement Tax',
    netAmount: 'Net After Tax',
  }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

function calcRetirementTax(severance: number, yearsOfService: number): number {
  // 퇴직소득세 간이 계산 (2024년 기준)
  // 근속연수 공제
  let tenure_deduct = 0
  if (yearsOfService <= 5) tenure_deduct = yearsOfService * 300000
  else if (yearsOfService <= 10) tenure_deduct = 1500000 + (yearsOfService - 5) * 500000
  else if (yearsOfService <= 20) tenure_deduct = 4000000 + (yearsOfService - 10) * 800000
  else tenure_deduct = 12000000 + (yearsOfService - 20) * 1200000

  const after_tenure = Math.max(0, severance - tenure_deduct)
  // 환산급여 (×12/근속연수)
  const annual_equiv = (after_tenure * 12) / Math.max(1, yearsOfService)
  // 환산급여공제
  let equiv_deduct = 0
  if (annual_equiv <= 8000000) equiv_deduct = annual_equiv * 0.8
  else if (annual_equiv <= 70000000) equiv_deduct = 6400000 + (annual_equiv - 8000000) * 0.6
  else if (annual_equiv <= 150000000) equiv_deduct = 43600000 + (annual_equiv - 70000000) * 0.55
  else equiv_deduct = 87600000 + (annual_equiv - 150000000) * 0.45

  const taxable = Math.max(0, annual_equiv - equiv_deduct)
  // 기본세율 적용
  let tax = 0
  if (taxable <= 14000000) tax = taxable * 0.06
  else if (taxable <= 50000000) tax = 840000 + (taxable - 14000000) * 0.15
  else if (taxable <= 88000000) tax = 6240000 + (taxable - 50000000) * 0.24
  else if (taxable <= 150000000) tax = 15360000 + (taxable - 88000000) * 0.35
  else tax = 37060000 + (taxable - 150000000) * 0.38

  // 환산세액 = 산출세액 × 근속연수/12
  const final_tax = (tax * yearsOfService) / 12
  // 지방세 10%
  return Math.round(final_tax * 1.1)
}

export default function SeverancePay() {
  const { lang } = useLang()
  const tx = T[lang]

  const [startDate, setStartDate] = useState('2019-03-01')
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [monthlySalary, setMonthlySalary] = useState(3500000)
  const [bonus, setBonus] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [showDetail, setShowDetail] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const workDays = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
  const workYears = workDays / 365

  // 평균임금 계산 (최근 3개월 기준)
  const monthly3 = monthlySalary * 3 + (bonus / 12) * 3 + (allowance / 12) * 3
  const avgDailyWage = monthly3 / 90  // 3개월=90일

  // 퇴직금 = 평균임금 × 30일 × (근속일수/365)
  const severance = avgDailyWage * 30 * (workDays / 365)

  // 1년 미만이면 0
  const actualSeverance = workDays >= 365 ? severance : 0

  // 퇴직소득세
  const retirementTax = workDays >= 365 ? calcRetirementTax(actualSeverance, Math.floor(workYears)) : 0
  const netAmount = actualSeverance - retirementTax

  // IRP 이전 시 세금 55% 경감
  const irpTaxBenefit = Math.round(retirementTax * 0.55)

  // 근속 연수/월 계산
  const totalMonths = Math.floor(workDays / 30.44)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
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
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.startDate}</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.endDate}</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: tx.monthlySalary, val: monthlySalary, set: setMonthlySalary, step: 100000 },
            { label: tx.bonus, val: bonus, set: setBonus, step: 100000 },
            { label: tx.allowance, val: allowance, set: setAllowance, step: 100000 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
              <input type="number" value={f.val} step={f.step} onChange={e => f.set(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-base font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>

        {/* 근속기간 표시 */}
        <div className="mt-3 rounded-lg border border-surface-border bg-[#0f1117] px-3 py-2 flex justify-between text-xs">
          <span className="text-slate-400">{lang === 'ko' ? '근속 기간' : 'Tenure'}</span>
          <span className="text-brand-400 font-bold font-mono">
            {years}{lang === 'ko' ? '년' : 'yr'} {months}{lang === 'ko' ? '개월' : 'mo'} ({workDays.toLocaleString()}{lang === 'ko' ? '일' : 'd'})
          </span>
        </div>
      </div>

      {/* 결과 카드 */}
      {workDays < 365 ? (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-4 text-center">
          <p className="text-yellow-400 font-bold text-lg mb-1">⚠️ {lang === 'ko' ? '퇴직금 미발생' : 'No Severance'}</p>
          <p className="text-slate-400 text-sm">{lang === 'ko' ? '퇴직금은 1년 이상 근속 시 발생합니다. 현재 근속일수: ' : 'Severance requires 1+ year of service. Current: '}{workDays}{lang === 'ko' ? '일' : ' days'}</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">{tx.severance}</p>
                <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(actualSeverance)}</p>
              </div>
              <button onClick={() => copy(String(Math.round(actualSeverance)), 'sev')}
                className={`p-2.5 rounded-xl border transition-all ${copied === 'sev' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
                {copied === 'sev' ? <CheckCheck size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: tx.avgWage, val: `₩${comma(avgDailyWage)}/${lang === 'ko' ? '일' : 'd'}`, key: 'avg' },
                { label: tx.taxAmount, val: `-₩${comma(retirementTax)}`, key: 'tax', red: true },
                { label: tx.netAmount, val: `₩${comma(netAmount)}`, key: 'net', green: true },
              ].map(r => (
                <div key={r.key} className={`flex justify-between items-center text-sm py-1.5 border-b border-brand-500/20 last:border-0 ${r.green ? 'border-t border-brand-500/40 mt-1 pt-2' : ''}`}>
                  <span className="text-slate-400">{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold ${r.red ? 'text-red-400' : r.green ? 'text-brand-300 text-lg' : 'text-slate-200'}`}>{r.val}</span>
                    <button onClick={() => copy(r.val.replace(/[₩,+\-]/g, ''), r.key)}
                      className={`p-1 rounded border transition-all ${copied === r.key ? 'text-brand-400 border-brand-500/40' : 'text-slate-600 border-surface-border hover:text-brand-400'}`}>
                      {copied === r.key ? <CheckCheck size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IRP 혜택 */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 mb-4">
            <p className="text-xs text-blue-400 font-bold mb-1">💡 IRP(개인형 퇴직연금) 이전 시 절세 혜택</p>
            <p className="text-sm text-slate-300">
              {lang === 'ko'
                ? `퇴직금을 IRP로 이전하면 퇴직소득세 55% 절감 → 약 ₩${comma(irpTaxBenefit)} 절세`
                : `Transferring to IRP reduces retirement tax by 55% → ~₩${comma(irpTaxBenefit)} saved`}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ko' ? '* IRP 이전 후 55세 이후 수령 시 연금소득세(3.3~5.5%)만 납부' : '* After transfer, pay only pension income tax (3.3-5.5%) when withdrawn after age 55'}
            </p>
          </div>

          {/* 상세 내역 */}
          <button onClick={() => setShowDetail(!showDetail)}
            className="text-xs text-brand-400 hover:text-brand-300 transition-all mb-2">
            {showDetail ? '▲' : '▼'} {lang === 'ko' ? '계산 상세 내역 보기' : 'Show calculation details'}
          </button>
          {showDetail && (
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-xs">
              <div className="flex flex-col gap-2">
                {[
                  [lang === 'ko' ? '최근 3개월 총임금' : '3-month Total', `₩${comma(monthly3)}`],
                  [lang === 'ko' ? '1일 평균임금 (÷90일)' : 'Daily Avg (÷90d)', `₩${comma(avgDailyWage)}`],
                  [lang === 'ko' ? '퇴직금 공식' : 'Formula', `₩${comma(avgDailyWage)} × 30 × ${(workDays / 365).toFixed(2)}`],
                  [lang === 'ko' ? '근속일수' : 'Days', `${workDays.toLocaleString()}${lang === 'ko' ? '일' : 'd'}`],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between">
                    <span className="text-slate-500">{l}</span>
                    <span className="text-slate-300 font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '퇴직금 계산기' : 'Severance Pay Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/severance-pay"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '입사일·퇴직일 입력', desc: '정확한 입사일과 퇴직 예정일을 선택하세요.' },
          { step: '임금 정보 입력', desc: '월 기본급, 연간 상여금, 기타수당을 입력하세요.' },
          { step: '퇴직금 확인', desc: '법정 퇴직금과 퇴직소득세 공제 후 실수령액을 확인하세요.' },
          { step: 'IRP 절세 확인', desc: 'IRP로 이전할 경우 절세 혜택을 확인하세요.' },
        ] : [
          { step: 'Enter start/end dates', desc: 'Select your exact start date and resignation date.' },
          { step: 'Enter wage info', desc: 'Input monthly base salary, annual bonus, and allowances.' },
          { step: 'View severance', desc: 'See legal severance pay and net amount after retirement tax.' },
          { step: 'Check IRP benefit', desc: 'See tax savings if transferring to IRP pension account.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '법정 퇴직금 공식 적용', desc: '고용노동부 기준 평균임금×30일×근속연수 공식을 정확히 적용합니다.' },
          { title: '퇴직소득세 자동 계산', desc: '2024년 기준 퇴직소득세와 지방소득세까지 계산합니다.' },
          { title: 'IRP 절세 혜택 안내', desc: 'IRP 이전 시 퇴직소득세 55% 절감 혜택을 알려줍니다.' },
          { title: '상세 계산 과정', desc: '평균임금 산정 등 계산 과정을 투명하게 공개합니다.' },
        ] : [
          { title: 'Legal formula applied', desc: 'Accurately applies Ministry of Labor formula: daily wage×30×years.' },
          { title: 'Auto retirement tax', desc: 'Calculates 2024 retirement income tax including local tax.' },
          { title: 'IRP tax benefit', desc: 'Shows 55% tax reduction when transferring to IRP account.' },
          { title: 'Transparent calculation', desc: 'Shows full calculation process including average wage derivation.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '퇴직금 계산 공식은?', a: '퇴직금 = 1일 평균임금 × 30 × (재직일수/365). 평균임금은 퇴직 전 3개월간의 총임금을 90일로 나눕니다.' },
          { q: '1년 미만 근무하면 퇴직금이 없나요?', a: '네. 근로기준법상 1년 이상 근속한 경우에만 퇴직금이 발생합니다. 단, 계약직의 경우 계약 만료 시에도 발생합니다.' },
          { q: '상여금은 퇴직금 계산에 포함되나요?', a: '네. 1년간 지급된 상여금을 12개월로 나누어 3개월치를 평균임금에 포함합니다. 연간 상여금란에 입력하세요.' },
          { q: 'IRP가 뭔가요?', a: '개인형 퇴직연금(Individual Retirement Pension). 퇴직금을 이 계좌로 이전하면 55세 이후 수령 시 세금이 크게 줄어듭니다.' },
        ] : [
          { q: 'Severance pay formula?', a: 'Severance = Daily avg wage × 30 × (days worked/365). Daily avg wage = last 3 months total wages ÷ 90 days.' },
          { q: 'No severance if under 1 year?', a: 'Correct. Labor Standards Act requires 1+ year of continuous service. Applies to contract workers at contract end too.' },
          { q: 'Is bonus included in severance?', a: 'Yes. Annual bonus ÷ 12 months × 3 months is included in avg wage calculation. Enter in annual bonus field.' },
          { q: 'What is IRP?', a: 'Individual Retirement Pension account. Transferring severance here significantly reduces tax when withdrawn after age 55.' },
        ]}
        keywords="퇴직금 계산기 · 퇴직금 계산 · 법정 퇴직금 · 퇴직소득세 계산 · IRP 퇴직금 · 퇴직금 얼마 · severance pay calculator · Korea severance · retirement pay calculation"
      />
    </div>
  )
}
