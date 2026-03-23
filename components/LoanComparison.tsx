'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '대출 비교 계산기',
    desc: '여러 대출 상품을 한번에 비교. 원리금균등·원금균등·이자만 납부 방식별 총 이자 비교.',
    addLoan: '대출 상품 추가',
    name: '상품명',
    principal: '대출금액',
    rate: '연이율 (%)',
    months: '기간 (개월)',
    method: '상환방식',
    methods: ['원리금균등', '원금균등', '이자만'],
    monthly: '월 납입액',
    totalInterest: '총 이자',
    totalPay: '총 상환액',
    compare: '비교 결과',
    best: '최저 이자',
  },
  en: {
    title: 'Loan Comparison Calculator',
    desc: 'Compare multiple loan products at once. Compare total interest for equal payment, equal principal, and interest-only methods.',
    addLoan: 'Add Loan',
    name: 'Product Name',
    principal: 'Loan Amount',
    rate: 'Annual Rate (%)',
    months: 'Term (months)',
    method: 'Repayment',
    methods: ['Equal Payment', 'Equal Principal', 'Interest Only'],
    monthly: 'Monthly',
    totalInterest: 'Total Interest',
    totalPay: 'Total Payment',
    compare: 'Comparison',
    best: 'Lowest Interest',
  }
}

interface Loan { id: number; name: string; principal: number; rate: number; months: number; method: number }

