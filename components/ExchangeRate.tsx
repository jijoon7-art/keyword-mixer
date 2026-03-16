'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, ArrowLeftRight, Copy, CheckCheck } from 'lucide-react'

const CURRENCIES = [
  { code: 'KRW', name: '한국 원', flag: '🇰🇷', symbol: '₩' },
  { code: 'USD', name: '미국 달러', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: '유로', flag: '🇪🇺', symbol: '€' },
  { code: 'JPY', name: '일본 엔', flag: '🇯🇵', symbol: '¥' },
  { code: 'CNY', name: '중국 위안', flag: '🇨🇳', symbol: '¥' },
  { code: 'GBP', name: '영국 파운드', flag: '🇬🇧', symbol: '£' },
  { code: 'AUD', name: '호주 달러', flag: '🇦🇺', symbol: 'A$' },
  { code: 'CAD', name: '캐나다 달러', flag: '🇨🇦', symbol: 'C$' },
  { code: 'CHF', name: '스위스 프랑', flag: '🇨🇭', symbol: 'Fr' },
  { code: 'HKD', name: '홍콩 달러', flag: '🇭🇰', symbol: 'HK$' },
  { code: 'SGD', name: '싱가포르 달러', flag: '🇸🇬', symbol: 'S$' },
  { code: 'THB', name: '태국 바트', flag: '🇹🇭', symbol: '฿' },
  { code: 'VND', name: '베트남 동', flag: '🇻🇳', symbol: '₫' },
  { code: 'MYR', name: '말레이시아 링깃', flag: '🇲🇾', symbol: 'RM' },
  { code: 'NZD', name: '뉴질랜드 달러', flag: '🇳🇿', symbol: 'NZ$' },
]

export default function ExchangeRate() {
  const [rates, setRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [amount, setAmount] = useState('1')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('KRW')
  const [copied, setCopied] = useState(false)

  const fetchRates = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      const data = await res.json()
      setRates(data.rates)
      setLastUpdated(new Date().toLocaleString('ko-KR'))
    } catch {
      // 폴백 데이터 (근사값)
      setRates({
        KRW: 1370, USD: 1, EUR: 0.92, JPY: 149, CNY: 7.24, GBP: 0.79,
        AUD: 1.54, CAD: 1.36, CHF: 0.88, HKD: 7.82, SGD: 1.34,
        THB: 35.1, VND: 25000, MYR: 4.72, NZD: 1.62,
      })
      setError('실시간 데이터를 불러오지 못했어요. 근사값이 표시됩니다.')
      setLastUpdated('근사값 (오프라인)')
    }
    setLoading(false)
  }

  useEffect(() => { fetchRates() }, [])

  const convert = (amt: number, fromCode: string, toCode: string): number => {
    if (!rates[fromCode] || !rates[toCode]) return 0
    const inUSD = amt / rates[fromCode]
    return inUSD * rates[toCode]
  }

  const result = convert(parseFloat(amount) || 0, from, to)

  const swap = () => { setFrom(to); setTo(from) }

  const copy = async () => {
    await navigator.clipboard.writeText(`${result.toLocaleString('ko-KR', { maximumFractionDigits: 2 })} ${to}`)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  const fromCur = CURRENCIES.find(c => c.code === from)
  const toCur = CURRENCIES.find(c => c.code === to)

  // 주요 통화 대 KRW 환율표
  const krwRates = CURRENCIES.filter(c => c.code !== 'KRW').map(c => ({
    ...c,
    rate: convert(1, c.code, 'KRW'),
    rateKrw: convert(1000, 'KRW', c.code),
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          실시간 환율
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">환율 계산기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          실시간 환율로 15개 주요 통화 즉시 변환. 달러·엔·유로·위안 환율 한눈에 확인.
        </p>
      </div>

      {/* 환율 변환기 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-200">환율 변환</p>
          <div className="flex items-center gap-2">
            {lastUpdated && <span className="text-xs text-slate-500">업데이트: {lastUpdated}</span>}
            <button onClick={fetchRates} className="p-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-amber-400 mb-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">{error}</p>}

        <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">금액</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <select value={from} onChange={e => setFrom(e.target.value)}
              className="w-full mt-2 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
            </select>
          </div>

          <button onClick={swap} className="mb-0.5 px-3 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all">
            <ArrowLeftRight size={16} />
          </button>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">결과</label>
            <div className="w-full bg-[#0f1117] border border-brand-500/30 rounded-xl px-4 py-3 text-brand-400 text-xl font-mono flex items-center min-h-[52px]">
              {loading ? '...' : result.toLocaleString('ko-KR', { maximumFractionDigits: 4 })}
            </div>
            <select value={to} onChange={e => setTo(e.target.value)}
              className="w-full mt-2 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all">
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>)}
            </select>
          </div>
        </div>

        {!loading && result > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f1117] border border-surface-border">
            <p className="text-sm text-slate-300">
              <span className="text-brand-400 font-bold">{(parseFloat(amount) || 1).toLocaleString()} {fromCur?.flag} {from}</span>
              {' = '}
              <span className="text-white font-bold">{result.toLocaleString('ko-KR', { maximumFractionDigits: 4 })} {toCur?.flag} {to}</span>
            </p>
            <button onClick={copy} className={`p-1.5 rounded-lg border transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40'}`}>
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        )}
      </div>

      {/* 환율표 */}
      {!loading && Object.keys(rates).length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-border">
            <p className="text-sm font-medium text-slate-200">💱 주요 통화 환율표 (기준: 1 외화 → 원화)</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-surface-border">
            {krwRates.slice(0, 12).map(c => (
              <div key={c.code} className="p-3 hover:bg-surface-hover/20 transition-all cursor-pointer"
                onClick={() => { setFrom(c.code); setTo('KRW'); setAmount('1') }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{c.flag}</span>
                  <span className="text-xs font-bold text-slate-300">{c.code}</span>
                  <span className="text-xs text-slate-500">{c.name}</span>
                </div>
                <p className="text-sm font-bold text-brand-400">
                  ₩{c.rate.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-slate-500">
                  ₩1,000 = {c.rateKrw.toFixed(4)} {c.code}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 p-5 rounded-xl border border-surface-border/30 bg-[#1a1d27]/50">
        <p className="text-xs text-slate-500 leading-relaxed">
          환율 계산기 · 달러 환율 · 엔 환율 · 유로 환율 · 위안 환율 · 실시간 환율 · 오늘 환율 · 환전 계산기 ·
          exchange rate calculator · currency converter · USD KRW · JPY KRW · EUR KRW · 환율 조회
        </p>
      </div>
    </div>
  )
}
