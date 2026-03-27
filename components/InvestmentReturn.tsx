'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '투자 수익률 계산기',
    desc: '투자 원금·기간·수익률로 복리 수익을 계산. CAGR(연평균 성장률), 72의 법칙, 물가상승률 반영 실질 수익률 제공.',
    principal: '투자 원금 (원)',
    monthly: '월 추가 납입 (원)',
    years: '투자 기간 (년)',
    rate: '연 수익률 (%)',
    inflation: '물가상승률 (%)',
    compound: '복리', simple: '단리',
    finalAmount: '최종 금액',
    profit: '총 수익',
    realProfit: '실질 수익 (물가 반영)',
    doubleTime: '원금 2배 시간 (72의 법칙)',
  },
  en: {
    title: 'Investment Return Calculator',
    desc: 'Calculate compound returns from principal, duration, and rate. Includes CAGR, Rule of 72, and inflation-adjusted real returns.',
    principal: 'Principal (₩)',
    monthly: 'Monthly Addition (₩)',
    years: 'Investment Period (years)',
    rate: 'Annual Return Rate (%)',
    inflation: 'Inflation Rate (%)',
    compound: 'Compound', simple: 'Simple',
    finalAmount: 'Final Amount',
    profit: 'Total Profit',
    realProfit: 'Real Profit (inflation adj.)',
    doubleTime: 'Time to Double (Rule of 72)',
  }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function InvestmentReturn() {
  const { lang } = useLang()
  const tx = T[lang]

  const [principal, setPrincipal] = useState(10000000)
  const [monthly, setMonthly] = useState(500000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(7)
  const [inflation, setInflation] = useState(3)
  const [mode, setMode] = useState<'compound' | 'simple'>('compound')
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const r = rate / 100
  const ir = inflation / 100
  const n = years

  let finalAmount = 0
  let totalInvested = principal + monthly * 12 * n

  if (mode === 'compound') {
    // 원금 복리
    const principalFV = principal * Math.pow(1 + r, n)
    // 월 납입 복리 (연 복리 기준으로 변환)
    const monthlyR = r / 12
    const monthlyFV = monthly * ((Math.pow(1 + monthlyR, n * 12) - 1) / monthlyR)
    finalAmount = principalFV + monthlyFV
  } else {
    // 단리
    finalAmount = principal * (1 + r * n) + monthly * 12 * n * (1 + r * n / 2)
  }

  const profit = finalAmount - totalInvested
  const profitRate = (profit / totalInvested) * 100

  // 실질 수익 (인플레이션 반영)
  const realFinalAmount = finalAmount / Math.pow(1 + ir, n)
  const realProfit = realFinalAmount - totalInvested

  // CAGR
  const cagr = (Math.pow(finalAmount / principal, 1 / n) - 1) * 100

  // 72의 법칙
  const doubleYears = rate > 0 ? (72 / rate).toFixed(1) : '—'

  // 연도별 데이터
  const yearlyData = Array.from({ length: Math.min(n, 20) }, (_, i) => {
    const yr = i + 1
    let val = 0
    if (mode === 'compound') {
      const pFV = principal * Math.pow(1 + r, yr)
      const mR = r / 12
      const mFV = monthly > 0 ? monthly * ((Math.pow(1 + mR, yr * 12) - 1) / mR) : 0
      val = pFV + mFV
    } else {
      val = principal * (1 + r * yr) + monthly * 12 * yr
    }
    return { year: yr, amount: val, invested: principal + monthly * 12 * yr }
  })

  const RATE_PRESETS = [3, 5, 7, 10, 15, 20]
  const YEAR_PRESETS = [1, 3, 5, 10, 20, 30]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* 입력 */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 flex flex-col gap-3">
          <div className="flex gap-2 mb-1">
            {[['compound', tx.compound], ['simple', tx.simple]].map(([v, l]) => (
              <button key={v} onClick={() => setMode(v as 'compound' | 'simple')}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${mode === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
            ))}
          </div>

          {[
            { label: tx.principal, val: principal, set: setPrincipal, step: 1000000, presets: [1000000, 5000000, 10000000, 30000000, 100000000] },
            { label: tx.monthly, val: monthly, set: setMonthly, step: 100000, presets: [0, 100000, 300000, 500000, 1000000] },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
              <input type="number" value={f.val} step={f.step} onChange={e => f.set(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-base font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-1" />
              <div className="flex flex-wrap gap-1">
                {f.presets.map(p => (
                  <button key={p} onClick={() => f.set(p)}
                    className={`text-xs px-2 py-0.5 rounded border transition-all ${f.val === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>
                    {p === 0 ? '0' : p >= 100000000 ? `${p / 100000000}억` : `${p / 10000}만`}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-slate-400">{tx.rate}</label>
              <span className="text-brand-400 font-mono text-sm font-bold">{rate}%</span>
            </div>
            <input type="range" min={0.1} max={30} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-green-500 mb-1" />
            <div className="flex flex-wrap gap-1">
              {RATE_PRESETS.map(p => (
                <button key={p} onClick={() => setRate(p)}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${rate === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-slate-400">{tx.years}</label>
              <span className="text-brand-400 font-mono text-sm font-bold">{years}{lang === 'ko' ? '년' : 'yr'}</span>
            </div>
            <input type="range" min={1} max={50} step={1} value={years} onChange={e => setYears(+e.target.value)} className="w-full accent-green-500 mb-1" />
            <div className="flex flex-wrap gap-1">
              {YEAR_PRESETS.map(p => (
                <button key={p} onClick={() => setYears(p)}
                  className={`text-xs px-2 py-0.5 rounded border transition-all ${years === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>
                  {p}{lang === 'ko' ? '년' : 'yr'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-slate-400">{tx.inflation}</label>
              <span className="text-slate-400 font-mono text-sm">{inflation}%</span>
            </div>
            <input type="range" min={0} max={10} step={0.1} value={inflation} onChange={e => setInflation(+e.target.value)} className="w-full accent-green-500" />
          </div>
        </div>

        {/* 결과 */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5">
            <p className="text-xs text-slate-400 mb-1">{tx.finalAmount}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(finalAmount)}</p>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => copy(String(Math.round(finalAmount)), 'final')}
                className={`p-1.5 rounded border transition-all ${copied === 'final' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                {copied === 'final' ? <CheckCheck size={12} /> : <Copy size={12} />}
              </button>
              <p className="text-xs text-slate-500">{lang === 'ko' ? `총 투자: ₩${comma(totalInvested)}` : `Total invested: ₩${comma(totalInvested)}`}</p>
            </div>
          </div>

          {[
            { label: tx.profit, val: `₩${comma(profit)} (+${profitRate.toFixed(1)}%)`, key: 'profit', color: 'text-brand-400' },
            { label: tx.realProfit, val: `₩${comma(realProfit)}`, key: 'real', color: 'text-blue-400' },
            { label: `CAGR ${lang === 'ko' ? '(연평균 성장률)' : '(Compound Annual Growth Rate)'}`, val: `${cagr.toFixed(2)}%`, key: 'cagr', color: 'text-purple-400' },
            { label: tx.doubleTime, val: `${doubleYears}${lang === 'ko' ? '년' : 'yr'}`, key: 'double', color: 'text-yellow-400' },
          ].map(r => (
            <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">{r.label}</p>
                <p className={`text-base font-bold font-mono ${r.color}`}>{r.val}</p>
              </div>
              <button onClick={() => copy(r.val, r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                {copied === r.key ? <CheckCheck size={12} /> : <Copy size={12} />}
              </button>
            </div>
          ))}

          {/* 원금 vs 수익 비율 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
            <p className="text-xs text-slate-400 mb-2">{lang === 'ko' ? '원금 vs 수익 비율' : 'Principal vs Profit Ratio'}</p>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="h-full bg-slate-600" style={{ width: `${(totalInvested / finalAmount) * 100}%` }} />
              <div className="h-full bg-brand-500" style={{ width: `${(profit / finalAmount) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-slate-400">원금 {((totalInvested / finalAmount) * 100).toFixed(0)}%</span>
              <span className="text-brand-400">수익 {((profit / finalAmount) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 연도별 성장 테이블 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <p className="text-sm font-semibold text-slate-200">{lang === 'ko' ? '📈 연도별 성장 추이' : '📈 Year-by-Year Growth'}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-4 py-2 text-left text-slate-500">{lang === 'ko' ? '연차' : 'Year'}</th>
                <th className="px-4 py-2 text-right text-slate-500">{lang === 'ko' ? '투자원금 누계' : 'Total Invested'}</th>
                <th className="px-4 py-2 text-right text-slate-500">{lang === 'ko' ? '평가금액' : 'Value'}</th>
                <th className="px-4 py-2 text-right text-slate-500">{lang === 'ko' ? '수익' : 'Profit'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {yearlyData.map(d => (
                <tr key={d.year} className="hover:bg-surface-hover/5">
                  <td className="px-4 py-2 text-slate-400">{d.year}{lang === 'ko' ? '년' : 'yr'}</td>
                  <td className="px-4 py-2 text-right text-slate-400 font-mono">₩{comma(d.invested)}</td>
                  <td className="px-4 py-2 text-right text-brand-400 font-mono font-bold">₩{comma(d.amount)}</td>
                  <td className="px-4 py-2 text-right text-slate-300 font-mono">+₩{comma(d.amount - d.invested)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '투자 수익률 계산기' : 'Investment Return Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/investment-return"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '복리/단리 선택', desc: '투자 방식에 따라 복리 또는 단리를 선택하세요.' },
          { step: '투자 정보 입력', desc: '원금, 월 납입액, 수익률, 기간을 입력하세요.' },
          { step: '물가상승률 설정', desc: '실질 수익 계산을 위한 물가상승률을 설정하세요.' },
          { step: '결과 분석', desc: '최종 금액, 수익률, CAGR, 연도별 성장을 확인하세요.' },
        ] : [
          { step: 'Select compound/simple', desc: 'Choose compound or simple interest mode.' },
          { step: 'Enter investment info', desc: 'Input principal, monthly additions, rate, and period.' },
          { step: 'Set inflation rate', desc: 'Set inflation rate for real return calculation.' },
          { step: 'Analyze results', desc: 'Review final amount, return rate, CAGR, and year-by-year growth.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '월 납입 복리 계산', desc: '원금 복리뿐만 아니라 매월 추가 납입금의 복리 효과도 계산합니다.' },
          { title: '실질 수익률 제공', desc: '물가상승률을 반영한 실질 구매력 기준 수익을 알려줍니다.' },
          { title: 'CAGR 계산', desc: '연평균 복합 성장률(CAGR)로 실제 투자 성과를 측정합니다.' },
          { title: '72의 법칙', desc: '원금이 2배가 되는 데 걸리는 시간을 72의 법칙으로 계산합니다.' },
        ] : [
          { title: 'Monthly addition compounding', desc: 'Calculates compounding effect of both principal and monthly additions.' },
          { title: 'Real returns', desc: 'Shows inflation-adjusted real purchasing power returns.' },
          { title: 'CAGR calculation', desc: 'Measures actual investment performance via compound annual growth rate.' },
          { title: 'Rule of 72', desc: 'Calculates time to double your money using Rule of 72.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '복리와 단리 차이는?', a: '단리는 원금에만 이자가 붙고, 복리는 이자에도 이자가 붙습니다. 장기투자일수록 복리의 효과가 극적으로 커집니다.' },
          { q: '72의 법칙이란?', a: '원금이 2배가 되는 데 걸리는 시간 ≈ 72 ÷ 수익률(%). 예: 연 6% 수익이면 72÷6=12년에 2배가 됩니다.' },
          { q: 'CAGR이란?', a: '연평균 복합 성장률(Compound Annual Growth Rate). 투자 성과를 연 단위로 환산한 수치로, 실제 투자 성과 비교에 유용합니다.' },
          { q: '물가상승률은 왜 중요한가요?', a: '실질 수익률 = 명목 수익률 - 물가상승률. 연 7% 수익이어도 물가가 3% 오르면 실질 구매력은 4% 증가에 불과합니다.' },
        ] : [
          { q: 'Compound vs simple interest?', a: 'Simple: interest only on principal. Compound: interest on interest too. The longer the period, the more dramatic the compound effect.' },
          { q: 'What is Rule of 72?', a: 'Years to double = 72 ÷ annual return rate. E.g., at 6% annual return: 72÷6=12 years to double your money.' },
          { q: 'What is CAGR?', a: 'Compound Annual Growth Rate. Converts investment performance to annual equivalent, useful for comparing different investments.' },
          { q: 'Why does inflation matter?', a: 'Real return = nominal return - inflation. Even 7% returns with 3% inflation means only 4% real purchasing power gain.' },
        ]}
        keywords="투자 수익률 계산기 · 복리 계산기 · 투자 복리 · CAGR 계산 · 72의 법칙 · 월 납입 복리 · investment return calculator · compound interest · CAGR calculator · Rule of 72"
      />
    </div>
  )
}
