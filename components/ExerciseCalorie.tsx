'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '운동 칼로리 소모 계산기', desc: '40가지 운동별 칼로리 소모량 계산. 체중·운동 시간 입력으로 즉시 계산.' },
  en: { title: 'Exercise Calorie Calculator', desc: 'Calculate calories burned for 40+ exercises. Enter weight and duration for instant results.' }
}

const EXERCISES = [
  { ko: '걷기 (보통속도)', en: 'Walking (moderate)', met: 3.5, cat: 'cardio' },
  { ko: '빠른 걷기', en: 'Brisk Walking', met: 4.5, cat: 'cardio' },
  { ko: '달리기 (8km/h)', en: 'Running (8km/h)', met: 8.0, cat: 'cardio' },
  { ko: '달리기 (10km/h)', en: 'Running (10km/h)', met: 10.0, cat: 'cardio' },
  { ko: '달리기 (12km/h)', en: 'Running (12km/h)', met: 12.5, cat: 'cardio' },
  { ko: '자전거 (보통)', en: 'Cycling (moderate)', met: 6.0, cat: 'cardio' },
  { ko: '자전거 (빠름)', en: 'Cycling (fast)', met: 10.0, cat: 'cardio' },
  { ko: '수영 (자유형)', en: 'Swimming (freestyle)', met: 7.0, cat: 'cardio' },
  { ko: '수영 (평영)', en: 'Swimming (breaststroke)', met: 5.3, cat: 'cardio' },
  { ko: '줄넘기', en: 'Jump Rope', met: 10.0, cat: 'cardio' },
  { ko: '등산', en: 'Hiking', met: 6.0, cat: 'cardio' },
  { ko: '에어로빅', en: 'Aerobics', met: 6.5, cat: 'cardio' },
  { ko: '댄스 (보통)', en: 'Dancing (moderate)', met: 4.5, cat: 'cardio' },
  { ko: '헬스 (웨이트)', en: 'Weight Training', met: 3.5, cat: 'strength' },
  { ko: '스쿼트', en: 'Squats', met: 5.0, cat: 'strength' },
  { ko: '푸시업', en: 'Push-ups', met: 3.8, cat: 'strength' },
  { ko: '풀업', en: 'Pull-ups', met: 4.0, cat: 'strength' },
  { ko: '데드리프트', en: 'Deadlift', met: 6.0, cat: 'strength' },
  { ko: '플랭크', en: 'Plank', met: 3.0, cat: 'strength' },
  { ko: '버피', en: 'Burpees', met: 8.0, cat: 'strength' },
  { ko: '요가 (보통)', en: 'Yoga (moderate)', met: 2.5, cat: 'flexibility' },
  { ko: '필라테스', en: 'Pilates', met: 3.0, cat: 'flexibility' },
  { ko: '스트레칭', en: 'Stretching', met: 2.0, cat: 'flexibility' },
  { ko: '축구', en: 'Soccer', met: 7.0, cat: 'sports' },
  { ko: '농구', en: 'Basketball', met: 6.5, cat: 'sports' },
  { ko: '배드민턴', en: 'Badminton', met: 5.5, cat: 'sports' },
  { ko: '테니스', en: 'Tennis', met: 6.0, cat: 'sports' },
  { ko: '탁구', en: 'Table Tennis', met: 4.0, cat: 'sports' },
  { ko: '볼링', en: 'Bowling', met: 3.0, cat: 'sports' },
  { ko: '골프', en: 'Golf', met: 3.5, cat: 'sports' },
]

const CATS = [
  { key: 'all', ko: '전체', en: 'All' },
  { key: 'cardio', ko: '유산소', en: 'Cardio' },
  { key: 'strength', ko: '근력', en: 'Strength' },
  { key: 'flexibility', ko: '유연성', en: 'Flexibility' },
  { key: 'sports', ko: '스포츠', en: 'Sports' },
]

