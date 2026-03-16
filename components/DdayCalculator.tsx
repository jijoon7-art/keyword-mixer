'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, CheckCheck } from 'lucide-react'
import ToolFooter from './ToolFooter'

interface DdayItem {
  id: string
  title: string
  date: string
  type: 'from' | 'until'
  color: string
}

const COLORS = ['brand', 'blue', 'purple', 'pink', 'orange', 'red']
const COLOR_CLASSES: Record<string, string> = {
  brand: 'border-brand-500/30 bg-brand-500/10 text-brand-400',
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  purple: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  pink: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
  red: 'border-red-500/30 bg-red-500/10 text-red-400',
}
const DOT_CLASSES: Record<string, string> = {
  brand: 'bg-brand-500', blue: 'bg-blue-500', purple: 'bg-purple-500',
  pink: 'bg-pink-500', orange: 'bg-orange-500', red: 'bg-red-500',
}

const PRESETS = [
  { title: '수능', date: `${new Date().getFullYear()}-11-13`, type: 'until' as const, color: 'blue' },
  { title: '크리스마스', date: `${new Date().getFullYear()}-12-25`, type: 'until' as const, color: 'red' },
  { title: '새해', date: `${new Date().getFullYear() + 1}-01-01`, type: 'until' as const, color: 'brand' },
  { title: '여름휴가', date: `${new Date().getFullYear()}-08-01`, type: 'until' as const, color: 'orange' },
]

function calcDday(dateStr: string, type: 'from' | 'until'): { dday: number; label: string; detail: string } {
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (type === 'until') {
    if (diff === 0) return { dday: 0, label: 'D-Day!', detail: '오늘이에요! 🎉' }
    if (diff > 0) return { dday: diff, label: `D-${diff}`, detail: `${diff}일 남았어요` }
    return { dday: diff, label: `D+${Math.abs(diff)}`, detail: `${Math.abs(diff)}일 지났어요` }
  } else {
    const abs = Math.abs(diff)
    if (diff === 0) return { dday: 0, label: '오늘', detail: '기준일이 오늘이에요' }
    if (diff < 0) return { dday: abs, label: `+${abs}일`, detail: `기준일로부터 ${abs}일 경과` }
    return { dday: abs, label: `-${abs}일`, detail: `기준일까지 ${abs}일 남음` }
  }
}

