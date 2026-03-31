'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '전세자금대출 계산기',
    desc: '전세 보증금과 대출 금리로 월 이자와 총 이자를 계산. HUG·HF·SGI 보증 한도, 전세대출 vs 매매 비교.',
    deposit: '전세 보증금 (원)',
    loanRate: '대출 이율 (%)',
    loanPeriod: '대출 기간',
    selfFund: '자기자금 (원)',
    loanAmount: '필요 대출금액',
    monthlyInterest: '월 이자',
    totalInterest: '총 이자 (기간 내)',
    compareWith: '매매 vs 전세 비교',
  },
  en: {
    title: 'Jeonse Loan Calculator',
    desc: 'Calculate monthly interest and total cost for Korean Jeonse (lease deposit) loans. Includes guarantee limits and buy vs rent comparison.',
    deposit: 'Jeonse Deposit (₩)',
    loanRate: 'Loan Rate (%)',
    loanPeriod: 'Loan Period',
    selfFund: 'Self Funding (₩)',
    loanAmount: 'Loan Needed',
    monthlyInterest: 'Monthly Interest',
    totalInterest: 'Total Interest',
    compareWith: 'Buy vs Jeonse Comparison',
  }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

const PERIODS = [1, 2, 4] // 년

export default function LeaseCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [deposit, setDeposit] = useState(300000000)
  const [loanRate, setLoanRate] = useState(3.5)
  const [period, setPeriod] = useState(2)
  const [selfFund, setSelfFund] = useState(50000000)
  const [buyPrice, setBuyPrice] = useState(500000000)
  const [showCompare, setShowCompare] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const loanAmount = Math.max(0, deposit - selfFund)
  const monthlyInterest = Math.round(loanAmount * (loanRate / 100) / 12)
  const totalInterest = monthlyInterest * period * 12
  const totalCost = selfFund + totalInterest // 전세 실질 비용

  // 보증 한도 (2024 기준 간략)
  const hugLimit = Math.min(deposit * 0.8, 400000000)  // HUG 80%, 4억 한도
  const hfLimit = Math.min(deposit * 0.8, 300000000)   // HF 80%, 3억 한도

  // 전세 vs 매매 비교
  const mortgageMonthly = buyPrice * 0.6 * (0.045 / 12) * Math.pow(1 + 0.045 / 12, 360) / (Math.pow(1 + 0.045 / 12, 360) - 1)
  const priceAppreciation = buyPrice * 0.03 * period // 3% 연간 상승 가정

  const DEPOSIT_PRESETS = [200000000, 300000000, 400000000, 500000000, 700000000]
  const RATE_PRESETS = [2.5, 3.0, 3.5, 4.0, 4.5]

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
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{tx.deposit}</label>
          <input type="number" value={deposit} step={10000000} onChange={e => setDeposit(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {DEPOSIT_PRESETS.map(p => (
              <button key={p} onClick={() => setDeposit(p)}
                className={`text-xs px-2.5 py-1 rounded border transition-all ${deposit === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
                {p >= 100000000 ? `${p / 100000000}억` : `${p / 10000}만`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.selfFund}</label>
            <input type="number" value={selfFund} step={10000000} onChange={e => setSelfFund(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.loanPeriod}</label>
            <div className="flex flex-col gap-1">
              {PERIODS.map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`py-1.5 rounded border text-xs font-bold transition-all ${period === p ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
                  {p}{lang === 'ko' ? '년' : 'yr'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-slate-400">{tx.loanRate}</label>
            <span className="text-brand-400 font-mono text-sm font-bold">{loanRate}%</span>
          </div>
          <input type="range" min={1} max={8} step={0.1} value={loanRate} onChange={e => setLoanRate(+e.target.value)} className="w-full accent-green-500 mb-1" />
          <div className="flex flex-wrap gap-1">
            {RATE_PRESETS.map(r => (
              <button key={r} onClick={() => setLoanRate(r)}
                className={`text-xs px-2 py-0.5 rounded border transition-all ${loanRate === r ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>{r}%</button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 col-span-2 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">{tx.monthlyInterest}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(monthlyInterest)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `대출금액: ₩${comma(loanAmount)} (이자만 납부)` : `Loan: ₩${comma(loanAmount)} (interest only)`}</p>
          </div>
          <button onClick={() => copy(String(monthlyInterest), 'mi')} className={`p-2.5 rounded-xl border transition-all ${copied === 'mi' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
            {copied === 'mi' ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </div>
        {[
          { label: tx.totalInterest, val: `₩${comma(totalInterest)}`, key: 'ti' },
          { label: lang === 'ko' ? '실질 총 비용 (자기자금+이자)' : 'Total Real Cost', val: `₩${comma(totalCost)}`, key: 'tc' },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className="text-base font-bold font-mono text-slate-200">{r.val}</p>
            </div>
            <button onClick={() => copy(r.val.replace(/[₩,]/g, ''), r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={12} /> : <Copy size={12} />}
            </button>
          </div>
        ))}
      </div>

      {/* 보증 한도 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '🏦 전세대출 보증 한도 (2024년 기준)' : '🏦 Jeonse Loan Guarantee Limits (2024)'}</p>
        <div className="flex flex-col gap-2">
          {[
            { name: 'HUG (주택도시보증공사)', limit: hugLimit, desc: lang === 'ko' ? '보증금의 80%, 최대 4억원' : '80% of deposit, max ₩400M' },
            { name: 'HF (한국주택금융공사)', limit: hfLimit, desc: lang === 'ko' ? '보증금의 80%, 최대 3억원' : '80% of deposit, max ₩300M' },
          ].map(g => (
            <div key={g.name} className="flex justify-between items-center px-3 py-2 rounded-lg border border-surface-border bg-[#0f1117]">
              <div>
                <p className="text-xs font-medium text-slate-200">{g.name}</p>
                <p className="text-xs text-slate-500">{g.desc}</p>
              </div>
              <p className="text-sm font-bold text-brand-400 font-mono">₩{comma(g.limit)}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-2">{lang === 'ko' ? '* 소득, 자산, 주택 기준에 따라 달라질 수 있습니다' : '* May vary by income, asset, and housing criteria'}</p>
      </div>

      {/* 전세 vs 매매 비교 */}
      <button onClick={() => setShowCompare(!showCompare)}
        className="text-xs text-brand-400 hover:text-brand-300 transition-all mb-2 flex items-center gap-1">
        {showCompare ? '▲' : '▼'} {tx.compareWith}
      </button>
      {showCompare && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <div className="mb-3">
            <label className="text-xs text-slate-400 mb-1 block">{lang === 'ko' ? '비슷한 주택 매매 가격' : 'Similar Home Purchase Price'}</label>
            <input type="number" value={buyPrice} step={10000000} onChange={e => setBuyPrice(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
              <p className="text-blue-400 font-bold mb-1">{lang === 'ko' ? '전세 선택 시' : 'Jeonse Option'}</p>
              <p className="text-slate-300">{lang === 'ko' ? `${period}년 총 이자: ₩${comma(totalInterest)}` : `${period}yr total interest: ₩${comma(totalInterest)}`}</p>
              <p className="text-slate-400">{lang === 'ko' ? '원금 보존, 자산 증식 없음' : 'Principal preserved, no asset building'}</p>
            </div>
            <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 p-3">
              <p className="text-brand-400 font-bold mb-1">{lang === 'ko' ? '매매 선택 시' : 'Purchase Option'}</p>
              <p className="text-slate-300">{lang === 'ko' ? `월 상환: ₩${comma(Math.round(mortgageMonthly))}` : `Monthly: ₩${comma(Math.round(mortgageMonthly))}`}</p>
              <p className="text-slate-400">{lang === 'ko' ? `자산 상승 예상(3%): +₩${comma(priceAppreciation)}` : `Est. appreciation(3%): +₩${comma(priceAppreciation)}`}</p>
            </div>
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '전세자금대출 계산기' : 'Jeonse Loan Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/lease-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '전세 보증금 입력', desc: '계약하려는 전세 보증금을 입력하세요.' },
          { step: '자기자금 입력', desc: '직접 준비할 수 있는 자기자금을 입력하면 필요 대출금액이 계산됩니다.' },
          { step: '금리와 기간 설정', desc: '현재 전세대출 금리와 대출 기간을 설정하세요.' },
          { step: '이자 확인', desc: '월 이자와 총 이자를 확인하고 보증 한도를 참고하세요.' },
        ] : [
          { step: 'Enter deposit', desc: 'Input the Jeonse deposit amount for the target property.' },
          { step: 'Enter self funding', desc: 'Input self-funded amount to auto-calculate loan needed.' },
          { step: 'Set rate and period', desc: 'Set current Jeonse loan rate and period.' },
          { step: 'View interest', desc: 'Check monthly and total interest, and guarantee limits.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '보증 한도 자동 계산', desc: 'HUG·HF 전세대출 보증 한도를 자동으로 계산합니다.' },
          { title: '전세 vs 매매 비교', desc: '같은 조건에서 전세와 매매의 비용을 비교합니다.' },
          { title: '실질 비용 계산', desc: '자기자금과 이자를 합한 실질 총 비용을 표시합니다.' },
          { title: '금리 슬라이더', desc: '금리를 실시간으로 조정하며 이자 변화를 확인합니다.' },
        ] : [
          { title: 'Auto guarantee limits', desc: 'Automatically calculates HUG and HF guarantee limits.' },
          { title: 'Buy vs Jeonse compare', desc: 'Compares total costs for Jeonse vs purchase.' },
          { title: 'Real total cost', desc: 'Shows actual total cost including self-funding plus interest.' },
          { title: 'Rate slider', desc: 'Adjust rate in real-time to see interest changes.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '전세자금대출 이자만 내나요?', a: '네. 전세자금대출은 일반적으로 전세 기간(2년) 동안 이자만 납부하고 만기 시 원금을 일시 상환합니다.' },
          { q: 'HUG vs HF 보증 차이는?', a: 'HUG(주택도시보증공사): 최대 4억원, 연 소득 1억원 이하. HF(한국주택금융공사): 최대 3억원, 연 소득 5천만원 이하. 기준이 다릅니다.' },
          { q: '전세자금대출 금리는?', a: '2024년 기준 은행 전세대출 금리는 약 3~5% 수준입니다. 버팀목전세자금(정책대출)은 연 1.2~2.1%의 낮은 금리를 적용합니다.' },
          { q: '버팀목전세자금대출이란?', a: '정부 지원 서민 주거 안정 대출 상품입니다. 연 소득 5천만원 이하, 주택 가격 3억원 이하 대상으로 우대 금리를 적용합니다.' },
        ] : [
          { q: 'Only pay interest on Jeonse loans?', a: 'Yes. Jeonse loans typically require interest-only payments during the 2-year lease period, with principal due at the end.' },
          { q: 'HUG vs HF difference?', a: 'HUG: max ₩400M, income ≤₩100M. HF: max ₩300M, income ≤₩50M. Different eligibility criteria.' },
          { q: 'Current Jeonse loan rates?', a: 'Bank rates around 3-5% as of 2024. Government Beotimok loan offers 1.2-2.1% for lower-income applicants.' },
          { q: 'What is Beotimok loan?', a: 'Government-subsidized Jeonse loan for residents. Low income, home value under ₩300M. Preferential interest rate of 1.2-2.1%.' },
        ]}
        keywords="전세자금대출 계산기 · 전세대출 이자 계산 · 전세 월 이자 · HUG HF 보증 한도 · 전세 대출 한도 · Jeonse loan calculator · Korean lease deposit loan · 전세보증금 대출"
      />
    </div>
  )
}
