'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = {
  ko: { title: '은퇴 계획 계산기', desc: '은퇴 목표금액 계산, 필요 저축액 시뮬레이션. 국민연금 수령액 추정 포함.' },
  en: { title: 'Retirement Planning Calculator', desc: 'Calculate retirement target and required savings. Includes national pension estimate.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }
export default function RetirementCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [currentAge, setCurrentAge] = useState(35)
  const [retireAge, setRetireAge] = useState(60)
  const [lifeExpect, setLifeExpect] = useState(85)
  const [monthlyExpense, setMonthlyExpense] = useState(3000000)
  const [currentSavings, setCurrentSavings] = useState(50000000)
  const [monthlyContrib, setMonthlyContrib] = useState(1000000)
  const [returnRate, setReturnRate] = useState(5)
  const [inflation, setInflation] = useState(3)
  const [pensionMonthly, setPensionMonthly] = useState(1000000)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }
  const yearsToRetire = retireAge - currentAge
  const retireYears = lifeExpect - retireAge
  const adjExpense = monthlyExpense * Math.pow(1 + inflation/100, yearsToRetire)
  const monthlyNeedAfterPension = Math.max(0, adjExpense - pensionMonthly)
  const retirementTarget = monthlyNeedAfterPension * 12 * retireYears
  const r = returnRate / 100 / 12
  const n = yearsToRetire * 12
  const futureSavings = currentSavings * Math.pow(1+r, n) + (r > 0 ? monthlyContrib * ((Math.pow(1+r,n)-1)/r) : monthlyContrib * n)
  const gap = retirementTarget - futureSavings
  const isOnTrack = gap <= 0
  const addNeeded = gap > 0 && r > 0 ? gap / ((Math.pow(1+r,n)-1)/r) : 0
  const preparedness = Math.min(100, Math.round((futureSavings/retirementTarget)*100))
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex flex-col gap-2.5">
          <p className="text-xs text-slate-400 font-medium">{lang==='ko'?'개인 정보':'Personal Info'}</p>
          {[
            [lang==='ko'?'현재 나이':'Current Age', currentAge, setCurrentAge],
            [lang==='ko'?'은퇴 나이':'Retire Age', retireAge, setRetireAge],
            [lang==='ko'?'기대수명':'Life Expectancy', lifeExpect, setLifeExpect],
            [lang==='ko'?'월 생활비 (원)':'Monthly Expense (₩)', monthlyExpense, setMonthlyExpense],
            [lang==='ko'?'현재 저축액 (원)':'Current Savings (₩)', currentSavings, setCurrentSavings],
            [lang==='ko'?'월 저축액 (원)':'Monthly Contribution (₩)', monthlyContrib, setMonthlyContrib],
          ].map(([l,v,s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-0.5 block">{l as string}</label>
              <input type="number" value={v as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex flex-col gap-2.5">
          <p className="text-xs text-slate-400 font-medium">{lang==='ko'?'투자 및 연금':'Investment & Pension'}</p>
          {[
            [lang==='ko'?'예상 연 수익률 (%)':'Expected Return (%)', returnRate, setReturnRate],
            [lang==='ko'?'물가상승률 (%)':'Inflation (%)', inflation, setInflation],
            [lang==='ko'?'월 국민연금 예상액 (원)':'Expected Pension/mo (₩)', pensionMonthly, setPensionMonthly],
          ].map(([l,v,s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-0.5 block">{l as string}</label>
              <input type="number" value={v as number} step={0.1} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
          <div className={`rounded-xl border p-4 mt-2 ${isOnTrack?'border-brand-500/30 bg-brand-500/10':'border-red-500/30 bg-red-500/10'}`}>
            <p className="text-xs text-slate-400 mb-1">{lang==='ko'?'은퇴 준비도':'Retirement Readiness'}</p>
            <p className={`text-3xl font-extrabold font-mono ${isOnTrack?'text-brand-400':'text-red-400'}`}>{preparedness}%</p>
            <div className="h-2 bg-surface-border rounded-full overflow-hidden mt-2">
              <div className={`h-full rounded-full ${isOnTrack?'bg-brand-500':'bg-red-500'}`} style={{width:`${preparedness}%`}} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[
          {label:lang==='ko'?'은퇴 목표 자산':'Retirement Target', val:`₩${comma(retirementTarget)}`, key:'target', large:true},
          {label:lang==='ko'?`${retireAge}세 예상 자산`:`Assets at age ${retireAge}`, val:`₩${comma(futureSavings)}`, key:'future', large:false},
          ...(gap > 0 ? [{label:lang==='ko'?'부족 예상 금액':'Projected Shortfall', val:`-₩${comma(gap)}`, key:'gap', large:false}] : [{label:lang==='ko'?'목표 초과':'Surplus', val:`+₩${comma(-gap)}`, key:'surplus', large:false}]),
          ...(addNeeded > 0 ? [{label:lang==='ko'?'추가 필요 월 저축액':'Extra Monthly Savings', val:`₩${comma(addNeeded)}`, key:'add', large:false}] : []),
        ].map(r => (
          <div key={r.key} className={`flex items-center justify-between p-4 rounded-xl border ${r.large?'border-brand-500/40 bg-brand-500/10':'border-surface-border bg-[#1a1d27]'}`}>
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className={`font-bold font-mono ${r.large?'text-2xl text-brand-400':'text-lg text-slate-200'}`}>{r.val}</p>
            </div>
            <button onClick={() => copy(r.val.replace(/[₩+\-,]/g,''), r.key)} className={`p-2 rounded-lg border transition-all ${copied===r.key?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied===r.key?<CheckCheck size={14}/>:<Copy size={14}/>}
            </button>
          </div>
        ))}
      </div>
      <ToolFooter toolName={lang==='ko'?'은퇴 계획 계산기':'Retirement Calculator'} toolUrl="https://keyword-mixer.vercel.app/retirement-calculator" description={tx.desc}
        howToUse={lang==='ko'?[{step:'개인 정보 입력',desc:'현재 나이, 은퇴 나이, 월 생활비를 입력하세요.'},{step:'저축 정보 입력',desc:'현재 저축액과 월 저축액을 입력하세요.'},{step:'투자 조건 설정',desc:'예상 수익률, 물가상승률, 국민연금을 입력하세요.'},{step:'준비도 확인',desc:'은퇴 목표 달성도와 추가 저축액을 확인하세요.'}]:[{step:'Enter personal info',desc:'Age, retirement age, life expectancy, monthly expenses.'},{step:'Enter savings',desc:'Current savings and monthly contribution.'},{step:'Investment settings',desc:'Return rate, inflation, pension amount.'},{step:'Check readiness',desc:'See goal achievement and required additional savings.'}]}
        whyUse={lang==='ko'?[{title:'인플레이션 반영',desc:'물가상승률을 반영해 미래 생활비를 현실적으로 계산합니다.'},{title:'국민연금 포함',desc:'국민연금 예상액을 공제해 실제 필요 저축액을 계산합니다.'},{title:'준비도 시각화',desc:'목표 대비 현재 준비도를 퍼센트로 보여줍니다.'},{title:'부족분 계산',desc:'부족분 채우기 위한 추가 월 저축액을 자동 계산합니다.'}]:[{title:'Inflation adjusted',desc:'Realistically calculates future expenses.'},{title:'Pension included',desc:'Deducts pension to find actual savings needed.'},{title:'Readiness visual',desc:'Shows goal progress as percentage.'},{title:'Shortfall calc',desc:'Auto-calculates additional monthly savings needed.'}]}
        faqs={lang==='ko'?[{q:'은퇴 후 생활비는 얼마?',a:'일반적으로 은퇴 전 소득의 70~80%가 권장됩니다.'},{q:'국민연금은 얼마?',a:'국민연금공단 홈페이지에서 예상 수령액 확인 가능. 20년 가입 평균 약 70~100만원/월.'},{q:'FIRE 목표 자산은?',a:'연간 지출의 25배(4% 인출률). 월 300만원 → 목표 9억원.'},{q:'개인연금 vs 국민연금?',a:'국민연금은 공적 의무, 개인연금은 사적 선택. 개인연금은 세액공제 혜택 있음.'}]:[{q:'Retirement expense?',a:'Generally 70-80% of pre-retirement income recommended.'},{q:'National pension amount?',a:'Check NPS website. Average earner 20yr: ~₩700K-1M/month.'},{q:'FIRE target?',a:'25x annual expenses (4% rule). ₩3M/mo = ₩900M target.'},{q:'Personal vs national pension?',a:'National is mandatory public. Personal is voluntary with tax deductions.'}]}
        keywords="은퇴 계획 계산기 · 은퇴 자금 · 노후 준비 · FIRE 계산기 · retirement calculator · retirement planning · retirement savings · how much to retire" />
    </div>
  )
}
