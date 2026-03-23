'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '물 섭취량 계산기', desc: '체중·운동량·날씨로 하루 권장 물 섭취량 계산. 잔 수 환산, 알림 간격 제안.' },
  en: { title: 'Water Intake Calculator', desc: 'Calculate daily water needs from weight, activity, and weather. Convert to glasses and get reminder intervals.' }
}

const ACTIVITY_LEVELS = [
  { key: 'sedentary', ko: '거의 안 움직임', en: 'Sedentary', factor: 30 },
  { key: 'light', ko: '가벼운 활동', en: 'Light Activity', factor: 33 },
  { key: 'moderate', ko: '보통 활동', en: 'Moderate', factor: 36 },
  { key: 'active', ko: '활발한 활동', en: 'Active', factor: 39 },
  { key: 'very_active', ko: '격렬한 운동', en: 'Very Active', factor: 42 },
]

const WEATHER = [
  { key: 'cold', ko: '추운 날씨', en: 'Cold', add: 0 },
  { key: 'normal', ko: '보통 날씨', en: 'Normal', add: 200 },
  { key: 'hot', ko: '더운 날씨', en: 'Hot', add: 500 },
  { key: 'very_hot', ko: '매우 더운 날씨', en: 'Very Hot', add: 800 },
]

export default function WaterIntake() {
  const { lang } = useLang()
  const tx = T[lang]
  const [weight, setWeight] = useState(65)
  const [activity, setActivity] = useState('moderate')
  const [weather, setWeather] = useState('normal')
  const [pregnant, setPregnant] = useState(false)
  const [breastfeeding, setBreastfeeding] = useState(false)
  const [cups, setCups] = useState(8)
  const [wakeHour, setWakeHour] = useState(7)
  const [sleepHour, setSleepHour] = useState(23)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const actFactor = ACTIVITY_LEVELS.find(a => a.key === activity)?.factor ?? 36
  const weatherAdd = WEATHER.find(w => w.key === weather)?.add ?? 200
  const pregnantAdd = pregnant ? 300 : 0
  const breastfeedingAdd = breastfeeding ? 700 : 0

  const baseIntake = weight * actFactor
  const totalMl = baseIntake + weatherAdd + pregnantAdd + breastfeedingAdd
  const totalL = (totalMl / 1000).toFixed(1)
  const glassCount = Math.round(totalMl / (1000 / cups))
  const awakeHours = ((sleepHour - wakeHour + 24) % 24)
  const intervalMin = Math.round((awakeHours * 60) / glassCount)

  const pct = Math.min(100, Math.round((totalMl / 3000) * 100))

  const schedule = Array.from({ length: glassCount }, (_, i) => {
    const minFromWake = intervalMin * i
    const h = Math.floor((wakeHour * 60 + minFromWake) / 60) % 24
    const m = (wakeHour * 60 + minFromWake) % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  })

  const waterFoods = lang === 'ko' ? [
    '오이 (96% 수분) - 1개 약 150ml',
    '수박 (92% 수분) - 1조각 약 200ml',
    '딸기 (91% 수분) - 10개 약 100ml',
    '우유 (87% 수분) - 200ml = 174ml 수분',
    '커피/차 - 수분에 포함되나 이뇨 효과 주의',
  ] : [
    'Cucumber (96% water) - 1 piece ≈ 150ml',
    'Watermelon (92% water) - 1 slice ≈ 200ml',
    'Strawberry (91% water) - 10 berries ≈ 100ml',
    'Milk (87% water) - 200ml = 174ml water',
    'Coffee/tea counts but has diuretic effect',
  ]

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
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '체중 (kg)' : 'Weight (kg)'}</label>
            <input type="number" min={30} max={200} value={weight} onChange={e => setWeight(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '컵 용량 (잔당 ml)' : 'Cup Size (ml)'}</label>
            <select value={cups} onChange={e => setCups(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-3 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all">
              {[4, 6, 8, 10, 12].map(c => <option key={c} value={c}>{c}{lang === 'ko' ? '잔=1L' : ' cups=1L'} ({Math.round(1000 / c)}ml)</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '활동 수준' : 'Activity Level'}</label>
          <div className="flex flex-wrap gap-1.5">
            {ACTIVITY_LEVELS.map(a => (
              <button key={a.key} onClick={() => setActivity(a.key)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${activity === a.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {lang === 'ko' ? a.ko : a.en}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '날씨' : 'Weather'}</label>
          <div className="flex flex-wrap gap-1.5">
            {WEATHER.map(w => (
              <button key={w.key} onClick={() => setWeather(w.key)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${weather === w.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                {lang === 'ko' ? w.ko : w.en}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-3">
          {[
            { label: lang === 'ko' ? '임신 중' : 'Pregnant', val: pregnant, set: setPregnant },
            { label: lang === 'ko' ? '모유 수유 중' : 'Breastfeeding', val: breastfeeding, set: setBreastfeeding },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => opt.set(!opt.val)} className={`w-9 h-5 rounded-full relative transition-all ${opt.val ? 'bg-brand-500' : 'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${opt.val ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-xs text-slate-300">{opt.label}</span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: lang === 'ko' ? '기상 시간' : 'Wake Time', val: wakeHour, set: setWakeHour, min: 4, max: 12 },
            { label: lang === 'ko' ? '취침 시간' : 'Sleep Time', val: sleepHour, set: setSleepHour, min: 20, max: 27 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
              <input type="number" min={f.min} max={f.max} value={f.val} onChange={e => f.set(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '하루 권장 물 섭취량' : 'Daily Recommended Water'}</p>
            <p className="text-5xl font-extrabold text-blue-400 font-mono">{totalL}L</p>
            <p className="text-sm text-slate-400 mt-1">{totalMl.toLocaleString()}ml · {lang === 'ko' ? `약 ${glassCount}잔` : `~${glassCount} glasses`} · {lang === 'ko' ? `${intervalMin}분마다 1잔` : `1 glass every ${intervalMin}min`}</p>
          </div>
          <button onClick={() => copy(`${totalL}L (${glassCount}잔)`, 'water')} className={`p-2.5 rounded-xl border transition-all ${copied === 'water' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'border-surface-border text-slate-400 hover:text-blue-400'}`}>
            {copied === 'water' ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="h-3 bg-surface-border rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0</span><span>1.5L (최소)</span><span>2L (권장)</span><span>3L+</span>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '섭취량 구성' : 'Intake Breakdown'}</p>
          {[
            { label: lang === 'ko' ? `기본 (체중 ${weight}kg × ${actFactor})` : `Base (${weight}kg × ${actFactor})`, val: baseIntake },
            { label: lang === 'ko' ? '날씨 추가' : 'Weather add', val: weatherAdd },
            ...(pregnant ? [{ label: lang === 'ko' ? '임신 추가' : 'Pregnancy', val: 300 }] : []),
            ...(breastfeeding ? [{ label: lang === 'ko' ? '수유 추가' : 'Breastfeeding', val: 700 }] : []),
          ].map(r => (
            <div key={r.label} className="flex justify-between text-xs py-1 border-b border-surface-border last:border-0">
              <span className="text-slate-400">{r.label}</span>
              <span className="text-slate-200 font-mono">{r.val}ml</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-3">
          <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '마시는 시간표' : 'Drinking Schedule'}</p>
          <div className="flex flex-wrap gap-1">
            {schedule.slice(0, 10).map((t, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">{t}</span>
            ))}
            {schedule.length > 10 && <span className="text-xs text-slate-500">+{schedule.length - 10}</span>}
          </div>
        </div>
      </div>

      {/* 수분 많은 음식 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '💧 수분 많은 음식 (물 섭취에 포함 가능)' : '💧 High Water Content Foods'}</p>
        <ul className="flex flex-col gap-1">
          {waterFoods.map(f => <li key={f} className="text-xs text-slate-300">• {f}</li>)}
        </ul>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '물 섭취량 계산기' : 'Water Intake Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/water-intake"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '체중 입력', desc: '체중을 입력하면 기본 섭취량이 계산됩니다.' },
          { step: '활동 수준 선택', desc: '오늘의 운동량이나 활동 수준을 선택하세요.' },
          { step: '날씨와 상태 선택', desc: '현재 날씨와 임신/수유 여부를 설정하세요.' },
          { step: '시간표 확인', desc: '권장 물 섭취 시간표가 자동으로 생성됩니다.' },
        ] : [
          { step: 'Enter weight', desc: 'Input your weight for base water calculation.' },
          { step: 'Select activity level', desc: 'Choose your activity level for the day.' },
          { step: 'Set weather and conditions', desc: 'Select weather and pregnancy/breastfeeding status.' },
          { step: 'View schedule', desc: 'A personalized water drinking schedule is generated.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '개인화된 계산', desc: '체중·활동량·날씨·임신 여부를 모두 반영한 맞춤 권장량을 제공합니다.' },
          { title: '음수 시간표 생성', desc: '기상~취침 시간을 기반으로 최적 음수 시간표를 자동 생성합니다.' },
          { title: '수분 함유 음식 안내', desc: '물뿐만 아니라 수분이 많은 음식도 섭취량에 포함할 수 있습니다.' },
          { title: '성분 분석', desc: '기본량·날씨·임신 등 각 요인별 추가 섭취량을 명확히 보여줍니다.' },
        ] : [
          { title: 'Personalized calculation', desc: 'Accounts for weight, activity, weather, and pregnancy for custom recommendation.' },
          { title: 'Drinking schedule', desc: 'Auto-generates optimal water schedule based on wake/sleep time.' },
          { title: 'High-water foods', desc: 'Includes water from food sources in the guidance.' },
          { title: 'Breakdown analysis', desc: 'Shows how each factor (base, weather, pregnancy) adds to the total.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '하루 물 2L 마시라는 게 맞나요?', a: '2L는 일반적인 성인 권장량이지만 체중, 활동량, 날씨에 따라 다릅니다. 이 계산기로 본인에게 맞는 양을 계산해보세요.' },
          { q: '커피나 차도 수분 섭취에 포함되나요?', a: '어느 정도 포함되지만, 카페인이 이뇨 작용을 하므로 완전히 같지는 않습니다. 커피 1잔당 추가로 물 0.5잔을 더 마시는 것을 권장합니다.' },
          { q: '탈수 증상은 어떤 것들이 있나요?', a: '소변 색이 짙은 노란색, 입이 마름, 피로감, 두통, 집중력 저하 등이 탈수 증상입니다. 소변 색이 연한 노란색이 되도록 물을 마시는 것이 좋습니다.' },
          { q: '물을 너무 많이 마셔도 문제가 되나요?', a: '과도한 물 섭취는 저나트륨혈증을 유발할 수 있습니다. 건강한 성인은 시간당 0.8~1L 이상 마시지 않도록 주의하세요.' },
        ] : [
          { q: 'Is 2L of water per day correct?', a: '2L is a general adult guideline, but actual needs vary by weight, activity, and weather. Use this calculator for your personal recommendation.' },
          { q: 'Does coffee/tea count toward water intake?', a: 'Somewhat, but caffeine has diuretic effects. For every cup of coffee, drink an extra half cup of water.' },
          { q: 'What are symptoms of dehydration?', a: 'Dark yellow urine, dry mouth, fatigue, headache, and poor concentration. Aim for pale yellow urine as an indicator of proper hydration.' },
          { q: 'Can you drink too much water?', a: 'Excessive intake can cause hyponatremia. Healthy adults should avoid drinking more than 0.8-1L per hour.' },
        ]}
        keywords="물 섭취량 계산기 · 하루 물 권장량 · 체중별 물 섭취 · 수분 섭취량 계산 · 물 마시는 양 · water intake calculator · daily water recommendation · hydration calculator · how much water per day · water needs by weight"
      />
    </div>
  )
}
