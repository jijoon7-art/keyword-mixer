
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '가스요금 계산기', desc: '월 가스 사용량으로 예상 요금 계산. 주택용·업소용 요금 구분, 계절별 단가 반영.' },
  en: { title: 'Gas Bill Calculator', desc: 'Estimate gas bills from monthly usage. Residential and commercial rates with seasonal pricing.' }
}
function comma(n: number) { return Math.round(n).toLocaleString() }

export default function GasCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [usage, setUsage] = useState(30)
  const [type, setType] = useState<"residential"|"commercial">("residential")
  const [season, setSeason] = useState<"winter"|"summer">("winter")
  const [copied, setCopied] = useState(false)

  // 한국 도시가스 요금 (2024년 기준, 단위: MJ)
  const rates = {
    residential: { winter: 21.86, summer: 16.94 }, // 원/MJ
    commercial: { winter: 23.5, summer: 18.2 },
  }
  const calorific = 43.1 // MJ/m³ (LNG 열량)
  const mj = usage * calorific
  const baseCharge = type === "residential" ? 1440 : 2880
  const unitRate = rates[type][season]
  const rawBill = baseCharge + mj * unitRate
  const vat = rawBill * 0.1
  const total = Math.round(rawBill + vat)
  const perM3 = Math.round(total / usage)

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
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[["residential", lang==="ko"?"주택용":"Residential"], ["commercial", lang==="ko"?"업소용":"Commercial"]].map(([v,l]) => (
            <button key={v} onClick={() => setType(v as any)}
              className={`py-2 rounded-lg border text-sm font-medium transition-all ${type===v?"bg-brand-500 border-brand-500 text-white font-bold":"border-surface-border text-slate-300 bg-[#0f1117]"}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[["winter", lang==="ko"?"동절기 (11~3월)":"Winter (Nov-Mar)"], ["summer", lang==="ko"?"하절기 (4~10월)":"Summer (Apr-Oct)"]].map(([v,l]) => (
            <button key={v} onClick={() => setSeason(v as any)}
              className={`py-2 rounded-lg border text-xs font-medium transition-all ${season===v?"bg-brand-500 border-brand-500 text-white font-bold":"border-surface-border text-slate-300 bg-[#0f1117]"}`}>{l}</button>
          ))}
        </div>
        <label className="text-xs text-slate-400 mb-1.5 block">{lang==="ko"?"월 사용량 (m³)":"Monthly Usage (m³)"}</label>
        <input type="number" value={usage} step={5} onChange={e => setUsage(+e.target.value)}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
        <div className="flex gap-1.5">
          {[10,20,30,50,80,100].map(v => (
            <button key={v} onClick={() => setUsage(v)}
              className={`flex-1 py-1 rounded border text-xs transition-all ${usage===v?"bg-brand-500 border-brand-500 text-white":"border-surface-border text-slate-500 bg-[#0f1117]"}`}>{v}m³</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400">{lang==="ko"?"월 예상 가스요금":"Est. Monthly Gas Bill"}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(total)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang==="ko"?`m³당 ₩${perM3} | 부가세 포함`:`₩${perM3}/m³ incl. VAT`}</p>
          </div>
          <button onClick={async () => { await navigator.clipboard.writeText(String(total)); setCopied(true); setTimeout(() => setCopied(false),1500) }}
            className={`p-2.5 rounded-xl border transition-all ${copied?"bg-brand-500/20 border-brand-500/40 text-brand-400":"border-surface-border text-slate-400 hover:text-brand-400"}`}>
            {copied?<CheckCheck size={16}/>:<Copy size={16}/>}
          </button>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          {[
            [lang==="ko"?"기본요금":"Base Charge", `₩${comma(baseCharge)}`],
            [lang==="ko"?"사용요금":"Usage Charge", `₩${comma(Math.round(mj*unitRate))}`],
            [lang==="ko"?"부가세 10%":"VAT 10%", `₩${comma(Math.round(vat))}`],
          ].map(([l,v]) => (
            <div key={l as string} className="flex justify-between">
              <span className="text-slate-500">{l as string}</span><span className="text-slate-300 font-mono">{v as string}</span>
            </div>
          ))}
        </div>
      </div>
      <ToolFooter
        toolName={lang==="ko"?"가스요금 계산기":"Gas Bill Calculator"}
        toolUrl="https://keyword-mixer.vercel.app/gas-calculator"
        description={tx.desc}
        howToUse={lang==="ko"?[
          {step:"요금 유형 선택", desc:"주택용 또는 업소용을 선택하세요."},
          {step:"계절 선택", desc:"현재 계절에 맞는 동절기/하절기를 선택하세요."},
          {step:"사용량 입력", desc:"가스 고지서의 월 사용량(m³)을 입력하세요."},
          {step:"요금 확인", desc:"기본요금, 사용요금, 부가세가 포함된 총요금이 계산됩니다."},
        ]:[
          {step:"Select rate type", desc:"Choose residential or commercial."},
          {step:"Select season", desc:"Choose winter or summer rate period."},
          {step:"Enter usage", desc:"Input monthly usage in m³ from your gas bill."},
          {step:"View bill", desc:"Base charge, usage charge, and VAT are all calculated."},
        ]}
        whyUse={lang==="ko"?[
          {title:"계절별 단가 반영", desc:"동절기와 하절기의 다른 가스 단가를 구분해 계산합니다."},
          {title:"부가세 포함 계산", desc:"부가세 10%가 포함된 실제 납부 금액을 보여줍니다."},
          {title:"m³당 단가 표시", desc:"m³당 실제 단가를 표시해 요금 적정성을 판단할 수 있습니다."},
          {title:"주택/업소 구분", desc:"주택용과 업소용 다른 요금체계를 지원합니다."},
        ]:[
          {title:"Seasonal rates", desc:"Applies different winter and summer unit rates."},
          {title:"VAT included", desc:"Shows total payment including 10% VAT."},
          {title:"Per-m³ rate display", desc:"Shows actual unit price for cost evaluation."},
          {title:"Residential/commercial", desc:"Supports both residential and commercial rate structures."},
        ]}
        faqs={lang==="ko"?[
          {q:"도시가스 요금 구조는?", a:"기본요금(고정) + 사용요금(사용량×단가) + 부가세로 구성됩니다. 단가는 계절과 요금제에 따라 다릅니다."},
          {q:"동절기와 하절기 요금 차이는?", a:"동절기(11~3월)는 수요가 많아 단가가 높고, 하절기(4~10월)는 단가가 낮습니다. 차이는 약 20~30% 수준입니다."},
          {q:"가스 사용량을 줄이는 방법은?", a:"보일러 온도를 18~20°C로 유지, 외출 시 외출 모드 사용, 단열재 보강, 절수형 샤워헤드 사용이 효과적입니다."},
          {q:"가스요금과 지역 차이가 있나요?", a:"도시가스 요금은 지역별 가스 공급사에 따라 다릅니다. 이 계산기는 평균 요금을 기반으로 합니다."},
        ]:[
          {q:"How is gas bill structured?", a:"Base charge (fixed) + usage charge (volume × rate) + 10% VAT. Rates vary by season and customer type."},
          {q:"Winter vs summer rate difference?", a:"Winter (Nov-Mar) has higher rates due to demand. Summer (Apr-Oct) is lower by about 20-30%."},
          {q:"How to reduce gas usage?", a:"Set boiler to 18-20°C, use vacation mode when out, improve insulation, use water-efficient showerheads."},
          {q:"Do rates vary by region?", a:"Korean gas rates vary by regional supplier. This calculator uses average national rates."},
        ]}
        keywords="가스요금 계산기 · 도시가스 요금 · 가스비 계산 · 월 가스요금 · 가스요금 단가 · gas bill calculator Korea · gas cost calculator · monthly gas bill · 가스비 얼마 · 동절기 가스요금"
      />
    </div>
  )
}
