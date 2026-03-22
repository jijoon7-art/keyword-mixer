'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '영양소 계산기', desc: '목표 칼로리에 맞는 탄수화물·단백질·지방 섭취량 계산. 다이어트·근성장·유지 목적별 맞춤 비율 제공.' },
  en: { title: 'Nutrition Calculator', desc: 'Calculate optimal carbs, protein, and fat intake for your calorie goal. Diet, muscle gain, or maintenance presets.' }
}

const GOALS = [
  { key: 'lose', ko: '체중감량', en: 'Weight Loss', carb: 40, protein: 35, fat: 25, desc_ko: '탄수화물을 줄이고 단백질을 높게', desc_en: 'Lower carbs, higher protein', multiplier: 0.8 },
  { key: 'maintain', ko: '체중유지', en: 'Maintenance', carb: 50, protein: 25, fat: 25, desc_ko: '균형잡힌 일반 비율', desc_en: 'Balanced general ratio', multiplier: 1.0 },
  { key: 'muscle', ko: '근성장', en: 'Muscle Gain', carb: 45, protein: 35, fat: 20, desc_ko: '단백질과 탄수화물 강화', desc_en: 'Higher protein and carbs', multiplier: 1.1 },
  { key: 'keto', ko: '케토식단', en: 'Keto', carb: 5, protein: 30, fat: 65, desc_ko: '극저탄수화물, 고지방', desc_en: 'Very low carb, high fat', multiplier: 1.0 },
  { key: 'custom', ko: '직접설정', en: 'Custom', carb: 50, protein: 25, fat: 25, desc_ko: '직접 비율 설정', desc_en: 'Set your own ratio', multiplier: 1.0 },
]

function comma(n: number) { return Math.round(n).toLocaleString() }

