'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '체지방률 계산기', desc: '키·몸무게·나이·성별로 체지방률 추정. BMI·기초대사량·체형 분석까지 한번에.', male: '남성', female: '여성' },
  en: { title: 'Body Fat Calculator', desc: 'Estimate body fat percentage from height, weight, age, and gender. BMI, BMR, and body type analysis.', male: 'Male', female: 'Female' }
}

function getBMI(weight: number, heightCm: number) {
  const h = heightCm / 100
  return weight / (h * h)
}

function getBFP(bmi: number, age: number, gender: 'male' | 'female') {
  // Deurenberg formula
  const sexFactor = gender === 'male' ? 1 : 0
  return (1.2 * bmi) + (0.23 * age) - (10.8 * sexFactor) - 5.4
}

function getBMR(weight: number, height: number, age: number, gender: 'male' | 'female') {
  if (gender === 'male') return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
}

function getBFCategory(bfp: number, gender: 'male' | 'female', lang: string): { label: string; color: string; desc: string } {
  const ranges = gender === 'male'
    ? [{ max: 6, label: lang === 'ko' ? '필수지방' : 'Essential fat', color: 'text-blue-400', desc: lang === 'ko' ? '생명 유지에 필요한 최소 지방' : 'Minimum fat for life functions' },
       { max: 14, label: lang === 'ko' ? '운동선수' : 'Athlete', color: 'text-brand-400', desc: lang === 'ko' ? '스포츠 선수 수준' : 'Athletic level' },
       { max: 18, label: lang === 'ko' ? '건강' : 'Fitness', color: 'text-green-400', desc: lang === 'ko' ? '건강하고 균형 잡힌 체형' : 'Healthy and balanced' },
       { max: 25, label: lang === 'ko' ? '보통' : 'Average', color: 'text-yellow-400', desc: lang === 'ko' ? '일반적인 성인 체형' : 'Average adult' },
       { max: 100, label: lang === 'ko' ? '비만' : 'Obese', color: 'text-red-400', desc: lang === 'ko' ? '체지방 과다' : 'High body fat' }]
    : [{ max: 14, label: lang === 'ko' ? '필수지방' : 'Essential fat', color: 'text-blue-400', desc: lang === 'ko' ? '생명 유지에 필요한 최소 지방' : 'Minimum fat for life functions' },
       { max: 21, label: lang === 'ko' ? '운동선수' : 'Athlete', color: 'text-brand-400', desc: lang === 'ko' ? '스포츠 선수 수준' : 'Athletic level' },
       { max: 25, label: lang === 'ko' ? '건강' : 'Fitness', color: 'text-green-400', desc: lang === 'ko' ? '건강하고 균형 잡힌 체형' : 'Healthy and balanced' },
       { max: 32, label: lang === 'ko' ? '보통' : 'Average', color: 'text-yellow-400', desc: lang === 'ko' ? '일반적인 성인 체형' : 'Average adult' },
       { max: 100, label: lang === 'ko' ? '비만' : 'Obese', color: 'text-red-400', desc: lang === 'ko' ? '체지방 과다' : 'High body fat' }]
  return ranges.find(r => bfp <= r.max) ?? ranges[ranges.length - 1]
}

function getBMICategory(bmi: number, lang: string): { label: string; color: string } {
  if (bmi < 18.5) return { label: lang === 'ko' ? '저체중' : 'Underweight', color: 'text-blue-400' }
  if (bmi < 23) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400' }
  if (bmi < 25) return { label: lang === 'ko' ? '과체중' : 'Overweight', color: 'text-yellow-400' }
  if (bmi < 30) return { label: lang === 'ko' ? '비만 1단계' : 'Obese Class I', color: 'text-orange-400' }
  return { label: lang === 'ko' ? '고도비만' : 'Obese Class II', color: 'text-red-400' }
}

const ACTIVITY_LEVELS = [
  { key: 'sedentary', factor: 1.2, ko: '거의 운동 안 함', en: 'Sedentary' },
  { key: 'light', factor: 1.375, ko: '가벼운 운동 (주 1~3회)', en: 'Light (1-3×/week)' },
  { key: 'moderate', factor: 1.55, ko: '보통 운동 (주 3~5회)', en: 'Moderate (3-5×/week)' },
  { key: 'active', factor: 1.725, ko: '격한 운동 (주 6~7회)', en: 'Active (6-7×/week)' },
  { key: 'veryActive', factor: 1.9, ko: '매우 격렬 (2회/일)', en: 'Very Active (2×/day)' },
]

