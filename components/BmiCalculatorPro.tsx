'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: 'BMI 계산기 Pro - 체성분 분석',
    desc: 'BMI·체지방률·기초대사량(BMR)·일일 권장 칼로리(TDEE)를 한번에 계산. 한국 기준 비만도 판정 및 이상 체중 제시.',
    height: '키 (cm)', weight: '체중 (kg)', age: '나이',
    gender: '성별', male: '남성', female: '여성',
    activity: '활동 수준', result: '분석 결과',
    bmi: 'BMI', bodyFat: '체지방률', bmr: '기초대사량 (BMR)', tdee: '일일 필요 칼로리 (TDEE)',
    category: '판정',
  },
  en: {
    title: 'BMI Calculator Pro - Body Composition',
    desc: 'Calculate BMI, body fat %, BMR, and TDEE all at once. Korean standard obesity assessment with ideal weight.',
    height: 'Height (cm)', weight: 'Weight (kg)', age: 'Age',
    gender: 'Gender', male: 'Male', female: 'Female',
    activity: 'Activity Level', result: 'Analysis',
    bmi: 'BMI', bodyFat: 'Body Fat %', bmr: 'BMR', tdee: 'Daily Calories (TDEE)',
    category: 'Category',
  }
}

const ACTIVITY_LEVELS = [
  { ko: '거의 안 움직임', en: 'Sedentary', factor: 1.2 },
  { ko: '가벼운 운동 (주 1-3회)', en: 'Light Exercise (1-3/wk)', factor: 1.375 },
  { ko: '보통 운동 (주 3-5회)', en: 'Moderate Exercise (3-5/wk)', factor: 1.55 },
  { ko: '격렬한 운동 (주 6-7회)', en: 'Hard Exercise (6-7/wk)', factor: 1.725 },
  { ko: '매우 격렬 (하루 2회 이상)', en: 'Very Hard (2x/day)', factor: 1.9 },
]

