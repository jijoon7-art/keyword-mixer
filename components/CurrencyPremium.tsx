'use client'
import { useState, useEffect } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '환전 우대율 계산기', desc: '환전 수수료와 우대율을 적용한 실제 환전 금액 계산. 은행·공항·환전소 비교.' },
  en: { title: 'Currency Exchange Premium Calculator', desc: 'Calculate actual exchange amount after fees and discount rates. Compare bank, airport, and exchange booth rates.' }
}
function comma(n: number) { return n.toLocaleString('ko-KR', { maximumFractionDigits: 2 }) }

const PRESETS = [
  { label: '우리은행', labelEn: 'Woori Bank', discount: 50 },
  { label: '국민은행', labelEn: 'Kookmin Bank', discount: 50 },
  { label: '신한은행', labelEn: 'Shinhan Bank', discount: 50 },
  { label: '인터넷뱅킹', labelEn: 'Internet Banking', discount: 90 },
  { label: '공항 환전소', labelEn: 'Airport Booth', discount: 0 },
  { label: '시내 환전소', labelEn: 'City Exchange', discount: 30 },
]

export default function CurrencyPremium() {
  const { lang } = useLang()
  const tx = T[lang]
  const [amount, setAmount] = useState(1000000)
  const [rate, setRate] = useState(1370)
  const [spread, setSpread] = useState(1.75)
  const [discount, setDiscount] = useState(50)
  const [direction, setDirection] = useState<'buy'|'sell'>('buy')
  const [copied, setCopied] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const fetchRate = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      const data = await res.json()
      if (data.rates?.KRW) setRate(Math.round(data.rates.KRW))
    } catch {}
    setLoading(false)
  }
  useEffect(() => { fetchRate() }, [])

  // 스프레드 계산
  const spreadAmount = rate * (spread / 100)
  const discountedSpread = spreadAmount * (1 - discount / 100)
  const actualSpread = spreadAmount - discountedSpread // 우대 후 실제 스프레드

  // 매수환율 (달러 살 때): 기준율 + 스프레드
  // 매도환율 (달러 팔 때): 기준율 - 스프레드
  const buyRate = rate + discountedSpread  // 우대 적용 매수율
  const sellRate = rate - discountedSpread  // 우대 적용 매도율
  const baseRate = direction === 'buy' ? rate + spreadAmount : rate - spreadAmount
  const finalRate = direction === 'buy' ? buyRate : sellRate

  // KRW → USD 계산
  const usdAmount = amount / finalRate
  const savedKRW = Math.round((amount / baseRate - amount / finalRate) * finalRate) // 우대로 절약한 금액

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
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-400 font-medium">{lang === 'ko' ? '기준환율 (USD/KRW)' : 'Base Rate (USD/KRW)'}</p>
          <button onClick={fetchRate} className="text-xs text-brand-400 flex items-center gap-1 hover:text-brand-300 transition-all">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {lang === 'ko' ? '실시간 환율' : 'Live Rate'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '기준환율' : 'Base Rate'}</label>
            <input type="number" value={rate} onChange={e => setRate(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '환전 스프레드 (%)' : 'Spread (%)'}</label>
            <input type="number" value={spread} step={0.25} onChange={e => setSpread(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">{lang === 'ko' ? '우대율 (%)' : 'Discount (%)'}</label>
            <input type="number" value={discount} min={0} max={100} onChange={e => setDiscount(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        {/* 우대율 프리셋 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => setDiscount(p.discount)}
              className={`text-xs px-2.5 py-1 rounded border transition-all ${discount === p.discount ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
              {lang === 'ko' ? p.label : p.labelEn} {p.discount}%
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {[['buy', lang === 'ko' ? '달러 매수 (KRW→USD)' : 'Buy USD (KRW→USD)'], ['sell', lang === 'ko' ? '달러 매도 (USD→KRW)' : 'Sell USD (USD→KRW)']].map(([v, l]) => (
            <button key={v} onClick={() => setDirection(v as 'buy'|'sell')}
              className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${direction === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '환전 금액 (원)' : 'Amount (KRW)'}</label>
          <input type="number" value={amount} step={100000} onChange={e => setAmount(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: lang === 'ko' ? '우대 전 환율' : 'Rate before discount', val: direction === 'buy' ? `₩${comma(baseRate)}` : `₩${comma(baseRate)}`, key: 'base', highlight: false },
          { label: lang === 'ko' ? `우대 후 환율 (${discount}% 우대)` : `Rate after ${discount}% discount`, val: direction === 'buy' ? `₩${comma(finalRate)}` : `₩${comma(finalRate)}`, key: 'final', highlight: false },
          { label: lang === 'ko' ? `수령 달러` : 'USD Received', val: `$${comma(usdAmount)}`, key: 'usd', highlight: true },
          { label: lang === 'ko' ? '우대로 절약한 금액' : 'Amount saved by discount', val: `₩${comma(Math.abs(savedKRW))}`, key: 'saved', highlight: false },
        ].map(r => (
          <div key={r.key} className={`flex items-center justify-between p-3 rounded-xl border ${r.highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
            <p className="text-xs text-slate-400">{r.label}</p>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
              <button onClick={() => copy(r.val.replace(/[₩$,]/g,''), r.key)} className={`p-1 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                {copied === r.key ? <CheckCheck size={11}/> : <Copy size={11}/>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '환전 우대율 계산기' : 'Exchange Discount Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/currency-premium"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '기준환율 확인', desc: '실시간 환율 버튼으로 현재 환율을 가져오거나 직접 입력하세요.' },
          { step: '우대율 선택', desc: '은행·인터넷뱅킹·공항 중 이용할 환전 방법을 선택하세요.' },
          { step: '환전 방향 선택', desc: '달러 매수(KRW→USD) 또는 매도(USD→KRW)를 선택하세요.' },
          { step: '금액 입력', desc: '환전할 금액을 입력하면 실제 수령액이 즉시 계산됩니다.' },
        ] : [
          { step: 'Check base rate', desc: 'Click live rate button or enter rate manually.' },
          { step: 'Select discount', desc: 'Choose bank, internet banking, or airport preset.' },
          { step: 'Select direction', desc: 'Choose buying or selling USD.' },
          { step: 'Enter amount', desc: 'Input amount to see actual exchange amount instantly.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '실시간 환율 연동', desc: '현재 달러 환율을 자동으로 가져와 계산합니다.' },
          { title: '우대율 비교', desc: '은행·인터넷뱅킹·공항 환전소별 우대율을 프리셋으로 제공합니다.' },
          { title: '절약 금액 표시', desc: '우대율 적용으로 얼마나 절약했는지 표시합니다.' },
          { title: '양방향 계산', desc: 'KRW→USD, USD→KRW 두 방향 모두 계산합니다.' },
        ] : [
          { title: 'Live exchange rates', desc: 'Automatically fetches current USD/KRW rate.' },
          { title: 'Discount rate comparison', desc: 'Bank, internet banking, and airport preset discount rates.' },
          { title: 'Savings display', desc: 'Shows how much you save with discount rates.' },
          { title: 'Bidirectional', desc: 'Calculates both KRW→USD and USD→KRW directions.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '환전 우대율이란?', a: '은행에서 제공하는 환전 스프레드 할인율입니다. 50% 우대 시 원래 스프레드(수수료)의 절반만 부과됩니다. 인터넷뱅킹이나 앱을 이용하면 최대 90%까지 우대 받을 수 있습니다.' },
          { q: '환전 스프레드란?', a: '은행이 기준환율에 더하거나 빼는 수수료입니다. 일반적으로 ±1.5~1.75% 수준이며 이 범위 내에서 매수/매도 환율이 결정됩니다.' },
          { q: '어디서 환전하는 게 가장 유리한가요?', a: '인터넷뱅킹/앱 환전이 우대율이 가장 높습니다(90%). 공항 환전소는 우대가 없어 가장 불리합니다. 여행 전 미리 인터넷뱅킹으로 환전하세요.' },
          { q: '환전 한도가 있나요?', a: '미화 기준 연간 5만달러까지 별도 신고 없이 환전 가능합니다. 초과 시 외국환거래법에 따라 신고가 필요합니다.' },
        ] : [
          { q: 'What is exchange discount rate?', a: 'Bank discount on spread fees. 50% discount means you pay only half the spread. Internet banking can offer up to 90% discount.' },
          { q: 'What is the exchange spread?', a: 'Fee the bank adds/subtracts from the base rate. Typically ±1.5-1.75%. This range determines buy/sell rates.' },
          { q: 'Where is the best place to exchange?', a: 'Internet banking apps offer the best rates (90% discount). Airport booths have no discount. Exchange before your trip online.' },
          { q: 'Is there an exchange limit?', a: 'Up to $50,000 USD equivalent per year without special reporting. Above that requires Foreign Exchange Transaction Act reporting.' },
        ]}
        keywords="환전 우대율 · 환전 계산기 · 달러 환전 · 환전 수수료 · 환전 우대 · 인터넷뱅킹 환전 · currency exchange Korea · exchange discount · USD KRW exchange · 공항 환전 · 환전 비교"
      />
    </div>
  )
}
