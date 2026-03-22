'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '복리 계산기', desc: '복리 투자 수익 시뮬레이션. 시간에 따른 자산 증가 그래프, 단리와 복리 비교 제공.' },
  en: { title: 'Compound Interest Calculator', desc: 'Simulate compound interest investment returns. Asset growth visualization and simple vs compound comparison.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function CompoundInterest() {
  const { lang } = useLang()
  const tx = T[lang]
  const [principal, setPrincipal] = useState(10000000)
  const [monthly, setMonthly] = useState(500000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [frequency, setFrequency] = useState(12)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  // 복리 계산
  const r = rate / 100 / frequency
  const n = years * frequency
  const compoundTotal = principal * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r)
  const totalDeposit = principal + monthly * 12 * years
  const compoundInterest = compoundTotal - totalDeposit

  // 단리 계산
  const simpleTotal = principal * (1 + rate / 100 * years) + monthly * 12 * years * (1 + rate / 100 * years / 2)
  const simpleInterest = simpleTotal - totalDeposit

  // 연도별 데이터
  const yearlyData = Array.from({ length: years + 1 }, (_, i) => {
    const ni = i * frequency
    const compound = principal * Math.pow(1 + r, ni) + (ni > 0 ? monthly * ((Math.pow(1 + r, ni) - 1) / r) : 0)
    const deposit = principal + monthly * 12 * i
    return { year: i, compound: Math.round(compound), deposit: Math.round(deposit) }
  })

  const maxVal = compoundTotal
  const FREQ_OPTIONS = [
    { val: 1, ko: '연 1회', en: 'Annually' },
    { val: 4, ko: '분기별', en: 'Quarterly' },
    { val: 12, ko: '월 1회', en: 'Monthly' },
    { val: 365, ko: '매일', en: 'Daily' },
  ]

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
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: lang === 'ko' ? '초기 투자금 (원)' : 'Initial Investment', val: principal, set: setPrincipal },
            { label: lang === 'ko' ? '월 추가 납입 (원)' : 'Monthly Contribution', val: monthly, set: setMonthly },
            { label: lang === 'ko' ? '연 수익률 (%)' : 'Annual Return (%)', val: rate, set: setRate, step: 0.5 },
            { label: lang === 'ko' ? '투자 기간 (년)' : 'Investment Period (yrs)', val: years, set: setYears },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <input type="number" value={f.val} step={(f as any).step ?? 100000} onChange={e => f.set(Number(e.target.value))}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '복리 계산 주기' : 'Compounding Frequency'}</label>
          <div className="flex gap-1.5">
            {FREQ_OPTIONS.map(f => (
              <button key={f.val} onClick={() => setFrequency(f.val)}
                className={`flex-1 py-1.5 rounded-lg border text-xs transition-all ${frequency === f.val ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {lang === 'ko' ? f.ko : f.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '복리 최종 금액' : 'Compound Final Amount'}</p>
          <p className="text-3xl font-extrabold text-brand-400 font-mono">₩{comma(compoundTotal)}</p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `이자 ₩${comma(compoundInterest)}` : `Interest ₩${comma(compoundInterest)}`}</p>
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '단리 최종 금액' : 'Simple Interest Amount'}</p>
          <p className="text-3xl font-extrabold text-slate-300 font-mono">₩{comma(simpleTotal)}</p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `이자 ₩${comma(simpleInterest)}` : `Interest ₩${comma(simpleInterest)}`}</p>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: lang === 'ko' ? '총 납입금' : 'Total Deposited', val: `₩${comma(totalDeposit)}`, key: 'dep' },
            { label: lang === 'ko' ? '복리 수익' : 'Compound Gain', val: `₩${comma(compoundInterest)}`, key: 'gain' },
            { label: lang === 'ko' ? '복리 vs 단리 차이' : 'Compound vs Simple', val: `+₩${comma(compoundTotal - simpleTotal)}`, key: 'diff' },
          ].map(r => (
            <div key={r.key}>
              <p className="text-xs text-slate-500 mb-0.5">{r.label}</p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-sm font-bold text-slate-200 font-mono">{r.val}</p>
                <button onClick={() => copy(r.val.replace(/[+₩,]/g, ''), r.key)} className={`p-1 rounded border transition-all ${copied === r.key ? 'text-brand-400 border-brand-500/40' : 'text-slate-600 border-surface-border hover:text-brand-400'}`}>
                  {copied === r.key ? <CheckCheck size={11} /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 간단한 바 차트 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang === 'ko' ? '연도별 자산 성장' : 'Asset Growth by Year'}</p>
        <div className="flex flex-col gap-1.5">
          {yearlyData.filter((_, i) => i % Math.max(1, Math.floor(years / 10)) === 0).map(d => (
            <div key={d.year} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-12 text-right flex-shrink-0">{d.year}{lang === 'ko' ? '년' : 'yr'}</span>
              <div className="flex-1 flex gap-1 items-center h-4">
                <div className="h-3 bg-brand-500/60 rounded-full transition-all" style={{ width: `${(d.compound / maxVal) * 100}%`, minWidth: '2px' }} />
              </div>
              <span className="text-xs text-brand-400 font-mono w-28 text-right flex-shrink-0">₩{comma(d.compound)}</span>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '복리 계산기' : 'Compound Interest Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/compound-interest"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '초기 투자금 입력', desc: '처음 투자할 금액을 입력하세요.' },
          { step: '월 납입액 설정', desc: '매월 추가로 납입할 금액을 입력하세요. 없으면 0으로 설정하세요.' },
          { step: '수익률과 기간 설정', desc: '예상 연 수익률과 투자 기간을 입력하세요.' },
          { step: '결과 확인', desc: '복리·단리 비교와 연도별 자산 성장을 확인하세요.' },
        ] : [
          { step: 'Enter initial investment', desc: 'Input the amount you start with.' },
          { step: 'Set monthly contribution', desc: 'Enter monthly additional amount. Set 0 if none.' },
          { step: 'Set rate and period', desc: 'Input expected annual return and investment period.' },
          { step: 'View results', desc: 'See compound vs simple comparison and yearly growth.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '복리 vs 단리 비교', desc: '복리와 단리 수익을 나란히 비교해 복리 효과를 직관적으로 보여줍니다.' },
          { title: '월 납입금 반영', desc: '초기 투자금 외에 매월 추가 납입을 반영한 현실적인 계산을 제공합니다.' },
          { title: '연도별 성장 그래프', desc: '자산이 시간에 따라 어떻게 성장하는지 시각적으로 확인할 수 있습니다.' },
          { title: '복리 주기 설정', desc: '연·분기·월·일 단위 복리 주기를 설정할 수 있습니다.' },
        ] : [
          { title: 'Compound vs simple comparison', desc: 'Compare compound and simple interest side by side.' },
          { title: 'Monthly contributions', desc: 'Realistic calculation including regular monthly additions.' },
          { title: 'Year-by-year growth', desc: 'Visualize how assets grow over time.' },
          { title: 'Compounding frequency', desc: 'Set annual, quarterly, monthly, or daily compounding.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '복리 효과란?', a: '이자에 다시 이자가 붙는 것입니다. 기간이 길수록 단리와 차이가 커지며, 장기 투자에서 매우 강력한 효과를 발휘합니다.' },
          { q: '복리 주기는 잦을수록 좋은가요?', a: '이론적으로 복리 주기가 잦을수록 최종 수익이 높아지지만, 현실적으로 월 복리와 일 복리의 차이는 미미합니다.' },
          { q: '연 수익률 7%가 현실적인가요?', a: '미국 S&P500 지수의 역사적 평균 수익률이 약 7~10%(인플레이션 반영)입니다. 주식·ETF 장기 투자의 참고 수치로 자주 사용됩니다.' },
          { q: '"72의 법칙"이란?', a: '72를 연 수익률로 나누면 원금이 2배가 되는 기간을 알 수 있습니다. 예: 7% 수익률이면 72÷7≈10년 후 2배.' },
        ] : [
          { q: 'What is the compound interest effect?', a: 'Interest earns interest. The longer the period, the greater the gap from simple interest. Extremely powerful for long-term investing.' },
          { q: 'Is more frequent compounding better?', a: 'Theoretically yes, but the practical difference between monthly and daily compounding is minimal.' },
          { q: 'Is 7% annual return realistic?', a: 'The US S&P500 historical average is ~7-10% (inflation-adjusted). Commonly used as a reference for long-term stock/ETF investments.' },
          { q: 'What is the "Rule of 72"?', a: 'Divide 72 by the annual rate to find when your money doubles. E.g., 7% rate → 72÷7≈10 years to double.' },
        ]}
        keywords="복리 계산기 · 복리 투자 · 투자 수익 계산 · 복리 효과 · 72의 법칙 · 장기 투자 · compound interest calculator · investment calculator · compound vs simple interest · return on investment · wealth growth calculator"
      />
    </div>
  )
}