function getBmiCategory(bmi: number, lang: string) {
  if (bmi < 18.5) return { label: lang === 'ko' ? '저체중' : 'Underweight', color: 'text-blue-400', bg: 'border-blue-500/30 bg-blue-500/10' }
  if (bmi < 23) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10' }
  if (bmi < 25) return { label: lang === 'ko' ? '과체중' : 'Overweight', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10' }
  if (bmi < 30) return { label: lang === 'ko' ? '비만 1단계' : 'Obese I', color: 'text-orange-400', bg: 'border-orange-500/30 bg-orange-500/10' }
  return { label: lang === 'ko' ? '고도비만' : 'Obese II', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' }
}

function getBodyFatCategory(bf: number, gender: string, lang: string) {
  if (gender === 'male') {
    if (bf < 6) return lang === 'ko' ? '필수지방 (매우 낮음)' : 'Essential (Very Low)'
    if (bf < 14) return lang === 'ko' ? '운동선수' : 'Athlete'
    if (bf < 18) return lang === 'ko' ? '건강한 체형' : 'Fitness'
    if (bf < 25) return lang === 'ko' ? '평균' : 'Average'
    return lang === 'ko' ? '비만' : 'Obese'
  } else {
    if (bf < 14) return lang === 'ko' ? '필수지방 (매우 낮음)' : 'Essential (Very Low)'
    if (bf < 21) return lang === 'ko' ? '운동선수' : 'Athlete'
    if (bf < 25) return lang === 'ko' ? '건강한 체형' : 'Fitness'
    if (bf < 32) return lang === 'ko' ? '평균' : 'Average'
    return lang === 'ko' ? '비만' : 'Obese'
  }
}

export default function BmiCalculatorPro() {
  const { lang } = useLang()
  const tx = T[lang]
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(70)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [activityIdx, setActivityIdx] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => {
    await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500)
  }

  const h = height / 100
  const bmi = weight / (h * h)
  const bmiCat = getBmiCategory(bmi, lang)

  // 체지방률 (US Navy/ACSM 공식 간략화 - BMI 기반)
  const bodyFat = gender === 'male'
    ? (1.20 * bmi) + (0.23 * age) - 16.2
    : (1.20 * bmi) + (0.23 * age) - 5.4
  const bfCat = getBodyFatCategory(bodyFat, gender, lang)

  // BMR - Mifflin-St Jeor 공식
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161
  const tdee = bmr * ACTIVITY_LEVELS[activityIdx].factor

  // 이상 체중 (BMI 22 기준)
  const idealWeight = 22 * h * h
  const idealWeightF = 21 * h * h
  const targetWeight = gender === 'male' ? idealWeight : idealWeightF
  const weightDiff = weight - targetWeight

  // 건강 목표 칼로리
  const loseCalories = tdee - 500  // 주당 0.5kg 감량
  const gainCalories = tdee + 300  // 근성장

  // 내장지방 추정
  const visceralFat = Math.max(1, Math.round((bmi - 18) * 0.7))

  const BMI_SCALE = [
    { label: lang === 'ko' ? '저체중' : 'Under', max: 18.5, color: '#3b82f6' },
    { label: lang === 'ko' ? '정상' : 'Normal', max: 23, color: '#22c55e' },
    { label: lang === 'ko' ? '과체중' : 'Over', max: 25, color: '#eab308' },
    { label: lang === 'ko' ? '비만1' : 'Obese1', max: 30, color: '#f97316' },
    { label: lang === 'ko' ? '고도비만' : 'Obese2', max: 40, color: '#ef4444' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      {/* 입력 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex gap-2 mb-4">
          {[['male', tx.male], ['female', tx.female]].map(([v, l]) => (
            <button key={v} onClick={() => setGender(v as 'male' | 'female')}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: tx.height, val: height, set: setHeight, min: 140, max: 220, unit: 'cm' },
            { label: tx.weight, val: weight, set: setWeight, min: 30, max: 200, unit: 'kg' },
            { label: tx.age, val: age, set: setAge, min: 5, max: 100, unit: lang === 'ko' ? '세' : 'yr' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <div className="flex items-center gap-1">
                <input type="number" min={f.min} max={f.max} value={f.val}
                  onChange={e => f.set(+e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-2 block">{tx.activity}</label>
          <div className="flex flex-col gap-1.5">
            {ACTIVITY_LEVELS.map((a, i) => (
              <button key={i} onClick={() => setActivityIdx(i)}
                className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${activityIdx === i ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-surface-border text-slate-400 bg-[#0f1117] hover:border-brand-500/30'}`}>
                <span className="font-medium">{lang === 'ko' ? a.ko : a.en}</span>
                <span className="text-slate-500 ml-2">×{a.factor}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {/* BMI */}
        <div className={`rounded-xl border p-5 ${bmiCat.bg}`}>
          <p className="text-xs text-slate-400 mb-1">BMI <span className="text-slate-600">(Body Mass Index)</span></p>
          <div className="flex items-end gap-3 mb-2">
            <p className={`text-5xl font-extrabold font-mono ${bmiCat.color}`}>{bmi.toFixed(1)}</p>
            <p className={`text-xl font-bold mb-1 ${bmiCat.color}`}>{bmiCat.label}</p>
            <button onClick={() => copy(bmi.toFixed(1), 'bmi')} className={`ml-auto p-2 rounded-lg border transition-all ${copied === 'bmi' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === 'bmi' ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
          {/* BMI 스케일 바 */}
          <div className="relative h-4 rounded-full overflow-hidden flex mb-1">
            {BMI_SCALE.map(s => (
              <div key={s.label} className="flex-1 h-full" style={{ backgroundColor: s.color + '50' }} />
            ))}
            <div className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all"
              style={{ left: `${Math.min(95, Math.max(0, ((bmi - 10) / 30) * 100))}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>10</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>40</span>
          </div>
        </div>

        {/* 체지방률 */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <p className="text-xs text-slate-400 mb-1">{tx.bodyFat}</p>
          <div className="flex items-end gap-3 mb-2">
            <p className="text-5xl font-extrabold font-mono text-orange-400">{Math.max(5, bodyFat).toFixed(1)}%</p>
            <button onClick={() => copy(Math.max(5, bodyFat).toFixed(1), 'bf')} className={`ml-auto p-2 rounded-lg border transition-all ${copied === 'bf' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === 'bf' ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-sm text-orange-300 font-medium">{bfCat}</p>
          <p className="text-xs text-slate-500 mt-2">{lang === 'ko' ? '추정 내장지방 레벨' : 'Est. Visceral Fat Level'}: <span className="text-slate-300 font-mono">{Math.min(15, visceralFat)}</span></p>
        </div>

        {/* BMR */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
          <p className="text-xs text-slate-400 mb-1">{tx.bmr}</p>
          <div className="flex items-end gap-3 mb-1">
            <p className="text-4xl font-extrabold font-mono text-blue-400">{Math.round(bmr)}</p>
            <p className="text-sm text-slate-400 mb-1">kcal/day</p>
            <button onClick={() => copy(String(Math.round(bmr)), 'bmr')} className={`ml-auto p-2 rounded-lg border transition-all ${copied === 'bmr' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === 'bmr' ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-xs text-slate-500">{lang === 'ko' ? '아무것도 안 해도 소모되는 기초 칼로리' : 'Calories burned at complete rest'}</p>
        </div>

        {/* TDEE */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5">
          <p className="text-xs text-slate-400 mb-1">{tx.tdee}</p>
          <div className="flex items-end gap-3 mb-1">
            <p className="text-4xl font-extrabold font-mono text-purple-400">{Math.round(tdee)}</p>
            <p className="text-sm text-slate-400 mb-1">kcal/day</p>
            <button onClick={() => copy(String(Math.round(tdee)), 'tdee')} className={`ml-auto p-2 rounded-lg border transition-all ${copied === 'tdee' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
              {copied === 'tdee' ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-xs text-slate-500">{lang === 'ko' ? '체중 유지를 위한 하루 섭취 칼로리' : 'Calories needed to maintain weight'}</p>
        </div>
      </div>

      {/* 목표별 칼로리 + 이상 체중 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '🎯 목표별 권장 칼로리' : '🎯 Goal-Based Calories'}</p>
          {[
            { label: lang === 'ko' ? '다이어트 (주 0.5kg 감량)' : 'Weight Loss (0.5kg/wk)', val: Math.round(loseCalories), color: 'text-brand-400' },
            { label: lang === 'ko' ? '체중 유지' : 'Maintenance', val: Math.round(tdee), color: 'text-yellow-400' },
            { label: lang === 'ko' ? '근성장 (+300kcal)' : 'Muscle Gain (+300kcal)', val: Math.round(gainCalories), color: 'text-orange-400' },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
              <span className="text-xs text-slate-400">{r.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold font-mono ${r.color}`}>{r.val.toLocaleString()} kcal</span>
                <button onClick={() => copy(String(r.val), r.label)} className={`p-1 rounded border transition-all ${copied === r.label ? 'text-brand-400 border-brand-500/40' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
                  {copied === r.label ? <CheckCheck size={11} /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '⚖️ 체중 분석' : '⚖️ Weight Analysis'}</p>
          {[
            { label: lang === 'ko' ? '현재 체중' : 'Current Weight', val: `${weight}kg`, color: 'text-slate-200' },
            { label: lang === 'ko' ? `이상 체중 (BMI ${gender === 'male' ? 22 : 21})` : `Ideal (BMI ${gender === 'male' ? 22 : 21})`, val: `${targetWeight.toFixed(1)}kg`, color: 'text-brand-400' },
            { label: lang === 'ko' ? (weightDiff > 0 ? '감량 필요' : '증량 필요') : (weightDiff > 0 ? 'To Lose' : 'To Gain'), val: `${Math.abs(weightDiff).toFixed(1)}kg`, color: weightDiff > 0 ? 'text-red-400' : 'text-blue-400' },
            { label: lang === 'ko' ? '예상 감량 기간 (주 0.5kg)' : 'Est. Duration (0.5kg/wk)', val: `${Math.ceil(Math.abs(weightDiff) / 0.5)}${lang === 'ko' ? '주' : 'wks'}`, color: 'text-purple-400' },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-2 border-b border-surface-border last:border-0">
              <span className="text-xs text-slate-400">{r.label}</span>
              <span className={`text-sm font-bold font-mono ${r.color}`}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BMI 가이드 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '📊 한국 기준 BMI 구간 (대한비만학회)' : '📊 Korean BMI Standards (KSO)'}</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { range: '<18.5', label: lang === 'ko' ? '저체중' : 'Under', color: 'text-blue-400', active: bmi < 18.5 },
            { range: '18.5~22.9', label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', active: bmi >= 18.5 && bmi < 23 },
            { range: '23~24.9', label: lang === 'ko' ? '과체중' : 'Over', color: 'text-yellow-400', active: bmi >= 23 && bmi < 25 },
            { range: '25~29.9', label: lang === 'ko' ? '비만1단계' : 'Obese I', color: 'text-orange-400', active: bmi >= 25 && bmi < 30 },
            { range: '≥30', label: lang === 'ko' ? '고도비만' : 'Obese II', color: 'text-red-400', active: bmi >= 30 },
          ].map(s => (
            <div key={s.range} className={`rounded-lg border p-2 text-center transition-all ${s.active ? 'border-white/30 bg-white/10' : 'border-surface-border bg-[#0f1117]'}`}>
              <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.range}</p>
              {s.active && <p className="text-xs text-white font-bold mt-0.5">▲ {lang === 'ko' ? '현재' : 'You'}</p>}
            </div>
          ))}
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? 'BMI 계산기 Pro' : 'BMI Calculator Pro'}
        toolUrl="https://keyword-mixer.vercel.app/bmi-calculator-pro"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '성별·나이 선택', desc: '성별과 나이를 선택하면 더 정확한 체지방률과 BMR이 계산됩니다.' },
          { step: '키·체중 입력', desc: '현재 키와 체중을 입력하세요.' },
          { step: '활동 수준 선택', desc: '평소 운동량을 선택하면 TDEE(일일 필요 칼로리)가 계산됩니다.' },
          { step: '결과 확인', desc: 'BMI, 체지방률, BMR, TDEE, 이상 체중, 목표 칼로리를 확인하세요.' },
        ] : [
          { step: 'Select gender & age', desc: 'Gender and age enable more accurate body fat and BMR calculation.' },
          { step: 'Enter height & weight', desc: 'Input your current height and weight.' },
          { step: 'Select activity level', desc: 'Your activity level determines TDEE (daily calorie needs).' },
          { step: 'View results', desc: 'See BMI, body fat %, BMR, TDEE, ideal weight, and calorie goals.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '5가지 지표 동시 계산', desc: 'BMI·체지방률·BMR·TDEE·이상 체중을 한번에 계산합니다.' },
          { title: '한국 대한비만학회 기준', desc: '서양(25 이상 비만)이 아닌 한국 기준(23 이상 과체중)을 적용합니다.' },
          { title: '목표별 칼로리 제공', desc: '다이어트·유지·근성장 세 가지 목표별 권장 칼로리를 제시합니다.' },
          { title: '시각적 BMI 스케일', desc: 'BMI 스케일 바로 현재 위치를 직관적으로 확인합니다.' },
        ] : [
          { title: '5 metrics at once', desc: 'BMI, body fat %, BMR, TDEE, and ideal weight all at once.' },
          { title: 'Korean BMI standards', desc: 'Uses Korean Society for the Study of Obesity (23+ overweight) vs Western (25+).' },
          { title: 'Goal-based calories', desc: 'Recommends calories for weight loss, maintenance, and muscle gain.' },
          { title: 'Visual BMI scale', desc: 'BMI scale bar shows your current position intuitively.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: 'BMI의 한계는?', a: 'BMI는 근육량을 반영하지 못합니다. 운동을 많이 하는 사람은 BMI가 높아도 실제 건강할 수 있습니다. 체지방률과 함께 종합적으로 평가하세요.' },
          { q: '체지방률 계산은 얼마나 정확한가요?', a: 'BMI 기반 체지방률 추정치로 실제와 3~5%p 차이가 날 수 있습니다. 정확한 측정은 체성분 분석기(인바디)를 권장합니다.' },
          { q: 'BMR과 TDEE의 차이는?', a: 'BMR은 완전히 쉬고 있어도 소모되는 기초 칼로리입니다. TDEE는 활동량을 포함한 실제 하루 필요 칼로리입니다.' },
          { q: '한국 BMI 기준이 서양과 다른 이유는?', a: '같은 BMI에서도 아시아인이 서양인보다 체지방이 더 많고 복부 비만 위험이 높습니다. 이에 따라 아시아·한국 기준은 25가 아닌 23부터 과체중으로 봅니다.' },
        ] : [
          { q: 'BMI limitations?', a: 'BMI doesn\'t account for muscle mass. Athletic people may have high BMI but be healthy. Use with body fat % for comprehensive assessment.' },
          { q: 'How accurate is body fat %?', a: 'BMI-based body fat estimate may differ from actual by 3-5%. For accuracy, use a body composition analyzer (InBody).' },
          { q: 'BMR vs TDEE difference?', a: 'BMR is calories burned at complete rest. TDEE includes activity level to give actual daily calorie needs.' },
          { q: 'Why different Korean BMI standards?', a: 'Asians have higher body fat and abdominal obesity risk at the same BMI as Westerners. Korean/Asian standard starts overweight at 23, not 25.' },
        ]}
        keywords="BMI 계산기 · 체지방률 계산기 · BMR 계산기 · TDEE 계산기 · 비만도 계산기 · 기초대사량 · 일일 칼로리 · BMI calculator Korea · body fat percentage · BMR calculator · TDEE calculator · 한국 BMI 기준"
      />
    </div>
  )
}
