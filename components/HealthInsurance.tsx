
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '건강보험료 계산기', desc: '직장가입자·지역가입자의 건강보험료, 장기요양보험료, 고용·산재보험료를 자동 계산.' },
  en: { title: 'Korean Health Insurance Calculator', desc: 'Calculate health insurance, long-term care, employment, and industrial accident insurance premiums for workers and self-employed.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function HealthInsurance() {
  const { lang } = useLang()
  const tx = T[lang]
  const [type, setType] = useState<'employee'|'self'>('employee')
  const [salary, setSalary] = useState(3500000)
  const [income, setIncome] = useState(50000000)
  const [assets, setAssets] = useState(100000000)
  const [car, setCar] = useState(0)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  // 2024년 직장가입자
  const HEALTH_RATE = 0.0709 // 7.09%
  const CARE_RATE = 0.9182 / 100 * 0.1227 // 장기요양
  const EMPLOY_RATE = 0.009 // 고용보험 근로자 0.9%
  const ACCIDENT_RATE = 0.015 // 산재 평균

  const employeeHealth = Math.round(salary * HEALTH_RATE / 2) // 절반 부담
  const employeeCare = Math.round(employeeHealth * 0.1227)
  const employeeEmploy = Math.round(salary * EMPLOY_RATE)
  const employeeTotal = employeeHealth + employeeCare + employeeEmploy

  // 회사 부담
  const companyHealth = employeeHealth
  const companyEmploy = Math.round(salary * 0.0115)
  const companyAccident = Math.round(salary * ACCIDENT_RATE)
  const companyTotal = companyHealth + employeeCare + companyEmploy + companyAccident

  // 지역가입자 (간략 추정)
  const incomeScore = Math.round(income / 12 / 70000)
  const assetScore = Math.round(assets / 5000000)
  const carScore = Math.round(car / 700000)
  const totalScore = incomeScore + assetScore + carScore
  const selfHealth = Math.round(totalScore * 208.4) // 2024년 부과점수당 208.4원
  const selfCare = Math.round(selfHealth * 0.1227)
  const selfTotal = selfHealth + selfCare

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['employee',lang==='ko'?'직장가입자 (근로자)':'Employee'],['self',lang==='ko'?'지역가입자 (자영업자 등)':'Self-employed']].map(([v,l]) => (
          <button key={v} onClick={() => setType(v as 'employee'|'self')} className={`flex-1 py-2.5 text-sm font-medium transition-all ${type===v?'bg-brand-500 text-white font-bold':'bg-[#1a1d27] text-slate-300'}`}>{l}</button>
        ))}
      </div>
      {type === 'employee' ? (
        <>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
            <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'월 보수월액 (세전 월급) (원)':'Monthly Salary (pre-tax) (₩)'}</label>
            <input type="number" value={salary} step={100000} onChange={e => setSalary(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
            <div className="flex flex-wrap gap-1.5">{[2000000,3000000,3500000,5000000,7000000,10000000].map(v => (
              <button key={v} onClick={() => setSalary(v)} className={`text-xs px-2 py-1 rounded border transition-all ${salary===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{v/10000}만</button>
            ))}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
              <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'👤 근로자 부담':'Worker's Share'}</p>
              {[
                [lang==='ko'?`건강보험 (${(HEALTH_RATE/2*100).toFixed(3)}%)`:'Health Insurance', employeeHealth,'eh'],
                [lang==='ko'?'장기요양 (건강보험의 12.27%)':'Long-term Care', employeeCare,'ec'],
                [lang==='ko'?'고용보험 (0.9%)':'Employment Insurance', employeeEmploy,'ee'],
              ].map(([l,v,k]) => (
                <div key={k as string} className="flex justify-between py-1.5 border-b border-brand-500/20 last:border-0 text-xs">
                  <span className="text-slate-400">{l as string}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-200 font-mono">₩{comma(v as number)}</span>
                    <button onClick={() => copy(String(v),k as string)} className={`p-0.5 rounded transition-all ${copied===k?'text-brand-400':'text-slate-600 hover:text-brand-400'}`}>{copied===k?<CheckCheck size={10}/>:<Copy size={10}/>}</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-1">
                <span className="text-sm font-bold text-slate-200">{lang==='ko'?'합계':'Total'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold text-brand-400 font-mono">₩{comma(employeeTotal)}</span>
                  <button onClick={() => copy(String(employeeTotal),'et')} className={`p-1 rounded border transition-all ${copied==='et'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>{copied==='et'?<CheckCheck size={12}/>:<Copy size={12}/>}</button>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'🏢 회사 부담 (참고)':'Company's Share (ref)'}</p>
              {[
                [lang==='ko'?'건강보험 (절반)':'Health Insurance', companyHealth,'ch'],
                [lang==='ko'?'장기요양 (절반)':'Long-term Care', employeeCare,'cc'],
                [lang==='ko'?'고용보험 (1.15%)':'Employment', companyEmploy,'ce'],
                [lang==='ko'?'산재보험 (평균 1.5%)':'Industrial Accident', companyAccident,'ca'],
              ].map(([l,v,k]) => (
                <div key={k as string} className="flex justify-between py-1.5 border-b border-surface-border last:border-0 text-xs">
                  <span className="text-slate-400">{l as string}</span>
                  <span className="text-slate-300 font-mono">₩{comma(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-1">
                <span className="text-sm font-bold text-slate-200">{lang==='ko'?'합계':'Total'}</span>
                <span className="text-base font-extrabold text-slate-200 font-mono">₩{comma(companyTotal)}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5 flex flex-col gap-3">
            {[
              [lang==='ko'?'연간 소득 (원)':'Annual Income (₩)', income, setIncome, 1000000],
              [lang==='ko'?'재산 (원)':'Assets (₩)', assets, setAssets, 10000000],
              [lang==='ko'?'자동차 가액 (원, 4000만 이하 면제)':'Vehicle Value (₩)', car, setCar, 1000000],
            ].map(([l,v,s,step]) => (
              <div key={l as string}>
                <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
                <input type="number" value={v as number} step={step as number} onChange={e => (s as Function)(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-4">
            <p className="text-xs text-slate-400 mb-2">{lang==='ko'?'지역가입자 예상 보험료':'Self-employed Premium Estimate'}</p>
            {[
              [lang==='ko'?'건강보험료':'Health Premium', selfHealth,'sh'],
              [lang==='ko'?'장기요양보험료':'Long-term Care', selfCare,'sc'],
            ].map(([l,v,k]) => (
              <div key={k as string} className="flex justify-between py-1.5 border-b border-brand-500/20 last:border-0 text-xs">
                <span className="text-slate-400">{l as string}</span>
                <span className="text-slate-200 font-mono">₩{comma(v as number)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 mt-1">
              <span className="text-sm font-bold text-slate-200">{lang==='ko'?'월 합계':'Monthly Total'}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-brand-400 font-mono">₩{comma(selfTotal)}</span>
                <button onClick={() => copy(String(selfTotal),'st')} className={`p-1.5 rounded border transition-all ${copied==='st'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>{copied==='st'?<CheckCheck size={13}/>:<Copy size={13}/>}</button>
              </div>
            </div>
          </div>
          <p className="text-xs text-yellow-500/70 text-center">⚠️ {lang==='ko'?'지역가입자 금액은 부과점수 기반 추정치로 실제와 다를 수 있습니다. 정확한 금액은 건강보험공단에서 확인하세요.':'Self-employed amount is an estimate based on points. Check with NHIS for exact figures.'}</p>
        </>
      )}
      <ToolFooter
        toolName={lang==='ko'?'건강보험료 계산기':'Health Insurance Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/health-insurance"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'가입 유형 선택',desc:'직장가입자 또는 지역가입자를 선택하세요.'},{step:'급여/소득 입력',desc:'월 급여 또는 연간 소득을 입력하세요.'},{step:'보험료 확인',desc:'건강보험료, 장기요양보험료가 자동 계산됩니다.'},{step:'복사하여 활용',desc:'계산된 금액을 복사해 재무 계획에 활용하세요.'}]:[{step:'Select type',desc:'Choose employee or self-employed.'},{step:'Enter salary/income',desc:'Input monthly salary or annual income.'},{step:'View premiums',desc:'Health and long-term care insurance calculated.'},{step:'Copy to use',desc:'Copy calculated amounts for financial planning.'}]}
        whyUse={lang==='ko'?[{title:'직장·지역 가입자 통합',desc:'직장가입자와 지역가입자 두 유형을 모두 지원합니다.'},{title:'근로자·회사 부담 분리',desc:'근로자 부담분과 회사 부담분을 각각 계산해 표시합니다.'},{title:'4대보험 통합 계산',desc:'건강·장기요양·고용·산재보험을 한번에 계산합니다.'},{title:'2024년 최신 요율',desc:'2024년 기준 최신 보험료율을 적용합니다.'}]:[{title:'Employee & self-employed',desc:'Supports both employee and self-employed types.'},{title:'Worker & company split',desc:'Shows worker's and company's share separately.'},{title:'All 4 insurances',desc:'Calculates health, care, employment, and accident insurance.'},{title:'2024 rates',desc:'Applies latest 2024 insurance premium rates.'}]}
        faqs={lang==='ko'?[{q:'4대보험이란?',a:'건강보험·고용보험·국민연금·산재보험입니다. 근로자는 4가지 모두 가입 의무가 있습니다.'},{q:'건강보험료율은?',a:'2024년 기준 7.09%, 근로자와 회사가 절반씩 부담(각 3.545%)합니다.'},{q:'장기요양보험이란?',a:'노인 등 장기 요양이 필요한 분들을 위한 보험입니다. 건강보험료의 12.27%로 계산됩니다.'},{q:'지역가입자 산정 방법은?',a:'소득·재산·자동차를 점수화해 점수당 208.4원(2024년)을 곱해 산정합니다.'}]:[{q:'What are the 4 major insurances?',a:'Health, employment, national pension, and industrial accident insurance. All mandatory for workers.'},{q:'Health insurance rate?',a:'7.09% in 2024, split equally between worker and company (3.545% each).'},{q:'What is long-term care insurance?',a:'Insurance for elderly needing long-term care. Calculated as 12.27% of health insurance premium.'},{q:'How is self-employed rate calculated?',a:'Income, assets, and vehicle are converted to points, multiplied by ₩208.4 per point (2024).'}]}
        keywords="건강보험료 계산기 · 4대보험 계산기 · 직장가입자 건강보험 · 지역가입자 건강보험 · 장기요양보험료 · Korean health insurance calculator · NHIS premium calculator"
      />
    </div>
  )
}