export default function NutritionCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [calories, setCalories] = useState(2000)
  const [goal, setGoal] = useState('maintain')
  const [customRatio, setCustomRatio] = useState({ carb: 50, protein: 25, fat: 25 })
  const [copied, setCopied] = useState<string | null>(null)
  const [meals, setMeals] = useState(3)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const selectedGoal = GOALS.find(g => g.key === goal) ?? GOALS[1]
  const ratio = goal === 'custom' ? customRatio : { carb: selectedGoal.carb, protein: selectedGoal.protein, fat: selectedGoal.fat }

  const total = ratio.carb + ratio.protein + ratio.fat
  const carbCal = calories * (ratio.carb / total)
  const proteinCal = calories * (ratio.protein / total)
  const fatCal = calories * (ratio.fat / total)

  // 칼로리 → 그램 (탄수 4kcal/g, 단백 4kcal/g, 지방 9kcal/g)
  const carbG = carbCal / 4
  const proteinG = proteinCal / 4
  const fatG = fatCal / 9

  const perMeal = { carb: carbG / meals, protein: proteinG / meals, fat: fatG / meals, cal: calories / meals }

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
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '목표 칼로리 (kcal)' : 'Target Calories (kcal)'}</label>
            <input type="number" value={calories} step={100} onChange={e => setCalories(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[1500, 1800, 2000, 2200, 2500].map(c => (
                <button key={c} onClick={() => setCalories(c)}
                  className={`text-xs px-2 py-1 rounded border transition-all ${calories === c ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '식사 횟수' : 'Meals per day'}</label>
            <div className="flex gap-1.5 mt-1">
              {[2, 3, 4, 5, 6].map(m => (
                <button key={m} onClick={() => setMeals(m)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${meals === m ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '목표 설정' : 'Goal'}</p>
        <div className="grid grid-cols-5 gap-1.5">
          {GOALS.map(g => (
            <button key={g.key} onClick={() => setGoal(g.key)}
              className={`py-2 rounded-lg border text-xs font-medium transition-all ${goal === g.key ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#0f1117]'}`}>
              {lang === 'ko' ? g.ko : g.en}
            </button>
          ))}
        </div>

        {goal === 'custom' && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[['carb', lang === 'ko' ? '탄수화물 %' : 'Carbs %'], ['protein', lang === 'ko' ? '단백질 %' : 'Protein %'], ['fat', lang === 'ko' ? '지방 %' : 'Fat %']].map(([k, l]) => (
              <div key={k}>
                <label className="text-xs text-slate-400 mb-1 block">{l}</label>
                <input type="number" value={(customRatio as any)[k]} onChange={e => setCustomRatio(p => ({ ...p, [k]: +e.target.value }))}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 결과 */}
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4 mb-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">{lang === 'ko' ? '하루 목표' : 'Daily Goal'} ({calories} kcal)</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: lang === 'ko' ? '탄수화물' : 'Carbs', g: carbG, cal: carbCal, ratio: ratio.carb, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
            { label: lang === 'ko' ? '단백질' : 'Protein', g: proteinG, cal: proteinCal, ratio: ratio.protein, color: 'bg-blue-500', textColor: 'text-blue-400' },
            { label: lang === 'ko' ? '지방' : 'Fat', g: fatG, cal: fatCal, ratio: ratio.fat, color: 'bg-red-500', textColor: 'text-red-400' },
          ].map(r => (
            <div key={r.label} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
              <p className={`text-2xl font-bold font-mono ${r.textColor}`}>{Math.round(r.g)}g</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.label}</p>
              <p className="text-xs text-slate-600">{Math.round(r.cal)}kcal · {r.ratio}%</p>
              <button onClick={() => copy(`${Math.round(r.g)}`, r.label)} className={`mt-1 p-1 rounded border transition-all ${copied === r.label ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                {copied === r.label ? <CheckCheck size={11} /> : <Copy size={11} />}
              </button>
            </div>
          ))}
        </div>
        {/* 비율 바 */}
        <div className="flex h-3 rounded-full overflow-hidden mt-3">
          <div className="bg-yellow-500/70" style={{ width: `${(ratio.carb / total) * 100}%` }} />
          <div className="bg-blue-500/70" style={{ width: `${(ratio.protein / total) * 100}%` }} />
          <div className="bg-red-500/70" style={{ width: `${(ratio.fat / total) * 100}%` }} />
        </div>
        <div className="flex gap-3 mt-1.5 text-xs text-slate-500 justify-center">
          <span>🟡 {lang === 'ko' ? '탄수' : 'Carbs'} {ratio.carb}%</span>
          <span>🔵 {lang === 'ko' ? '단백' : 'Protein'} {ratio.protein}%</span>
          <span>🔴 {lang === 'ko' ? '지방' : 'Fat'} {ratio.fat}%</span>
        </div>
      </div>

      {/* 식사당 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? `식사당 (${meals}회 분할)` : `Per Meal (÷${meals})`}</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: lang === 'ko' ? '칼로리' : 'Calories', val: `${Math.round(perMeal.cal)}kcal`, key: 'pmcal' },
            { label: lang === 'ko' ? '탄수화물' : 'Carbs', val: `${Math.round(perMeal.carb)}g`, key: 'pmc' },
            { label: lang === 'ko' ? '단백질' : 'Protein', val: `${Math.round(perMeal.protein)}g`, key: 'pmp' },
            { label: lang === 'ko' ? '지방' : 'Fat', val: `${Math.round(perMeal.fat)}g`, key: 'pmf' },
          ].map(r => (
            <div key={r.key} className="rounded-lg border border-surface-border bg-[#0f1117] p-2 text-center">
              <p className="text-sm font-bold text-slate-200 font-mono">{r.val}</p>
              <p className="text-xs text-slate-500">{r.label}</p>
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '영양소 계산기' : 'Nutrition Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/nutrition-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '목표 칼로리 입력', desc: '하루 목표 칼로리를 입력하거나 프리셋을 선택하세요.' },
          { step: '목표 설정', desc: '체중감량, 유지, 근성장, 케토 중 목적을 선택하면 최적 비율이 자동 설정됩니다.' },
          { step: '식사 횟수 설정', desc: '하루 몇 끼를 먹는지 설정하면 식사당 영양소도 계산됩니다.' },
          { step: '결과 복사', desc: '탄단지 각 수치를 복사해 식단 앱이나 메모에 기록하세요.' },
        ] : [
          { step: 'Enter target calories', desc: 'Input daily calorie goal or use presets.' },
          { step: 'Select goal', desc: 'Choose weight loss, maintenance, muscle gain, or keto for optimal ratios.' },
          { step: 'Set meal frequency', desc: 'Set how many meals per day to see per-meal nutrition.' },
          { step: 'Copy results', desc: 'Copy carb, protein, fat values for diet apps or notes.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '5가지 목표별 비율', desc: '체중감량·유지·근성장·케토·직접설정 5가지 모드를 지원합니다.' },
          { title: '그램 단위 계산', desc: '칼로리가 아닌 실제 섭취해야 할 그램(g) 단위로 표시합니다.' },
          { title: '식사당 분할', desc: '하루 총량을 식사 횟수로 나눠 끼니별 목표를 제시합니다.' },
          { title: '직접 비율 설정', desc: '탄단지 비율을 직접 입력해 커스텀 식단을 만들 수 있습니다.' },
        ] : [
          { title: '5 goal presets', desc: 'Weight loss, maintenance, muscle gain, keto, and custom ratio modes.' },
          { title: 'Gram-based results', desc: 'Shows actual grams to consume, not just percentages.' },
          { title: 'Per-meal breakdown', desc: 'Divides daily totals by meal count for per-meal targets.' },
          { title: 'Custom ratio input', desc: 'Set your own carb/protein/fat ratio for personalized plans.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '탄단지란?', a: '탄수화물(탄), 단백질(단), 지방(지)의 줄임말로 식단의 3대 영양소를 말합니다. 각각 탄수 4kcal/g, 단백질 4kcal/g, 지방 9kcal/g입니다.' },
          { q: '단백질은 체중 kg당 몇 g이 적당한가요?', a: '일반인은 체중 kg당 0.8~1g, 운동하는 사람은 1.2~2g, 근성장 목적이라면 2g 이상이 권장됩니다.' },
          { q: '케토 식단이란?', a: '탄수화물 섭취를 극도로 줄이고(5% 이하) 지방을 주 에너지원으로 사용하는 식단입니다. 케톤증 유발로 체지방을 직접 태웁니다.' },
          { q: '탄수화물을 너무 줄이면?', a: '탄수화물은 뇌와 근육의 주요 에너지원입니다. 과도하게 줄이면 집중력 저하, 피로, 근손실이 올 수 있습니다.' },
        ] : [
          { q: 'What are macros?', a: 'Macronutrients: carbohydrates (4 kcal/g), protein (4 kcal/g), and fat (9 kcal/g). The three main food energy sources.' },
          { q: 'How much protein per kg bodyweight?', a: 'General recommendation: 0.8-1g/kg. Active people: 1.2-2g/kg. Muscle building: 2g+/kg.' },
          { q: 'What is a keto diet?', a: 'Extremely low carb (under 5%) with high fat as the primary energy source. Induces ketosis to burn body fat directly.' },
          { q: 'Risks of too few carbs?', a: 'Carbs are the brain and muscles primary fuel. Too few can cause fatigue, poor concentration, and muscle loss.' },
        ]}
        keywords="영양소 계산기 · 탄단지 계산기 · 다이어트 식단 · 단백질 섭취량 · 탄수화물 계산 · 칼로리 영양소 · nutrition calculator · macro calculator · protein calculator · carb calculator · diet macro · TDEE macros"
      />
    </div>
  )
}
