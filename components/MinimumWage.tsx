'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '최저임금 계산기',
    desc: '2025년 최저시급 10,030원 기준 주급·월급·연봉을 자동 계산. 주휴수당 포함, 세전·세후 실수령액 계산.',
    hourly: '시급 (원)',
    hours: '일일 근무 시간',
    days: '주간 근무 일수',
    weekly: '주급',
    monthly: '월급',
    annual: '연봉',
    withHoliday: '주휴수당 포함',
    holidayPay: '주휴수당',
    afterTax: '세후 실수령액 (추정)',
    setMin: '2025 최저시급 적용',
  },
  en: {
    title: 'Korean Minimum Wage Calculator',
    desc: '2025 minimum wage ₩10,030/hr. Calculate weekly, monthly, annual pay including weekly holiday allowance.',
    hourly: 'Hourly Rate (₩)',
    hours: 'Daily Work Hours',
    days: 'Weekly Work Days',
    weekly: 'Weekly Pay',
    monthly: 'Monthly Pay',
    annual: 'Annual Salary',
    withHoliday: 'Include Holiday Pay',
    holidayPay: 'Weekly Holiday Pay',
    afterTax: 'Estimated After-Tax',
    setMin: 'Set 2025 Min Wage',
  }
}

const MIN_WAGE_2025 = 10030
const MIN_WAGE_2024 = 9860

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

function calcAfterTax(monthly: number): number {
  // 4대보험 + 소득세 간략 추정
  const health = Math.round(monthly * 0.03545)
  const pension = Math.round(monthly * 0.045)
  const employment = Math.round(monthly * 0.009)
  const incomeTax = monthly > 2000000 ? Math.round((monthly - 2000000) * 0.06 * 0.55) : 0
  return monthly - health - pension - employment - incomeTax
}

