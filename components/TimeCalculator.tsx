'use client'

import { useState } from 'react'
import { Copy, CheckCheck, Plus, Minus } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '시간 계산기',
    desc: '근무시간·시간 더하기/빼기·두 시간 사이 계산. 시급 계산, 초과근무 자동 계산.',
    tabs: ['시간 더하기/빼기', '두 시간 사이', '근무시간 계산'],
    add: '더하기', sub: '빼기',
    from: '시작 시간', to: '종료 시간',
    result: '결과',
    hours: '시간', minutes: '분', seconds: '초',
    workStart: '출근 시간', workEnd: '퇴근 시간',
    lunchBreak: '점심 시간 (분)',
    hourlyWage: '시급 (원)',
    totalWork: '총 근무시간',
    overtime: '초과근무',
    wage: '예상 임금',
    copy: '복사',
  },
  en: {
    title: 'Time Calculator',
    desc: 'Add/subtract time, calculate between two times. Work hours and overtime calculation included.',
    tabs: ['Add/Subtract', 'Between Times', 'Work Hours'],
    add: 'Add', sub: 'Subtract',
    from: 'Start Time', to: 'End Time',
    result: 'Result',
    hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
    workStart: 'Work Start', workEnd: 'Work End',
    lunchBreak: 'Lunch Break (min)',
    hourlyWage: 'Hourly Wage',
    totalWork: 'Total Work Hours',
    overtime: 'Overtime',
    wage: 'Expected Pay',
    copy: 'Copy',
  }
}

