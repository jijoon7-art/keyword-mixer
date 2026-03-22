'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '전월세 계산기', desc: '전세→월세 변환, 월세→전세 환산, 전세 대출 이자 계산. 2024년 전세자금대출 금리 반영.' },
  en: { title: 'Jeonse ↔ Monthly Rent Calculator', desc: 'Convert Korean Jeonse to monthly rent and vice versa. Calculate Jeonse loan interest.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function JeonseCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  // 전→월 전환율
  const [jeonse, setJeonse] = useState(300000000)
  const [convRate, setConvRate] = useState(5.5)
  const [deposit, setDeposit] = useState(50000000)

  // 월→전 환산
  const [monthly, setMonthly] = useState(800000)
  const [monthDeposit, setMonthDeposit] = useState(10000000)
  const [monthRate, setMonthRate] = useState(5.5)

  // 전세대출 이자
  const [loanAmount, setLoanAmount] = useState(200000000)
  const [loanRate, setLoanRate] = useState(3.8)
  const [loanMonths, setLoanMonths] = useState(24)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  // 전→월 계산
  const monthlyRent = Math.round((jeonse - deposit) * (convRate / 100) / 12)
  // 월→전 환산
  const jeonseEquiv = Math.round(monthDeposit + monthly * 12 / (monthRate / 100))
  // 전세대출 월 이자
  const monthlyInterest = Math.round(loanAmount * (loanRate / 100) / 12)
  const totalInterest = monthlyInterest * loanMonths

  const RATE_PRESETS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {[lang === 'ko' ? '전세→월세' : 'Jeonse→Monthly', lang === 'ko' ? '월세→전세' : 'Monthly→Jeonse', lang === 'ko' ? '전세대출 이자' : 'Jeonse Loan'].map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 text-xs font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300'}`}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '전세금 (원)' : 'Jeonse Amount (₩)'}</label>
                <input type="number" value={jeonse} step={1000000} onChange={e => setJeonse(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '보증금 (원)' : 'Deposit (₩)'}</label>
                <input type="number" value={deposit} step={1000000} onChange={e => setDeposit(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
            <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '전월세 전환율 (%)' : 'Conversion Rate (%)'}</label>
            <div className="flex gap-1.5 mb-2">
              {RATE_PRESETS.map(r => (
                <button key={r} onClick={() => setConvRate(r)}
                  className={`flex-1 py-1.5 rounded border text-xs transition-all ${convRate === r ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{r}%</button>
              ))}
            </div>
            <input type="range" min={1} max={15} step={0.1} value={convRate} onChange={e => setConvRate(+e.target.value)} className="w-full accent-green-500" />
          </div>
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '월세 (보증금 공제 후)' : 'Monthly Rent (after deposit)'}</p>
              <p className="text-3xl font-extrabold text-brand-400 font-mono">₩{comma(monthlyRent)}</p>
              <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `연간: ₩${comma(monthlyRent * 12)}` : `Annual: ₩${comma(monthlyRent * 12)}`}</p>
            </div>
            <button onClick={() => copy(String(monthlyRent), 'monthly')} className={`p-2.5 rounded-xl border transition-all ${copied === 'monthly' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied === 'monthly' ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-xs text-slate-400">
            <p className="font-medium text-slate-200 mb-1">{lang === 'ko' ? '전월세 전환율이란?' : 'What is conversion rate?'}</p>
            <p>{lang === 'ko' ? '전세를 월세로 바꿀 때 적용하는 연 이율입니다. 법정 상한선은 기준금리 + 2%이며, 실거래 시장에서는 4~6% 수준이 일반적입니다.' : 'Annual rate for converting Jeonse to monthly rent. Legal maximum is base rate + 2%. Market rate is typically 4-6%.'}</p>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '월세 (원)' : 'Monthly Rent (₩)'}</label>
                <input type="number" value={monthly} step={10000} onChange={e => setMonthly(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '보증금 (원)' : 'Deposit (₩)'}</label>
                <input type="number" value={monthDeposit} step={1000000} onChange={e => setMonthDeposit(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '전환율 (%)' : 'Rate (%)'}</label>
            <input type="range" min={1} max={15} step={0.1} value={monthRate} onChange={e => setMonthRate(+e.target.value)} className="w-full accent-green-500" />
            <p className="text-xs text-brand-400 font-mono mt-1">{monthRate}%</p>
          </div>
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '전세 환산금액' : 'Jeonse Equivalent'}</p>
              <p className="text-3xl font-extrabold text-brand-400 font-mono">₩{comma(jeonseEquiv)}</p>
            </div>
            <button onClick={() => copy(String(jeonseEquiv), 'jeonse')} className={`p-2.5 rounded-xl border transition-all ${copied === 'jeonse' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied === 'jeonse' ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '대출금액 (원)' : 'Loan Amount'}</label>
                <input type="number" value={loanAmount} step={10000000} onChange={e => setLoanAmount(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '금리 (%)' : 'Rate (%)'}</label>
                <input type="number" value={loanRate} step={0.1} onChange={e => setLoanRate(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '기간 (개월)' : 'Months'}</label>
                <input type="number" value={loanMonths} onChange={e => setLoanMonths(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: lang === 'ko' ? '월 이자' : 'Monthly Interest', val: `₩${comma(monthlyInterest)}`, key: 'mi', highlight: true },
              { label: lang === 'ko' ? `총 이자 (${loanMonths}개월)` : `Total Interest (${loanMonths}mo)`, val: `₩${comma(totalInterest)}`, key: 'ti', highlight: false },
            ].map(r => (
              <div key={r.key} className={`rounded-xl border p-4 flex items-center justify-between ${r.highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
                <div>
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className={`text-2xl font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
                </div>
                <button onClick={() => copy(r.val.replace(/[₩,]/g,''), r.key)} className={`p-2 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
                  {copied === r.key ? <CheckCheck size={14}/> : <Copy size={14}/>}
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-300">
            {lang === 'ko' ? '💡 전세자금대출은 이자만 납부하는 거치식이 일반적입니다. 만기 시 전세금 반환으로 원금을 상환합니다.' : '💡 Jeonse loans are typically interest-only. Principal is repaid when the Jeonse deposit is returned at lease end.'}
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '전월세 계산기' : 'Jeonse/Rent Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/jeonse-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '계산 유형 선택', desc: '전세→월세, 월세→전세 환산, 전세대출 이자 중 탭을 선택하세요.' },
          { step: '금액 입력', desc: '전세금 또는 월세, 보증금을 입력하세요.' },
          { step: '전환율 설정', desc: '전월세 전환율을 슬라이더로 조절하세요. 일반적으로 4~6%입니다.' },
          { step: '결과 복사', desc: '계산된 금액을 복사해 활용하세요.' },
        ] : [
          { step: 'Select calculation type', desc: 'Choose Jeonse→Monthly, Monthly→Jeonse, or Loan Interest tab.' },
          { step: 'Enter amounts', desc: 'Input Jeonse or monthly rent and deposit amounts.' },
          { step: 'Set conversion rate', desc: 'Adjust the conversion rate slider. Typically 4-6%.' },
          { step: 'Copy result', desc: 'Copy the calculated amount for your use.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 계산 통합', desc: '전세→월세, 월세→전세, 전세대출 이자를 한 페이지에서 모두 계산합니다.' },
          { title: '전환율 프리셋', desc: '자주 사용하는 전환율을 버튼으로 빠르게 선택할 수 있습니다.' },
          { title: '법정 전환율 안내', desc: '법정 전월세 전환율 상한에 대한 설명을 제공합니다.' },
          { title: '전세대출 이자 계산', desc: '거치식 전세자금대출의 월 이자와 총 이자를 계산합니다.' },
        ] : [
          { title: '3 calculations in one', desc: 'Jeonse↔monthly conversion and loan interest all in one page.' },
          { title: 'Rate presets', desc: 'Quick select buttons for commonly used conversion rates.' },
          { title: 'Legal rate guidance', desc: 'Explains the legal maximum conversion rate.' },
          { title: 'Jeonse loan interest', desc: 'Calculate monthly and total interest for interest-only Jeonse loans.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '전월세 전환율이란?', a: '전세를 월세로 전환할 때 적용하는 연 이율입니다. 법적 상한은 기준금리 + 2%입니다. 2024년 기준 약 5.5~6% 수준이 일반적입니다.' },
          { q: '전세자금대출 한도는?', a: '보증기관에 따라 다르지만 전세금의 80% 이내, HUG 기준 최대 2.2억원, 서울 기준 최대 3억원 정도입니다.' },
          { q: '전세 vs 월세 어떤 게 유리한가요?', a: '금리가 낮을 때는 전세가 유리합니다. 이 계산기로 전세대출 이자와 월세를 비교해 판단하세요.' },
          { q: '전월세 신고제란?', a: '2021년 6월부터 시행된 제도로, 전세 또는 월세 계약 후 30일 이내에 주민센터나 앱으로 신고해야 합니다.' },
        ] : [
          { q: 'What is the Jeonse conversion rate?', a: 'Annual rate for converting Jeonse to monthly rent. Legal maximum is base rate + 2%. Typically 5.5-6% as of 2024.' },
          { q: 'What is the Jeonse loan limit?', a: 'Varies by guarantee agency. Generally up to 80% of Jeonse, max ₩220M (HUG) or ₩300M (Seoul).' },
          { q: 'Jeonse vs monthly rent: which is better?', a: 'Jeonse is better when interest rates are low. Use this calculator to compare loan interest vs monthly rent.' },
          { q: 'What is Jeonse reporting?', a: 'Since June 2021, Jeonse and monthly rent contracts must be reported within 30 days at local offices or via app.' },
        ]}
        keywords="전월세 계산기 · 전세 월세 변환 · 전월세 전환율 · 전세자금대출 이자 · 월세 전환 · 전세 환산 · jeonse calculator · Korea rent calculator · jeonse to monthly rent · 전세 계산 · 보증금 계산"
      />
    </div>
  )
}
