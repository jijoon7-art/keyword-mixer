'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '포모도로 타이머',
    desc: '집중 25분 + 휴식 5분 포모도로 기법으로 생산성을 극대화. 알림음·자동 전환·세션 기록 제공.',
    focus: '집중', shortBreak: '짧은 휴식', longBreak: '긴 휴식',
    start: '시작', pause: '일시정지', reset: '초기화',
    session: '세션', completed: '완료',
    settings: '설정', autoStart: '자동 시작',
    todaySessions: '오늘 완료 세션',
  },
  en: {
    title: 'Pomodoro Timer',
    desc: 'Maximize productivity with 25-min focus + 5-min break Pomodoro technique. Includes notification sound, auto-switch, and session log.',
    focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break',
    start: 'Start', pause: 'Pause', reset: 'Reset',
    session: 'Session', completed: 'Completed',
    settings: 'Settings', autoStart: 'Auto Start',
    todaySessions: "Today's Sessions",
  }
}

type Mode = 'focus' | 'short' | 'long'

export default function PomodoroTimer() {
  const { lang } = useLang()
  const tx = T[lang]

  const [mode, setMode] = useState<Mode>('focus')
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(25 * 60)
  const [sessions, setSessions] = useState(0)
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [autoStart, setAutoStart] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [focusMins, setFocusMins] = useState(25)
  const [shortMins, setShortMins] = useState(5)
  const [longMins, setLongMins] = useState(15)

  const audioCtx = useRef<AudioContext | null>(null)

  const DURATIONS: Record<Mode, number> = {
    focus: focusMins * 60,
    short: shortMins * 60,
    long: longMins * 60,
  }

  const playSound = useCallback((freq: number, duration: number) => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtx.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    } catch {}
  }, [])

  const handleComplete = useCallback(() => {
    setRunning(false)
    playSound(880, 0.5)
    setTimeout(() => playSound(1100, 0.3), 600)

    if (mode === 'focus') {
      const newSessions = sessions + 1
      setSessions(newSessions)
      const now = new Date().toLocaleTimeString(lang === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      setCompletedToday(p => [...p, now])

      // 4번마다 긴 휴식
      const nextMode: Mode = newSessions % 4 === 0 ? 'long' : 'short'
      setMode(nextMode)
      setSeconds(DURATIONS[nextMode])
    } else {
      setMode('focus')
      setSeconds(DURATIONS.focus)
    }

    if (autoStart) setTimeout(() => setRunning(true), 1000)
  }, [mode, sessions, autoStart, lang, DURATIONS, playSound])

  useEffect(() => {
    if (!running) return
    if (seconds <= 0) { handleComplete(); return }
    const id = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(id)
  }, [running, seconds, handleComplete])

  const switchMode = (m: Mode) => {
    setMode(m)
    setSeconds(DURATIONS[m])
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(DURATIONS[mode])
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  const total = DURATIONS[mode]
  const progress = ((total - seconds) / total) * 100

  const MODE_COLORS: Record<Mode, string> = {
    focus: '#ef4444',
    short: '#22c55e',
    long: '#3b82f6',
  }
  const modeColor = MODE_COLORS[mode]

  const MODE_LABELS: Record<Mode, string> = {
    focus: tx.focus,
    short: tx.shortBreak,
    long: tx.longBreak,
  }

  // 원형 프로그레스
  const R = 90
  const circumference = 2 * Math.PI * R
  const offset = circumference - (progress / 100) * circumference

  // 브라우저 탭 타이틀 업데이트
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = running ? `${timeStr} - ${MODE_LABELS[mode]}` : tx.title
    }
    return () => { if (typeof document !== 'undefined') document.title = tx.title }
  }, [timeStr, running, mode])

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Productivity Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 모드 선택 */}
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {(['focus', 'short', 'long'] as Mode[]).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === m ? 'text-white font-bold' : 'bg-[#1a1d27] text-slate-400'}`}
            style={mode === m ? { backgroundColor: modeColor } : {}}>
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* 원형 타이머 */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <svg width="220" height="220" className="rotate-[-90deg]">
            <circle cx="110" cy="110" r={R} fill="none" stroke="#1e293b" strokeWidth="10" />
            <circle cx="110" cy="110" r={R} fill="none" stroke={modeColor} strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-extrabold font-mono text-white tracking-wider">{timeStr}</p>
            <p className="text-sm text-slate-400 mt-1">{MODE_LABELS[mode]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{lang === 'ko' ? `세션 ${sessions + 1}` : `Session ${sessions + 1}`}</p>
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex gap-3 mt-4">
          <button onClick={reset}
            className="px-5 py-2.5 rounded-xl border border-surface-border text-slate-300 hover:border-slate-400 text-sm transition-all">
            {tx.reset}
          </button>
          <button onClick={() => { setRunning(!running); if (!running) playSound(440, 0.1) }}
            className="px-10 py-2.5 rounded-xl text-white font-bold text-lg transition-all"
            style={{ backgroundColor: modeColor }}>
            {running ? tx.pause : tx.start}
          </button>
        </div>
      </div>

      {/* 오늘의 세션 */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '완료한 포모도로' : 'Pomodoros Done'}</p>
          <div className="flex justify-center gap-1 flex-wrap">
            {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
              <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < sessions ? 'text-white' : 'border border-surface-border text-slate-700'}`}
                style={i < sessions ? { backgroundColor: modeColor } : {}}>
                {i < sessions ? '✓' : i + 1}
              </div>
            ))}
          </div>
          <p className="text-2xl font-extrabold mt-2" style={{ color: modeColor }}>{sessions}</p>
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 mb-2">{tx.todaySessions}</p>
          <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
            {completedToday.length === 0 ? (
              <p className="text-xs text-slate-600">{lang === 'ko' ? '아직 완료한 세션이 없습니다' : 'No sessions completed yet'}</p>
            ) : (
              completedToday.map((time, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: modeColor }} />
                  <span className="text-slate-300">{lang === 'ko' ? `세션 ${i + 1}` : `Session ${i + 1}`}</span>
                  <span className="text-slate-500 ml-auto">{time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 설정 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-400 font-medium">{tx.settings}</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-300">{tx.autoStart}</span>
            <div onClick={() => setAutoStart(!autoStart)} className={`w-9 h-5 rounded-full relative transition-all ${autoStart ? 'bg-brand-500' : 'bg-surface-border'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${autoStart ? 'left-4' : 'left-0.5'}`} />
            </div>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [lang === 'ko' ? '집중 (분)' : 'Focus (min)', focusMins, setFocusMins],
            [lang === 'ko' ? '짧은 휴식' : 'Short Break', shortMins, setShortMins],
            [lang === 'ko' ? '긴 휴식' : 'Long Break', longMins, setLongMins],
          ].map(([l, v, s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-500 mb-1 block">{l as string}</label>
              <input type="number" min={1} max={60} value={v as number} onChange={e => { (s as Function)(+e.target.value); if (!running) setSeconds(DURATIONS[mode]) }}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 포모도로 기법 안내 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '📋 포모도로 기법이란?' : '📋 What is Pomodoro Technique?'}</p>
        <div className="flex flex-col gap-1.5 text-xs text-slate-300">
          {(lang === 'ko' ? [
            '1. 할 일 목록 작성',
            '2. 타이머 25분 설정 후 집중 작업',
            '3. 타이머 종료 후 5분 휴식',
            '4. 위 과정 4번 반복 후 15~30분 긴 휴식',
          ] : [
            '1. Write down tasks to complete',
            '2. Set timer for 25 minutes and work with focus',
            '3. Take a 5-minute break when timer rings',
            '4. After 4 rounds, take a 15-30 minute long break',
          ]).map((step, i) => (
            <div key={i} className="flex gap-2">
              <span style={{ color: modeColor }}>•</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '포모도로 타이머' : 'Pomodoro Timer'}
        toolUrl="https://keyword-mixer.vercel.app/pomodoro-pro"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '모드 선택', desc: '집중(25분), 짧은 휴식(5분), 긴 휴식(15분) 중 선택하세요.' },
          { step: '시작 버튼', desc: '시작을 누르면 타이머가 작동하고 탭 제목에도 시간이 표시됩니다.' },
          { step: '알림음 확인', desc: '타이머 종료 시 알림음이 울리고 자동으로 다음 모드로 전환됩니다.' },
          { step: '세션 기록 확인', desc: '오늘 완료한 포모도로 세션과 시간을 확인할 수 있습니다.' },
        ] : [
          { step: 'Select mode', desc: 'Choose focus (25min), short break (5min), or long break (15min).' },
          { step: 'Press start', desc: 'Timer activates and countdown shows in browser tab title too.' },
          { step: 'Hear notification', desc: 'Notification sound plays when timer ends and auto-switches to next mode.' },
          { step: 'View session log', desc: 'Check today\'s completed pomodoro sessions and times.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '브라우저 탭 표시', desc: '타이머 실행 중 브라우저 탭에도 남은 시간이 표시됩니다.' },
          { title: '알림음 내장', desc: '타이머 종료 시 Web Audio API 알림음이 자동으로 울립니다.' },
          { title: '자동 전환', desc: '자동 시작 옵션으로 집중→휴식→집중이 자동으로 이어집니다.' },
          { title: '세션 기록', desc: '오늘 완료한 모든 세션과 시간이 기록됩니다.' },
        ] : [
          { title: 'Browser tab display', desc: 'Remaining time shows in browser tab while timer runs.' },
          { title: 'Built-in notification', desc: 'Web Audio API sound plays automatically when timer ends.' },
          { title: 'Auto transition', desc: 'Auto-start option cycles focus→break→focus automatically.' },
          { title: 'Session log', desc: 'Records all completed sessions and times for today.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '포모도로 기법이란?', a: '1980년대 프란체스코 시릴로가 개발한 시간 관리 기법입니다. 25분 집중 + 5분 휴식을 반복해 집중력과 생산성을 높입니다.' },
          { q: '집중 시간을 25분이 아닌 다른 시간으로 바꿀 수 있나요?', a: '네, 설정 패널에서 집중 시간, 짧은 휴식, 긴 휴식 시간을 자유롭게 변경할 수 있습니다.' },
          { q: '긴 휴식은 언제 시작되나요?', a: '기본 설정에서 집중 세션 4번 완료 후 자동으로 긴 휴식(15분)으로 전환됩니다.' },
          { q: '알림이 오지 않는 경우는?', a: '브라우저에서 소리가 차단된 경우 알림음이 들리지 않을 수 있습니다. 브라우저 설정에서 소리를 허용해주세요.' },
        ] : [
          { q: 'What is the Pomodoro Technique?', a: 'A time management method developed by Francesco Cirillo in the 1980s. Alternates 25-min focus sessions with 5-min breaks.' },
          { q: 'Can I change the 25-minute focus time?', a: 'Yes, freely adjust focus time, short break, and long break in the settings panel.' },
          { q: 'When does long break start?', a: 'By default, long break (15 min) starts automatically after completing 4 focus sessions.' },
          { q: 'No notification sound?', a: 'Browser may have sound blocked. Allow sound in browser settings for notification audio.' },
        ]}
        keywords="포모도로 타이머 · 뽀모도로 타이머 · 집중 타이머 · 공부 타이머 · 시간 관리 · pomodoro timer · focus timer · productivity timer · study timer · pomodoro technique"
      />
    </div>
  )
}
