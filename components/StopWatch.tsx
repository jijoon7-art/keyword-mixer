'use client'
import { useState, useEffect, useRef } from 'react'
import { Copy, CheckCheck, Trash2, Flag } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '스톱워치', desc: '밀리초 단위 정밀 스톱워치. 랩 타임 기록, 최고/최저 랩 강조, 기록 복사 지원.' },
  en: { title: 'Stopwatch', desc: 'Precise stopwatch with millisecond accuracy. Lap timing, best/worst lap highlighting, and record copy.' }
}

export default function StopWatch() {
  const { lang } = useLang()
  const tx = T[lang]
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const [lapStart, setLapStart] = useState(0)
  const [copied, setCopied] = useState(false)
  const startRef = useRef<number>(0)
  const elapsedRef = useRef<number>(0)

  useEffect(() => {
    if (!running) return
    startRef.current = Date.now() - elapsedRef.current
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current)
    }, 10)
    return () => clearInterval(id)
  }, [running])

  const fmt = (ms: number): string => {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
  }

  const toggle = () => {
    if (running) {
      elapsedRef.current = elapsed
    }
    setRunning(!running)
  }

  const lap = () => {
    const lapTime = elapsed - lapStart
    setLaps(p => [...p, lapTime])
    setLapStart(elapsed)
  }

  const reset = () => {
    setRunning(false)
    setElapsed(0)
    elapsedRef.current = 0
    setLaps([])
    setLapStart(0)
  }

  const copyAll = async () => {
    const lines = [
      `${lang === 'ko' ? '총 시간' : 'Total'}: ${fmt(elapsed)}`,
      ...laps.map((l, i) => `${lang === 'ko' ? `랩 ${i + 1}` : `Lap ${i + 1}`}: ${fmt(l)}`),
    ].join('\n')
    await navigator.clipboard.writeText(lines)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const bestLap = laps.length > 0 ? Math.min(...laps) : null
  const worstLap = laps.length > 1 ? Math.max(...laps) : null
  const avgLap = laps.length > 0 ? laps.reduce((a, b) => a + b, 0) / laps.length : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-brand-400 animate-pulse' : 'bg-slate-600'}`} />
          {running ? (lang === 'ko' ? '실행 중' : 'Running') : (lang === 'ko' ? '정지' : 'Stopped')}
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 메인 타이머 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-8 mb-5 text-center">
        <p className={`text-7xl font-extrabold font-mono tracking-wider transition-colors ${running ? 'text-brand-400' : 'text-slate-200'}`}>
          {fmt(elapsed)}
        </p>
        {laps.length > 0 && (
          <p className="text-slate-500 text-sm mt-2 font-mono">
            {lang === 'ko' ? '현재 랩:' : 'Current lap:'} {fmt(elapsed - lapStart)}
          </p>
        )}
      </div>

      {/* 컨트롤 */}
      <div className="flex gap-3 mb-5">
        <button onClick={reset} className="flex-1 py-3 rounded-xl border border-surface-border text-slate-300 hover:border-slate-400 text-sm font-medium transition-all">
          {lang === 'ko' ? '초기화' : 'Reset'}
        </button>
        {running && (
          <button onClick={lap} className="flex-1 py-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm font-medium transition-all flex items-center justify-center gap-1.5">
            <Flag size={14} /> {lang === 'ko' ? '랩' : 'Lap'}
          </button>
        )}
        <button onClick={toggle}
          className={`flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all ${running ? 'bg-red-500 hover:bg-red-400' : 'bg-brand-500 hover:bg-brand-400'}`}>
          {running ? (lang === 'ko' ? '⏸ 정지' : '⏸ Stop') : (lang === 'ko' ? '▶ 시작' : '▶ Start')}
        </button>
      </div>

      {/* 통계 */}
      {laps.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: lang === 'ko' ? '최고 랩' : 'Best Lap', val: bestLap !== null ? fmt(bestLap) : '—', color: 'text-brand-400' },
              { label: lang === 'ko' ? '평균 랩' : 'Avg Lap', val: avgLap !== null ? fmt(avgLap) : '—', color: 'text-blue-400' },
              { label: lang === 'ko' ? '최저 랩' : 'Worst Lap', val: worstLap !== null ? fmt(worstLap) : '—', color: 'text-red-400' },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-sm font-bold font-mono ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>

          {/* 랩 목록 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-[#0f1117]">
              <p className="text-xs font-medium text-slate-200">{lang === 'ko' ? `랩 기록 (${laps.length}개)` : `Lap Records (${laps.length})`}</p>
              <button onClick={copyAll} className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
                {copied ? <CheckCheck size={11} /> : <Copy size={11} />} {lang === 'ko' ? '전체 복사' : 'Copy All'}
              </button>
            </div>
            <div className="divide-y divide-surface-border max-h-60 overflow-y-auto">
              {[...laps].reverse().map((lap, i) => {
                const realIdx = laps.length - 1 - i
                const isBest = lap === bestLap
                const isWorst = lap === worstLap && laps.length > 1
                return (
                  <div key={realIdx} className={`flex items-center gap-3 px-4 py-2.5 ${isBest ? 'bg-brand-500/5' : isWorst ? 'bg-red-500/5' : ''}`}>
                    <span className="text-xs text-slate-500 w-12">{lang === 'ko' ? `랩 ${realIdx + 1}` : `Lap ${realIdx + 1}`}</span>
                    <span className={`flex-1 font-mono text-sm font-bold ${isBest ? 'text-brand-400' : isWorst ? 'text-red-400' : 'text-slate-200'}`}>{fmt(lap)}</span>
                    {isBest && <span className="text-xs text-brand-400 font-bold">BEST</span>}
                    {isWorst && <span className="text-xs text-red-400 font-bold">SLOW</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      <ToolFooter
        toolName={lang === 'ko' ? '스톱워치' : 'Stopwatch'}
        toolUrl="https://keyword-mixer.vercel.app/stopwatch"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '시작 버튼', desc: '시작 버튼을 눌러 스톱워치를 시작하세요.' },
          { step: '랩 기록', desc: '실행 중에 랩 버튼을 눌러 구간별 시간을 기록하세요.' },
          { step: '정지 후 분석', desc: '정지하면 최고/평균/최저 랩 통계를 확인할 수 있습니다.' },
          { step: '기록 복사', desc: '전체 복사 버튼으로 모든 랩 기록을 텍스트로 복사하세요.' },
        ] : [
          { step: 'Press Start', desc: 'Click start to begin the stopwatch.' },
          { step: 'Record laps', desc: 'Press Lap button while running to record split times.' },
          { step: 'Analyze after stop', desc: 'View best/average/worst lap statistics after stopping.' },
          { step: 'Copy records', desc: 'Use copy all button to copy all lap records as text.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '밀리초 정밀도', desc: '10ms 단위로 업데이트되는 정밀한 스톱워치입니다.' },
          { title: '랩 타임 분석', desc: '최고·평균·최저 랩을 자동으로 계산하고 강조 표시합니다.' },
          { title: '기록 복사', desc: '모든 랩 기록을 한번에 텍스트로 복사할 수 있습니다.' },
          { title: '간단한 조작', desc: '시작/정지/랩/초기화 4가지 기능만으로 직관적으로 사용합니다.' },
        ] : [
          { title: 'Millisecond precision', desc: 'Updates every 10ms for precise timing.' },
          { title: 'Lap analysis', desc: 'Auto-calculates and highlights best, average, worst laps.' },
          { title: 'Record copy', desc: 'Copy all lap records as text in one click.' },
          { title: 'Simple controls', desc: 'Intuitive with just start/stop/lap/reset functions.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '브라우저를 닫으면 기록이 사라지나요?', a: '네, 현재 버전은 페이지를 새로고침하거나 닫으면 기록이 초기화됩니다.' },
          { q: '얼마나 오래 측정할 수 있나요?', a: '시간 제한 없이 측정할 수 있습니다. 시간, 분, 초, 밀리초 형식으로 표시됩니다.' },
          { q: '랩 기록을 삭제할 수 있나요?', a: '초기화 버튼을 누르면 모든 기록과 시간이 초기화됩니다.' },
          { q: '운동·스포츠에 사용할 수 있나요?', a: '네, 달리기, 수영, 자전거 등의 랩 타임 측정에 활용할 수 있습니다. 랩 버튼으로 구간별 기록이 가능합니다.' },
        ] : [
          { q: 'Records lost when browser closes?', a: 'Yes, current version resets when page is refreshed or closed.' },
          { q: 'Maximum timing duration?', a: 'No time limit. Displays hours, minutes, seconds, and milliseconds.' },
          { q: 'Can I delete lap records?', a: 'Press Reset to clear all records and elapsed time.' },
          { q: 'Suitable for sports timing?', a: 'Yes, great for running, swimming, cycling lap times. Use Lap button for split recordings.' },
        ]}
        keywords="스톱워치 · 온라인 스톱워치 · 랩 타이머 · 스톱워치 온라인 · 시간 측정 · stopwatch online · lap timer · online stopwatch · split timer"
      />
    </div>
  )
}
