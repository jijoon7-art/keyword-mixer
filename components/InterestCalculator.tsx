'use client'

import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '이자 계산기',
    desc: '예금·적금·대출 이자 즉시 계산. 단리/복리, 세전/세후 수익 비교.',
    tabs: ['예금 이자', '적금 이자', '대출 이자'],
    principal: '원금',
    rate: '연이율 (%)',
    months: '기간 (개월)',
    taxType: '이자 과세',
    tax15: '일반과세 (15.4%)',
    taxFree: '비과세',
    interestType: '이자 유형',
    simple: '단리',
    compound: '복리',
    monthly: '월 납입액',
    result: '계산 결과',
    totalInterest: '세전 이자',
    tax: '세금 (15.4%)',
    afterTax: '세후 이자',
    totalAmount: '최종 수령액',
    monthlyPayment: '월 상환액',
    totalRepayment: '총 상환액',
    totalInterestPaid: '총 이자',
  },
  en: {
    title: 'Interest Calculator',
    desc: 'Calculate savings & loan interest instantly. Compare simple/compound interest, pre/post-tax.',
    tabs: ['Savings', 'Installment', 'Loan'],
    principal: 'Principal',
    rate: 'Annual Rate (%)',
    months: 'Period (months)',
    taxType: 'Tax Type',
    tax15: 'General Tax (15.4%)',
    taxFree: 'Tax-Free',
    interestType: 'Interest Type',
    simple: 'Simple',
    compound: 'Compound',
    monthly: 'Monthly Payment',
    result: 'Result',
    totalInterest: 'Pre-tax Interest',
    tax: 'Tax (15.4%)',
    afterTax: 'After-tax Interest',
    totalAmount: 'Total Amount',
    monthlyPayment: 'Monthly Payment',
    totalRepayment: 'Total Repayment',
    totalInterestPaid: 'Total Interest',
  }
}

function comma(n: number) {
  return Math.round(n).toLocaleString('ko-KR')
}