export default function BodyFatCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [height, setHeight] = useState(175)
  const [weight, setWeight] = useState(70)
  const [age, setAge] = useState(30)
  const [activity, setActivity] = useState('moderate')
  const [copied, setCopied] = useState<string | null>(null)

  const bmi = getBMI(weight, height)
  const bfp = getBFP(bmi, age, gender)
  const bmr = getBMR(weight, height, age, gender)
  const actFactor = ACTIVITY_LEVELS.find(a => a.key === activity)?.factor ?? 1.55
  const tdee = bmr * actFactor

  const fatMass = (weight * bfp) / 100
  const leanMass = weight - fatMass

  const bfCategory = getBFCategory(bfp, gender, lang)
  const bmiCategory = getBMICategory(bmi, lang)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1500)
  }

  const idealBFP = gender === 'male' ? { min: 10, max: 20 } : { min: 18, max: 28 }
  const idealWeight = { min: +(leanMass / (1 - idealBFP.max / 100)).toFixed(1), max: +(leanMass / (1 - idealBFP.min / 100)).toFixed(1) }

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
        <div className="flex gap-2 mb-4">
          {[['male', tx.male], ['female', tx.female]].map(([v, l]) => (
            <button key={v} onClick={() => setGender(v as 'male' | 'female')}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: lang === 'ko' ? '키 (cm)' : 'Height (cm)', val: height, set: setHeight, min: 100, max: 250 },
            { label: lang === 'ko' ? '몸무게 (kg)' : 'Weight (kg)', val: weight, set: setWeight, min: 20, max: 300 },
            { label: lang === 'ko' ? '나이' : 'Age', val: age, set: setAge, min: 10, max: 100 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <input type="number" min={f.min} max={f.max} value={f.val} onChange={e => f.set(Number(e.target.value))}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono focus:outline-none focus:border-brand-500/50 transition-all text-center" />
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="text-xs text-slate-400 mb-2 block">{lang === 'ko' ? '활동 수준' : 'Activity Level'}</label>
          <div className="flex flex-col gap-1.5">
            {ACTIVITY_LEVELS.map(a => (
              <button key={a.key} onClick={() => setActivity(a.key)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all ${activity === a.key ? 'bg-brand-500/15 border-brand-500/30 text-brand-300 font-medium' : 'border-surface-border text-slate-400 hover:border-brand-500/30 bg-[#0f1117]'}`}>
                <span>{lang === 'ko' ? a.ko : a.en}</span>
                <span className="text-slate-600">× {a.factor}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '체지방률 (추정)' : 'Body Fat % (est.)'}</p>
          <p className={`text-4xl font-extrabold font-mono ${bfCategory.color}`}>{bfp.toFixed(1)}%</p>
          <p className={`text-sm font-bold mt-1 ${bfCategory.color}`}>{bfCategory.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{bfCategory.desc}</p>
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">BMI</p>
          <p className={`text-4xl font-extrabold font-mono ${bmiCategory.color}`}>{bmi.toFixed(1)}</p>
          <p className={`text-sm font-bold mt-1 ${bmiCategory.color}`}>{bmiCategory.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{lang === 'ko' ? '정상: 18.5~22.9' : 'Normal: 18.5~22.9'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: lang === 'ko' ? '지방 무게' : 'Fat Mass', val: `${fatMass.toFixed(1)}kg`, key: 'fat' },
          { label: lang === 'ko' ? '제지방 무게' : 'Lean Mass', val: `${leanMass.toFixed(1)}kg`, key: 'lean' },
          { label: lang === 'ko' ? '기초대사량 (BMR)' : 'BMR', val: `${Math.round(bmr)} kcal`, key: 'bmr' },
          { label: lang === 'ko' ? '일일 권장칼로리 (TDEE)' : 'TDEE', val: `${Math.round(tdee)} kcal`, key: 'tdee' },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">{r.label}</p>
              <p className="text-base font-bold text-slate-200 font-mono mt-0.5">{r.val}</p>
            </div>
            <button onClick={() => copy(r.val.replace(/[kcalkg]/g, '').trim(), r.key)} className={`p-1.5 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={12} /> : <Copy size={12} />}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-2 font-medium">{lang === 'ko' ? '목표 체형 (이상적 체지방률 기준)' : 'Ideal Weight Range'}</p>
        <p className="text-sm text-slate-200">
          {lang === 'ko'
            ? `이상적 체중: ${idealWeight.min}~${idealWeight.max}kg (체지방률 ${idealBFP.min}~${idealBFP.max}% 기준)`
            : `Ideal weight: ${idealWeight.min}~${idealWeight.max}kg (body fat ${idealBFP.min}~${idealBFP.max}%)`}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'ko'
            ? `현재 대비 ${weight > idealWeight.max ? `${(weight - idealWeight.max).toFixed(1)}kg 감량 권장` : weight < idealWeight.min ? `${(idealWeight.min - weight).toFixed(1)}kg 증량 권장` : '이상적인 체중입니다 ✓'}`
            : `${weight > idealWeight.max ? `Recommend losing ${(weight - idealWeight.max).toFixed(1)}kg` : weight < idealWeight.min ? `Recommend gaining ${(idealWeight.min - weight).toFixed(1)}kg` : 'Ideal weight range ✓'}`}
        </p>
      </div>

      <p className="text-xs text-slate-600 mt-3 text-center">
        {lang === 'ko' ? '* Deurenberg 공식 기반 추정치입니다. 정확한 측정은 병원·헬스장의 체성분 분석기를 이용하세요.' : '* Estimated using the Deurenberg formula. For accurate measurement, use professional body composition analysis.'}
      </p>

      <ToolFooter
        toolName={lang === 'ko' ? '체지방률 계산기' : 'Body Fat Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/body-fat-calculator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '성별 선택', desc: '남성 또는 여성을 선택하세요.' },
          { step: '신체 정보 입력', desc: '키, 몸무게, 나이를 입력하세요.' },
          { step: '활동 수준 선택', desc: '평소 운동량에 맞는 활동 수준을 선택하세요.' },
          { step: '결과 확인', desc: '체지방률, BMI, 기초대사량, 권장칼로리가 즉시 표시됩니다.' },
        ] : [
          { step: 'Select gender', desc: 'Choose male or female.' },
          { step: 'Enter body info', desc: 'Input height, weight, and age.' },
          { step: 'Select activity level', desc: 'Choose your typical physical activity level.' },
          { step: 'View results', desc: 'Body fat %, BMI, BMR, and TDEE are shown instantly.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '5가지 지표 동시 계산', desc: '체지방률·BMI·제지방·기초대사량·TDEE를 한번에 계산합니다.' },
          { title: '이상 체중 안내', desc: '현재 체형에서 이상적인 체지방률에 맞는 목표 체중을 제시합니다.' },
          { title: '활동 수준 반영', desc: '운동량에 따른 실제 일일 권장 칼로리를 계산합니다.' },
          { title: '체형 카테고리', desc: '필수지방·운동선수·건강·보통·비만으로 체형을 분류합니다.' },
        ] : [
          { title: '5 metrics at once', desc: 'Body fat %, BMI, lean mass, BMR, and TDEE all calculated together.' },
          { title: 'Ideal weight guidance', desc: 'Shows target weight range based on ideal body fat percentage.' },
          { title: 'Activity level factored', desc: 'Calculates actual daily calorie needs based on exercise frequency.' },
          { title: 'Body type classification', desc: 'Classifies as essential fat, athlete, fitness, average, or obese.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '체지방률이 정확한가요?', a: 'Deurenberg 공식을 사용한 추정값으로, 실제 인바디 측정값과 3~5% 정도 차이가 날 수 있습니다. 참고용으로만 사용하세요.' },
          { q: '남성과 여성의 적정 체지방률 차이는?', a: '여성은 생리적으로 지방이 더 필요해서 기준이 더 높습니다. 남성 10~20%, 여성 18~28%가 건강한 범위입니다.' },
          { q: '기초대사량(BMR)이란?', a: '아무것도 하지 않고 누워있을 때 생명 유지에 필요한 최소 칼로리입니다. Mifflin-St Jeor 방정식 기반입니다.' },
          { q: 'TDEE란?', a: 'Total Daily Energy Expenditure. 하루 동안 실제로 소모하는 총 칼로리로, BMR × 활동지수로 계산합니다.' },
        ] : [
          { q: 'Is the body fat % accurate?', a: 'It uses the Deurenberg formula and may differ 3-5% from actual InBody results. Use as a reference only.' },
          { q: 'Why are male/female ranges different?', a: 'Women require more essential fat physiologically. Healthy ranges: men 10-20%, women 18-28%.' },
          { q: 'What is BMR?', a: 'Basal Metabolic Rate - minimum calories needed to maintain life functions at rest. Calculated using Mifflin-St Jeor equation.' },
          { q: 'What is TDEE?', a: 'Total Daily Energy Expenditure - total calories burned per day. Calculated as BMR × activity factor.' },
        ]}
        keywords="체지방률 계산기 · 체지방 계산 · 인바디 추정 · BMI 계산기 · 기초대사량 · TDEE 계산 · 체형 분석 · body fat calculator · body fat percentage · BMI calculator · BMR calculator · TDEE calculator · ideal weight"
      />
    </div>
  )
}
