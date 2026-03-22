'use client'
import { useState, useEffect } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '수면 계산기', desc: '취침 시각→기상 최적시간 계산. 수면 사이클(90분) 기반으로 가장 개운한 기상 시간을 추천합니다.' },
  en: { title: 'Sleep Calculator', desc: 'Calculate optimal wake-up times based on 90-min sleep cycles. Find the best time to wake up.' }
}

function addMinutes(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number)
  const total = (h * 60 + m + minutes) % (24 * 60)
  const nh = Math.floor(total / 60)
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

function subtractMinutes(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number)
  const total = ((h * 60 + m - minutes) % (24 * 60) + 24 * 60) % (24 * 60)
  const nh = Math.floor(total / 60)
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

function formatTimeAMPM(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

const FALL_ASLEEP_MIN = 14 // 평균 잠드는 시간

export default function SleepCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<'bedtime' | 'wakeup'>('bedtime')
  const [time, setTime] = useState('23:00')
  const [now, setNow] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const t = new Date()
    setNow(`${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`)
  }, [])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  // 취침 → 기상 계산 (3~6 사이클)
  const wakeUpTimes = mode === 'bedtime'
    ? [3, 4, 5, 6].map(cycles => ({
        cycles,
        time: addMinutes(time, FALL_ASLEEP_MIN + cycles * 90),
        hours: (FALL_ASLEEP_MIN + cycles * 90) / 60,
        quality: cycles >= 5 ? (lang === 'ko' ? '최적' : 'Optimal') : cycles === 4 ? (lang === 'ko' ? '좋음' : 'Good') : (lang === 'ko' ? '보통' : 'Fair'),
        color: cycles >= 5 ? 'brand' : cycles === 4 ? 'blue' : 'yellow',
      }))
    : []

  // 기상 → 취침 계산
  const bedtimeTimes = mode === 'wakeup'
    ? [3, 4, 5, 6].map(cycles => ({
        cycles,
        time: subtractMinutes(time, FALL_ASLEEP_MIN + cycles * 90),
        hours: (FALL_ASLEEP_MIN + cycles * 90) / 60,
        quality: cycles >= 5 ? (lang === 'ko' ? '최적' : 'Optimal') : cycles === 4 ? (lang === 'ko' ? '좋음' : 'Good') : (lang === 'ko' ? '보통' : 'Fair'),
        color: cycles >= 5 ? 'brand' : cycles === 4 ? 'blue' : 'yellow',
      }))
    : []

  const results = mode === 'bedtime' ? wakeUpTimes : bedtimeTimes

  const colorMap: Record<string, string> = {
    brand: 'border-brand-500/30 bg-brand-500/10 text-brand-400',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  }

  const QUALITY_MAP = {
    [lang === 'ko' ? '최적' : 'Optimal']: '🌟',
    [lang === 'ko' ? '좋음' : 'Good']: '✅',
    [lang === 'ko' ? '보통' : 'Fair']: '😴',
    'Optimal': '🌟', 'Good': '✅', 'Fair': '😴',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex rounded-xl border border-surface-border overflow-hidden mb-4">
          {[['bedtime', lang === 'ko' ? '취침 시각 → 기상 시각' : 'Bedtime → Wake-up'], ['wakeup', lang === 'ko' ? '기상 시각 → 취침 시각' : 'Wake-up → Bedtime']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v as 'bedtime' | 'wakeup')}
              className={`flex-1 py-2.5 text-xs font-medium transition-all ${mode === v ? 'bg-brand-500 text-white font-bold' : 'bg-[#0f1117] text-slate-300'}`}>{l}</button>
          ))}
        </div>

        <label className="text-xs text-slate-400 mb-1.5 block font-medium">
          {mode === 'bedtime' ? (lang === 'ko' ? '취침 시각' : 'Bedtime') : (lang === 'ko' ? '기상 시각' : 'Wake-up Time')}
        </label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)}
          className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-3" />

        <button onClick={() => setTime(now)} className="text-xs text-brand-400 hover:text-brand-300 transition-all">
          {lang === 'ko' ? `현재 시각 (${now}) 사용` : `Use current time (${now})`}
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <p className="text-xs text-slate-400 font-medium">
          {mode === 'bedtime'
            ? (lang === 'ko' ? `취침 시각 ${formatTimeAMPM(time)} 기준 추천 기상 시각` : `Recommended wake-up times after ${formatTimeAMPM(time)}`)
            : (lang === 'ko' ? `기상 시각 ${formatTimeAMPM(time)} 기준 추천 취침 시각` : `Recommended bedtimes to wake at ${formatTimeAMPM(time)}`)}
        </p>
        {results.map((r, i) => (
          <div key={i} className={`rounded-xl border p-4 flex items-center justify-between ${colorMap[r.color]}`}>
            <div>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-extrabold font-mono ${colorMap[r.color].split(' ')[2]}`}>{formatTimeAMPM(r.time)}</p>
                <span className="text-xs font-medium opacity-80">{QUALITY_MAP[r.quality]} {r.quality}</span>
              </div>
              <p className="text-xs opacity-70 mt-0.5">
                {r.cycles}{lang === 'ko' ? '사이클' : ' cycles'} · {r.hours.toFixed(1)}{lang === 'ko' ? '시간' : 'h'}
              </p>
            </div>
            <button onClick={() => copy(r.time, `t${i}`)} className={`p-2 rounded-lg border transition-all ${copied === `t${i}` ? 'bg-white/20 text-white border-white/30' : 'border-current opacity-50 hover:opacity-100'}`}>
              {copied === `t${i}` ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
        ))}
      </div>

      {/* 수면 사이클 설명 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-200 font-semibold mb-2">{lang === 'ko' ? '💤 수면 사이클 (90분)' : '💤 Sleep Cycle (90 min)'}</p>
        <div className="flex gap-2 mb-2">
          {[lang === 'ko' ? '입면' : 'N1', lang === 'ko' ? '얕은수면' : 'N2', lang === 'ko' ? '깊은수면' : 'N3', 'REM'].map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`h-8 rounded ${['bg-slate-700', 'bg-slate-600', 'bg-blue-700', 'bg-purple-700'][i]}`} style={{ opacity: 0.7 + i * 0.1 }} />
              <p className="text-xs text-slate-400 mt-1">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">{lang === 'ko' ? '수면은 약 90분 사이클로 반복됩니다. 사이클 중간에 깨면 더 피곤할 수 있어요. 5~6 사이클(7.5~9시간)이 가장 이상적입니다.' : 'Sleep repeats in ~90 min cycles. Waking mid-cycle makes you feel groggy. 5-6 cycles (7.5-9 hours) is ideal.'}</p>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '수면 계산기' : 'Sleep Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/sleep-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '계산 방향 선택', desc: '취침→기상 또는 기상→취침 방향을 선택하세요.' },
          { step: '시각 입력', desc: '취침 시각 또는 기상 시각을 입력하세요. 현재 시각 버튼을 활용하세요.' },
          { step: '추천 시각 확인', desc: '90분 수면 사이클 기반으로 3~6 사이클에 해당하는 최적 시각이 표시됩니다.' },
          { step: '복사하여 알람 설정', desc: '원하는 시각을 복사해 알람으로 설정하세요.' },
        ] : [
          { step: 'Choose direction', desc: 'Select Bedtime→Wake-up or Wake-up→Bedtime mode.' },
          { step: 'Enter time', desc: 'Input your bedtime or desired wake-up time. Use the current time button.' },
          { step: 'View recommendations', desc: 'See optimal times based on 3-6 sleep cycles (90 min each).' },
          { step: 'Copy for alarm', desc: 'Copy your chosen time to set as an alarm.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '수면 사이클 기반', desc: '90분 수면 사이클 원리를 적용해 가장 개운하게 깰 수 있는 시각을 계산합니다.' },
          { title: '양방향 계산', desc: '취침 시각으로 기상 시각을, 또는 기상 시각으로 취침 시각을 역산할 수 있습니다.' },
          { title: '품질 등급', desc: '수면 사이클 수에 따라 최적·좋음·보통으로 수면 품질을 안내합니다.' },
          { title: '수면 사이클 시각화', desc: 'N1·N2·N3·REM 수면 단계를 시각적으로 설명합니다.' },
        ] : [
          { title: 'Sleep cycle based', desc: 'Applies 90-min sleep cycle science for the most refreshed wake-up times.' },
          { title: 'Bidirectional calculation', desc: 'Calculate from bedtime to wake-up or reverse from wake-up to bedtime.' },
          { title: 'Quality ratings', desc: 'Rates sleep quality as Optimal, Good, or Fair based on cycle count.' },
          { title: 'Sleep stage visualization', desc: 'Visual explanation of N1, N2, N3, and REM sleep stages.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '수면 사이클이란?', a: '수면은 약 90분 단위로 반복되는 사이클로 구성됩니다. 각 사이클은 얕은수면(N1·N2), 깊은수면(N3), REM 수면 단계를 포함합니다.' },
          { q: '왜 잠들고 14분을 더하나요?', a: '평균적으로 눕고 나서 잠드는 데 약 10~20분이 걸립니다. 이 도구에서는 14분을 기본값으로 적용합니다.' },
          { q: '몇 시간 수면이 적당한가요?', a: '성인 권장 수면 시간은 7~9시간(5~6 사이클)입니다. 개인차가 있으므로 본인이 개운함을 느끼는 시간을 파악하는 것이 중요합니다.' },
          { q: '깊은 수면이 중요한 이유는?', a: '깊은 수면(N3) 단계에서 성장호르몬 분비, 세포 재생, 기억 강화가 이루어집니다. 이 단계에서 깨면 가장 피곤합니다.' },
        ] : [
          { q: 'What is a sleep cycle?', a: 'Sleep repeats in ~90-min cycles, each containing light sleep (N1/N2), deep sleep (N3), and REM stages.' },
          { q: 'Why add 14 minutes?', a: 'On average, it takes 10-20 minutes to fall asleep. This tool uses 14 minutes as the default.' },
          { q: 'How many hours of sleep is ideal?', a: 'Adults need 7-9 hours (5-6 cycles). Individual needs vary, so find what makes you feel most refreshed.' },
          { q: 'Why is deep sleep important?', a: 'Deep sleep (N3) is when growth hormone is released, cells regenerate, and memories consolidate. Waking during this stage causes grogginess.' },
        ]}
        keywords="수면 계산기 · 기상 시간 계산 · 수면 사이클 · 취침 시간 계산 · 몇 시에 자야 · 알람 시간 계산 · sleep calculator · wake up time calculator · sleep cycle · optimal wake time · bedtime calculator"
      />
    </div>
  )
}
