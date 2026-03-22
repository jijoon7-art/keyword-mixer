'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '만보기 / 걸음수 칼로리 계산기',
    desc: '걸음수를 입력해 소모 칼로리·거리·시간을 즉시 계산. 일일 목표 달성률과 체중 감량 효과도 확인.',
    steps: '걸음수', weight: '체중 (kg)', height: '키 (cm)',
    pace: '걷기 속도', slow: '천천히', normal: '보통', fast: '빠르게',
    result: '계산 결과', calories: '소모 칼로리', distance: '이동 거리',
    time: '소요 시간', goal: '목표 달성률', fatLoss: '체지방 소모',
    dailyGoal: '일일 목표',
  },
  en: {
    title: 'Pedometer / Steps Calorie Calculator',
    desc: 'Calculate calories burned, distance, and time from step count. Track daily goal progress and fat loss.',
    steps: 'Steps', weight: 'Weight (kg)', height: 'Height (cm)',
    pace: 'Walking Speed', slow: 'Slow', normal: 'Normal', fast: 'Fast',
    result: 'Results', calories: 'Calories Burned', distance: 'Distance',
    time: 'Time', goal: 'Goal Progress', fatLoss: 'Fat Burned',
    dailyGoal: 'Daily Goal',
  }
}

const PACE_DATA = {
  slow: { speed: 3.5, met: 2.8, label_ko: '천천히 (3.5km/h)', label_en: 'Slow (3.5km/h)' },
  normal: { speed: 4.5, met: 3.5, label_ko: '보통 (4.5km/h)', label_en: 'Normal (4.5km/h)' },
  fast: { speed: 6.0, met: 5.0, label_ko: '빠르게 (6.0km/h)', label_en: 'Fast (6.0km/h)' },
}

const STEP_PRESETS = [3000, 5000, 7500, 10000, 15000, 20000]
const GOALS = [5000, 7000, 8000, 10000]

function comma(n: number) { return Math.round(n).toLocaleString() }

