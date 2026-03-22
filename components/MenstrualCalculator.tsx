'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '생리주기 계산기',
    desc: '마지막 생리일과 주기를 입력해 다음 생리 예정일, 배란일, 가임기를 자동 계산.',
    lastPeriod: '마지막 생리 시작일',
    cycleLength: '생리 주기 (일)',
    periodLength: '생리 기간 (일)',
    next: '다음 생리 예정일',
    ovulation: '배란 예정일',
    fertile: '가임기',
    safe: '비가임기',
    months: '향후 3개월 예측',
    disclaimer: '이 계산기는 참고용이며 의학적 조언이 아닙니다.',
  },
  en: {
    title: 'Menstrual Cycle Calculator',
    desc: 'Enter last period date and cycle length to calculate next period, ovulation, and fertile window.',
    lastPeriod: 'Last Period Start Date',
    cycleLength: 'Cycle Length (days)',
    periodLength: 'Period Duration (days)',
    next: 'Next Period',
    ovulation: 'Ovulation Date',
    fertile: 'Fertile Window',
    safe: 'Safe Period',
    months: 'Next 3 Months Forecast',
    disclaimer: 'This calculator is for reference only and not medical advice.',
  }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  if (lang === 'ko') {
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
  }
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (${daysEn[d.getDay()]})`
}

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0,0,0,0)
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function MenstrualCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 14); return d.toISOString().slice(0, 10)
  })
  const [cycleLen, setCycleLen] = useState(28)
  const [periodLen, setPeriodLen] = useState(5)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  const nextPeriod = addDays(lastPeriod, cycleLen)
  const ovulation = addDays(lastPeriod, cycleLen - 14)
  const fertileStart = addDays(ovulation, -5)
  const fertileEnd = addDays(ovulation, 1)
  const dUntilNext = daysUntil(nextPeriod)

  // 3개월 예측
  const forecasts = [1, 2, 3].map(i => ({
    start: addDays(lastPeriod, cycleLen * i),
    end: addDays(lastPeriod, cycleLen * i + periodLen - 1),
    ovul: addDays(lastPeriod, cycleLen * i - 14),
    fertStart: addDays(lastPeriod, cycleLen * i - 19),
    fertEnd: addDays(lastPeriod, cycleLen * i - 13),
  }))

  const getPhase = (): { label: string; color: string } => {
    const today = new Date().toISOString().slice(0, 10)
    if (today >= lastPeriod && today <= addDays(lastPeriod, periodLen - 1)) return { label: lang === 'ko' ? '생리 중' : 'Period', color: 'text-red-400' }
    if (today >= fertileStart && today <= fertileEnd) return { label: lang === 'ko' ? '가임기' : 'Fertile', color: 'text-brand-400' }
    if (today === ovulation) return { label: lang === 'ko' ? '배란일' : 'Ovulation', color: 'text-purple-400' }
    return { label: lang === 'ko' ? '일반' : 'Normal', color: 'text-slate-400' }
  }

  const currentPhase = getPhase()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">{tx.lastPeriod}</label>
            <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{tx.cycleLength}</label>
              <input type="range" min={21} max={45} value={cycleLen} onChange={e => setCycleLen(+e.target.value)} className="w-full accent-green-500 mb-1" />
              <p className="text-brand-400 font-mono text-sm font-bold text-center">{cycleLen}{lang === 'ko' ? '일' : ' days'}</p>
              <div className="flex gap-1 mt-1">
                {[24, 28, 30, 35].map(d => (
                  <button key={d} onClick={() => setCycleLen(d)}
                    className={`flex-1 py-1 rounded border text-xs transition-all ${cycleLen === d ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-500 bg-[#0f1117]'}`}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">{tx.periodLength}</label>
              <input type="range" min={2} max={10} value={periodLen} onChange={e => setPeriodLen(+e.target.value)} className="w-full accent-green-500 mb-1" />
              <p className="text-brand-400 font-mono text-sm font-bold text-center">{periodLen}{lang === 'ko' ? '일' : ' days'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 현재 상태 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">{lang === 'ko' ? '현재 상태' : 'Current Phase'}</p>
          <p className={`text-lg font-bold ${currentPhase.color}`}>{currentPhase.label}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{lang === 'ko' ? '다음 생리까지' : 'Until next period'}</p>
          <p className="text-2xl font-bold text-brand-400 font-mono">{dUntilNext > 0 ? `D-${dUntilNext}` : dUntilNext === 0 ? 'D-Day' : `D+${Math.abs(dUntilNext)}`}</p>
        </div>
      </div>

      {/* 주요 날짜 */}
      <div className="flex flex-col gap-2 mb-5">
        {[
          { label: tx.next, val: formatDate(nextPeriod, lang), key: 'next', color: 'border-red-500/30 bg-red-500/10 text-red-400' },
          { label: tx.ovulation, val: formatDate(ovulation, lang), key: 'ovul', color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
          { label: tx.fertile, val: `${formatDate(fertileStart, lang)} ~ ${formatDate(fertileEnd, lang)}`, key: 'fertile', color: 'border-brand-500/30 bg-brand-500/10 text-brand-400' },
        ].map(r => (
          <div key={r.key} className={`rounded-xl border p-3.5 flex items-center justify-between ${r.color.split(' ').slice(0,2).join(' ')}`}>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">{r.label}</p>
              <p className={`text-sm font-medium ${r.color.split(' ')[2]}`}>{r.val}</p>
            </div>
            <button onClick={() => copy(r.val, r.key)} className={`p-1.5 rounded border border-current opacity-50 hover:opacity-100 transition-all ${r.color.split(' ')[2]} ${copied === r.key ? 'opacity-100' : ''}`}>
              {copied === r.key ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>

      {/* 3개월 예측 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-surface-border">
          <p className="text-sm font-semibold text-slate-200">{tx.months}</p>
        </div>
        <div className="divide-y divide-surface-border">
          {forecasts.map((f, i) => (
            <div key={i} className="px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">{i + 1}{lang === 'ko' ? '개월 후' : ' month(s) ahead'}</p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span><span className="text-red-400 font-medium">{lang === 'ko' ? '생리' : 'Period'}</span> {f.start.slice(5)} ~ {f.end.slice(5)}</span>
                <span><span className="text-purple-400 font-medium">{lang === 'ko' ? '배란' : 'Ovul.'}</span> {f.ovul.slice(5)}</span>
                <span><span className="text-brand-400 font-medium">{lang === 'ko' ? '가임기' : 'Fertile'}</span> {f.fertStart.slice(5)} ~ {f.fertEnd.slice(5)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-yellow-500/70 text-center">⚠️ {tx.disclaimer}</p>

      <ToolFooter
        toolName={lang === 'ko' ? '생리주기 계산기' : 'Menstrual Cycle Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/menstrual-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '마지막 생리일 입력', desc: '가장 최근 생리 시작일을 선택하세요.' },
          { step: '주기와 기간 설정', desc: '본인의 생리 주기(보통 21~35일)와 생리 기간을 설정하세요.' },
          { step: '예정일 확인', desc: '다음 생리일, 배란일, 가임기가 자동으로 계산됩니다.' },
          { step: '3개월 예측 확인', desc: '향후 3개월간의 생리 일정을 미리 확인하세요.' },
        ] : [
          { step: 'Enter last period date', desc: 'Select the start date of your most recent period.' },
          { step: 'Set cycle and duration', desc: 'Set your cycle length (typically 21-35 days) and period duration.' },
          { step: 'View predicted dates', desc: 'Next period, ovulation, and fertile window are auto-calculated.' },
          { step: 'Check 3-month forecast', desc: 'See predicted cycle dates for the next 3 months.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3개월 예측', desc: '향후 3개월간의 생리일, 배란일, 가임기를 한눈에 확인합니다.' },
          { title: '현재 상태 표시', desc: '오늘이 생리 중인지, 가임기인지, 배란일인지 즉시 확인합니다.' },
          { title: 'D-day 카운터', desc: '다음 생리까지 남은 날수를 D-day 형식으로 표시합니다.' },
          { title: '개인화된 계산', desc: '주기 길이와 생리 기간을 개인에 맞게 설정할 수 있습니다.' },
        ] : [
          { title: '3-month forecast', desc: 'See period dates, ovulation, and fertile windows for 3 months ahead.' },
          { title: 'Current phase display', desc: 'Know instantly if today is period, fertile window, or ovulation.' },
          { title: 'D-day counter', desc: 'Shows days until next period in D-day format.' },
          { title: 'Personalized calculation', desc: 'Customize cycle length and period duration to your body.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '생리 주기는 어떻게 계산하나요?', a: '이번 생리 시작일부터 다음 생리 시작일 전날까지를 세면 됩니다. 21~35일이 정상 범위입니다.' },
          { q: '배란일은 어떻게 계산하나요?', a: '일반적으로 다음 생리 예정일 14일 전이 배란일입니다. 단, 불규칙한 주기에서는 변동이 클 수 있습니다.' },
          { q: '가임기란?', a: '배란 5일 전부터 배란 후 1일까지가 가임기입니다. 정자의 생존 기간(약 5일)과 난자의 생존 기간(약 24시간)을 고려한 기간입니다.' },
          { q: '이 계산기를 피임 목적으로 사용할 수 있나요?', a: '아니요. 이 계산기는 참고용이며 피임 수단으로 사용하면 안 됩니다. 생리 주기는 불규칙할 수 있어 신뢰성이 낮습니다. 의사와 상담하세요.' },
        ] : [
          { q: 'How to calculate cycle length?', a: 'Count from the first day of one period to the day before the next period starts. Normal range is 21-35 days.' },
          { q: 'How is ovulation calculated?', a: 'Typically 14 days before the next expected period. May vary significantly with irregular cycles.' },
          { q: 'What is the fertile window?', a: '5 days before ovulation to 1 day after. Based on sperm survival (~5 days) and egg viability (~24 hours).' },
          { q: 'Can this be used for contraception?', a: 'No. This is for reference only and should NOT be used as birth control. Cycles can be irregular. Consult a doctor.' },
        ]}
        keywords="생리주기 계산기 · 생리 예정일 · 배란일 계산 · 가임기 계산 · 월경 주기 · 생리 달력 · menstrual cycle calculator · period tracker · ovulation calculator · fertile window · period predictor"
      />
    </div>
  )
}
