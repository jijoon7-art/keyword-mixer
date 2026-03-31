'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '주택담보대출 계산기 (모기지)',
    desc: '아파트·주택 구매 시 주택담보대출 월 상환액, 총 이자, LTV·DTI를 자동 계산. 원리금균등·원금균등 비교.',
    housePrice: '주택 가격 (원)',
    downPayment: '자기자본 (원)',
    loanAmount: '대출 금액',
    rate: '연이율 (%)',
    period: '대출 기간 (년)',
    method: '상환 방식',
    equal: '원리금균등',
    principal: '원금균등',
    income: '연 소득 (DTI 계산용, 원)',
    ltv: 'LTV (주택담보인정비율)',
    dti: 'DTI (총부채상환비율)',
    monthly: '월 상환액 (1회차)',
    totalInterest: '총 이자',
    totalPay: '총 상환액',
  },
  en: {
    title: 'Mortgage / Home Loan Calculator',
    desc: 'Calculate monthly payment, total interest, LTV, and DTI for home purchases. Compare equal payment vs equal principal.',
    housePrice: 'House Price (₩)',
    downPayment: 'Down Payment (₩)',
    loanAmount: 'Loan Amount',
    rate: 'Annual Rate (%)',
    period: 'Loan Period (years)',
    method: 'Repayment Method',
    equal: 'Equal Payment',
    principal: 'Equal Principal',
    income: 'Annual Income (for DTI)',
    ltv: 'LTV (Loan-to-Value)',
    dti: 'DTI (Debt-to-Income)',
    monthly: 'Monthly Payment (1st)',
    totalInterest: 'Total Interest',
    totalPay: 'Total Payment',
  }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function MortgageCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [housePrice, setHousePrice] = useState(500000000)
  const [downPayment, setDownPayment] = useState(150000000)
  const [rate, setRate] = useState(4.5)
  const [period, setPeriod] = useState(30)
  const [method, setMethod] = useState<'equal' | 'principal'>('equal')
  const [income, setIncome] = useState(60000000)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const loan = Math.max(0, housePrice - downPayment)
  const r = rate / 100 / 12
  const n = period * 12

  // 원리금균등
  const monthlyEqual = r > 0 ? loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : loan / n
  const totalEqual = monthlyEqual * n
  const interestEqual = totalEqual - loan

  // 원금균등 1회차
  const principalPart = loan / n
  const interestFirst = loan * r
  const monthly1stPrincipal = principalPart + interestFirst
  // 원금균등 총이자
  let totalInterestPrincipal = 0
  for (let i = 0; i < n; i++) {
    totalInterestPrincipal += (loan - principalPart * i) * r
  }
  const totalPayPrincipal = loan + totalInterestPrincipal

  const monthly1st = method === 'equal' ? monthlyEqual : monthly1stPrincipal
  const totalInterest = method === 'equal' ? interestEqual : totalInterestPrincipal
  const totalPay = method === 'equal' ? totalEqual : totalPayPrincipal

  // LTV
  const ltv = housePrice > 0 ? (loan / housePrice) * 100 : 0
  // DTI
  const dti = income > 0 ? ((monthly1st * 12) / income) * 100 : 0

  const ltvStatus = ltv <= 40 ? { color: 'text-brand-400', label: lang === 'ko' ? '안전' : 'Safe' }
    : ltv <= 60 ? { color: 'text-yellow-400', label: lang === 'ko' ? '보통' : 'Moderate' }
    : { color: 'text-red-400', label: lang === 'ko' ? '높음' : 'High' }

  const dtiStatus = dti <= 40 ? { color: 'text-brand-400', label: lang === 'ko' ? '안전' : 'Safe' }
    : dti <= 50 ? { color: 'text-yellow-400', label: lang === 'ko' ? '주의' : 'Caution' }
    : { color: 'text-red-400', label: lang === 'ko' ? '위험' : 'Risky' }

  const PRICE_PRESETS = [300000000, 500000000, 700000000, 1000000000, 1500000000]

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
        {/* 주택가격 */}
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{tx.housePrice}</label>
          <input type="number" value={housePrice} step={10000000} onChange={e => setHousePrice(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {PRICE_PRESETS.map(p => (
              <button key={p} onClick={() => setHousePrice(p)}
                className={`text-xs px-2.5 py-1 rounded border transition-all ${housePrice === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
                {p >= 100000000 ? `${p / 100000000}억` : `${p / 10000}만`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.downPayment}</label>
            <input type="number" value={downPayment} step={10000000} onChange={e => setDownPayment(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.loanAmount}</label>
            <div className="bg-[#0f1117] border border-brand-500/30 rounded-lg px-3 py-2.5 text-brand-400 text-sm font-mono font-bold">
              ₩{comma(loan)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.rate}</label>
            <input type="number" step={0.1} min={0.1} max={20} value={rate} onChange={e => setRate(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.period}</label>
            <select value={period} onChange={e => setPeriod(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all">
              {[10, 15, 20, 25, 30, 40].map(p => <option key={p} value={p}>{p}{lang === 'ko' ? '년' : 'yr'}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.income}</label>
            <input type="number" value={income} step={1000000} onChange={e => setIncome(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        <div className="flex gap-2">
          {[['equal', tx.equal], ['principal', tx.principal]].map(([v, l]) => (
            <button key={v} onClick={() => setMethod(v as 'equal' | 'principal')}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${method === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 col-span-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">{tx.monthly}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(monthly1st)}</p>
            <p className="text-xs text-slate-500 mt-1">
              {method === 'principal' ? (lang === 'ko' ? '(매월 감소)' : '(Decreasing monthly)') : ''}
            </p>
          </div>
          <button onClick={() => copy(String(Math.round(monthly1st)), 'monthly')}
            className={`p-2.5 rounded-xl border transition-all ${copied === 'monthly' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
            {copied === 'monthly' ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {[
          { label: tx.totalInterest, val: `₩${comma(totalInterest)}`, key: 'ti', color: 'text-red-400' },
          { label: tx.totalPay, val: `₩${comma(totalPay)}`, key: 'tp', color: 'text-slate-200' },
          { label: `${tx.ltv} ${ltvStatus.label}`, val: `${ltv.toFixed(1)}%`, key: 'ltv', color: ltvStatus.color },
          { label: `${tx.dti} ${dtiStatus.label}`, val: `${dti.toFixed(1)}%`, key: 'dti', color: dtiStatus.color },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className={`text-lg font-bold font-mono ${r.color}`}>{r.val}</p>
            </div>
            <button onClick={() => copy(r.val, r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={12} /> : <Copy size={12} />}
            </button>
          </div>
        ))}
      </div>

      {/* 원리금균등 vs 원금균등 비교 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '📊 상환 방식 비교' : '📊 Method Comparison'}</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: tx.equal, monthly: monthlyEqual, interest: interestEqual, active: method === 'equal' },
            { label: tx.principal, monthly: monthly1stPrincipal, interest: totalInterestPrincipal, active: method === 'principal' },
          ].map(m => (
            <div key={m.label} className={`rounded-lg border p-3 ${m.active ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
              <p className={`font-bold mb-2 ${m.active ? 'text-brand-400' : 'text-slate-400'}`}>{m.label}</p>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between"><span className="text-slate-500">{lang === 'ko' ? '월 납입 (1회)' : 'Monthly (1st)'}</span><span className="text-slate-200 font-mono">₩{comma(m.monthly)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">{lang === 'ko' ? '총 이자' : 'Total Interest'}</span><span className="text-red-400 font-mono">₩{comma(m.interest)}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {lang === 'ko'
            ? `💡 원금균등이 원리금균등보다 총 이자 ₩${comma(interestEqual - totalInterestPrincipal)} 더 저렴합니다.`
            : `💡 Equal Principal saves ₩${comma(interestEqual - totalInterestPrincipal)} in total interest vs Equal Payment.`}
        </p>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '주택담보대출 계산기' : 'Mortgage Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/mortgage-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '주택가격·자기자본 입력', desc: '구매할 주택 가격과 본인 자금을 입력하세요.' },
          { step: '대출 조건 설정', desc: '이율, 기간, 상환 방식을 설정하세요.' },
          { step: '월 상환액 확인', desc: '월 납입금과 LTV·DTI 지표를 확인하세요.' },
          { step: '상환 방식 비교', desc: '원리금균등과 원금균등의 총이자 차이를 비교하세요.' },
        ] : [
          { step: 'Enter price and down payment', desc: 'Input house price and your own funds.' },
          { step: 'Set loan terms', desc: 'Set interest rate, period, and repayment method.' },
          { step: 'View monthly payment', desc: 'See monthly payment and LTV/DTI indicators.' },
          { step: 'Compare methods', desc: 'Compare total interest between equal payment and equal principal.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: 'LTV·DTI 자동 계산', desc: 'LTV(주택담보인정비율)와 DTI(총부채상환비율)를 자동으로 계산해 대출 한도를 파악합니다.' },
          { title: '두 방식 비교', desc: '원리금균등과 원금균등의 월 납입액과 총이자를 나란히 비교합니다.' },
          { title: '총이자 절감 안내', desc: '원금균등 선택 시 총이자 절감액을 정확히 알려줍니다.' },
          { title: '주택가격 프리셋', desc: '3억·5억·7억·10억·15억 프리셋으로 빠르게 시뮬레이션합니다.' },
        ] : [
          { title: 'Auto LTV & DTI', desc: 'Calculates Loan-to-Value and Debt-to-Income automatically.' },
          { title: 'Method comparison', desc: 'Side-by-side comparison of monthly payments and total interest.' },
          { title: 'Interest savings', desc: 'Shows exact interest savings when choosing equal principal.' },
          { title: 'Price presets', desc: 'Quick simulation with 300M, 500M, 700M, 1B, 1.5B presets.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'LTV(주택담보인정비율)란?', a: '대출금/주택가격×100. 예: 5억짜리 집에 3억 대출이면 LTV 60%. 일반적으로 투기지역 40%, 투기과열지구 50%, 기타 70%가 최대 한도입니다.' },
          { q: 'DTI(총부채상환비율)란?', a: '연간 대출 상환액/연소득×100. 예: 연소득 6천만원에 연 상환액 1800만원이면 DTI 30%. 보통 40~50%가 기준입니다.' },
          { q: '원리금균등과 원금균등 중 어느 것이 좋나요?', a: '총이자 절감은 원금균등이 유리합니다. 다만 초기 월납입액이 높습니다. 초기 현금 부담이 크지 않다면 원금균등을 권장합니다.' },
          { q: '변동금리 vs 고정금리?', a: '고정금리는 금리 상승 위험이 없는 반면 초기 금리가 높습니다. 변동금리는 금리 하락 시 유리하지만 상승 위험이 있습니다. 이 계산기는 고정금리 기준입니다.' },
        ] : [
          { q: 'What is LTV?', a: 'Loan Amount/House Price×100. E.g., 300M loan on 500M house = LTV 60%. Typical limits: 40% in speculation zones, 50% in overheated zones, 70% elsewhere.' },
          { q: 'What is DTI?', a: 'Annual Loan Payments/Annual Income×100. E.g., ₩18M annual payments on ₩60M income = DTI 30%. Typical limit is 40-50%.' },
          { q: 'Equal payment vs equal principal?', a: 'Equal principal saves on total interest but has higher initial payments. Recommended if you can manage the initial payment burden.' },
          { q: 'Variable vs fixed rate?', a: 'Fixed protects against rate increases but starts higher. Variable benefits from drops but carries rise risk. This calculator uses fixed rates.' },
        ]}
        keywords="주택담보대출 계산기 · 모기지 계산기 · LTV DTI 계산 · 아파트 대출 계산 · 원리금균등 원금균등 · mortgage calculator · home loan calculator · LTV DTI Korea · 주택 대출 이자"
      />
    </div>
  )
}
