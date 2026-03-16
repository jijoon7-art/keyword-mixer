'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCheck, RefreshCw } from 'lucide-react'

const TIMEZONES = [
  { label: '서울 (KST)', tz: 'Asia/Seoul', flag: '🇰🇷' },
  { label: '도쿄 (JST)', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { label: '베이징 (CST)', tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { label: '싱가포르', tz: 'Asia/Singapore', flag: '🇸🇬' },
  { label: '뉴욕 (ET)', tz: 'America/New_York', flag: '🇺🇸' },
  { label: '로스앤젤레스 (PT)', tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { label: '런던 (GMT)', tz: 'Europe/London', flag: '🇬🇧' },
  { label: '파리 (CET)', tz: 'Europe/Paris', flag: '🇫🇷' },
  { label: '베를린', tz: 'Europe/Berlin', flag: '🇩🇪' },
  { label: '두바이 (GST)', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { label: '뭄바이 (IST)', tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { label: '시드니 (AEDT)', tz: 'Australia/Sydney', flag: '🇦🇺' },
  { label: 'UTC', tz: 'UTC', flag: '🌐' },
  { label: '상파울루', tz: 'America/Sao_Paulo', flag: '🇧🇷' },
  { label: '모스크바', tz: 'Europe/Moscow', flag: '🇷🇺' },
]

function formatTime(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    weekday: 'short',
  }).format(date)
}

function getOffset(tz: string): string {
  const now = new Date()
  const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' })
  const tzStr = now.toLocaleString('en-US', { timeZone: tz })
  const diff = (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / (1000 * 60 * 60)
  const sign = diff >= 0 ? '+' : '-'
  const abs = Math.abs(diff)
  const h = Math.floor(abs)
  const m = Math.round((abs - h) * 60)
  return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function TimezoneConverter() {
  const [now, setNow] = useState(new Date())
  const [inputDate, setInputDate] = useState('')
  const [inputTime, setInputTime] = useState('')
  const [fromTz, setFromTz] = useState('Asia/Seoul')
  const [selectedTzs, setSelectedTzs] = useState<string[]>(['Asia/Tokyo', 'America/New_York', 'Europe/London', 'UTC'])
  const [copied, setCopied] = useState<string | null>(null)
  const [useNow, setUseNow] = useState(true)

  useEffect(() => {
    if (!useNow) return
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [useNow])

  const baseDate = useNow ? now : (() => {
    if (!inputDate || !inputTime) return now
    const localStr = `${inputDate}T${inputTime}`
    const d = new Date(localStr)
    return isNaN(d.getTime()) ? now : d
  })()

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const toggleTz = (tz: string) => {
    setSelectedTzs(prev =>
      prev.includes(tz) ? prev.filter(t => t !== tz) : [...prev, tz]
    )
  }

  const allTzs = [fromTz, ...selectedTzs.filter(t => t !== fromTz)]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">타임존 변환기</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          세계 주요 도시의 현재 시간을 한눈에 비교. 특정 시간을 여러 타임존으로 즉시 변환.
        </p>
      </div>

      {/* Input mode */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setUseNow(true)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${useNow ? 'border-brand-500 bg-brand-500' : 'border-slate-500'}`}>
              {useNow && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
            </div>
            <span className="text-sm text-slate-300">현재 시간 사용</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setUseNow(false)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${!useNow ? 'border-brand-500 bg-brand-500' : 'border-slate-500'}`}>
              {!useNow && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
            </div>
            <span className="text-sm text-slate-300">날짜/시간 입력</span>
          </label>
        </div>

        {!useNow && (
          <div className="flex gap-3 mb-4">
            <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)}
              className="bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
            <input type="time" value={inputTime} onChange={e => setInputTime(e.target.value)}
              className="bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
            <select value={fromTz} onChange={e => setFromTz(e.target.value)}
              className="bg-surface-DEFAULT border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all">
              {TIMEZONES.map(t => <option key={t.tz} value={t.tz}>{t.flag} {t.label}</option>)}
            </select>
          </div>
        )}

        {/* Results */}
        <div className="grid gap-2">
          {TIMEZONES.filter(t => allTzs.includes(t.tz) || t.tz === fromTz).map(tz => {
            const timeStr = formatTime(baseDate, tz.tz)
            const offset = getOffset(tz.tz)
            const isFrom = tz.tz === fromTz && !useNow
            return (
              <div key={tz.tz} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isFrom ? 'border-brand-500/30 bg-brand-500/5' : 'border-surface-border bg-surface-DEFAULT'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{tz.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{tz.label}</p>
                    <p className="text-xs text-slate-500">{offset}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-slate-200">{timeStr}</p>
                  <button onClick={() => copy(timeStr, tz.tz)} className={`p-1.5 rounded border transition-all ${copied === tz.tz ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400 hover:border-brand-500/40'}`}>
                    {copied === tz.tz ? <CheckCheck size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/remove timezones */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-5">
        <p className="text-xs text-slate-400 mb-3 font-medium">타임존 추가/제거</p>
        <div className="flex flex-wrap gap-2">
          {TIMEZONES.map(t => (
            <button key={t.tz} onClick={() => toggleTz(t.tz)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedTzs.includes(t.tz) ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300'}`}>
              {t.flag} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="mt-10 p-6 rounded-xl border border-surface-border/30 bg-surface-card/20">
        <p className="text-xs text-slate-500 leading-relaxed">
          타임존 변환기 · 세계 시간 변환 · 시간대 변환기 · 한국시간 변환 · 뉴욕 시간 · 런던 시간 · UTC 변환 ·
          timezone converter · world clock · time zone converter · KST to EST · KST to GMT ·
          free timezone tool · international time converter
        </p>
      </div>
    </div>
  )
}
