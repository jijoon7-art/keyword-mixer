'use client'
import { useState, useEffect } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '날짜 계산기 Pro',
    desc: '두 날짜 사이의 일수·주수·개월·년수를 정확히 계산. 근무일 제외, 특정 요일 수 계산, 날짜 더하기/빼기 지원.',
    startDate: '시작 날짜', endDate: '종료 날짜',
    days: '일', weeks: '주', months: '개월', years: '년',
    workDays: '근무일 (주말 제외)', addDate: '날짜 계산',
    result: '계산 결과',
  },
  en: {
    title: 'Date Calculator Pro',
    desc: 'Precisely calculate days, weeks, months, years between two dates. Excludes weekends, counts specific weekdays.',
    startDate: 'Start Date', endDate: 'End Date',
    days: 'Days', weeks: 'Weeks', months: 'Months', years: 'Years',
    workDays: 'Workdays (excl. weekends)', addDate: 'Add/Subtract',
    result: 'Result',
  }
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

function workDaysBetween(d1: Date, d2: Date): number {
  let count = 0
  const cur = new Date(d1)
  while (cur <= d2) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

function countWeekday(d1: Date, d2: Date, dayOfWeek: number): number {
  let count = 0
  const cur = new Date(d1)
  while (cur <= d2) {
    if (cur.getDay() === dayOfWeek) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr)
  const daysKo = ['일', '월', '화', '수', '목', '금', '토']
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  if (lang === 'ko') {
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${daysKo[d.getDay()]})`
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
}

export default function DateDiffCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<'diff' | 'add'>('diff')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(() => {
    const d = new Date(); d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [addDays2, setAddDays2] = useState(30)
  const [addBase, setAddBase] = useState(() => new Date().toISOString().slice(0, 10))
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }
  const [now, setNow] = useState(new Date().toISOString().slice(0, 10))
  useEffect(() => { setNow(new Date().toISOString().slice(0, 10)) }, [])

  const d1 = new Date(startDate)
  const d2 = new Date(endDate)
  const totalDays = daysBetween(d1, d2)
  const workDays = Math.abs(totalDays) < 1000 ? workDaysBetween(d1 < d2 ? d1 : d2, d1 < d2 ? d2 : d1) : 0
  const weekendDays = Math.abs(totalDays) - workDays
  const weeks = (totalDays / 7).toFixed(2)
  const months = ((d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth())
  const years = (totalDays / 365.25).toFixed(2)

  const mondayCount = Math.abs(totalDays) < 1000 ? countWeekday(d1 < d2 ? d1 : d2, d1 < d2 ? d2 : d1, 1) : 0

  const resultDate = addDaysToDate(addBase, addDays2)

  const QUICK_DIFFS = [
    { label: lang === 'ko' ? '오늘~1달 후' : 'Today to 1 month', days: 30 },
    { label: lang === 'ko' ? '오늘~3달 후' : 'Today to 3 months', days: 90 },
    { label: lang === 'ko' ? '오늘~6달 후' : 'Today to 6 months', days: 180 },
    { label: lang === 'ko' ? '오늘~1년 후' : 'Today to 1 year', days: 365 },
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

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['diff', lang === 'ko' ? '날짜 사이 계산' : 'Days Between'], ['add', lang === 'ko' ? '날짜 더하기/빼기' : 'Add/Subtract Days']].map(([v, l]) => (
          <button key={v} onClick={() => setMode(v as 'diff' | 'add')}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === v ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300'}`}>{l}</button>
        ))}
      </div>

      {mode === 'diff' && (
        <>
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{tx.startDate}</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{tx.endDate}</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_DIFFS.map(q => (
                <button key={q.days} onClick={() => { setStartDate(now); setEndDate(addDaysToDate(now, q.days)) }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* 결과 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 col-span-2 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{lang === 'ko' ? '총 일수' : 'Total Days'}</p>
                <p className="text-5xl font-extrabold text-brand-400 font-mono">
                  {Math.abs(totalDays)}<span className="text-xl ml-1">{lang === 'ko' ? '일' : 'd'}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {totalDays < 0 ? (lang === 'ko' ? '⚠️ 종료일이 시작일보다 이전입니다' : '⚠️ End is before start') : ''}
                </p>
              </div>
              <button onClick={() => copy(String(Math.abs(totalDays)), 'days')}
                className={`p-2.5 rounded-xl border transition-all ${copied === 'days' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
                {copied === 'days' ? <CheckCheck size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {[
              { label: tx.weeks, val: `${Math.abs(parseFloat(weeks)).toFixed(1)}${lang === 'ko' ? '주' : 'w'}`, key: 'weeks' },
              { label: tx.months, val: `${Math.abs(months)}${lang === 'ko' ? '개월' : 'mo'}`, key: 'months' },
              { label: tx.workDays, val: `${workDays}${lang === 'ko' ? '일' : 'd'}`, key: 'wdays' },
              { label: lang === 'ko' ? '주말' : 'Weekends', val: `${weekendDays}${lang === 'ko' ? '일' : 'd'}`, key: 'wends' },
            ].map(r => (
              <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-400">{r.label}</p>
                  <p className="text-xl font-bold text-slate-200 font-mono">{r.val}</p>
                </div>
                <button onClick={() => copy(r.val, r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                  {copied === r.key ? <CheckCheck size={13} /> : <Copy size={13} />}
                </button>
              </div>
            ))}
          </div>

          {/* 날짜 상세 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '📅 날짜 상세' : '📅 Date Details'}</p>
            <div className="flex flex-col gap-1 text-xs">
              {[
                [lang === 'ko' ? '시작일' : 'Start', formatDate(startDate, lang)],
                [lang === 'ko' ? '종료일' : 'End', formatDate(endDate, lang)],
                [lang === 'ko' ? '기간 (약)' : 'Period (approx)', `${Math.abs(parseFloat(years))}${lang === 'ko' ? '년' : 'yr'}`],
                [lang === 'ko' ? '이 기간의 월요일 수' : 'Mondays in period', `${mondayCount}${lang === 'ko' ? '번' : ''}`],
              ].map(([l, v]) => (
                <div key={l as string} className="flex justify-between py-1.5 border-b border-surface-border last:border-0">
                  <span className="text-slate-400">{l}</span>
                  <span className="text-slate-200 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {mode === 'add' && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '기준 날짜' : 'Base Date'}</label>
                <input type="date" value={addBase} onChange={e => setAddBase(e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '더하기/빼기 (일)' : 'Days to Add/Subtract'}</label>
                <input type="number" value={addDays2} onChange={e => setAddDays2(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
                <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? '음수(-) 입력 시 빼기' : 'Negative number = subtract'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[-365, -90, -30, -7, 7, 30, 90, 365].map(d => (
                <button key={d} onClick={() => setAddDays2(d)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${addDays2 === d ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
                  {d > 0 ? '+' : ''}{d}{lang === 'ko' ? '일' : 'd'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">
                {lang === 'ko' ? `${formatDate(addBase, lang)} ${addDays2 >= 0 ? '+' : ''}${addDays2}일` : `${formatDate(addBase, lang)} ${addDays2 >= 0 ? '+' : ''}${addDays2} days`}
              </p>
              <p className="text-2xl font-extrabold text-brand-400">{formatDate(resultDate, lang)}</p>
            </div>
            <button onClick={() => copy(resultDate, 'result')}
              className={`p-2.5 rounded-xl border transition-all ${copied === 'result' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied === 'result' ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '날짜 계산기 Pro' : 'Date Calculator Pro'}
        toolUrl="https://keyword-mixer.vercel.app/date-diff-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '모드 선택', desc: '날짜 사이 계산 또는 날짜 더하기/빼기를 선택하세요.' },
          { step: '날짜 입력', desc: '시작일과 종료일, 또는 기준 날짜와 더할 일수를 입력하세요.' },
          { step: '결과 확인', desc: '일수, 주수, 개월, 근무일 등 다양한 결과가 계산됩니다.' },
          { step: '결과 복사', desc: '필요한 값을 복사해 활용하세요.' },
        ] : [
          { step: 'Select mode', desc: 'Choose days between or add/subtract days.' },
          { step: 'Enter dates', desc: 'Input start/end dates or base date and number of days.' },
          { step: 'View results', desc: 'Days, weeks, months, workdays and more are calculated.' },
          { step: 'Copy results', desc: 'Copy needed values for your use.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '근무일 자동 계산', desc: '주말을 제외한 실제 근무일 수를 자동으로 계산합니다.' },
          { title: '다양한 단위', desc: '일, 주, 개월, 연으로 기간을 다양하게 표현합니다.' },
          { title: '날짜 더하기/빼기', desc: '특정 날짜에서 N일 후/전의 날짜를 즉시 계산합니다.' },
          { title: '요일 횟수 계산', desc: '기간 내 특정 요일이 몇 번 있는지 계산합니다.' },
        ] : [
          { title: 'Auto workday calc', desc: 'Automatically calculates actual workdays excluding weekends.' },
          { title: 'Multiple units', desc: 'Expresses duration in days, weeks, months, and years.' },
          { title: 'Date add/subtract', desc: 'Find date N days after/before a specific date instantly.' },
          { title: 'Weekday counting', desc: 'Counts how many times a specific weekday occurs in a period.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '근무일 계산에 공휴일도 제외되나요?', a: '현재 버전은 주말(토/일)만 제외합니다. 공휴일은 나라마다 다르므로 자동으로 처리되지 않습니다. 수동으로 빼셔야 합니다.' },
          { q: '두 날짜 사이 개월 수 계산 방법은?', a: '연도 차이 × 12 + 월 차이로 계산합니다. 예: 2023년 1월~2024년 3월 = 14개월.' },
          { q: '근로계약 기간 계산은?', a: '시작일과 만료일을 입력해 근무 기간을 계산하세요. 근무일 수는 주말 제외 기준으로 표시됩니다.' },
          { q: 'D-day 계산도 되나요?', a: '오늘 날짜(시작일)와 목표 날짜(종료일)를 입력하면 D-day가 계산됩니다. 음수면 이미 지난 날짜입니다.' },
        ] : [
          { q: 'Are holidays excluded from workdays?', a: 'Current version only excludes weekends (Sat/Sun). Holidays vary by country and are not auto-excluded. Subtract manually.' },
          { q: 'How are months between dates calculated?', a: 'Year difference × 12 + month difference. E.g., Jan 2023 to Mar 2024 = 14 months.' },
          { q: 'Employment contract duration?', a: 'Enter start and end dates to calculate duration. Workdays shown excludes weekends.' },
          { q: 'Can I calculate D-day?', a: 'Enter today as start and target date as end. Negative result means the date has passed.' },
        ]}
        keywords="날짜 계산기 · 두 날짜 사이 일수 · 근무일 계산 · 날짜 더하기 · D-day 계산 · 기간 계산기 · date calculator · days between dates · workday calculator · date difference · add days to date"
      />
    </div>
  )
}
