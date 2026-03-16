'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Flag, Plus, Minus } from 'lucide-react'

type Tab = 'timer' | 'stopwatch' | 'pomodoro'

function pad(n: number) { return String(n).padStart(2, '0') }

function formatMs(ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const cs = Math.floor((ms % 1000) / 10)
  return { h, m, s, cs }
}

export default function TimerStopwatch() {
  const [tab, setTab] = useState<Tab>('timer')

  // ── 타이머 ──
  const [timerH, setTimerH] = useState(0)
  const [timerM, setTimerM] = useState(25)
  const [timerS, setTimerS] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerMs, setTimerMs] = useState(25 * 60 * 1000)
  const [timerFinished, setTimerFinished] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const timerLastRef = useRef<number>(0)

  // ── 스톱워치 ──
  const [swMs, setSwMs] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const [laps, setLaps] = useState<{ ms: number; diff: number }[]>([])
  const swRef = useRef<NodeJS.Timeout | null>(null)
  const swLastRef = useRef<number>(0)
  const swAccRef = useRef<number>(0)

  // ── 포모도로 ──
  const [pomodoroPhase, setPomodoroPhase] = useState<'work' | 'break' | 'longbreak'>('work')
  const [pomodoroMs, setPomodoroMs] = useState(25 * 60 * 1000)
  const [pomodoroRunning, setPomodoroRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const pomodoroRef = useRef<NodeJS.Timeout | null>(null)
  const pomodoroLastRef = useRef<number>(0)
  const POMODORO_TIMES = { work: 25 * 60 * 1000, break: 5 * 60 * 1000, longbreak: 15 * 60 * 1000 }
  const PHASE_LABELS = { work: '집중 시간', break: '짧은 휴식', longbreak: '긴 휴식' }
  const PHASE_COLORS = { work: 'text-red-400', break: 'text-brand-400', longbreak: 'text-blue-400' }

  // 타이머 실행
  useEffect(() => {
    if (timerRunning) {
      timerLastRef.current = Date.now()
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const delta = now - timerLastRef.current
        timerLastRef.current = now
        setTimerMs(prev => {
          const next = prev - delta
          if (next <= 0) {
            setTimerRunning(false)
            setTimerFinished(true)
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return next
        })
      }, 50)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  // 스톱워치
  useEffect(() => {
    if (swRunning) {
      swLastRef.current = Date.now()
      swRef.current = setInterval(() => {
        const now = Date.now()
        setSwMs(swAccRef.current + (now - swLastRef.current))
      }, 30)
    } else {
      if (swRef.current) clearInterval(swRef.current)
      swAccRef.current = swMs
    }
    return () => { if (swRef.current) clearInterval(swRef.current) }
  }, [swRunning])

  // 포모도로
  useEffect(() => {
    if (pomodoroRunning) {
      pomodoroLastRef.current = Date.now()
      pomodoroRef.current = setInterval(() => {
        const now = Date.now()
        const delta = now - pomodoroLastRef.current
        pomodoroLastRef.current = now
        setPomodoroMs(prev => {
          const next = prev - delta
          if (next <= 0) {
            setPomodoroRunning(false)
            if (pomodoroRef.current) clearInterval(pomodoroRef.current)
            // 다음 단계
            setPomodoroPhase(p => {
              if (p === 'work') {
                const newCount = pomodoroCount + 1
                setPomodoroCount(newCount)
                const nextPhase = newCount % 4 === 0 ? 'longbreak' : 'break'
                setPomodoroMs(POMODORO_TIMES[nextPhase])
                return nextPhase
              } else {
                setPomodoroMs(POMODORO_TIMES.work)
                return 'work'
              }
            })
            return 0
          }
          return next
        })
      }, 50)
    } else {
      if (pomodoroRef.current) clearInterval(pomodoroRef.current)
    }
    return () => { if (pomodoroRef.current) clearInterval(pomodoroRef.current) }
  }, [pomodoroRunning])

  const resetTimer = () => {
    setTimerRunning(false)
    setTimerFinished(false)
    setTimerMs((timerH * 3600 + timerM * 60 + timerS) * 1000)
  }

  const startTimer = () => {
    if (timerMs <= 0) {
      const ms = (timerH * 3600 + timerM * 60 + timerS) * 1000
      if (ms <= 0) return
      setTimerMs(ms)
    }
    setTimerFinished(false)
    setTimerRunning(true)
  }

  const recordLap = () => {
    const prev = laps[0]?.ms ?? 0
    setLaps(l => [{ ms: swMs, diff: swMs - prev }, ...l])
  }

  const resetSw = () => {
    setSwRunning(false)
    setSwMs(0)
    swAccRef.current = 0
    setLaps([])
  }

  const t = formatMs(timerMs)
  const sw = formatMs(swMs)
  const p = formatMs(pomodoroMs)

  const PRESETS = [
    { label: '1분', ms: 60000 }, { label: '3분', ms: 180000 }, { label: '5분', ms: 300000 },
    { label: '10분', ms: 600000 }, { label: '15분', ms: 900000 }, { label: '30분', ms: 1800000 },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">타이머 / 스톱워치</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          카운트다운 타이머·스톱워치·포모도로 타이머. 랩 기록, 프리셋 지원.
        </p>
      </div>

      {/* 탭 */}
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {[['timer','⏱ 타이머'],['stopwatch','⏲ 스톱워치'],['pomodoro','🍅 포모도로']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === key ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── 타이머 ── */}
      {tab === 'timer' && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-6">
          {/* 시간 설정 */}
          {!timerRunning && timerMs === (timerH * 3600 + timerM * 60 + timerS) * 1000 && (
            <div className="flex items-center justify-center gap-3 mb-6">
              {[
                { val: timerH, set: setTimerH, label: '시' },
                { val: timerM, set: setTimerM, label: '분' },
                { val: timerS, set: setTimerS, label: '초' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <button onClick={() => f.set(v => Math.min(i === 0 ? 23 : 59, v + 1))} className="w-8 h-8 rounded-lg border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 flex items-center justify-center transition-all"><Plus size={14} /></button>
                  <div className="w-16 h-14 rounded-xl bg-[#0f1117] border border-surface-border flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-slate-200">{pad(f.val)}</span>
                    <span className="text-xs text-slate-500">{f.label}</span>
                  </div>
                  <button onClick={() => f.set(v => Math.max(0, v - 1))} className="w-8 h-8 rounded-lg border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 flex items-center justify-center transition-all"><Minus size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* 카운트다운 디스플레이 */}
          {(timerRunning || timerMs !== (timerH * 3600 + timerM * 60 + timerS) * 1000) && (
            <div className={`text-center mb-6 p-6 rounded-xl border ${timerFinished ? 'border-red-500/40 bg-red-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
              <p className={`text-6xl font-mono font-extrabold tracking-tight ${timerFinished ? 'text-red-400' : 'text-slate-200'}`}>
                {t.h > 0 ? `${pad(t.h)}:` : ''}{pad(t.m)}:{pad(t.s)}
              </p>
              {timerFinished && <p className="text-red-400 text-lg font-bold mt-2 animate-pulse">⏰ 시간 종료!</p>}
            </div>
          )}

          {/* 프리셋 */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {PRESETS.map(pr => (
              <button key={pr.label} onClick={() => {
                setTimerRunning(false); setTimerFinished(false)
                const h = Math.floor(pr.ms / 3600000)
                const m = Math.floor((pr.ms % 3600000) / 60000)
                const s = Math.floor((pr.ms % 60000) / 1000)
                setTimerH(h); setTimerM(m); setTimerS(s); setTimerMs(pr.ms)
              }} className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
                {pr.label}
              </button>
            ))}
          </div>

          {/* 컨트롤 */}
          <div className="flex gap-3">
            <button onClick={timerRunning ? () => setTimerRunning(false) : startTimer}
              disabled={timerH === 0 && timerM === 0 && timerS === 0 && timerMs === 0}
              className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
              {timerRunning ? <><Pause size={15} />일시정지</> : <><Play size={15} />시작</>}
            </button>
            <button onClick={resetTimer} className="px-5 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── 스톱워치 ── */}
      {tab === 'stopwatch' && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-6">
          <div className="text-center mb-6 p-6 rounded-xl border border-surface-border bg-[#0f1117]">
            <p className="text-6xl font-mono font-extrabold tracking-tight text-slate-200">
              {pad(sw.h > 0 ? sw.h : sw.m)}:{sw.h > 0 ? pad(sw.m) : pad(sw.s)}
              <span className="text-3xl text-slate-500">.{pad(sw.cs)}</span>
            </p>
            {sw.h > 0 && <p className="text-xs text-slate-500 mt-1">{pad(sw.h)}시간 {pad(sw.m)}분 {pad(sw.s)}초</p>}
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={swRunning ? () => setSwRunning(false) : () => setSwRunning(true)}
              className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
              {swRunning ? <><Pause size={15} />정지</> : <><Play size={15} />시작</>}
            </button>
            {swRunning && (
              <button onClick={recordLap} className="px-5 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1.5 text-sm">
                <Flag size={14} /> 랩
              </button>
            )}
            <button onClick={resetSw} className="px-5 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              <RotateCcw size={16} />
            </button>
          </div>

          {laps.length > 0 && (
            <div className="rounded-xl border border-surface-border overflow-hidden">
              <div className="px-4 py-2 border-b border-surface-border bg-[#0f1117]">
                <p className="text-xs font-medium text-slate-400">랩 기록 ({laps.length})</p>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-surface-border">
                {laps.map((lap, i) => {
                  const lt = formatMs(lap.ms)
                  const dt = formatMs(lap.diff)
                  return (
                    <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-surface-hover/20">
                      <span className="text-xs text-slate-500">Lap {laps.length - i}</span>
                      <span className="text-xs font-mono text-brand-400">+{pad(dt.m)}:{pad(dt.s)}.{pad(dt.cs)}</span>
                      <span className="text-xs font-mono text-slate-300">{pad(lt.m)}:{pad(lt.s)}.{pad(lt.cs)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 포모도로 ── */}
      {tab === 'pomodoro' && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-6">
          <div className="flex justify-center gap-2 mb-5">
            {(['work','break','longbreak'] as const).map(ph => (
              <button key={ph} onClick={() => { setPomodoroRunning(false); setPomodoroPhase(ph); setPomodoroMs(POMODORO_TIMES[ph]) }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${pomodoroPhase === ph ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-400 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {PHASE_LABELS[ph]}
              </button>
            ))}
          </div>

          <div className="text-center mb-4 p-8 rounded-xl border border-surface-border bg-[#0f1117]">
            <p className="text-xs text-slate-500 mb-2">{PHASE_LABELS[pomodoroPhase]}</p>
            <p className={`text-7xl font-mono font-extrabold tracking-tight ${PHASE_COLORS[pomodoroPhase]}`}>
              {pad(p.m)}:{pad(p.s)}
            </p>
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < (pomodoroCount % 4) ? 'bg-red-500' : 'bg-surface-border'}`} />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">완료한 포모도로: {pomodoroCount}개</p>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={() => setPomodoroRunning(r => !r)}
              className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
              {pomodoroRunning ? <><Pause size={15} />일시정지</> : <><Play size={15} />시작</>}
            </button>
            <button onClick={() => { setPomodoroRunning(false); setPomodoroMs(POMODORO_TIMES[pomodoroPhase]) }}
              className="px-5 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#0f1117] border border-surface-border text-xs text-slate-500">
            💡 포모도로 기법: 25분 집중 → 5분 휴식 반복. 4회 후 15분 긴 휴식.
          </div>
        </div>
      )}

      <div className="mt-10 p-5 rounded-xl border border-surface-border/30 bg-[#1a1d27]/50">
        <p className="text-xs text-slate-500 leading-relaxed">
          타이머 · 온라인 타이머 · 스톱워치 · 카운트다운 타이머 · 포모도로 타이머 · 공부 타이머 · 요리 타이머 ·
          online timer · stopwatch · countdown timer · pomodoro timer · free timer
        </p>
      </div>
    </div>
  )
}
