
'use client'
import { useState, useEffect } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '카운트다운 / D-day 생성기', desc: '중요한 날까지 남은 시간을 초 단위로 카운트다운. 여러 D-day를 동시에 관리.' },
  en: { title: 'Countdown / D-Day Creator', desc: 'Count down to important dates in seconds. Manage multiple D-days simultaneously.' }
}

interface Event { id: number; name: string; date: string; color: string }
const COLORS = ['brand', 'blue', 'purple', 'red', 'yellow', 'orange']
const COLOR_MAP: Record<string, string> = {
  brand: 'text-brand-400 border-brand-500/30 bg-brand-500/10',
  blue: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  red: 'text-red-400 border-red-500/30 bg-red-500/10',
  yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  orange: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
}

function getDiff(dateStr: string) {
  const target = new Date(dateStr); target.setHours(0,0,0,0)
  const now = new Date(); now.setHours(0,0,0,0)
  const diff = Math.round((target.getTime() - now.getTime()) / 86400000)
  return diff
}

export default function CountdownCreator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: lang === "ko" ? "새해" : "New Year", date: "2026-01-01", color: "brand" },
    { id: 2, name: lang === "ko" ? "크리스마스" : "Christmas", date: "2025-12-25", color: "red" },
  ])
  const [form, setForm] = useState({ name: "", date: new Date(Date.now() + 30*86400000).toISOString().slice(0,10), color: "brand" })
  const [now, setNow] = useState(new Date())
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null),1500) }

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id) }, [])

  const add = () => {
    if (!form.name || !form.date) return
    setEvents(p => [...p, { id: Date.now(), ...form }])
    setForm(p => ({ ...p, name: "" }))
  }

  const sortedEvents = [...events].sort((a, b) => getDiff(a.date) - getDiff(b.date))

  function getCountdown(dateStr: string): string {
    const target = new Date(dateStr)
    target.setHours(23,59,59,999)
    const diff = target.getTime() - now.getTime()
    if (diff < 0) return lang === "ko" ? "종료됨" : "Passed"
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    if (d > 0) return lang === "ko" ? `${d}일 ${h}시간 ${m}분` : `${d}d ${h}h ${m}m`
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Live Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang === "ko" ? "이벤트 추가" : "Add Event"}</p>
        <div className="flex gap-2 mb-2">
          <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder={lang === "ko" ? "이벤트 이름..." : "Event name..."}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
          <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
            className="bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            {COLORS.map(c => (
              <button key={c} onClick={() => setForm(p => ({...p, color: c}))}
                className={`w-5 h-5 rounded-full border-2 transition-all ${COLOR_MAP[c].split(" ")[2].replace("/10", "")} ${form.color === c ? "border-white scale-125" : "border-transparent"}`} />
            ))}
          </div>
          <button onClick={add} className="ml-auto px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center gap-1.5">
            <Plus size={14}/> {lang === "ko" ? "추가" : "Add"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {sortedEvents.map(ev => {
          const diff = getDiff(ev.date)
          const colorCls = COLOR_MAP[ev.color] ?? COLOR_MAP.brand
          return (
            <div key={ev.id} className={`rounded-xl border p-4 group relative ${colorCls}`}>
              <button onClick={() => setEvents(p => p.filter(e => e.id !== ev.id))}
                className="absolute top-2 right-2 p-1 rounded text-current opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-all">
                <Trash2 size={12}/>
              </button>
              <p className="text-xs font-medium mb-1 text-current opacity-70">{ev.name}</p>
              <p className={`text-2xl font-extrabold font-mono mb-1 ${colorCls.split(" ")[0]}`}>{getCountdown(ev.date)}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-60">{diff > 0 ? `D-${diff}` : diff === 0 ? "D-Day!" : `D+${Math.abs(diff)}`} · {ev.date}</p>
                <button onClick={() => copy(`${ev.name}: ${diff > 0 ? `D-${diff}` : "D-Day"}`, `ev${ev.id}`)}
                  className={`p-1 rounded border border-current opacity-40 hover:opacity-80 transition-all ${copied === `ev${ev.id}` ? "opacity-100" : ""}`}>
                  {copied === `ev${ev.id}` ? <CheckCheck size={11}/> : <Copy size={11}/>}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <ToolFooter
        toolName={lang === "ko" ? "카운트다운 / D-day 생성기" : "Countdown Creator"}
        toolUrl="https://keyword-mixer.vercel.app/countdown-creator"
        description={tx.desc}
        howToUse={lang === "ko" ? [
          {step:"이벤트 입력", desc:"이벤트 이름과 날짜를 입력하세요."},
          {step:"색상 선택", desc:"원하는 색상을 선택해 이벤트를 구분하세요."},
          {step:"추가 버튼 클릭", desc:"추가 버튼을 클릭하면 카운트다운이 시작됩니다."},
          {step:"여러 이벤트 관리", desc:"여러 이벤트를 동시에 추가해 한눈에 관리하세요."},
        ] : [
          {step:"Enter event", desc:"Type event name and select a date."},
          {step:"Choose color", desc:"Pick a color to distinguish events."},
          {step:"Click Add", desc:"Click Add to start the countdown."},
          {step:"Manage multiple", desc:"Add multiple events to track all at once."},
        ]}
        whyUse={lang === "ko" ? [
          {title:"실시간 카운트다운", desc:"초 단위로 업데이트되는 실시간 카운트다운을 제공합니다."},
          {title:"여러 이벤트 동시 관리", desc:"시험, 여행, 기념일 등 여러 D-day를 한번에 관리합니다."},
          {title:"색상 구분", desc:"6가지 색상으로 이벤트를 시각적으로 구분할 수 있습니다."},
          {title:"D-day 복사", desc:"각 이벤트의 D-day 정보를 텍스트로 복사할 수 있습니다."},
        ] : [
          {title:"Real-time countdown", desc:"Updates every second for live countdown display."},
          {title:"Multiple events", desc:"Track exams, trips, anniversaries all at once."},
          {title:"Color coding", desc:"6 colors to visually distinguish different events."},
          {title:"Copy D-day", desc:"Copy D-day info as text for each event."},
        ]}
        faqs={lang === "ko" ? [
          {q:"이벤트가 지나면 어떻게 표시되나요?", a:"D-day가 지난 이벤트는 D+숫자로 표시되며 맨 아래에 배치됩니다."},
          {q:"카운트다운이 저장되나요?", a:"현재는 브라우저 세션 동안만 유지됩니다. 페이지를 새로고침하면 초기화됩니다."},
          {q:"이벤트 최대 개수는?", a:"현재 제한은 없습니다. 많은 이벤트를 추가할수록 화면이 길어집니다."},
          {q:"시각까지 설정할 수 있나요?", a:"현재 날짜 단위로만 지원합니다. 시각 단위 카운트다운은 추후 업데이트 예정입니다."},
        ] : [
          {q:"What happens when a date passes?", a:"Past events show D+number and sort to the bottom."},
          {q:"Are countdowns saved?", a:"Currently maintained for browser session only. Resets on page refresh."},
          {q:"Is there a max event count?", a:"No limit currently. More events = longer page."},
          {q:"Can I set a specific time?", a:"Currently date-only. Time-based countdown planned for future update."},
        ]}
        keywords="카운트다운 · D-day 계산기 · D-day 만들기 · 날짜 카운트다운 · 이벤트 카운트다운 · countdown timer · D-day calculator · countdown creator · days until · date countdown"
      />
    </div>
  )
}