export default function DdayCalculator() {
  const [items, setItems] = useState<DdayItem[]>([
    { id: '1', title: '나의 D-Day', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], type: 'until', color: 'brand' },
  ])
  const [now, setNow] = useState(new Date())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      title: '새 D-Day',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'until',
      color: COLORS[prev.length % COLORS.length],
    }])
  }

  const update = (id: string, key: keyof DdayItem, val: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i))
  }

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const copyItem = async (item: DdayItem) => {
    const r = calcDday(item.date, item.type)
    await navigator.clipboard.writeText(`${item.title}: ${r.label} (${r.detail})`)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const applyPreset = (p: typeof PRESETS[0]) => {
    setItems(prev => [...prev, { id: Date.now().toString(), ...p }])
  }

  // 두 날짜 사이 계산
  const dateDiff = (() => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const diff = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))
    const years = Math.floor(Math.abs(diff) / 365)
    const months = Math.floor((Math.abs(diff) % 365) / 30)
    const days = Math.abs(diff) % 30
    return { diff, years, months, days }
  })()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">D-day 계산기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          중요한 날까지 남은 날수 계산. 여러 D-day 동시 관리, 두 날짜 사이 계산 지원.
        </p>
        <p className="text-brand-400 text-sm font-mono mt-3">
          {now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} {now.toLocaleTimeString('ko-KR')}
        </p>
      </div>

      {/* 프리셋 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-2 font-medium">빠른 추가</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.title} onClick={() => applyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
              + {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* D-day 목록 */}
      <div className="flex flex-col gap-3 mb-5">
        {items.map(item => {
          const r = calcDday(item.date, item.type)
          return (
            <div key={item.id} className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
              <div className="flex gap-3 items-start mb-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <input value={item.title} onChange={e => update(item.id, 'title', e.target.value)}
                    className="bg-transparent text-slate-200 font-semibold text-sm focus:outline-none border-b border-transparent focus:border-brand-500/40 transition-all" />
                  <div className="flex gap-2 flex-wrap">
                    <input type="date" value={item.date} onChange={e => update(item.id, 'date', e.target.value)}
                      className="bg-[#0f1117] border border-surface-border rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-brand-500/50 transition-all" />
                    <div className="flex gap-1">
                      {['until', 'from'].map(t => (
                        <button key={t} onClick={() => update(item.id, 'type', t)}
                          className={`text-xs px-2 py-1 rounded-lg border transition-all ${item.type === t ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-400 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                          {t === 'until' ? '날짜까지' : '날짜부터'}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {COLORS.map(c => (
                        <button key={c} onClick={() => update(item.id, 'color', c)}
                          className={`w-4 h-4 rounded-full ${DOT_CLASSES[c]} ${item.color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1a1d27]' : ''} transition-all`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => copyItem(item)} className={`p-1.5 rounded-lg border transition-all ${copiedId === item.id ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400 hover:border-brand-500/40'}`}>
                    {copiedId === item.id ? <CheckCheck size={13} /> : <Copy size={13} />}
                  </button>
                  {items.length > 1 && (
                    <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg border border-surface-border text-slate-500 hover:text-red-400 hover:border-red-500/40 transition-all">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className={`rounded-lg border p-4 text-center ${COLOR_CLASSES[item.color]}`}>
                <p className="text-3xl font-extrabold font-mono">{r.label}</p>
                <p className="text-sm mt-1 opacity-80">{r.detail}</p>
                <p className="text-xs mt-1 opacity-60">{new Date(item.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
              </div>
            </div>
          )
        })}

        <button onClick={addItem}
          className="rounded-xl border-2 border-dashed border-surface-border p-3 text-slate-500 hover:text-brand-400 hover:border-brand-500/40 transition-all flex items-center justify-center gap-2 text-sm">
          <Plus size={14} /> D-day 추가
        </button>
      </div>

      {/* 두 날짜 사이 계산 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">📅 두 날짜 사이 계산</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">시작일</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">종료일</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '총 일수', value: `${Math.abs(dateDiff.diff).toLocaleString()}일` },
            { label: '연', value: `${dateDiff.years}년` },
            { label: '개월', value: `${dateDiff.months}개월` },
            { label: '일', value: `${dateDiff.days}일` },
          ].map(r => (
            <div key={r.label} className="rounded-lg bg-[#0f1117] border border-surface-border p-3 text-center">
              <p className="text-sm font-bold text-slate-200">{r.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.label}</p>
            </div>
          ))}
        </div>
        {dateDiff.diff < 0 && <p className="text-xs text-slate-500 mt-2 text-center">※ 종료일이 시작일보다 이전입니다</p>}
      </div>

      <ToolFooter
        toolName="D-day 계산기"
        toolUrl="https://keyword-mixer.vercel.app/dday-calculator"
        description="중요한 날까지 남은 날수 계산. 여러 D-day 동시 관리, 두 날짜 사이 계산 지원."
        howToUse={[
          { step: '날짜 입력', desc: '목표 날짜를 입력하고 이름을 설정하세요. 수능, 생일, 기념일 등 이름을 자유롭게 설정할 수 있습니다.' },
          { step: '유형 선택', desc: '"날짜까지" 또는 "날짜부터"를 선택해 D-day 방향을 설정하세요.' },
          { step: '색상 설정', desc: '여러 D-day를 색상으로 구분해 한눈에 파악하세요.' },
          { step: 'D-day 추가', desc: '하단 추가 버튼으로 여러 D-day를 동시에 관리할 수 있습니다.' },
        ]}
        whyUse={[
          { title: '여러 D-day 동시 관리', desc: '수능, 생일, 여행, 시험 등 여러 중요한 날을 한 화면에서 관리하세요.' },
          { title: '실시간 현재 시간 표시', desc: '현재 시간이 실시간으로 표시되어 정확한 날짜 파악이 가능합니다.' },
          { title: '두 날짜 사이 계산', desc: '두 날짜 사이의 일수를 연·월·일 단위로 세분화해 계산합니다.' },
          { title: '색상 구분', desc: '6가지 색상으로 D-day를 시각적으로 구분해 중요도에 따라 정리할 수 있습니다.' },
        ]}
        faqs={[
          { q: 'D-day가 지났을 때는 어떻게 표시되나요?', a: '날짜가 지나면 D+숫자로 표시됩니다. 예: 결혼기념일이 3일 지났으면 D+3으로 표시됩니다.' },
          { q: '수능 D-day는 어떻게 설정하나요?', a: '빠른 추가 버튼에서 수능을 클릭하면 자동으로 설정됩니다. 날짜는 매년 11월 두 번째 목요일 기준입니다.' },
          { q: '두 날짜 사이 계산은 어디서 하나요?', a: '페이지 하단 "두 날짜 사이 계산" 섹션에서 시작일과 종료일을 입력하면 자동으로 계산됩니다.' },
          { q: '설정한 D-day는 저장되나요?', a: '현재는 페이지를 새로고침하면 초기화됩니다. 브라우저 북마크로 저장해두고 활용하세요.' },
        ]}
        keywords="디데이 계산기 · D-day 계산기 · 날짜 계산기 · 수능 디데이 · 생일 디데이 · 날짜 차이 계산 · d-day calculator · days until · date countdown · date difference calculator · days between dates"
      />
    </div>
  )
}