export default function InterestCalculator() {
  const { lang } = useLang()
  const tx = T[lang]

  const [tab, setTab] = useState(0)
  const [principal, setPrincipal] = useState(10000000)
  const [rate, setRate] = useState(3.5)
  const [months, setMonths] = useState(12)
  const [taxFree, setTaxFree] = useState(false)
  const [compound, setCompound] = useState(false)
  const [monthly, setMonthly] = useState(300000)

  const TAX_RATE = 0.154

  // 예금 계산
  const depositCalc = () => {
    let interest = 0
    if (compound) {
      const r = rate / 100 / 12
      interest = principal * (Math.pow(1 + r, months) - 1)
    } else {
      interest = principal * (rate / 100) * (months / 12)
    }
    const tax = taxFree ? 0 : interest * TAX_RATE
    return { interest, tax, afterTax: interest - tax, total: principal + interest - tax }
  }

  // 적금 계산
  const installmentCalc = () => {
    let total = 0
    const r = rate / 100 / 12
    for (let i = 1; i <= months; i++) {
      total += monthly * (1 + r * (months - i + 1))
    }
    const totalPrincipal = monthly * months
    const interest = total - totalPrincipal
    const tax = taxFree ? 0 : interest * TAX_RATE
    return { interest, tax, afterTax: interest - tax, total: totalPrincipal + interest - tax, totalPrincipal }
  }

  // 대출 계산 (원리금 균등)
  const loanCalc = () => {
    const r = rate / 100 / 12
    const payment = r === 0 ? principal / months : principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
    const totalRepayment = payment * months
    const totalInterest = totalRepayment - principal
    return { payment, totalRepayment, totalInterest }
  }

  const dep = depositCalc()
  const ins = installmentCalc()
  const loan = loanCalc()

  const SLIDERS = [
    { label: tx.principal, val: tab === 1 ? monthly : principal, set: tab === 1 ? setMonthly : setPrincipal, min: 100000, max: 500000000, step: 100000, display: `₩${comma(tab === 1 ? monthly : principal)}` },
    { label: tx.rate, val: rate, set: setRate, min: 0.1, max: 20, step: 0.1, display: `${rate}%` },
    { label: tx.months, val: months, set: setMonths, min: 1, max: 120, step: 1, display: `${months}${lang === 'ko' ? '개월' : 'mo'}` },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 탭 */}
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {tx.tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        {/* 슬라이더 */}
        <div className="flex flex-col gap-4 mb-4">
          {SLIDERS.map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm text-slate-300">{s.label}</label>
                <span className="text-sm text-brand-400 font-mono font-bold">{s.display}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                onChange={e => s.set(parseFloat(e.target.value))}
                className="w-full accent-green-500" />
            </div>
          ))}
        </div>

        {/* 옵션 */}
        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setTaxFree(!taxFree)} className={`w-10 h-5 rounded-full relative transition-all ${taxFree ? 'bg-brand-500' : 'bg-surface-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${taxFree ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-300">{tx.taxFree}</span>
          </label>
          {tab < 2 && (
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => setCompound(!compound)} className={`w-10 h-5 rounded-full relative transition-all ${compound ? 'bg-brand-500' : 'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow ${compound ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm text-slate-300">{tx.compound}</span>
            </label>
          )}
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        <p className="text-sm font-semibold text-slate-200 mb-4">{tx.result}</p>
        {tab < 2 ? (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: tx.totalInterest, val: `₩${comma(tab === 0 ? dep.interest : ins.interest)}` },
              { label: tx.tax, val: taxFree ? lang === 'ko' ? '비과세' : 'Tax-free' : `₩${comma(tab === 0 ? dep.tax : ins.tax)}` },
              { label: tx.afterTax, val: `₩${comma(tab === 0 ? dep.afterTax : ins.afterTax)}`, highlight: true },
              { label: tx.totalAmount, val: `₩${comma(tab === 0 ? dep.total : ins.total)}`, highlight: true },
            ].map(r => (
              <div key={r.label} className={`rounded-xl border p-4 text-center ${(r as any).highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
                <p className={`text-lg font-bold font-mono ${(r as any).highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
                <p className="text-xs text-slate-500 mt-1">{r.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: tx.monthlyPayment, val: `₩${comma(loan.payment)}`, highlight: true },
              { label: tx.totalRepayment, val: `₩${comma(loan.totalRepayment)}` },
              { label: tx.totalInterestPaid, val: `₩${comma(loan.totalInterest)}` },
            ].map(r => (
              <div key={r.label} className={`rounded-xl border p-4 text-center ${(r as any).highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
                <p className={`text-base font-bold font-mono ${(r as any).highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
                <p className="text-xs text-slate-500 mt-1">{r.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '이자 계산기' : 'Interest Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/interest-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '계산 유형 선택', desc: '예금, 적금, 대출 중 원하는 탭을 선택하세요.' },
          { step: '금액과 이율 설정', desc: '슬라이더로 원금(월 납입액), 연이율, 기간을 설정하세요.' },
          { step: '옵션 설정', desc: '비과세 여부와 복리 적용 여부를 선택하세요.' },
          { step: '결과 확인', desc: '세전/세후 이자, 최종 수령액을 즉시 확인하세요.' },
        ] : [
          { step: 'Select calculator type', desc: 'Choose Savings, Installment, or Loan tab.' },
          { step: 'Set amount and rate', desc: 'Adjust principal, annual rate, and period with sliders.' },
          { step: 'Configure options', desc: 'Toggle tax-free and compound interest options.' },
          { step: 'View results', desc: 'See pre/after-tax interest and total amount instantly.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 계산기 통합', desc: '예금·적금·대출 이자를 한 페이지에서 모두 계산합니다.' },
          { title: '세후 수익 계산', desc: '15.4% 이자소득세를 자동 반영한 실제 수령액을 보여줍니다.' },
          { title: '단리/복리 비교', desc: '단리와 복리 이자를 즉시 비교해 유리한 상품을 선택하세요.' },
          { title: '슬라이더 방식', desc: '숫자 입력 없이 슬라이더로 직관적으로 조절할 수 있습니다.' },
        ] : [
          { title: '3-in-1 calculator', desc: 'Savings, installment, and loan interest all in one page.' },
          { title: 'After-tax calculation', desc: 'Automatically calculates 15.4% Korean interest tax.' },
          { title: 'Simple vs compound', desc: 'Compare simple and compound interest side by side.' },
          { title: 'Slider interface', desc: 'Intuitive sliders for easy adjustment without typing.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '이자소득세 15.4%는 어떻게 계산되나요?', a: '이자의 14%가 소득세, 1.4%가 지방소득세입니다. 합계 15.4%가 원천징수됩니다.' },
          { q: '비과세 상품은 어떤 게 있나요?', a: 'ISA(개인종합자산관리계좌), 청년희망적금, 농어촌 특례 등이 있습니다. 가입 조건 확인 후 활용하세요.' },
          { q: '복리와 단리 차이는?', a: '단리는 원금에만 이자가 붙고, 복리는 이자에도 이자가 붙습니다. 장기 투자일수록 복리 효과가 크게 나타납니다.' },
          { q: '적금 이자는 왜 예금보다 적나요?', a: '적금은 매월 납입하므로 첫 달 납입금은 전체 기간, 마지막 달 납입금은 1개월만 이자가 붙습니다. 실효이율은 약 절반 수준입니다.' },
        ] : [
          { q: 'What is the Korean interest tax rate?', a: '15.4% total (14% income tax + 1.4% local income tax) is withheld from interest earnings.' },
          { q: 'What are tax-free savings options in Korea?', a: 'ISA (Individual Savings Account), Youth Hope Savings, and agricultural cooperative accounts offer tax exemptions.' },
          { q: 'Difference between simple and compound interest?', a: 'Simple interest is calculated only on principal. Compound interest is calculated on principal plus accumulated interest.' },
          { q: 'Why is installment savings interest lower?', a: 'Monthly deposits earn interest for shorter periods. The effective rate is roughly half the stated annual rate.' },
        ]}
        keywords="이자 계산기 · 예금 이자 · 적금 계산기 · 대출 이자 · 세후 이자 · 복리 계산 · interest calculator · savings calculator · deposit interest · installment savings Korea · compound interest calculator"
      />
    </div>
  )
}