export default function StepsCalorie() {
  const { lang } = useLang()
  const tx = T[lang]
  const [steps, setSteps] = useState(10000)
  const [weight, setWeight] = useState(65)
  const [height, setHeight] = useState(170)
  const [pace, setPace] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [dailyGoal, setDailyGoal] = useState(10000)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const paceData = PACE_DATA[pace]
  // 보폭 계산 (신장 × 0.413 for normal walk)
  const strideM = height * 0.413 / 100
  const distanceKm = (steps * strideM) / 1000
  const timeHours = distanceKm / paceData.speed
  const timeMin = timeHours * 60

  // 칼로리: MET × 체중 × 시간(h)
  const calories = Math.round(paceData.met * weight * timeHours)
  // 체지방: 칼로리 / 7700 × 1000 (g)
  const fatG = (calories / 7700) * 1000

  const goalPct = Math.min(100, Math.round((steps / dailyGoal) * 100))

  // 만보(10000보) 기준 비교
  const cal10k = Math.round(paceData.met * weight * ((10000 * strideM / 1000) / paceData.speed))

  // 주간/월간 예상
  const weeklyFat = fatG * 7
  const monthlyFat = fatG * 30

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
        {/* 걸음수 */}
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block font-medium">{tx.steps}</label>
          <input type="number" value={steps} step={500} onChange={e => setSteps(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-3xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {STEP_PRESETS.map(s => (
              <button key={s} onClick={() => setSteps(s)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${steps === s ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
                {s.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.weight}</label>
            <input type="number" value={weight} onChange={e => setWeight(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.height}</label>
            <input type="number" value={height} onChange={e => setHeight(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{tx.dailyGoal}</label>
            <select value={dailyGoal} onChange={e => setDailyGoal(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all">
              {GOALS.map(g => <option key={g} value={g}>{g.toLocaleString()}{lang === 'ko' ? '보' : ' steps'}</option>)}
            </select>
          </div>
        </div>

        {/* 속도 */}
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">{tx.pace}</label>
          <div className="flex gap-2">
            {(['slow', 'normal', 'fast'] as const).map(p => (
              <button key={p} onClick={() => setPace(p)}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${pace === p ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {lang === 'ko' ? PACE_DATA[p].label_ko : PACE_DATA[p].label_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: tx.calories, val: `${comma(calories)} kcal`, key: 'cal', highlight: true },
          { label: tx.distance, val: `${distanceKm.toFixed(2)} km`, key: 'dist', highlight: false },
          { label: tx.time, val: `${Math.floor(timeMin)}${lang === 'ko' ? '분' : 'min'} ${Math.round((timeMin % 1) * 60)}${lang === 'ko' ? '초' : 's'}`, key: 'time', highlight: false },
          { label: tx.fatLoss, val: `${fatG.toFixed(1)} g`, key: 'fat', highlight: false },
        ].map(r => (
          <div key={r.key} className={`rounded-xl border p-4 flex items-center justify-between ${r.highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-surface-border bg-[#1a1d27]'}`}>
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className={`text-xl font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
            </div>
            <button onClick={() => copy(r.val, r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>

      {/* 목표 달성률 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-slate-200">{tx.goal}: {dailyGoal.toLocaleString()}{lang === 'ko' ? '보' : ' steps'}</p>
          <p className={`text-lg font-bold font-mono ${goalPct >= 100 ? 'text-brand-400' : goalPct >= 70 ? 'text-blue-400' : 'text-yellow-400'}`}>{goalPct}%</p>
        </div>
        <div className="h-3 bg-surface-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${goalPct >= 100 ? 'bg-brand-500' : goalPct >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
            style={{ width: `${Math.min(100, goalPct)}%` }} />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          {goalPct >= 100
            ? (lang === 'ko' ? '🎉 목표 달성!' : '🎉 Goal achieved!')
            : (lang === 'ko' ? `${(dailyGoal - steps).toLocaleString()}보 더 필요` : `${(dailyGoal - steps).toLocaleString()} more steps needed`)}
        </p>
      </div>

      {/* 장기 효과 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '📈 꾸준히 걸으면 (현재 페이스 유지 시)' : '📈 Long-term Effect (at current pace)'}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: lang === 'ko' ? '일일' : 'Daily', val: `${fatG.toFixed(1)}g` },
            { label: lang === 'ko' ? '1주일' : 'Weekly', val: `${(weeklyFat / 1000).toFixed(2)}kg` },
            { label: lang === 'ko' ? '1개월' : 'Monthly', val: `${(monthlyFat / 1000).toFixed(2)}kg` },
          ].map(r => (
            <div key={r.label} className="rounded-lg border border-surface-border bg-[#0f1117] p-2.5 text-center">
              <p className="text-sm font-bold text-brand-400 font-mono">{r.val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{r.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-2">{lang === 'ko' ? '* 체지방 1kg = 약 7,700kcal 기준 추정치' : '* Estimated: 1kg fat ≈ 7,700kcal'}</p>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '만보기 칼로리 계산기' : 'Steps Calorie Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/steps-calorie"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '걸음수 입력', desc: '오늘 걸은 걸음수를 입력하거나 프리셋을 선택하세요.' },
          { step: '신체 정보 입력', desc: '체중과 키를 입력하면 더 정확한 칼로리와 보폭이 계산됩니다.' },
          { step: '걷기 속도 선택', desc: '본인의 걷기 속도에 맞게 선택하세요.' },
          { step: '결과 확인', desc: '칼로리, 거리, 시간, 체지방 소모량과 목표 달성률을 확인하세요.' },
        ] : [
          { step: 'Enter step count', desc: 'Input today\'s steps or use preset buttons.' },
          { step: 'Enter body info', desc: 'Weight and height for accurate calorie and stride calculation.' },
          { step: 'Select walking speed', desc: 'Choose your typical walking pace.' },
          { step: 'View results', desc: 'See calories, distance, time, fat burned, and goal progress.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '보폭 자동 계산', desc: '키를 기반으로 보폭을 자동 계산해 정확한 이동 거리를 제공합니다.' },
          { title: '목표 달성률', desc: '일일 목표 걸음수에 대한 달성률을 시각적으로 확인합니다.' },
          { title: '장기 체중 효과', desc: '꾸준히 걸을 경우 주간·월간 체지방 감소량을 예측합니다.' },
          { title: '속도별 계산', desc: '걷기 속도에 따른 칼로리 차이를 확인할 수 있습니다.' },
        ] : [
          { title: 'Auto stride calculation', desc: 'Automatically calculates stride from height for accurate distance.' },
          { title: 'Goal progress tracking', desc: 'Visual indicator of daily step goal achievement.' },
          { title: 'Long-term fat loss', desc: 'Predicts weekly and monthly fat loss from consistent walking.' },
          { title: 'Pace-based calculation', desc: 'See calorie differences based on walking speed.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '만보(10,000보)의 효과는?', a: '10,000보는 약 7~8km에 해당하며, 체중 65kg 기준 약 300~400kcal를 소모합니다. 꾸준히 매일 걸으면 월 1~2kg 감량 효과가 있습니다.' },
          { q: '걸음수는 어떻게 측정하나요?', a: '스마트폰의 건강 앱(iPhone 건강, Galaxy Health), 스마트워치, 만보계 앱을 활용하면 자동으로 측정됩니다.' },
          { q: '보폭은 사람마다 다른가요?', a: '네, 신장과 보폭은 비례합니다. 일반적으로 신장(cm) × 0.413 / 100이 보통 보행의 보폭(m)입니다.' },
          { q: '칼로리 계산이 정확한가요?', a: 'MET 값 기반의 추정치로, 실제와 10~20% 차이가 날 수 있습니다. 체력 수준, 지형, 날씨 등에 따라 달라집니다.' },
        ] : [
          { q: 'What is the effect of 10,000 steps?', a: '10,000 steps equals ~7-8km. For 65kg person, burns ~300-400 kcal. Daily practice can lead to 1-2kg monthly weight loss.' },
          { q: 'How to count steps?', a: 'Use your smartphone\'s health app (iPhone Health, Samsung Health), smartwatch, or dedicated pedometer app.' },
          { q: 'Does stride length vary by person?', a: 'Yes, stride correlates with height. Average: height (cm) × 0.413 / 100 = stride in meters.' },
          { q: 'How accurate is the calorie calculation?', a: 'MET-based estimate with 10-20% variance. Actual varies by fitness level, terrain, and weather.' },
        ]}
        keywords="만보기 칼로리 · 걸음수 칼로리 · 만보 효과 · 걷기 칼로리 · 만보기 앱 · 걸음수 거리 계산 · steps calorie calculator · walking calorie · pedometer calculator · 10000 steps calories · 만보 칼로리"
      />
    </div>
  )
}
