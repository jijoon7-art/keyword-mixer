'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '주식 수익률 계산기', desc: '매수/매도 금액으로 수익률·수익금·세금 자동 계산. 증권거래세, 양도소득세 포함.' },
  en: { title: 'Stock Return Calculator', desc: 'Calculate stock returns, profit/loss, and taxes. Includes securities tax and capital gains tax.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function StockCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [buyPrice, setBuyPrice] = useState(50000)
  const [buyQty, setBuyQty] = useState(100)
  const [sellPrice, setSellPrice] = useState(65000)
  const [sellQty, setSellQty] = useState(100)
  const [market, setMarket] = useState<'kospi'|'kosdaq'|'overseas'>('kospi')
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const buyTotal = buyPrice * buyQty
  const buyFee = Math.round(buyTotal * 0.00015) // 매수 수수료 0.015%
  const sellTotal = sellPrice * sellQty
  const sellFee = Math.round(sellTotal * 0.00015)
  const secTax = market === 'overseas' ? 0 : Math.round(sellTotal * (market === 'kospi' ? 0.002 : 0.002))
  const grossProfit = sellTotal - buyTotal
  const netProfit = grossProfit - buyFee - sellFee - secTax
  const returnRate = ((netProfit / (buyTotal + buyFee)) * 100)
  const isProfit = netProfit > 0

  const MARKETS = [['kospi', 'KOSPI (코스피)'], ['kosdaq', 'KOSDAQ (코스닥)'], ['overseas', lang === 'ko' ? '해외 주식' : 'Overseas']]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex gap-1.5 mb-4">
          {MARKETS.map(([v, l]) => (
            <button key={v} onClick={() => setMarket(v as any)}
              className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${market === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
            <p className="text-xs text-blue-400 font-medium mb-2">{lang === 'ko' ? '매수 정보' : 'Buy'}</p>
            {[
              { label: lang === 'ko' ? '매수 단가' : 'Buy Price', val: buyPrice, set: setBuyPrice },
              { label: lang === 'ko' ? '매수 수량' : 'Buy Qty', val: buyQty, set: setBuyQty },
            ].map(f => (
              <div key={f.label} className="mb-2">
                <label className="text-xs text-slate-400 mb-0.5 block">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
            <p className="text-xs text-blue-300 font-mono">₩{comma(buyTotal)}</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-xs text-red-400 font-medium mb-2">{lang === 'ko' ? '매도 정보' : 'Sell'}</p>
            {[
              { label: lang === 'ko' ? '매도 단가' : 'Sell Price', val: sellPrice, set: setSellPrice },
              { label: lang === 'ko' ? '매도 수량' : 'Sell Qty', val: sellQty, set: setSellQty },
            ].map(f => (
              <div key={f.label} className="mb-2">
                <label className="text-xs text-slate-400 mb-0.5 block">{f.label}</label>
                <input type="number" value={f.val} onChange={e => f.set(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
            <p className="text-xs text-red-300 font-mono">₩{comma(sellTotal)}</p>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border p-5 mb-4 ${isProfit ? 'border-brand-500/40 bg-brand-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400">{lang === 'ko' ? '순 수익금' : 'Net Profit'}</p>
            <p className={`text-3xl font-extrabold font-mono ${isProfit ? 'text-brand-400' : 'text-red-400'}`}>{isProfit ? '+' : ''}₩{comma(netProfit)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">{lang === 'ko' ? '수익률' : 'Return'}</p>
            <p className={`text-3xl font-extrabold font-mono ${isProfit ? 'text-brand-400' : 'text-red-400'}`}>{returnRate.toFixed(2)}%</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          {[
            { label: lang === 'ko' ? '매수 수수료' : 'Buy Fee', val: `₩${comma(buyFee)}`, key: 'bf' },
            { label: lang === 'ko' ? '매도 수수료' : 'Sell Fee', val: `₩${comma(sellFee)}`, key: 'sf' },
            { label: lang === 'ko' ? '증권거래세' : 'Securities Tax', val: `₩${comma(secTax)}`, key: 'st' },
            { label: lang === 'ko' ? '총 비용' : 'Total Costs', val: `₩${comma(buyFee + sellFee + secTax)}`, key: 'tc' },
          ].map(r => (
            <div key={r.key} className="flex justify-between">
              <span className="text-slate-500">{r.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-300 font-mono">{r.val}</span>
                <button onClick={() => copy(r.val.replace(/[₩,]/g,''), r.key)} className={`p-0.5 rounded transition-all ${copied === r.key ? 'text-brand-400' : 'text-slate-600 hover:text-brand-400'}`}>
                  {copied === r.key ? <CheckCheck size={10}/> : <Copy size={10}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '주식 수익률 계산기' : 'Stock Return Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/stock-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '시장 선택', desc: '코스피, 코스닥, 해외 주식 중 거래한 시장을 선택하세요.' },
          { step: '매수 정보 입력', desc: '매수 단가와 수량을 입력하세요.' },
          { step: '매도 정보 입력', desc: '매도 단가와 수량을 입력하세요.' },
          { step: '결과 확인', desc: '수수료·세금 공제 후 순 수익금과 수익률이 표시됩니다.' },
        ] : [
          { step: 'Select market', desc: 'Choose KOSPI, KOSDAQ, or overseas stocks.' },
          { step: 'Enter buy info', desc: 'Input buy price and quantity.' },
          { step: 'Enter sell info', desc: 'Input sell price and quantity.' },
          { step: 'View results', desc: 'Net profit and return rate after fees and taxes are shown.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '세금 자동 계산', desc: '증권거래세가 자동으로 계산되어 실제 수익률을 확인할 수 있습니다.' },
          { title: '수수료 포함', desc: '매수/매도 수수료까지 포함한 실질 수익을 보여줍니다.' },
          { title: '시장별 세율', desc: '코스피, 코스닥, 해외 주식의 다른 세율을 반영합니다.' },
          { title: '손익 시각화', desc: '수익/손실 여부를 색상으로 직관적으로 구분합니다.' },
        ] : [
          { title: 'Auto tax calculation', desc: 'Securities tax calculated automatically for accurate net return.' },
          { title: 'Fee inclusive', desc: 'Shows actual profit including buy and sell commission fees.' },
          { title: 'Market-specific rates', desc: 'Applies different rates for KOSPI, KOSDAQ, and overseas.' },
          { title: 'Profit/loss visualization', desc: 'Color-coded display for intuitive profit/loss indication.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '증권거래세란?', a: '주식을 매도할 때 부과되는 세금입니다. 코스피/코스닥은 0.2%(2024년)입니다.' },
          { q: '주식 양도소득세는?', a: '소액주주는 상장주식 양도 시 비과세입니다. 단, 대주주(코스피 1% 또는 10억원 이상 보유)는 과세 대상입니다.' },
          { q: '해외 주식 세금은?', a: '해외 주식은 양도소득세 22%(지방세 포함)가 부과됩니다. 연간 250만원 기본공제가 있습니다.' },
          { q: '증권사 수수료는 얼마인가요?', a: '증권사마다 다르지만 일반적으로 0.015~0.5% 수준입니다. 이 계산기는 0.015%를 기본값으로 사용합니다.' },
        ] : [
          { q: 'What is securities transaction tax?', a: 'Tax levied on stock sales. KOSPI/KOSDAQ rate is 0.2% (2024).' },
          { q: 'Capital gains tax on stocks?', a: 'Minority shareholders are generally exempt from CGT on listed stocks. Major shareholders (1%+ or ₩1B+) are taxable.' },
          { q: 'Overseas stock taxes?', a: 'Overseas stocks are subject to 22% capital gains tax (including local tax). Annual deduction of ₩2.5M applies.' },
          { q: 'What are brokerage fees?', a: 'Varies by broker, typically 0.015-0.5%. This calculator uses 0.015% as default.' },
        ]}
        keywords="주식 수익률 계산기 · 주식 수익 계산 · 증권거래세 · 주식 매매 수익 · 주식 투자 수익률 · stock return calculator · stock profit calculator · securities tax Korea · investment return · 주식 손익 계산"
      />
    </div>
  )
}