export default function ExerciseCalorie() {
  const { lang } = useLang()
  const tx = T[lang]
  const [weight, setWeight] = useState(70)
  const [duration, setDuration] = useState(30)
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number[]>([0, 2, 13])
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  // 칼로리 = MET × 체중(kg) × 시간(h)
  const calcCalorie = (met: number) => Math.round(met * weight * (duration / 60))

  const filtered = EXERCISES.filter(e => {
    const matchCat = cat === 'all' || e.cat === cat
    const matchSearch = !search || (lang === 'ko' ? e.ko : e.en).toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const toggleSelect = (i: number) => {
    const idx = EXERCISES.indexOf(filtered[i])
    setSelected(prev => prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx])
  }

  const selectedCalories = selected.reduce((sum, i) => sum + calcCalorie(EXERCISES[i].met), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: lang === 'ko' ? '체중 (kg)' : 'Weight (kg)', val: weight, set: setWeight },
              { label: lang === 'ko' ? '운동 시간 (분)' : 'Duration (min)', val: duration, set: setDuration },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
                <input type="number" min={1} value={f.val} onChange={e => f.set(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[10, 20, 30, 45, 60, 90].map(d => (
              <button key={d} onClick={() => setDuration(d)}
                className={`text-xs px-2.5 py-1 rounded border transition-all ${duration === d ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{d}{lang === 'ko' ? '분' : 'm'}</button>
            ))}
          </div>
        </div>

        {/* 선택된 운동 합계 */}
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
          <p className="text-xs text-slate-400 mb-2">{lang === 'ko' ? `선택된 운동 (${selected.length}개) 총 소모 칼로리` : `Total for ${selected.length} selected exercises`}</p>
          <p className="text-4xl font-extrabold text-brand-400 font-mono">{selectedCalories.toLocaleString()} kcal</p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `체중 ${weight}kg, ${duration}분 기준` : `${weight}kg, ${duration} minutes`}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {selected.map(i => (
              <span key={i} className="text-xs px-2 py-1 rounded-lg bg-brand-500/20 text-brand-300">
                {lang === 'ko' ? EXERCISES[i].ko : EXERCISES[i].en}: {calcCalorie(EXERCISES[i].met)}kcal
              </span>
            ))}
          </div>
          <button onClick={() => copy(selectedCalories.toString(), 'total')} className={`mt-3 text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${copied === 'total' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied === 'total' ? <CheckCheck size={12} /> : <Copy size={12} />} {lang === 'ko' ? '복사' : 'Copy'}
          </button>
        </div>
      </div>

      {/* 운동 목록 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="p-3 border-b border-surface-border flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)}
              className={`text-xs px-2.5 py-1 rounded border transition-all ${cat === c.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
              {lang === 'ko' ? c.ko : c.en}
            </button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === 'ko' ? '검색...' : 'Search...'}
            className="ml-auto bg-[#0f1117] border border-surface-border rounded-lg px-2 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 w-28 transition-all" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 divide-surface-border">
          {filtered.map((e, i) => {
            const idx = EXERCISES.indexOf(e)
            const isSelected = selected.includes(idx)
            const cal = calcCalorie(e.met)
            return (
              <button key={i} onClick={() => toggleSelect(i)}
                className={`flex items-center justify-between p-3 border-b border-r border-surface-border text-left transition-all hover:bg-surface-hover/10 ${isSelected ? 'bg-brand-500/10' : ''}`}>
                <div>
                  <p className={`text-xs font-medium ${isSelected ? 'text-brand-300' : 'text-slate-200'}`}>{lang === 'ko' ? e.ko : e.en}</p>
                  <p className="text-xs text-slate-600">MET {e.met}</p>
                </div>
                <span className={`text-sm font-bold font-mono ${isSelected ? 'text-brand-400' : 'text-slate-400'}`}>{cal}<span className="text-xs font-normal">kcal</span></span>
              </button>
            )
          })}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '운동 칼로리 소모 계산기' : 'Exercise Calorie Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/exercise-calorie"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '체중과 시간 입력', desc: '본인의 체중(kg)과 운동 예정 시간(분)을 입력하세요.' },
          { step: '운동 선택', desc: '운동 목록에서 하나 이상의 운동을 클릭해 선택하세요.' },
          { step: '칼로리 확인', desc: '선택한 운동의 칼로리 소모량이 상단에 합산되어 표시됩니다.' },
          { step: '복사하여 활용', desc: '총 소모 칼로리를 복사해 다이어트 앱에 입력하세요.' },
        ] : [
          { step: 'Enter weight and duration', desc: 'Input your body weight (kg) and exercise duration (minutes).' },
          { step: 'Select exercises', desc: 'Click one or more exercises from the list to select them.' },
          { step: 'View calorie total', desc: 'Total calories burned for selected exercises is shown above.' },
          { step: 'Copy to use', desc: 'Copy total calories for your diet tracking app.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '30가지 운동 지원', desc: '유산소·근력·유연성·스포츠 등 30가지 운동의 칼로리를 계산합니다.' },
          { title: '복수 운동 합산', desc: '여러 운동을 선택해 총 소모 칼로리를 한번에 계산할 수 있습니다.' },
          { title: 'MET 기반 정확한 계산', desc: '신체활동 대사당량(MET)을 기반으로 체중별 정확한 칼로리를 계산합니다.' },
          { title: '운동 카테고리 필터', desc: '유산소·근력·스포츠 등 카테고리로 운동을 빠르게 찾을 수 있습니다.' },
        ] : [
          { title: '30+ exercises supported', desc: 'Cardio, strength, flexibility, and sports - 30 exercises covered.' },
          { title: 'Multiple exercise total', desc: 'Select multiple exercises to calculate combined calorie burn.' },
          { title: 'MET-based accurate calculation', desc: 'Uses Metabolic Equivalent of Task (MET) for weight-specific accuracy.' },
          { title: 'Category filters', desc: 'Quickly find exercises with cardio, strength, and sports filters.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'MET이란?', a: 'Metabolic Equivalent of Task. 안정 시 대사율 대비 운동 강도를 나타내는 지표입니다. MET × 체중(kg) × 시간(h)으로 칼로리를 계산합니다.' },
          { q: '같은 운동도 체중에 따라 소모량이 달라지나요?', a: '네, 체중이 무거울수록 같은 운동을 할 때 더 많은 칼로리를 소모합니다.' },
          { q: '1kg 감량에 필요한 칼로리는?', a: '약 7,700kcal를 소모해야 체지방 1kg이 감량됩니다. 하루 500kcal 적자면 약 2주 후 1kg 감량이 가능합니다.' },
          { q: '운동 전과 후 칼로리 소모 차이는?', a: '근력 운동 후에는 근육 회복을 위해 수 시간 동안 추가 칼로리(EPOC 효과)가 소모됩니다.' },
        ] : [
          { q: 'What is MET?', a: 'Metabolic Equivalent of Task - measures exercise intensity relative to rest. Calories = MET × weight(kg) × time(h).' },
          { q: 'Do heavier people burn more calories?', a: 'Yes, heavier individuals burn more calories for the same exercise and duration.' },
          { q: 'How many calories to lose 1kg?', a: 'Approximately 7,700 kcal deficit needed to lose 1kg of body fat. A 500 kcal daily deficit = ~1kg in 2 weeks.' },
          { q: 'What about post-exercise calorie burn?', a: 'Strength training causes additional calorie burn for hours after (EPOC effect) as muscles recover.' },
        ]}
        keywords="운동 칼로리 · 칼로리 소모 계산기 · 운동 칼로리 계산 · MET 계산 · 달리기 칼로리 · 헬스 칼로리 · exercise calorie calculator · calories burned · MET calculator · workout calorie burn · running calories burned"
      />
    </div>
  )
}
