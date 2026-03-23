'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '연료비 계산기', desc: '여행·출퇴근 연료비를 즉시 계산. 휘발유·경유·LPG·전기차 비용 비교. 주유 예산 계획.' },
  en: { title: 'Fuel Cost Calculator', desc: 'Calculate travel and commute fuel costs instantly. Compare gasoline, diesel, LPG, and EV costs.' }
}

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

const FUEL_TYPES = [
  { key: 'gasoline', ko: '휘발유', en: 'Gasoline', price: 1700, color: 'text-orange-400' },
  { key: 'diesel', ko: '경유', en: 'Diesel', price: 1550, color: 'text-yellow-400' },
  { key: 'lpg', ko: 'LPG', en: 'LPG', price: 1000, color: 'text-blue-400' },
  { key: 'ev', ko: '전기차', en: 'EV', price: 347, color: 'text-brand-400' },
]

export default function FuelCost() {
  const { lang } = useLang()
  const tx = T[lang]
  const [distance, setDistance] = useState(100)
  const [efficiency, setEfficiency] = useState(12)
  const [fuelType, setFuelType] = useState('gasoline')
  const [fuelPrice, setFuelPrice] = useState(1700)
  const [monthlyKm, setMonthlyKm] = useState(2000)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const selected = FUEL_TYPES.find(f => f.key === fuelType)!
  const isEV = fuelType === 'ev'

  // 1회 여행 비용 (전기차는 kWh/100km 기준)
  const fuelNeeded = isEV ? (distance / 100) * efficiency : distance / efficiency
  const tripCost = Math.round(fuelNeeded * fuelPrice)
  const monthlyFuelCost = Math.round((monthlyKm / (isEV ? 100 : 1)) * (isEV ? efficiency : 1) / (isEV ? 1 : efficiency) * fuelPrice)
  const yearlyFuelCost = monthlyFuelCost * 12

  const perKmCost = Math.round(tripCost / distance)

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
        {/* 연료 유형 */}
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-2 block font-medium">{lang === 'ko' ? '연료 유형' : 'Fuel Type'}</label>
          <div className="grid grid-cols-4 gap-2">
            {FUEL_TYPES.map(f => (
              <button key={f.key} onClick={() => { setFuelType(f.key); setFuelPrice(f.price); setEfficiency(f.key === 'ev' ? 20 : 12) }}
                className={`py-2 rounded-lg border text-xs font-medium transition-all ${fuelType === f.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {lang === 'ko' ? f.ko : f.en}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '거리 (km)' : 'Distance (km)'}</label>
            <input type="number" value={distance} step={10} onChange={e => setDistance(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <div className="flex gap-1 mt-1.5">
              {[10, 50, 100, 200, 400].map(d => (
                <button key={d} onClick={() => setDistance(d)} className={`flex-1 py-1 rounded text-xs border transition-all ${distance === d ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">
              {isEV ? (lang === 'ko' ? '전력소비 (kWh/100km)' : 'Consumption (kWh/100km)') : (lang === 'ko' ? '연비 (km/L)' : 'Fuel Economy (km/L)')}
            </label>
            <input type="number" value={efficiency} step={isEV ? 1 : 0.5} onChange={e => setEfficiency(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">
              {isEV ? (lang === 'ko' ? '전기 단가 (원/kWh)' : 'Electricity (₩/kWh)') : (lang === 'ko' ? '유가 (원/L)' : 'Fuel Price (₩/L)')}
            </label>
            <input type="number" value={fuelPrice} step={10} onChange={e => setFuelPrice(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '월 주행거리 (km)' : 'Monthly km'}</label>
            <input type="number" value={monthlyKm} step={100} onChange={e => setMonthlyKm(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{lang === 'ko' ? `${distance}km 편도 연료비` : `${distance}km Trip Cost`}</p>
              <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(tripCost)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {isEV
                  ? `${fuelNeeded.toFixed(1)} kWh × ₩${fuelPrice}`
                  : `${fuelNeeded.toFixed(2)}L × ₩${fuelPrice} | km당 ₩${perKmCost}`}
              </p>
            </div>
            <button onClick={() => copy(String(tripCost), 'trip')} className={`p-2.5 rounded-xl border transition-all ${copied === 'trip' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied === 'trip' ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        {[
          { label: lang === 'ko' ? '월 연료비' : 'Monthly Cost', val: monthlyFuelCost, key: 'monthly' },
          { label: lang === 'ko' ? '연간 연료비' : 'Annual Cost', val: yearlyFuelCost, key: 'yearly' },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className="text-xl font-bold text-slate-200 font-mono">₩{comma(r.val)}</p>
            </div>
            <button onClick={() => copy(String(r.val), r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>

      {/* 연료 유형 비교 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '🚗 연료 유형별 비교 (현재 거리 기준)' : '🚗 Comparison by Fuel Type'}</p>
        <div className="flex flex-col gap-2">
          {FUEL_TYPES.map(f => {
            const eff = f.key === 'ev' ? 20 : 12
            const needed = f.key === 'ev' ? (distance / 100) * eff : distance / eff
            const cost = Math.round(needed * f.price)
            return (
              <div key={f.key} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-16 flex-shrink-0">{lang === 'ko' ? f.ko : f.en}</span>
                <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.color.replace('text-', 'bg-')}`}
                    style={{ width: `${(cost / Math.max(...FUEL_TYPES.map(x => { const e = x.key === 'ev' ? 20 : 12; const n = x.key === 'ev' ? (distance / 100) * e : distance / e; return n * x.price }))) * 100}%` }} />
                </div>
                <span className={`text-xs font-mono font-bold w-20 text-right ${f.color}`}>₩{comma(cost)}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-600 mt-2">{lang === 'ko' ? '* 기본 연비: 내연기관 12km/L, 전기차 20kWh/100km 기준' : '* Default: ICE 12km/L, EV 20kWh/100km'}</p>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '연료비 계산기' : 'Fuel Cost Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/fuel-cost"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '연료 유형 선택', desc: '휘발유, 경유, LPG, 전기차 중 차량 연료 유형을 선택하세요.' },
          { step: '거리와 연비 입력', desc: '여행할 거리와 차량 연비를 입력하세요.' },
          { step: '유가 설정', desc: '현재 유가(또는 전기 단가)를 입력하세요.' },
          { step: '결과 확인', desc: '편도 연료비, 월 연료비, 연간 연료비가 계산됩니다.' },
        ] : [
          { step: 'Select fuel type', desc: 'Choose gasoline, diesel, LPG, or EV.' },
          { step: 'Enter distance and efficiency', desc: 'Input trip distance and fuel economy.' },
          { step: 'Set fuel price', desc: 'Enter current fuel price or electricity rate.' },
          { step: 'View results', desc: 'Trip, monthly, and annual fuel costs are calculated.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 연료 유형 비교', desc: '휘발유, 경유, LPG, 전기차의 실제 비용을 비교합니다.' },
          { title: '월/연간 예산 계획', desc: '월 주행거리를 입력해 연간 연료 예산을 계획할 수 있습니다.' },
          { title: 'km당 비용 계산', desc: '주행 1km당 드는 연료비를 계산합니다.' },
          { title: '전기차 vs 내연기관 비교', desc: '전기차와 내연기관의 실제 연료비 차이를 비교합니다.' },
        ] : [
          { title: '4 fuel type comparison', desc: 'Compare actual costs for gasoline, diesel, LPG, and EV.' },
          { title: 'Monthly/annual budget', desc: 'Plan annual fuel budget by entering monthly mileage.' },
          { title: 'Cost per km', desc: 'Calculates fuel cost per kilometer driven.' },
          { title: 'EV vs ICE comparison', desc: 'Compare actual fuel cost difference between EV and conventional.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '현재 유가는 어디서 확인하나요?', a: '한국석유공사 오피넷(www.opinet.co.kr)에서 전국 주유소별 실시간 유가를 확인할 수 있습니다.' },
          { q: '전기차 충전 단가는?', a: '공공 급속 충전기 약 350원/kWh, 완속 약 250원/kWh, 가정용 약 100~160원/kWh입니다. 충전 방식과 시간대에 따라 다릅니다.' },
          { q: '같은 거리를 달려도 연료비가 다른 이유는?', a: '주행 방식(고속/시내), 에어컨 사용, 짐의 무게, 타이어 공기압 등에 따라 실제 연비가 달라집니다.' },
          { q: '내연기관을 전기차로 바꾸면 얼마나 절약되나요?', a: '이 계산기의 연료 유형 비교를 활용하세요. 일반적으로 같은 거리를 달릴 때 전기차는 휘발유 대비 80% 정도 연료비가 절약됩니다.' },
        ] : [
          { q: 'Where to check current fuel prices?', a: 'In Korea, check Opinet (www.opinet.co.kr) for real-time prices at gas stations nationwide.' },
          { q: 'EV charging cost?', a: 'Public fast charger ~₩350/kWh, slow charger ~₩250/kWh, home charging ~₩100-160/kWh. Varies by method and time.' },
          { q: 'Why does fuel cost vary for same distance?', a: 'Driving style (highway/city), AC use, cargo weight, and tire pressure all affect actual fuel economy.' },
          { q: 'How much saves switching to EV?', a: 'Use the fuel type comparison in this calculator. EVs typically save ~80% on fuel costs vs gasoline for the same distance.' },
        ]}
        keywords="연료비 계산기 · 기름값 계산기 · 유류비 계산 · 주유비 계산 · 전기차 연료비 · 고속도로 기름값 · fuel cost calculator · gas cost calculator · fuel expense · EV vs gasoline cost · 연비 계산기"
      />
    </div>
  )
}