export default function MinimumWage() {
  const { lang } = useLang()
  const tx = T[lang]
  const [hourly, setHourly] = useState(MIN_WAGE_2025)
  const [hours, setHours] = useState(8)
  const [days, setDays] = useState(5)
  const [includeHoliday, setIncludeHoliday] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const dailyPay = hourly * hours
  // 주휴수당: 주 15시간 이상 근무 시 (주간 근무시간/40) * 8시간 * 시급
  const weeklyHours = hours * days
  const holidayHours = weeklyHours >= 15 ? (weeklyHours / 40) * 8 : 0
  const holidayPay = includeHoliday ? Math.round(hourly * holidayHours) : 0

  const weeklyPay = dailyPay * days + holidayPay
  const monthlyPay = Math.round(weeklyPay * 4.345) // 월 평균 주수
  const annualPay = monthlyPay * 12
  const afterTax = calcAfterTax(monthlyPay)

  // 최저임금 대비
  const minMonthly = Math.round(MIN_WAGE_2025 * hours * days * 4.345 + (includeHoliday ? MIN_WAGE_2025 * holidayHours * 4.345 : 0))
  const isAboveMin = hourly >= MIN_WAGE_2025

  const HOURS_PRESETS = [4, 5, 6, 7, 8]
  const DAYS_PRESETS = [3, 4, 5, 6, 7]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 최저임금 배너 */}
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">2025{lang === 'ko' ? '년 법정 최저시급' : ' Legal Minimum Wage'}</p>
          <p className="text-2xl font-extrabold text-brand-400 font-mono">₩{comma(MIN_WAGE_2025)} / {lang === 'ko' ? '시간' : 'hr'}</p>
          <p className="text-xs text-slate-500">2024: ₩{comma(MIN_WAGE_2024)} (+{((MIN_WAGE_2025 / MIN_WAGE_2024 - 1) * 100).toFixed(1)}%)</p>
        </div>
        <button onClick={() => setHourly(MIN_WAGE_2025)}
          className="px-3 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all">
          {tx.setMin}
        </button>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{tx.hourly}</label>
          <input type="number" value={hourly} step={10} onChange={e => setHourly(+e.target.value)}
            className={`w-full bg-[#0f1117] border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none transition-all ${!isAboveMin ? 'border-red-500/50' : 'border-surface-border focus:border-brand-500/50'}`} />
          {!isAboveMin && (
            <p className="text-xs text-red-400 mt-1">⚠️ {lang === 'ko' ? `2025년 최저시급(₩${comma(MIN_WAGE_2025)}) 미만입니다` : `Below 2025 minimum wage (₩${comma(MIN_WAGE_2025)})`}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.hours}</label>
            <div className="flex gap-1">
              {HOURS_PRESETS.map(h => (
                <button key={h} onClick={() => setHours(h)}
                  className={`flex-1 py-2 rounded border text-xs font-bold transition-all ${hours === h ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{h}h</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.days}</label>
            <div className="flex gap-1">
              {DAYS_PRESETS.map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`flex-1 py-2 rounded border text-xs font-bold transition-all ${days === d ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{d}d</button>
              ))}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-3">
          <div onClick={() => setIncludeHoliday(!includeHoliday)}
            className={`w-9 h-5 rounded-full relative transition-all ${includeHoliday ? 'bg-brand-500' : 'bg-surface-border'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${includeHoliday ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="text-xs text-slate-300">{tx.withHoliday} {weeklyHours < 15 && <span className="text-yellow-400">({lang === 'ko' ? '주 15시간 미만 해당없음' : 'N/A under 15hr/week'})</span>}</span>
        </label>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: tx.weekly, val: weeklyPay, key: 'w', large: false },
          { label: tx.holidayPay, val: holidayPay, key: 'hp', large: false },
          { label: tx.monthly, val: monthlyPay, key: 'm', large: true },
          { label: tx.afterTax, val: afterTax, key: 'at', large: false },
          { label: tx.annual, val: annualPay, key: 'a', large: false },
          { label: lang === 'ko' ? '일급' : 'Daily', val: dailyPay, key: 'd', large: false },
        ].map(r => (
          <div key={r.key} className={`rounded-xl border p-3 flex justify-between items-center ${r.large ? 'border-brand-500/40 bg-brand-500/10 col-span-2' : 'border-surface-border bg-[#1a1d27]'}`}>
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className={`font-bold font-mono ${r.large ? 'text-2xl text-brand-400' : 'text-base text-slate-200'}`}>₩{comma(r.val)}</p>
            </div>
            <button onClick={() => copy(String(r.val), r.key)}
              className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={12} /> : <Copy size={12} />}
            </button>
          </div>
        ))}
      </div>

      {/* 최저임금 대비 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '📊 최저임금 대비 비교' : '📊 vs Minimum Wage'}</p>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between"><span className="text-slate-400">{lang === 'ko' ? '2025 최저임금 월급' : '2025 Min Wage Monthly'}</span><span className="text-slate-200 font-mono">₩{comma(minMonthly)}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">{lang === 'ko' ? '현재 입력 월급' : 'Current Monthly'}</span><span className={`font-mono font-bold ${isAboveMin ? 'text-brand-400' : 'text-red-400'}`}>₩{comma(monthlyPay)}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">{lang === 'ko' ? '최저임금 대비' : 'vs Min Wage'}</span>
            <span className={`font-mono font-bold ${monthlyPay >= minMonthly ? 'text-brand-400' : 'text-red-400'}`}>
              {monthlyPay >= minMonthly ? '+' : ''}{((monthlyPay / minMonthly - 1) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '최저임금 계산기' : 'Minimum Wage Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/minimum-wage"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '시급 입력', desc: '시급을 입력하거나 2025 최저시급 적용 버튼을 클릭하세요.' },
          { step: '근무 시간 설정', desc: '일일 근무 시간과 주간 근무 일수를 선택하세요.' },
          { step: '주휴수당 설정', desc: '주 15시간 이상 근무 시 주휴수당이 자동으로 포함됩니다.' },
          { step: '급여 확인', desc: '일급·주급·월급·연봉·세후 실수령액을 확인하세요.' },
        ] : [
          { step: 'Enter hourly rate', desc: 'Input hourly rate or click to set 2025 minimum wage.' },
          { step: 'Set work hours', desc: 'Select daily hours and weekly work days.' },
          { step: 'Holiday pay', desc: 'Weekly holiday pay auto-included when working 15hr+ weekly.' },
          { step: 'View all pay', desc: 'See daily, weekly, monthly, annual, and after-tax amounts.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '2025 최저시급 반영', desc: '2025년 최저시급 10,030원을 기준으로 계산합니다.' },
          { title: '주휴수당 자동 계산', desc: '주 15시간 이상 근무 시 발생하는 주휴수당을 자동으로 계산합니다.' },
          { title: '세후 실수령액 추정', desc: '4대보험과 소득세를 고려한 실수령액을 추정합니다.' },
          { title: '최저임금 위반 경고', desc: '입력한 시급이 법정 최저시급에 미달하면 경고를 표시합니다.' },
        ] : [
          { title: '2025 min wage updated', desc: 'Calculates based on 2025 minimum wage of ₩10,030/hr.' },
          { title: 'Auto holiday pay', desc: 'Automatically calculates weekly holiday allowance for 15hr+ workers.' },
          { title: 'After-tax estimate', desc: 'Estimates take-home pay after social insurance and income tax.' },
          { title: 'Minimum wage alert', desc: 'Shows warning if entered rate is below legal minimum.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '2025년 최저시급은?', a: '2025년 최저시급은 10,030원입니다. 2024년 9,860원 대비 170원(1.7%) 인상되었습니다.' },
          { q: '주휴수당이란?', a: '1주일에 15시간 이상 일하는 근로자에게 주어지는 유급 휴일 수당입니다. (주간 근무 시간/40시간) × 8시간 × 시급으로 계산합니다.' },
          { q: '최저임금 위반 시 벌칙은?', a: '최저임금법 위반 시 3년 이하 징역 또는 2천만원 이하 벌금에 처해질 수 있습니다.' },
          { q: '아르바이트도 최저임금 적용되나요?', a: '네. 아르바이트, 파트타임, 단기 근로자 모두 법정 최저임금이 적용됩니다. 수습 기간에는 3개월간 10% 감액이 가능합니다.' },
        ] : [
          { q: '2025 minimum wage?', a: '₩10,030/hr in 2025. Up ₩170 (1.7%) from ₩9,860 in 2024.' },
          { q: 'What is weekly holiday pay?', a: 'Paid day off for workers working 15hr+ per week. Calculated as (weekly hours/40) × 8hr × hourly rate.' },
          { q: 'Penalties for violation?', a: 'Minimum wage law violations carry up to 3 years imprisonment or ₩20M fine.' },
          { q: 'Does minimum wage apply to part-timers?', a: 'Yes. All workers including part-time, temporary, and day workers are covered. 10% reduction allowed for first 3 months of probation.' },
        ]}
        keywords="최저임금 계산기 · 2025 최저시급 · 최저임금 월급 · 주휴수당 계산 · 최저시급 계산기 · minimum wage Korea · 2025 minimum wage · hourly wage calculator · 10030원"
      />
    </div>
  )
}
