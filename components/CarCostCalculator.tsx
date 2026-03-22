
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '자동차 유지비 계산기', desc: '월 유류비·보험료·주차비·감가상각 등 자동차 유지비 총액 계산.' },
  en: { title: 'Car Cost Calculator', desc: 'Calculate total monthly car ownership costs including fuel, insurance, parking, and depreciation.' }
}
function comma(n: number) { return Math.round(n).toLocaleString() }

export default function CarCostCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [carPrice, setCarPrice] = useState(30000000)
  const [monthlyKm, setMonthlyKm] = useState(1500)
  const [fuelEff, setFuelEff] = useState(12)
  const [fuelPrice, setFuelPrice] = useState(1700)
  const [insurance, setInsurance] = useState(1000000)
  const [parking, setParking] = useState(150000)
  const [maintenance, setMaintenance] = useState(50000)
  const [loan, setLoan] = useState(0)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  const monthlyFuel = Math.round((monthlyKm / fuelEff) * fuelPrice)
  const monthlyInsurance = Math.round(insurance / 12)
  const depreciation = Math.round(carPrice * 0.15 / 12) // 연 15% 감가상각
  const total = monthlyFuel + monthlyInsurance + parking + maintenance + depreciation + loan
  const annualTotal = total * 12
  const perKmCost = Math.round(total / monthlyKm)

  const items = [
    { label: lang === "ko" ? "월 유류비" : "Monthly Fuel", val: monthlyFuel, key: "fuel" },
    { label: lang === "ko" ? "보험료 (월)" : "Insurance (monthly)", val: monthlyInsurance, key: "ins" },
    { label: lang === "ko" ? "주차비" : "Parking", val: parking, key: "park" },
    { label: lang === "ko" ? "유지보수" : "Maintenance", val: maintenance, key: "maint" },
    { label: lang === "ko" ? "감가상각" : "Depreciation", val: depreciation, key: "dep" },
    { label: lang === "ko" ? "할부금" : "Loan Payment", val: loan, key: "loan" },
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
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex flex-col gap-3">
          {[
            [lang==="ko"?"차량 가격":"Car Price", carPrice, setCarPrice, 1000000],
            [lang==="ko"?"월 주행거리 (km)":"Monthly km", monthlyKm, setMonthlyKm, 100],
            [lang==="ko"?"연비 (km/L)":"Fuel Economy", fuelEff, setFuelEff, 1],
            [lang==="ko"?"유류비 (원/L)":"Fuel Price/L", fuelPrice, setFuelPrice, 10],
            [lang==="ko"?"연 보험료":"Annual Insurance", insurance, setInsurance, 100000],
            [lang==="ko"?"월 주차비":"Monthly Parking", parking, setParking, 10000],
            [lang==="ko"?"월 유지보수":"Monthly Maintenance", maintenance, setMaintenance, 10000],
            [lang==="ko"?"월 할부금":"Monthly Loan", loan, setLoan, 10000],
          ].map(([l, v, s, step]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
              <input type="number" value={v as number} step={step as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5">
            <p className="text-xs text-slate-400 mb-1">{lang==="ko"?"월 총 유지비":"Monthly Total Cost"}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(total)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang==="ko"?`연간: ₩${comma(annualTotal)} | km당: ₩${perKmCost}`:`Annual: ₩${comma(annualTotal)} | Per km: ₩${perKmCost}`}</p>
          </div>
          {items.map(r => (
            <div key={r.key} className="flex justify-between items-center p-3 rounded-lg border border-surface-border bg-[#1a1d27]">
              <span className="text-xs text-slate-400">{r.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-200">₩{comma(r.val)}</span>
                <button onClick={() => copy(String(r.val), r.key)} className={`p-1 rounded border transition-all ${copied===r.key?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-600 hover:text-brand-400"}`}>
                  {copied===r.key?<CheckCheck size={11}/>:<Copy size={11}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToolFooter
        toolName={lang==="ko"?"자동차 유지비 계산기":"Car Cost Calculator"}
        toolUrl="https://keyword-mixer.vercel.app/car-cost-calculator"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"차량 정보 입력", desc:"차량 가격, 연비, 월 주행거리를 입력하세요."},
          {step:"고정 비용 입력", desc:"보험료, 주차비, 유지보수비를 입력하세요."},
          {step:"결과 확인", desc:"월 총 유지비와 km당 비용이 계산됩니다."},
          {step:"복사", desc:"각 항목 금액을 복사해 가계부에 활용하세요."},
        ]:[
          {step:"Enter vehicle info", desc:"Input car price, fuel economy, and monthly km."},
          {step:"Enter fixed costs", desc:"Add insurance, parking, and maintenance costs."},
          {step:"View results", desc:"Monthly total and per-km cost are calculated."},
          {step:"Copy values", desc:"Copy individual costs for budgeting."},
        ]}
        whyUse={lang==="ko"?[
          {title:"감가상각 포함", desc:"차량 구입가의 연 15% 감가상각을 자동 반영합니다."},
          {title:"km당 비용", desc:"실제 주행 1km당 드는 총 비용을 계산합니다."},
          {title:"연간 비용 환산", desc:"월 비용을 연간 환산해 전체 규모를 파악합니다."},
          {title:"항목별 비용", desc:"유류비, 보험, 주차 등 항목별로 비용을 파악합니다."},
        ]:[
          {title:"Depreciation included", desc:"Auto-applies 15% annual depreciation on car value."},
          {title:"Per-km cost", desc:"Calculates total cost per kilometer driven."},
          {title:"Annual projection", desc:"Converts monthly to annual costs for full picture."},
          {title:"Itemized breakdown", desc:"See individual costs for fuel, insurance, parking etc."},
        ]}
        faqs={lang==="ko"?[
          {q:"자동차 유지비는 얼마가 적당한가요?", a:"일반적으로 차량 구입가의 연 15~20%(월 1.25~1.67%)가 유지비로 추산됩니다. 월 소득의 10~15% 이하로 관리하는 것을 권장합니다."},
          {q:"감가상각이란?", a:"시간이 지남에 따라 차량 가치가 감소하는 것입니다. 신차는 첫 해 약 20%, 이후 연 10~15% 감소합니다."},
          {q:"중고차와 신차 중 유지비는?", a:"신차는 보증기간 내 수리비가 낮지만 감가상각이 큽니다. 중고차는 수리비가 높을 수 있지만 감가상각이 낮습니다."},
          {q:"전기차 유지비는 얼마인가요?", a:"전기차는 유류비 대신 충전비(가솔린의 30~40%)가 들며, 엔진오일 교환이 없어 유지보수비가 낮습니다. 단, 배터리 교체 비용은 별도입니다."},
        ]:[
          {q:"What is a reasonable car cost?", a:"Typically 15-20% of car purchase price annually (1.25-1.67%/month). Recommended to keep under 10-15% of monthly income."},
          {q:"What is depreciation?", a:"The decrease in car value over time. New cars lose ~20% in year 1, then 10-15% annually."},
          {q:"New vs used car costs?", a:"New cars have lower repair costs but higher depreciation. Used cars may have higher repairs but lower depreciation."},
          {q:"EV ownership costs?", a:"EVs replace fuel with charging (30-40% of gas cost) and have no oil changes. Battery replacement is a separate major cost."},
        ]}
        keywords="자동차 유지비 · 차량 유지비 계산 · 자동차 유류비 · 차 유지비 · 월 자동차 비용 · car cost calculator · monthly car expenses · vehicle running cost · car ownership cost · 자동차 감가상각"
      />
    </div>
  )
}
