'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '이상 체중 계산기',
    desc: '키·나이·성별로 표준 체중·이상 체중·비만도·BMI를 계산. 건강한 목표 체중 범위 제시.',
    height: '키 (cm)', weight: '현재 체중 (kg)', age: '나이', male: '남성', female: '여성',
    idealWeight: '이상 체중', standardWeight: '표준 체중', bmi: 'BMI',
    obesity: '비만도', weightToLose: '감량 필요',
  },
  en: {
    title: 'Ideal Weight Calculator',
    desc: 'Calculate ideal weight, standard weight, obesity index, and BMI from height, age, and gender.',
    height: 'Height (cm)', weight: 'Current Weight (kg)', age: 'Age', male: 'Male', female: 'Female',
    idealWeight: 'Ideal Weight', standardWeight: 'Standard Weight', bmi: 'BMI',
    obesity: 'Obesity Index', weightToLose: 'Weight to Lose',
  }
}

function comma(n: number) { return n.toFixed(1) }

export default function IdealWeight() {
  const { lang } = useLang()
  const tx = T[lang]
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(70)
  const [age, setAge] = useState(30)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const h = height / 100
  // BMI
  const bmi = weight / (h * h)
  // 표준 체중 (Broca 변형식)
  const broca = gender === 'male' ? (height - 100) * 0.9 : (height - 100) * 0.85
  // 이상 체중 (BMI 22 기준 / 여성 21)
  const idealBmi = gender === 'male' ? 22 : 21
  const idealWeight = idealBmi * h * h
  // WHO 정상 체중 범위 (BMI 18.5~22.9)
  const minWeight = 18.5 * h * h
  const maxWeight = 22.9 * h * h
  // 비만도
  const obesityIndex = (weight / broca) * 100
  // 감량/증량 필요
  const weightDiff = weight - idealWeight
  // 칼로리 계산 (체지방 1kg = 7700kcal)
  const dailyCalDiff = Math.round(Math.abs(weightDiff) * 7700 / 90) // 3개월 목표

  // 비만 단계
  function getBmiCategory() {
    if (bmi < 18.5) return { label: lang === 'ko' ? '저체중' : 'Underweight', color: 'text-blue-400', bg: 'border-blue-500/30 bg-blue-500/10' }
    if (bmi < 23) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10' }
    if (bmi < 25) return { label: lang === 'ko' ? '과체중' : 'Overweight', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10' }
    if (bmi < 30) return { label: lang === 'ko' ? '비만 1단계' : 'Obese I', color: 'text-orange-400', bg: 'border-orange-500/30 bg-orange-500/10' }
    return { label: lang === 'ko' ? '비만 2단계' : 'Obese II', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' }
  }
  const bmiCat = getBmiCategory()

  // 신체 사이즈 (한국 표준 의류 사이즈)
  function getClothingSize() {
    if (bmi < 18.5) return gender === 'male' ? 'S (85~90)' : 'S (44~55)'
    if (bmi < 22) return gender === 'male' ? 'M (90~95)' : 'M (55~66)'
    if (bmi < 25) return gender === 'male' ? 'L (95~100)' : 'L (66~77)'
    if (bmi < 30) return gender === 'male' ? 'XL (100~105)' : 'XL (77~88)'
    return gender === 'male' ? 'XXL (105+)' : 'XXL (88+)'
  }

  // BMI 범위별 목표 체중 배열
  const weightTargets = [
    { label: lang === 'ko' ? '저체중 기준 (18.5)' : 'Underweight (18.5)', w: 18.5 * h * h, color: 'text-blue-400' },
    { label: lang === 'ko' ? '이상 체중 (BMI 21~22)' : 'Ideal (BMI 21~22)', w: idealWeight, color: 'text-brand-400' },
    { label: lang === 'ko' ? '정상 상한 (22.9)' : 'Normal max (22.9)', w: maxWeight, color: 'text-yellow-400' },
    { label: lang === 'ko' ? '과체중 기준 (25)' : 'Overweight (25)', w: 25 * h * h, color: 'text-orange-400' },
    { label: lang === 'ko' ? '비만 기준 (30)' : 'Obese (30)', w: 30 * h * h, color: 'text-red-400' },
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
        <div className="flex gap-2 mb-4">
          {[['male', tx.male], ['female', tx.female]].map(([v, l]) => (
            <button key={v} onClick={() => setGender(v as 'male' | 'female')}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: tx.height, val: height, set: setHeight, min: 140, max: 220, step: 1 },
            { label: tx.weight, val: weight, set: setWeight, min: 30, max: 200, step: 0.5 },
            { label: tx.age, val: age, set: setAge, min: 10, max: 100, step: 1 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <input type="number" min={f.min} max={f.max} step={f.step} value={f.val} onChange={e => f.set(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 주요 결과 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-xl border p-4 text-center col-span-1 ${bmiCat.bg}`}>
          <p className="text-xs text-slate-400 mb-1">BMI</p>
          <p className={`text-4xl font-extrabold font-mono ${bmiCat.color}`}>{comma(bmi)}</p>
          <p className={`text-sm font-bold mt-1 ${bmiCat.color}`}>{bmiCat.label}</p>
          <button onClick={() => copy(comma(bmi), 'bmi')} className={`mt-2 p-1.5 rounded border transition-all ${copied === 'bmi' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
            {copied === 'bmi' ? <CheckCheck size={12} /> : <Copy size={12} />}
          </button>
        </div>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{tx.idealWeight}</p>
          <p className="text-4xl font-extrabold font-mono text-brand-400">{comma(idealWeight)}<span className="text-xl">kg</span></p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `BMI ${idealBmi} 기준` : `BMI ${idealBmi} standard`}</p>
          <button onClick={() => copy(comma(idealWeight), 'ideal')} className={`mt-2 p-1.5 rounded border transition-all ${copied === 'ideal' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
            {copied === 'ideal' ? <CheckCheck size={12} /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: lang === 'ko' ? '표준 체중 (Broca)' : 'Standard (Broca)', val: `${comma(broca)}kg`, key: 'broca' },
          { label: lang === 'ko' ? '정상 체중 범위' : 'Normal Range', val: `${comma(minWeight)}~${comma(maxWeight)}kg`, key: 'range' },
          { label: lang === 'ko' ? '권장 의류 사이즈' : 'Clothing Size', val: getClothingSize(), key: 'size' },
        ].map(r => (
          <div key={r.key} className="rounded-xl border border-surface-border bg-[#1a1d27] p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">{r.label}</p>
            <p className="text-sm font-bold text-slate-200 font-mono">{r.val}</p>
            <button onClick={() => copy(r.val, r.key)} className={`mt-1 p-1 rounded border transition-all ${copied === r.key ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-600 hover:text-brand-400'}`}>
              {copied === r.key ? <CheckCheck size={10} /> : <Copy size={10} />}
            </button>
          </div>
        ))}
      </div>

      {/* 감량/증량 목표 */}
      {Math.abs(weightDiff) > 0.5 && (
        <div className={`rounded-xl border p-4 mb-4 ${weightDiff > 0 ? 'border-orange-500/30 bg-orange-500/10' : 'border-blue-500/30 bg-blue-500/10'}`}>
          <p className="text-xs text-slate-400 mb-1">{weightDiff > 0 ? (lang === 'ko' ? '💪 감량 목표' : '💪 Weight Loss Goal') : (lang === 'ko' ? '🥗 증량 목표' : '🥗 Weight Gain Goal')}</p>
          <p className={`text-xl font-bold ${weightDiff > 0 ? 'text-orange-400' : 'text-blue-400'}`}>
            {Math.abs(weightDiff).toFixed(1)}kg {weightDiff > 0 ? (lang === 'ko' ? '감량 필요' : 'to lose') : (lang === 'ko' ? '증량 필요' : 'to gain')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ko' ? `3개월 목표 시: 하루 ${dailyCalDiff}kcal ${weightDiff > 0 ? '적게' : '더'} 섭취` : `3-month goal: ${dailyCalDiff} kcal ${weightDiff > 0 ? 'less' : 'more'} per day`}
          </p>
        </div>
      )}

      {/* BMI 기준 체중표 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? `📊 키 ${height}cm 기준 체중 범위` : `📊 Weight Ranges for ${height}cm`}</p>
        <div className="flex flex-col gap-2">
          {weightTargets.map(t => (
            <div key={t.label} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-32 flex-shrink-0">{t.label}</span>
              <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${t.color.replace('text-', 'bg-')}/60`}
                  style={{ width: `${Math.min(100, (t.w / 100) * 100)}%` }} />
              </div>
              <span className={`text-xs font-mono font-bold ${t.color} w-16 text-right flex-shrink-0`}>{comma(t.w)}kg</span>
            </div>
          ))}
          {/* 현재 체중 표시 */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-200 font-bold w-32 flex-shrink-0">▶ {lang === 'ko' ? '현재 체중' : 'Current'}</span>
            <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full" style={{ width: `${Math.min(100, (weight / 100) * 100)}%` }} />
            </div>
            <span className="text-xs font-mono font-bold text-white w-16 text-right flex-shrink-0">{comma(weight)}kg</span>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '이상 체중 계산기' : 'Ideal Weight Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/ideal-weight"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '성별 선택', desc: '남성 또는 여성을 선택하세요.' },
          { step: '키·체중·나이 입력', desc: '현재 키, 체중, 나이를 입력하세요.' },
          { step: '결과 확인', desc: 'BMI, 이상 체중, 표준 체중, 정상 범위가 즉시 계산됩니다.' },
          { step: '목표 설정', desc: '이상 체중과의 차이를 확인하고 목표 칼로리를 참고하세요.' },
        ] : [
          { step: 'Select gender', desc: 'Choose male or female.' },
          { step: 'Enter height, weight, age', desc: 'Input your current measurements.' },
          { step: 'View results', desc: 'BMI, ideal weight, standard weight, and normal range calculated.' },
          { step: 'Set goals', desc: 'See the gap from ideal weight and reference daily calorie target.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4가지 체중 기준 동시 계산', desc: 'BMI·이상 체중·표준 체중(Broca)·정상 범위를 한번에 계산합니다.' },
          { title: '목표 칼로리 제시', desc: '이상 체중까지의 감량/증량에 필요한 일일 칼로리 조절량을 알려줍니다.' },
          { title: '체중 범위 시각화', desc: '저체중~고도비만 기준 체중을 한눈에 비교할 수 있습니다.' },
          { title: '의류 사이즈 추정', desc: 'BMI 기반으로 한국 표준 의류 사이즈를 추정합니다.' },
        ] : [
          { title: '4 weight standards', desc: 'BMI, ideal weight, Broca standard, and normal range all at once.' },
          { title: 'Calorie target', desc: 'Shows daily calorie adjustment needed to reach ideal weight in 3 months.' },
          { title: 'Weight range visualization', desc: 'Compare underweight to obese reference weights at a glance.' },
          { title: 'Clothing size estimate', desc: 'Estimates Korean standard clothing size based on BMI.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '이상 체중과 표준 체중의 차이는?', a: '이상 체중은 BMI 21~22를 목표로 한 체중입니다. 표준 체중(Broca 변형식)은 (키-100)×0.9(남)/(키-100)×0.85(여)로 계산합니다.' },
          { q: 'BMI 정상 범위는 한국과 서양이 다른가요?', a: '네, 서양 기준은 BMI 18.5~24.9가 정상이지만, 한국·아시아 기준은 18.5~22.9를 정상으로 봅니다. 이 계산기는 한국 기준을 사용합니다.' },
          { q: '체지방 1kg 빼려면 칼로리 얼마나 줄여야 하나요?', a: '체지방 1kg = 약 7,700kcal에 해당합니다. 하루 770kcal를 줄이면 10일, 하루 약 550kcal를 줄이면 2주 만에 1kg 감량이 가능합니다.' },
          { q: 'BMI의 한계는 무엇인가요?', a: 'BMI는 키와 몸무게만으로 계산해 근육량을 반영하지 못합니다. 운동을 많이 하는 사람은 BMI가 높아도 체지방이 낮을 수 있습니다.' },
        ] : [
          { q: 'Ideal weight vs standard weight?', a: 'Ideal weight targets BMI 21-22. Standard weight (Broca method) is (height-100)×0.9 for males, (height-100)×0.85 for females.' },
          { q: 'Is BMI normal range different in Korea?', a: 'Yes. Western standard: BMI 18.5-24.9. Korean/Asian standard: 18.5-22.9 is normal. This calculator uses Korean standards.' },
          { q: 'Calories needed to lose 1kg?', a: '1kg of body fat = ~7,700 kcal. Cut 770 kcal/day = lose 1kg in 10 days. Cut 550 kcal/day = 1kg in 2 weeks.' },
          { q: 'Limitations of BMI?', a: 'BMI doesn\'t account for muscle mass. Athletes may have high BMI but low body fat. Use with body composition analysis for accuracy.' },
        ]}
        keywords="이상 체중 계산기 · 표준 체중 계산 · BMI 이상 체중 · 나의 적정 체중 · 체중 감량 목표 · ideal weight calculator · standard weight · BMI normal range · target weight · healthy weight"
      />
    </div>
  )
}