function calcLoan(loan: Loan) {
  const r = loan.rate / 100 / 12
  const n = loan.months
  const p = loan.principal

  let monthlyFirst = 0, totalInterest = 0

  if (loan.method === 0) {
    // 원리금균등
    if (r === 0) { monthlyFirst = p / n; totalInterest = 0 }
    else {
      monthlyFirst = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
      totalInterest = monthlyFirst * n - p
    }
  } else if (loan.method === 1) {
    // 원금균등
    const principalPart = p / n
    monthlyFirst = principalPart + p * r
    let interest = 0
    let balance = p
    for (let i = 0; i < n; i++) {
      interest += balance * r
      balance -= principalPart
    }
    totalInterest = interest
  } else {
    // 이자만 (만기일시)
    monthlyFirst = p * r
    totalInterest = monthlyFirst * n
  }

  return {
    monthlyFirst: Math.round(monthlyFirst),
    totalInterest: Math.round(totalInterest),
    totalPay: Math.round(p + totalInterest),
  }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function LoanComparison() {
  const { lang } = useLang()
  const tx = T[lang]
  const [loans, setLoans] = useState<Loan[]>([
    { id: 1, name: lang === 'ko' ? '은행 A' : 'Bank A', principal: 100000000, rate: 4.5, months: 120, method: 0 },
    { id: 2, name: lang === 'ko' ? '은행 B' : 'Bank B', principal: 100000000, rate: 5.0, months: 120, method: 0 },
    { id: 3, name: lang === 'ko' ? '카드론 C' : 'Card Loan C', principal: 100000000, rate: 6.5, months: 60, method: 1 },
  ])
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const addLoan = () => setLoans(p => [...p, { id: Date.now(), name: `${lang === 'ko' ? '상품' : 'Product'} ${p.length + 1}`, principal: 100000000, rate: 4.0, months: 120, method: 0 }])
  const removeLoan = (id: number) => setLoans(p => p.filter(l => l.id !== id))
  const update = (id: number, k: keyof Loan, v: string | number) => setLoans(p => p.map(l => l.id === id ? { ...l, [k]: v } : l))

  const results = loans.map(l => ({ ...l, ...calcLoan(l) }))
  const minInterest = Math.min(...results.map(r => r.totalInterest))

  const COLORS = ['brand', 'blue', 'purple', 'orange', 'red']
  const COLOR_MAP: Record<string, string> = {
    brand: 'text-brand-400 border-brand-500/30 bg-brand-500/5',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
    orange: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
    red: 'text-red-400 border-red-500/30 bg-red-500/5',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 대출 입력 카드들 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {loans.map((loan, i) => {
          const color = COLORS[i % COLORS.length]
          const colorCls = COLOR_MAP[color]
          return (
            <div key={loan.id} className={`rounded-xl border p-4 ${colorCls}`}>
              <div className="flex items-center justify-between mb-3">
                <input value={loan.name} onChange={e => update(loan.id, 'name', e.target.value)}
                  className={`text-sm font-bold bg-transparent focus:outline-none border-b border-current/30 pb-0.5 ${colorCls.split(' ')[0]} w-full`} />
                {loans.length > 1 && (
                  <button onClick={() => removeLoan(loan.id)} className="ml-2 text-slate-500 hover:text-red-400 transition-all flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: tx.principal, key: 'principal' as const, step: 1000000 },
                  { label: tx.rate, key: 'rate' as const, step: 0.1 },
                  { label: tx.months, key: 'months' as const, step: 12 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-slate-400 mb-0.5 block">{f.label}</label>
                    <input type="number" value={loan[f.key]} step={f.step} onChange={e => update(loan.id, f.key, +e.target.value)}
                      className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-1.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-slate-400 mb-0.5 block">{tx.method}</label>
                  <select value={loan.method} onChange={e => update(loan.id, 'method', +e.target.value)}
                    className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-brand-500/50 transition-all">
                    {tx.methods.map((m, mi) => <option key={mi} value={mi}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )
        })}
        {loans.length < 5 && (
          <button onClick={addLoan} className="rounded-xl border border-dashed border-surface-border hover:border-brand-500/40 p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-brand-400 transition-all min-h-[200px]">
            <Plus size={16} /> {tx.addLoan}
          </button>
        )}
      </div>

      {/* 비교 결과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <p className="text-sm font-semibold text-slate-200">{tx.compare}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-4 py-3 text-left text-slate-400 font-medium">{tx.name}</th>
                <th className="px-4 py-3 text-right text-slate-400 font-medium">{tx.monthly}</th>
                <th className="px-4 py-3 text-right text-slate-400 font-medium">{tx.totalInterest}</th>
                <th className="px-4 py-3 text-right text-slate-400 font-medium">{tx.totalPay}</th>
                <th className="px-4 py-3 text-center text-slate-400 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {results.map((r, i) => {
                const isBest = r.totalInterest === minInterest
                const color = COLORS[i % COLORS.length]
                return (
                  <tr key={r.id} className={`hover:bg-surface-hover/10 transition-all ${isBest ? 'bg-brand-500/5' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`font-bold ${COLOR_MAP[color].split(' ')[0]}`}>{r.name}</p>
                        <p className="text-slate-500">{r.rate}% · {r.months}{lang === 'ko' ? '개월' : 'mo'} · {tx.methods[r.method]}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">₩{comma(r.monthlyFirst)}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      <span className={isBest ? 'text-brand-400 font-bold' : 'text-red-400'}>₩{comma(r.totalInterest)}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">₩{comma(r.totalPay)}</td>
                    <td className="px-4 py-3 text-center">
                      {isBest ? <span className="text-brand-400 text-xs font-bold">✓ {tx.best}</span> : ''}
                      <button onClick={() => copy(`${r.name}: 월 ₩${comma(r.monthlyFirst)}, 총이자 ₩${comma(r.totalInterest)}`, `r${r.id}`)} className={`ml-1 p-1 rounded border transition-all ${copied === `r${r.id}` ? 'text-brand-400 border-brand-500/40' : 'text-slate-600 border-surface-border hover:text-brand-400'}`}>
                        {copied === `r${r.id}` ? <CheckCheck size={11} /> : <Copy size={11} />}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 이자 차이 시각화 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '총 이자 비교' : 'Total Interest Comparison'}</p>
        {results.map((r, i) => {
          const maxInterest = Math.max(...results.map(x => x.totalInterest))
          const pct = maxInterest > 0 ? (r.totalInterest / maxInterest) * 100 : 100
          const color = COLORS[i % COLORS.length]
          return (
            <div key={r.id} className="mb-2.5">
              <div className="flex justify-between text-xs mb-1">
                <span className={COLOR_MAP[color].split(' ')[0]}>{r.name}</span>
                <span className="text-slate-300 font-mono">₩{comma(r.totalInterest)}</span>
              </div>
              <div className="h-3 bg-surface-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${['bg-brand-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'][i % 5]}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '대출 비교 계산기' : 'Loan Comparison Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/loan-comparison"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '대출 정보 입력', desc: '각 대출 상품의 금액, 이율, 기간, 상환방식을 입력하세요.' },
          { step: '상품 추가', desc: '최대 5개 상품을 비교할 수 있습니다. + 버튼으로 추가하세요.' },
          { step: '비교 결과 확인', desc: '월 납입액, 총 이자, 총 상환액을 한눈에 비교합니다.' },
          { step: '최저 이자 상품 선택', desc: '✓ 표시된 상품이 총 이자가 가장 적은 상품입니다.' },
        ] : [
          { step: 'Enter loan info', desc: 'Input amount, rate, term, and repayment method for each loan.' },
          { step: 'Add products', desc: 'Compare up to 5 products. Click + to add.' },
          { step: 'View comparison', desc: 'Monthly payment, total interest, and total payment at a glance.' },
          { step: 'Select best option', desc: 'The ✓ marked product has the lowest total interest.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '5개 상품 동시 비교', desc: '최대 5개 대출 상품을 나란히 비교해 최적 상품을 찾습니다.' },
          { title: '3가지 상환 방식', desc: '원리금균등·원금균등·이자만 납부 방식을 비교합니다.' },
          { title: '총 이자 시각화', desc: '바 차트로 상품별 총 이자를 직관적으로 비교합니다.' },
          { title: '최저 이자 자동 표시', desc: '총 이자가 가장 적은 상품을 자동으로 표시합니다.' },
        ] : [
          { title: 'Compare 5 products', desc: 'Side-by-side comparison of up to 5 loan products.' },
          { title: '3 repayment methods', desc: 'Compare equal payment, equal principal, and interest-only.' },
          { title: 'Interest visualization', desc: 'Bar chart for intuitive total interest comparison.' },
          { title: 'Auto best pick', desc: 'Automatically marks the product with lowest total interest.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '원리금균등과 원금균등 어떤 게 유리한가요?', a: '총 이자 측면에서는 원금균등이 더 유리합니다. 그러나 초기 납입액이 높아 부담이 클 수 있습니다. 여유 자금이 있다면 원금균등을 권장합니다.' },
          { q: '이자율이 같아도 왜 총 이자가 다른가요?', a: '상환기간과 상환방식이 다르기 때문입니다. 기간이 길수록, 이자만 납부 방식일수록 총 이자가 커집니다.' },
          { q: '대출 갈아타기가 유리한 경우는?', a: '현재 대출 이율보다 1% 이상 낮은 상품이 있고, 중도상환 수수료보다 절약 이자가 크다면 갈아타기를 고려해볼 수 있습니다.' },
          { q: '변동금리와 고정금리 어떤 게 나은가요?', a: '금리 상승 예상 시 고정금리, 금리 하락 예상 시 변동금리가 유리합니다. 이 계산기는 고정금리 기준입니다.' },
        ] : [
          { q: 'Equal payment vs equal principal: which is better?', a: 'Equal principal pays less total interest but has higher initial payments. Recommended if you have sufficient cash flow.' },
          { q: 'Why does total interest differ with same rate?', a: 'Due to different terms and repayment methods. Longer terms and interest-only methods result in higher total interest.' },
          { q: 'When should I refinance?', a: 'Consider refinancing if you can find a rate 1%+ lower and the interest savings exceed early repayment penalties.' },
          { q: 'Fixed vs variable rate?', a: 'Fixed is safer when rates are expected to rise. Variable is better when rates are expected to fall. This calculator uses fixed rates.' },
        ]}
        keywords="대출 비교 계산기 · 대출 상품 비교 · 금리 비교 · 대출 이자 비교 · 원리금균등 원금균등 비교 · loan comparison calculator · compare loan products · interest rate comparison · mortgage comparison"
      />
    </div>
  )
}
