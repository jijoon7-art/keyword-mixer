'use client'
import { useState, useMemo } from 'react'
import { Copy, CheckCheck, Download } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '대출 상환표 생성기', desc: '원리금균등·원금균등·만기일시 상환 방식별 월별 상환표 자동 생성. 엑셀 다운로드 지원.', tabs: ['원리금균등', '원금균등', '만기일시'] },
  en: { title: 'Loan Repayment Table Generator', desc: 'Generate monthly loan repayment schedules for equal payment, equal principal, and bullet repayment methods.', tabs: ['Equal Payment', 'Equal Principal', 'Bullet'] }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function LoanRepaymentTable() {
  const { lang } = useLang()
  const tx = T[lang]
  const [principal, setPrincipal] = useState(100000000)
  const [rate, setRate] = useState(4.5)
  const [months, setMonths] = useState(120)
  const [method, setMethod] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const schedule = useMemo(() => {
    const r = rate / 100 / 12
    const rows = []
    let balance = principal

    if (method === 0) {
      // 원리금 균등
      const payment = r === 0 ? principal / months : principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
      for (let i = 1; i <= months; i++) {
        const interest = balance * r
        const principalPart = payment - interest
        balance -= principalPart
        rows.push({ month: i, payment: Math.round(payment), principal: Math.round(principalPart), interest: Math.round(interest), balance: Math.max(0, Math.round(balance)) })
      }
    } else if (method === 1) {
      // 원금 균등
      const principalPart = principal / months
      for (let i = 1; i <= months; i++) {
        const interest = balance * r
        const payment = principalPart + interest
        balance -= principalPart
        rows.push({ month: i, payment: Math.round(payment), principal: Math.round(principalPart), interest: Math.round(interest), balance: Math.max(0, Math.round(balance)) })
      }
    } else {
      // 만기일시
      for (let i = 1; i <= months; i++) {
        const interest = principal * r
        const principalPart = i === months ? principal : 0
        const payment = interest + principalPart
        balance = i === months ? 0 : principal
        rows.push({ month: i, payment: Math.round(payment), principal: Math.round(principalPart), interest: Math.round(interest), balance: Math.round(balance) })
      }
    }
    return rows
  }, [principal, rate, months, method])

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0)
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0)

  const copyCSV = async () => {
    const header = `월,납입액,원금,이자,잔액\n`
    const body = schedule.map(r => `${r.month},${r.payment},${r.principal},${r.interest},${r.balance}`).join('\n')
    await navigator.clipboard.writeText(header + body)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const displayRows = showAll ? schedule : schedule.slice(0, 12)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex rounded-xl border border-surface-border overflow-hidden mb-4">
          {tx.tabs.map((t, i) => (
            <button key={i} onClick={() => setMethod(i)}
              className={`flex-1 py-2 text-xs font-medium transition-all ${method === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#0f1117] text-slate-300 hover:text-white'}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: lang === 'ko' ? '대출금액 (원)' : 'Loan Amount (₩)', val: principal, set: setPrincipal, step: 1000000 },
            { label: lang === 'ko' ? '연이율 (%)' : 'Annual Rate (%)', val: rate, set: setRate, step: 0.1 },
            { label: lang === 'ko' ? '상환기간 (개월)' : 'Term (months)', val: months, set: setMonths, step: 12 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <input type="number" value={f.val} step={f.step} onChange={e => f.set(Number(e.target.value))}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: lang === 'ko' ? '총 상환액' : 'Total Payment', val: `₩${comma(totalPayment)}`, highlight: true },
          { label: lang === 'ko' ? '총 이자' : 'Total Interest', val: `₩${comma(totalInterest)}`, highlight: false },
          { label: lang === 'ko' ? '이자 비율' : 'Interest Ratio', val: `${((totalInterest / totalPayment) * 100).toFixed(1)}%`, highlight: false },
        ].map(r => (
          <div key={r.label} className={`rounded-xl border p-3 text-center ${r.highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
            <p className={`text-lg font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
            <p className="text-xs text-slate-500 mt-0.5">{r.label}</p>
          </div>
        ))}
      </div>

      {/* 상환표 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
          <p className="text-sm font-semibold text-slate-200">{lang === 'ko' ? '월별 상환표' : 'Monthly Schedule'}</p>
          <button onClick={copyCSV} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />} {lang === 'ko' ? 'CSV 복사' : 'Copy CSV'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-[#0f1117]">
                {[lang === 'ko' ? '회차' : 'No.', lang === 'ko' ? '납입액' : 'Payment', lang === 'ko' ? '원금' : 'Principal', lang === 'ko' ? '이자' : 'Interest', lang === 'ko' ? '잔액' : 'Balance'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-slate-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {displayRows.map(r => (
                <tr key={r.month} className="hover:bg-surface-hover/10 transition-all">
                  <td className="px-3 py-2 text-slate-400 font-mono">{r.month}</td>
                  <td className="px-3 py-2 text-slate-200 font-mono font-medium">₩{comma(r.payment)}</td>
                  <td className="px-3 py-2 text-brand-400 font-mono">₩{comma(r.principal)}</td>
                  <td className="px-3 py-2 text-red-400 font-mono">₩{comma(r.interest)}</td>
                  <td className="px-3 py-2 text-slate-400 font-mono">₩{comma(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {schedule.length > 12 && (
          <button onClick={() => setShowAll(!showAll)} className="w-full py-2.5 text-xs text-slate-400 hover:text-brand-400 border-t border-surface-border transition-all">
            {showAll ? (lang === 'ko' ? '접기' : 'Collapse') : (lang === 'ko' ? `나머지 ${schedule.length - 12}개월 더보기` : `Show all ${schedule.length - 12} more months`)}
          </button>
        )}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '대출 상환표 생성기' : 'Loan Repayment Table'}
        toolUrl="https://keyword-mixer.vercel.app/loan-repayment-table"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '상환 방식 선택', desc: '원리금균등, 원금균등, 만기일시 상환 중 해당 방식을 선택하세요.' },
          { step: '대출 정보 입력', desc: '대출금액, 연이율, 상환기간(개월)을 입력하세요.' },
          { step: '상환표 확인', desc: '월별 납입액, 원금, 이자, 잔액이 자동으로 계산됩니다.' },
          { step: 'CSV 복사', desc: 'CSV 복사 버튼으로 전체 상환표를 엑셀에서 사용하세요.' },
        ] : [
          { step: 'Select repayment method', desc: 'Choose equal payment, equal principal, or bullet repayment.' },
          { step: 'Enter loan details', desc: 'Input loan amount, annual rate, and term in months.' },
          { step: 'View schedule', desc: 'Monthly payment, principal, interest, and balance are auto-calculated.' },
          { step: 'Copy CSV', desc: 'Copy the full schedule as CSV for use in Excel.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 상환 방식', desc: '원리금균등·원금균등·만기일시 상환표를 모두 지원합니다.' },
          { title: '전체 상환표', desc: '만기까지 월별 상세 납입 내역을 확인할 수 있습니다.' },
          { title: 'CSV 내보내기', desc: '전체 상환표를 CSV로 복사해 엑셀에서 활용할 수 있습니다.' },
          { title: '총 이자 비용', desc: '총 상환액과 총 이자를 한눈에 비교할 수 있습니다.' },
        ] : [
          { title: '3 repayment methods', desc: 'Equal payment, equal principal, and bullet repayment schedules.' },
          { title: 'Full schedule', desc: 'View detailed monthly payment breakdown until maturity.' },
          { title: 'CSV export', desc: 'Copy entire schedule as CSV for Excel analysis.' },
          { title: 'Total interest cost', desc: 'Compare total repayment and total interest at a glance.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '원리금균등과 원금균등 차이는?', a: '원리금균등은 매월 동일금액 납입. 원금균등은 원금은 고정, 이자가 줄어들어 초기 납입액이 높지만 총 이자가 적습니다.' },
          { q: '어떤 상환 방식이 유리한가요?', a: '총 이자 부담: 원금균등 < 원리금균등 < 만기일시 순입니다. 하지만 초기 납입 부담은 반대입니다.' },
          { q: '중도 상환 수수료는?', a: '이 계산기는 중도상환 수수료를 포함하지 않습니다. 실제 은행 대출 계약서를 확인하세요.' },
          { q: '고정금리와 변동금리란?', a: '고정금리는 상환 기간 동안 이율이 변하지 않고, 변동금리는 시장 금리에 따라 바뀝니다. 이 계산기는 고정금리 기준입니다.' },
        ] : [
          { q: 'Difference between equal payment and equal principal?', a: 'Equal payment: same amount every month. Equal principal: fixed principal, decreasing interest. Less total interest but higher initial payments.' },
          { q: 'Which method is more advantageous?', a: 'Total interest burden: equal principal < equal payment < bullet. But initial payment burden is the reverse.' },
          { q: 'What about prepayment penalties?', a: 'This calculator does not include prepayment penalties. Check your actual loan agreement.' },
          { q: 'Fixed vs variable rate?', a: 'Fixed rate stays constant throughout. Variable rate changes with market rates. This calculator uses fixed rates.' },
        ]}
        keywords="대출 상환표 · 대출 계산기 · 원리금균등 계산 · 원금균등 계산 · 상환 일정 · 대출 이자 계산 · loan repayment table · loan amortization · mortgage calculator · loan schedule · monthly payment calculator"
      />
    </div>
  )
}