function timeToMin(h: number, m: number): number { return h * 60 + m }
function minToTime(min: number): { h: number; m: number; neg: boolean } {
  const neg = min < 0
  const abs = Math.abs(min)
  return { h: Math.floor(abs / 60), m: abs % 60, neg }
}
function formatTime(h: number, m: number, neg = false): string {
  return `${neg ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function TimeCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)

  // 탭1: 시간 더하기/빼기
  const [base, setBase] = useState({ h: 9, m: 0 })
  const [ops, setOps] = useState([{ h: 8, m: 30, op: 'add' }])

  // 탭2: 두 시간 사이
  const [fromT, setFromT] = useState('09:00')
  const [toT, setToT] = useState('18:00')

  // 탭3: 근무시간
  const [workStart, setWorkStart] = useState('09:00')
  const [workEnd, setWorkEnd] = useState('18:00')
  const [lunch, setLunch] = useState(60)
  const [wage, setWage] = useState(9860)
  const [stdHours, setStdHours] = useState(8)

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  // 탭1 계산
  const tab1Result = (() => {
    let total = timeToMin(base.h, base.m)
    ops.forEach(op => {
      const v = timeToMin(op.h, op.m)
      total = op.op === 'add' ? total + v : total - v
    })
    const r = minToTime(total)
    return { ...r, str: formatTime(r.h, r.m, r.neg) }
  })()

  // 탭2 계산
  const tab2Result = (() => {
    const [fh, fm] = fromT.split(':').map(Number)
    const [th, tm] = toT.split(':').map(Number)
    let diff = timeToMin(th, tm) - timeToMin(fh, fm)
    if (diff < 0) diff += 24 * 60 // 다음날
    const r = minToTime(diff)
    return { ...r, str: formatTime(r.h, r.m), totalMin: diff }
  })()

  // 탭3 계산
  const tab3Result = (() => {
    const [sh, sm] = workStart.split(':').map(Number)
    const [eh, em] = workEnd.split(':').map(Number)
    let workMin = timeToMin(eh, em) - timeToMin(sh, sm)
    if (workMin < 0) workMin += 24 * 60
    const netMin = workMin - lunch
    const netH = Math.floor(netMin / 60)
    const netM = netMin % 60
    const overMin = Math.max(0, netMin - stdHours * 60)
    const overH = Math.floor(overMin / 60)
    const overM = overMin % 60
    const basicPay = Math.floor((Math.min(netMin, stdHours * 60) / 60) * wage)
    const overPay = Math.floor((overMin / 60) * wage * 1.5)
    const totalPay = basicPay + overPay
    return { netH, netM, overH, overM, basicPay, overPay, totalPay, isOver: overMin > 0 }
  })()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {tx.tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2.5 text-xs font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* 탭1: 더하기/빼기 */}
      {tab === 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <div className="mb-4">
            <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '기준 시간' : 'Base Time'}</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{tx.hours}</label>
                <input type="number" min={0} max={23} value={base.h} onChange={e => setBase(p => ({ ...p, h: +e.target.value }))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{tx.minutes}</label>
                <input type="number" min={0} max={59} value={base.m} onChange={e => setBase(p => ({ ...p, m: +e.target.value }))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50" />
              </div>
            </div>
          </div>

          {ops.map((op, i) => (
            <div key={i} className="mb-3 flex items-end gap-2">
              <div className="flex-shrink-0">
                <label className="text-xs text-slate-500 block mb-1">{lang === 'ko' ? '연산' : 'Op'}</label>
                <div className="flex rounded-lg border border-surface-border overflow-hidden">
                  <button onClick={() => setOps(prev => prev.map((o, j) => j === i ? { ...o, op: 'add' } : o))}
                    className={`px-3 py-2 text-xs transition-all ${op.op === 'add' ? 'bg-brand-500 text-white font-bold' : 'bg-[#0f1117] text-slate-400'}`}>+</button>
                  <button onClick={() => setOps(prev => prev.map((o, j) => j === i ? { ...o, op: 'sub' } : o))}
                    className={`px-3 py-2 text-xs transition-all ${op.op === 'sub' ? 'bg-red-500 text-white font-bold' : 'bg-[#0f1117] text-slate-400'}`}>−</button>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{tx.hours}</label>
                <input type="number" min={0} value={op.h} onChange={e => setOps(prev => prev.map((o, j) => j === i ? { ...o, h: +e.target.value } : o))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">{tx.minutes}</label>
                <input type="number" min={0} max={59} value={op.m} onChange={e => setOps(prev => prev.map((o, j) => j === i ? { ...o, m: +e.target.value } : o))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50" />
              </div>
              {ops.length > 1 && (
                <button onClick={() => setOps(prev => prev.filter((_, j) => j !== i))} className="pb-0.5 text-slate-500 hover:text-red-400 transition-all">
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}

          <button onClick={() => setOps(prev => [...prev, { h: 1, m: 0, op: 'add' }])}
            className="text-xs text-slate-500 hover:text-brand-400 transition-all flex items-center gap-1 mb-4">
            <Plus size={12} /> {lang === 'ko' ? '연산 추가' : 'Add operation'}
          </button>

          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">{tx.result}</p>
              <p className="text-3xl font-extrabold text-brand-400 font-mono">{tab1Result.str}</p>
            </div>
            <button onClick={() => copy(tab1Result.str)} className={`p-2 rounded-lg border transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
              {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* 탭2: 두 시간 사이 */}
      {tab === 1 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[[tx.from, fromT, setFromT], [tx.to, toT, setToT]].map(([label, val, setter]) => (
              <div key={label as string}>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">{label as string}</label>
                <input type="time" value={val as string} onChange={e => (setter as Function)(e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: lang === 'ko' ? '시간' : 'Hours', val: `${tab2Result.h}${lang === 'ko' ? '시간' : 'h'}` },
              { label: lang === 'ko' ? '분' : 'Minutes', val: `${tab2Result.m}${lang === 'ko' ? '분' : 'm'}` },
              { label: lang === 'ko' ? '총 분' : 'Total Min', val: `${tab2Result.totalMin}${lang === 'ko' ? '분' : 'min'}` },
            ].map(r => (
              <div key={r.label} className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-center">
                <p className="text-xl font-bold text-brand-400 font-mono">{r.val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{r.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between items-center p-3 rounded-xl border border-surface-border bg-[#0f1117]">
            <p className="text-sm text-slate-300 font-mono">{fromT} → {toT} = <span className="text-brand-400 font-bold">{tab2Result.str}</span></p>
            <button onClick={() => copy(`${fromT} → ${toT} = ${tab2Result.str}`)} className={`p-1.5 rounded border transition-all ${copied ? 'text-brand-400 border-brand-500/40' : 'text-slate-500 border-surface-border hover:text-brand-400'}`}>
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      )}

      {/* 탭3: 근무시간 */}
      {tab === 2 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[[tx.workStart, workStart, setWorkStart], [tx.workEnd, workEnd, setWorkEnd]].map(([label, val, setter]) => (
              <div key={label as string}>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">{label as string}</label>
                <input type="time" value={val as string} onChange={e => (setter as Function)(e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: tx.lunchBreak, val: lunch, set: setLunch, min: 0, max: 120 },
              { label: lang === 'ko' ? '기준 근무시간 (h)' : 'Std Hours', val: stdHours, set: setStdHours, min: 1, max: 12 },
              { label: tx.hourlyWage, val: wage, set: setWage, min: 0, max: 100000 },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-slate-400 mb-1.5 block font-medium">{f.label}</label>
                <input type="number" min={f.min} max={f.max} value={f.val} onChange={e => f.set(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: tx.totalWork, val: `${tab3Result.netH}${lang === 'ko' ? '시간' : 'h'} ${tab3Result.netM}${lang === 'ko' ? '분' : 'm'}`, highlight: true },
              { label: tx.overtime, val: tab3Result.isOver ? `${tab3Result.overH}${lang === 'ko' ? '시간' : 'h'} ${tab3Result.overM}${lang === 'ko' ? '분' : 'm'}` : lang === 'ko' ? '없음' : 'None', highlight: false },
              { label: lang === 'ko' ? '기본 임금' : 'Base Pay', val: `₩${tab3Result.basicPay.toLocaleString()}`, highlight: false },
              { label: lang === 'ko' ? '초과근무 수당 (1.5배)' : 'OT Pay (×1.5)', val: `₩${tab3Result.overPay.toLocaleString()}`, highlight: false },
              { label: tx.wage, val: `₩${tab3Result.totalPay.toLocaleString()}`, highlight: true },
            ].map(r => (
              <div key={r.label} className={`rounded-xl border p-3 text-center ${r.highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'} ${r.label === tx.wage ? 'col-span-2' : ''}`}>
                <p className={`text-lg font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
                <p className="text-xs text-slate-500 mt-0.5">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '시간 계산기' : 'Time Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/time-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '탭 선택', desc: '시간 더하기/빼기, 두 시간 사이, 근무시간 계산 중 원하는 탭을 선택하세요.' },
          { step: '시간 입력', desc: '계산할 시간을 입력하세요.' },
          { step: '결과 확인', desc: '입력과 동시에 결과가 즉시 계산됩니다.' },
          { step: '복사하여 활용', desc: '결과를 복사해 업무 보고서나 급여 계산에 활용하세요.' },
        ] : [
          { step: 'Select tab', desc: 'Choose Add/Subtract, Between Times, or Work Hours.' },
          { step: 'Enter time', desc: 'Input the times you want to calculate.' },
          { step: 'See result', desc: 'Results update instantly as you type.' },
          { step: 'Copy result', desc: 'Copy the result for work reports or payroll.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '3가지 계산 모드', desc: '시간 더하기, 구간 계산, 근무시간 계산을 모두 지원합니다.' },
          { title: '근무시간 + 시급 계산', desc: '근무시간과 시급을 입력하면 예상 임금을 자동 계산합니다.' },
          { title: '초과근무 수당 계산', desc: '기준 근무시간 초과분을 1.5배로 자동 계산합니다.' },
          { title: '복수 연산 지원', desc: '시간을 여러 번 더하거나 빼는 복수 연산을 지원합니다.' },
        ] : [
          { title: '3 calculation modes', desc: 'Add/subtract time, between two times, and work hours.' },
          { title: 'Pay calculation', desc: 'Enter work hours and hourly wage to get expected pay.' },
          { title: 'Overtime calculation', desc: 'Automatically calculates overtime pay at 1.5x rate.' },
          { title: 'Multiple operations', desc: 'Add or subtract time multiple times in one calculation.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '자정을 넘긴 근무는 어떻게 계산하나요?', a: '자정을 넘기는 경우 자동으로 다음날로 처리됩니다. 예: 22:00~06:00은 8시간으로 계산됩니다.' },
          { q: '초과근무 수당은 얼마인가요?', a: '법정 기준은 1.5배(50% 할증)입니다. 야간(22:00~06:00)은 추가 할증이 적용됩니다.' },
          { q: '최저임금 기준 시급은?', a: '2024년 기준 최저임금은 9,860원/시간입니다. 기본값으로 설정되어 있습니다.' },
          { q: '점심시간은 근무시간에서 제외되나요?', a: '근무시간 탭에서 점심시간을 분 단위로 입력하면 자동 제외됩니다.' },
        ] : [
          { q: 'What about overnight shifts?', a: 'Overnight shifts are automatically handled. E.g., 22:00~06:00 = 8 hours.' },
          { q: 'How is overtime pay calculated?', a: 'Legal standard is 1.5x pay for overtime. Additional rates apply for night shifts (22:00~06:00).' },
          { q: 'What is the Korean minimum wage?', a: 'As of 2024, the Korean minimum wage is ₩9,860/hour, set as default.' },
          { q: 'Is lunch break excluded from work time?', a: 'Yes, enter lunch break minutes in the Work Hours tab to exclude it automatically.' },
        ]}
        keywords="시간 계산기 · 근무시간 계산 · 시급 계산기 · 초과근무 계산 · 시간 더하기 · 두 시간 사이 · time calculator · work hours calculator · hourly wage calculator · overtime calculator · time difference"
      />
    </div>
  )
}
