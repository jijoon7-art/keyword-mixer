'use client'

import { useState } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '날짜 계산기',
    desc: '두 날짜 사이 일수·주·개월 계산. 날짜 더하기/빼기, 요일 계산, 만 나이까지 한번에.',
    tab1: '날짜 사이 계산',
    tab2: '날짜 더하기/빼기',
    tab3: '요일 계산',
    from: '시작 날짜',
    to: '종료 날짜',
    result: '계산 결과',
    today: '오늘',
    add: '더하기',
    subtract: '빼기',
    days: '일',
    weeks: '주',
    months: '개월',
    years: '년',
  },
  en: {
    title: 'Date Calculator',
    desc: 'Calculate days between dates, add/subtract dates, find day of week, and more.',
    tab1: 'Days Between',
    tab2: 'Add/Subtract',
    tab3: 'Day of Week',
    from: 'Start Date',
    to: 'End Date',
    result: 'Result',
    today: 'Today',
    add: 'Add',
    subtract: 'Subtract',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years',
  }
}

const DAY_NAMES_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatDate(d: Date, lang: string): string {
  if (lang === 'ko') return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  return `${MONTH_NAMES_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export default function DateCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const today = new Date().toISOString().split('T')[0]

  const [tab, setTab] = useState(0)
  const [from, setFrom] = useState(today)
  const [to, setTo] = useState(today)
  const [baseDate, setBaseDate] = useState(today)
  const [addAmount, setAddAmount] = useState('30')
  const [addUnit, setAddUnit] = useState('days')
  const [addMode, setAddMode] = useState<'add' | 'sub'>('add')
  const [checkDate, setCheckDate] = useState(today)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  // 두 날짜 사이 계산
  const diff = (() => {
    const d1 = new Date(from), d2 = new Date(to)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null
    const ms = d2.getTime() - d1.getTime()
    const totalDays = Math.round(ms / (1000 * 60 * 60 * 24))
    const abs = Math.abs(totalDays)
    const years = Math.floor(abs / 365)
    const months = Math.floor((abs % 365) / 30)
    const days = abs % 30
    return { totalDays, abs, years, months, days, isNeg: totalDays < 0 }
  })()

  // 날짜 더하기/빼기
  const addResult = (() => {
    const d = new Date(baseDate)
    if (isNaN(d.getTime())) return null
    const n = parseInt(addAmount) || 0
    const multiplier = addMode === 'add' ? 1 : -1
    const result = new Date(d)
    if (addUnit === 'days') result.setDate(d.getDate() + n * multiplier)
    else if (addUnit === 'weeks') result.setDate(d.getDate() + n * 7 * multiplier)
    else if (addUnit === 'months') result.setMonth(d.getMonth() + n * multiplier)
    else if (addUnit === 'years') result.setFullYear(d.getFullYear() + n * multiplier)
    return result
  })()

  // 요일 계산
  const dayResult = (() => {
    const d = new Date(checkDate)
    if (isNaN(d.getTime())) return null
    const dayIdx = d.getDay()
    const isWeekend = dayIdx === 0 || dayIdx === 6
    const lunar = lang === 'ko' ? '' : '' // 음력은 복잡해서 생략
    return {
      day: lang === 'ko' ? DAY_NAMES_KO[dayIdx] : DAY_NAMES_EN[dayIdx],
      isWeekend,
      formatted: formatDate(d, lang),
      dayIdx,
    }
  })()

  // 특정 날짜까지 D-day
  const dday = (() => {
    const d = new Date(to)
    if (isNaN(d.getTime())) return null
    const now = new Date(); now.setHours(0, 0, 0, 0); d.setHours(0, 0, 0, 0)
    return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  })()

  const TABS = [tx.tab1, tx.tab2, tx.tab3]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* 탭 0: 날짜 사이 계산 */}
      {tab === 0 && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{tx.from}</label>
                <div className="flex gap-1">
                  <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                    className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
                  <button onClick={() => setFrom(today)} className="px-2 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-400 text-xs hover:border-brand-500/40 transition-all">{tx.today}</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">{tx.to}</label>
                <div className="flex gap-1">
                  <input type="date" value={to} onChange={e => setTo(e.target.value)}
                    className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
                  <button onClick={() => setTo(today)} className="px-2 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-400 text-xs hover:border-brand-500/40 transition-all">{tx.today}</button>
                </div>
              </div>
            </div>
          </div>

          {diff && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 text-center">
                <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '총 일수' : 'Total Days'}</p>
                <p className="text-5xl font-extrabold font-mono text-brand-400">
                  {diff.isNeg ? '-' : ''}{diff.abs.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400 mt-1">{lang === 'ko' ? '일' : 'days'}</p>
                {dday !== null && (
                  <p className="text-xs text-slate-500 mt-2">
                    {lang === 'ko' ? `종료일 기준 D${dday >= 0 ? '-' + dday : '+' + Math.abs(dday)}` : `D${dday >= 0 ? '-' + dday : '+' + Math.abs(dday)} from today`}
                  </p>
                )}
                <button onClick={() => copy(`${diff.abs}${lang === 'ko' ? '일' : ' days'}`, 'total')}
                  className={`mt-3 text-xs px-3 py-1 rounded border transition-all ${copied === 'total' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:border-brand-500/40'}`}>
                  {copied === 'total' ? <CheckCheck size={12} className="inline" /> : <Copy size={12} className="inline" />} {lang === 'ko' ? '복사' : 'Copy'}
                </button>
              </div>
              {[
                { label: lang === 'ko' ? '주' : 'Weeks', val: `${Math.floor(diff.abs / 7)} ${lang === 'ko' ? '주' : 'weeks'} ${diff.abs % 7}${lang === 'ko' ? '일' : ' days'}`, k: 'weeks' },
                { label: lang === 'ko' ? '개월' : 'Months', val: `${diff.years > 0 ? diff.years + (lang === 'ko' ? '년 ' : ' years ') : ''}${diff.months}${lang === 'ko' ? '개월 ' : ' months '}${diff.days}${lang === 'ko' ? '일' : ' days'}`, k: 'months' },
              ].map(r => (
                <div key={r.k} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">{r.label}</p>
                  <p className="text-lg font-bold text-slate-200">{r.val}</p>
                  <button onClick={() => copy(r.val, r.k)} className={`mt-2 text-xs px-2 py-0.5 rounded border transition-all ${copied === r.k ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:border-brand-500/40'}`}>
                    {copied === r.k ? '✓' : <Copy size={11} className="inline" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 탭 1: 날짜 더하기/빼기 */}
      {tab === 1 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '기준 날짜' : 'Base Date'}</label>
              <div className="flex gap-2">
                <input type="date" value={baseDate} onChange={e => setBaseDate(e.target.value)}
                  className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
                <button onClick={() => setBaseDate(today)} className="px-3 py-2 rounded border border-surface-border text-slate-400 hover:text-brand-400 text-xs hover:border-brand-500/40 transition-all">{tx.today}</button>
              </div>
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex gap-1 flex-shrink-0">
                {[['add', tx.add], ['sub', tx.subtract]].map(([v, l]) => (
                  <button key={v} onClick={() => setAddMode(v as any)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${addMode === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                    {l}
                  </button>
                ))}
              </div>
              <input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} min="0"
                className="w-24 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              <div className="flex gap-1">
                {[['days', tx.days], ['weeks', tx.weeks], ['months', tx.months], ['years', tx.years]].map(([v, l]) => (
                  <button key={v} onClick={() => setAddUnit(v)}
                    className={`px-2.5 py-2 rounded-lg border text-xs transition-all ${addUnit === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {addResult && (
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
                <p className="text-xs text-slate-400 mb-1">{tx.result}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-brand-400 font-mono">{addResult.toISOString().split('T')[0]}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{formatDate(addResult, lang)}</p>
                  </div>
                  <button onClick={() => copy(addResult.toISOString().split('T')[0], 'addRes')}
                    className={`p-2 rounded border transition-all ${copied === 'addRes' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                    {copied === 'addRes' ? <CheckCheck size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 탭 2: 요일 계산 */}
      {tab === 2 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '날짜 선택' : 'Select Date'}</label>
          <div className="flex gap-2 mb-4">
            <input type="date" value={checkDate} onChange={e => setCheckDate(e.target.value)}
              className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
            <button onClick={() => setCheckDate(today)} className="px-3 py-2 rounded border border-surface-border text-slate-400 hover:text-brand-400 text-xs hover:border-brand-500/40 transition-all">{tx.today}</button>
          </div>

          {dayResult && (
            <div className="flex flex-col gap-3">
              <div className={`rounded-xl border p-5 text-center ${dayResult.isWeekend ? 'border-red-500/30 bg-red-500/10' : 'border-brand-500/30 bg-brand-500/10'}`}>
                <p className={`text-4xl font-extrabold ${dayResult.isWeekend ? 'text-red-400' : 'text-brand-400'}`}>{dayResult.day}</p>
                <p className="text-slate-400 text-sm mt-1">{dayResult.formatted}</p>
                {dayResult.isWeekend && <p className="text-xs text-red-400 mt-1">{lang === 'ko' ? '주말' : 'Weekend'}</p>}
              </div>

              {/* 같은 요일 찾기 */}
              <div className="rounded-xl border border-surface-border bg-[#0f1117] p-4">
                <p className="text-xs text-slate-400 mb-2 font-medium">
                  {lang === 'ko' ? `${checkDate.split('-')[0]}년 ${dayResult.day} 목록` : `All ${dayResult.day}s in ${checkDate.split('-')[0]}`}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const year = parseInt(checkDate.split('-')[0])
                    const days: string[] = []
                    for (let m = 0; m < 12; m++) {
                      for (let d = 1; d <= 31; d++) {
                        const dt = new Date(year, m, d)
                        if (dt.getMonth() !== m) break
                        if (dt.getDay() === dayResult.dayIdx) {
                          days.push(`${m + 1}/${d}`)
                        }
                      }
                    }
                    return days.slice(0, 12).map(d => (
                      <span key={d} className="text-xs px-2 py-0.5 rounded bg-surface-border text-slate-300 font-mono">{d}</span>
                    ))
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '날짜 계산기' : 'Date Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/date-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '계산 유형 선택', desc: '날짜 사이 계산, 날짜 더하기/빼기, 요일 확인 중 원하는 탭을 선택하세요.' },
          { step: '날짜 입력', desc: '시작일과 종료일, 또는 기준 날짜를 입력하세요. 오늘 버튼으로 빠르게 설정할 수 있습니다.' },
          { step: '결과 확인', desc: '일수, 주, 월, 년 단위로 계산 결과가 즉시 표시됩니다.' },
          { step: '결과 복사', desc: '복사 버튼으로 결과를 클립보드에 저장하세요.' },
        ] : [
          { step: 'Choose calculation type', desc: 'Select Days Between, Add/Subtract, or Day of Week tab.' },
          { step: 'Enter dates', desc: 'Enter start and end dates, or base date. Use Today button for quick input.' },
          { step: 'View results', desc: 'See results in days, weeks, months, and years instantly.' },
          { step: 'Copy result', desc: 'Use copy buttons to save results to clipboard.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 계산 통합', desc: '날짜 사이, 날짜 더하기/빼기, 요일 확인을 한 페이지에서 모두 처리.' },
          { title: 'D-day 자동 계산', desc: '두 날짜 사이 계산 시 오늘 기준 D-day도 함께 표시됩니다.' },
          { title: '요일 목록 제공', desc: '특정 요일(예: 월요일)이 해당 연도에 몇 번 있는지 목록으로 보여줍니다.' },
          { title: '결과 복사 지원', desc: '계산된 날짜/일수를 버튼 하나로 바로 복사할 수 있습니다.' },
        ] : [
          { title: '3-in-1 calculator', desc: 'Days between, add/subtract, and day of week all in one page.' },
          { title: 'Auto D-day', desc: 'Shows D-day from today when calculating days between dates.' },
          { title: 'Weekday list', desc: 'Shows all occurrences of a weekday in a given year.' },
          { title: 'Copy support', desc: 'Copy calculated dates and day counts with one click.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '오늘부터 30일 후는 언제인가요?', a: '"날짜 더하기/빼기" 탭에서 오늘 기준으로 30일을 더하면 바로 계산됩니다.' },
          { q: '두 날짜 사이 평일만 계산하려면?', a: '현재 버전에서는 총 일수를 계산합니다. 평일만 계산하는 기능은 추후 추가 예정입니다.' },
          { q: '윤년도 올바르게 계산하나요?', a: '네, JavaScript Date 객체를 사용해 윤년(2월 29일)을 자동으로 처리합니다.' },
          { q: '날짜 계산이 달력과 다른 이유는?', a: '시간대(timezone)의 영향으로 자정 기준 계산 시 1일 차이가 날 수 있습니다. 이 도구는 현지 시간 기준으로 계산합니다.' },
        ] : [
          { q: 'What date is 30 days from today?', a: 'Use the "Add/Subtract" tab with today as base date and add 30 days.' },
          { q: 'Can I calculate only weekdays between dates?', a: 'Current version calculates total days. Weekday-only calculation will be added later.' },
          { q: 'Does it handle leap years correctly?', a: 'Yes, JavaScript Date handles leap years (Feb 29) automatically.' },
          { q: 'Why might results differ from a calendar?', a: 'Timezone effects can cause 1-day differences at midnight. This tool uses local time.' },
        ]}
        keywords="날짜 계산기 · 날짜 차이 계산 · 두 날짜 사이 일수 · 날짜 더하기 빼기 · 요일 계산기 · 날짜 계산 · date calculator · days between dates · date difference · add subtract days · day of week calculator · date math"
      />
    </div>
  )
}
