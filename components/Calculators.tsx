'use client'

import ToolFooter from './ToolFooter'
import { useState } from 'react'

type Tab = 'loan' | 'bmi' | 'calorie' | 'tax'

function comma(n: number) {
  return Math.round(n).toLocaleString('ko-KR')
}

// ── 대출 계산기 ──
function LoanCalc() {
  const [amount, setAmount] = useState(300000000)
  const [rate, setRate] = useState(4.5)
  const [months, setMonths] = useState(360)

  const monthly = (() => {
    const r = rate / 100 / 12
    if (r === 0) return amount / months
    return amount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
  })()
  const total = monthly * months
  const interest = total - amount

  return (
    <div className="flex flex-col gap-5">
      {[
        { label: '대출 금액', value: amount, set: setAmount, min: 1000000, max: 2000000000, step: 10000000, unit: '원', display: `${comma(amount)}원` },
        { label: '연이율 (%)', value: rate, set: setRate, min: 0.1, max: 20, step: 0.1, unit: '%', display: `${rate}%` },
        { label: '대출 기간', value: months, set: setMonths, min: 12, max: 600, step: 12, unit: '개월', display: `${months}개월 (${months / 12}년)` },
      ].map(f => (
        <div key={f.label}>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm text-slate-300">{f.label}</label>
            <span className="text-sm text-brand-400 font-mono font-bold">{f.display}</span>
          </div>
          <input type="range" min={f.min} max={f.max} step={f.step} value={f.value}
            onChange={e => f.set(parseFloat(e.target.value))}
            className="w-full accent-green-500" />
        </div>
      ))}

      <div className="grid grid-cols-3 gap-3 mt-2">
        {[
          { label: '월 상환금', val: `${comma(monthly)}원`, highlight: true },
          { label: '총 상환금', val: `${comma(total)}원`, highlight: false },
          { label: '총 이자', val: `${comma(interest)}원`, highlight: false },
        ].map(r => (
          <div key={r.label} className={`rounded-xl border p-4 text-center ${r.highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
            <p className={`text-lg font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
            <p className="text-xs text-slate-500 mt-1">{r.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600">* 원리금 균등상환 방식 기준. 실제 대출 조건과 다를 수 있습니다.</p>
    </div>
  )
}

// ── BMI 계산기 ──
function BMICalc() {
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(65)

  const bmi = weight / Math.pow(height / 100, 2)
  const { label, color } = bmi < 18.5 ? { label: '저체중', color: 'text-blue-400' }
    : bmi < 23 ? { label: '정상', color: 'text-brand-400' }
    : bmi < 25 ? { label: '과체중', color: 'text-yellow-400' }
    : bmi < 30 ? { label: '비만', color: 'text-orange-400' }
    : { label: '고도비만', color: 'text-red-400' }

  const idealWeight = { min: 18.5 * Math.pow(height / 100, 2), max: 23 * Math.pow(height / 100, 2) }

  return (
    <div className="flex flex-col gap-5">
      {[
        { label: '키 (cm)', value: height, set: setHeight, min: 140, max: 220, display: `${height}cm` },
        { label: '몸무게 (kg)', value: weight, set: setWeight, min: 30, max: 200, display: `${weight}kg` },
      ].map(f => (
        <div key={f.label}>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm text-slate-300">{f.label}</label>
            <span className="text-sm text-brand-400 font-mono font-bold">{f.display}</span>
          </div>
          <input type="range" min={f.min} max={f.max} value={f.value}
            onChange={e => f.set(parseInt(e.target.value))}
            className="w-full accent-green-500" />
        </div>
      ))}

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-5 text-center">
        <p className="text-5xl font-extrabold font-mono text-white mb-2">{bmi.toFixed(1)}</p>
        <p className={`text-lg font-bold ${color}`}>{label}</p>
        <p className="text-xs text-slate-500 mt-3">
          정상 체중 범위: {Math.round(idealWeight.min)}kg ~ {Math.round(idealWeight.max)}kg
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs text-center">
        {[['~18.4', '저체중', 'text-blue-400'], ['18.5~22.9', '정상', 'text-brand-400'], ['23~24.9', '과체중', 'text-yellow-400'], ['25~', '비만', 'text-red-400']].map(([range, lbl, cls]) => (
          <div key={lbl} className="rounded-lg border border-surface-border bg-[#0f1117] p-2">
            <p className={`font-bold ${cls}`}>{lbl}</p>
            <p className="text-slate-600 mt-0.5">{range}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 칼로리 계산기 ──
function CalorieCalc() {
  const [gender, setGender] = useState<'m' | 'f'>('m')
  const [age, setAge] = useState(30)
  const [height, setHeight] = useState(170)
  const [weight, setWeight] = useState(65)
  const [activity, setActivity] = useState(1.375)

  const bmr = gender === 'm'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  const tdee = bmr * activity

  const ACTIVITIES = [
    { val: 1.2, label: '거의 없음', desc: '주로 앉아서 생활' },
    { val: 1.375, label: '가벼운 활동', desc: '주 1-3회 운동' },
    { val: 1.55, label: '보통 활동', desc: '주 3-5회 운동' },
    { val: 1.725, label: '높은 활동', desc: '주 6-7회 운동' },
    { val: 1.9, label: '매우 높음', desc: '하루 2회 운동' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {[['m', '남성'], ['f', '여성']].map(([v, l]) => (
          <button key={v} onClick={() => setGender(v as 'm' | 'f')}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
            {l}
          </button>
        ))}
      </div>

      {[
        { label: '나이', value: age, set: setAge, min: 10, max: 90, display: `${age}세` },
        { label: '키', value: height, set: setHeight, min: 140, max: 220, display: `${height}cm` },
        { label: '몸무게', value: weight, set: setWeight, min: 30, max: 200, display: `${weight}kg` },
      ].map(f => (
        <div key={f.label}>
          <div className="flex justify-between mb-1"><label className="text-sm text-slate-300">{f.label}</label><span className="text-sm text-brand-400 font-mono">{f.display}</span></div>
          <input type="range" min={f.min} max={f.max} value={f.value} onChange={e => f.set(parseInt(e.target.value))} className="w-full accent-green-500" />
        </div>
      ))}

      <div>
        <label className="text-sm text-slate-300 block mb-2">활동 수준</label>
        <div className="flex flex-col gap-1.5">
          {ACTIVITIES.map(a => (
            <button key={a.val} onClick={() => setActivity(a.val)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${activity === a.val ? 'bg-brand-500/15 border-brand-500/40 text-brand-300' : 'border-surface-border text-slate-300 bg-[#0f1117] hover:border-brand-500/30'}`}>
              <span className="font-medium">{a.label}</span>
              <span className="text-xs text-slate-500">{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-surface-border bg-[#0f1117] p-4 text-center">
          <p className="text-2xl font-bold font-mono text-slate-200">{Math.round(bmr).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">기초대사량 (BMR) kcal</p>
        </div>
        <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 text-center">
          <p className="text-2xl font-bold font-mono text-brand-400">{Math.round(tdee).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">일일 권장칼로리 (TDEE) kcal</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        {[['체중 감량', Math.round(tdee - 500)], ['체중 유지', Math.round(tdee)], ['체중 증가', Math.round(tdee + 500)]].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-surface-border bg-[#0f1117] p-2">
            <p className="font-bold text-slate-200">{Number(v).toLocaleString()} kcal</p>
            <p className="text-slate-600 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 세금 계산기 ──
function TaxCalc() {
  const [income, setIncome] = useState(50000000)
  const [type, setType] = useState<'salary' | 'freelance'>('salary')

  const brackets = [
    { limit: 14000000, rate: 0.06, deduction: 0 },
    { limit: 50000000, rate: 0.15, deduction: 1260000 },
    { limit: 88000000, rate: 0.24, deduction: 5760000 },
    { limit: 150000000, rate: 0.35, deduction: 15440000 },
    { limit: 300000000, rate: 0.38, deduction: 19940000 },
    { limit: 500000000, rate: 0.40, deduction: 25940000 },
    { limit: 1000000000, rate: 0.42, deduction: 35940000 },
    { limit: Infinity, rate: 0.45, deduction: 65940000 },
  ]

  const taxableIncome = type === 'salary'
    ? income <= 5000000 ? income * 0.7
      : income <= 15000000 ? income * 0.7 - (income - 5000000) * 0.03
      : income <= 45000000 ? income * 0.6
      : income <= 100000000 ? income * 0.55
      : income * 0.45
    : income * 0.6

  const bracket = brackets.find(b => taxableIncome <= b.limit)!
  const incomeTax = Math.max(0, taxableIncome * bracket.rate - bracket.deduction)
  const localTax = incomeTax * 0.1
  const totalTax = incomeTax + localTax
  const afterTax = income - totalTax
  const effectiveRate = (totalTax / income * 100).toFixed(1)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {[['salary', '근로소득'], ['freelance', '사업/프리랜서']].map(([v, l]) => (
          <button key={v} onClick={() => setType(v as 'salary' | 'freelance')}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${type === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
            {l}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm text-slate-300">연간 소득</label>
          <span className="text-sm text-brand-400 font-mono font-bold">{comma(income)}원</span>
        </div>
        <input type="range" min={1000000} max={500000000} step={1000000} value={income}
          onChange={e => setIncome(parseInt(e.target.value))} className="w-full accent-green-500" />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>100만원</span><span>5억원</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '과세 표준', val: `${comma(taxableIncome)}원` },
          { label: '세율', val: `${(bracket.rate * 100).toFixed(0)}%` },
          { label: '소득세', val: `${comma(incomeTax)}원` },
          { label: '지방소득세', val: `${comma(localTax)}원` },
          { label: '총 세금', val: `${comma(totalTax)}원`, highlight: true },
          { label: '실효세율', val: `${effectiveRate}%`, highlight: true },
          { label: '세후 소득', val: `${comma(afterTax)}원`, highlight: true },
          { label: '월 세후', val: `${comma(afterTax / 12)}원`, highlight: false },
        ].map(r => (
          <div key={r.label} className={`rounded-xl border p-3 ${r.highlight ? 'border-brand-500/40 bg-brand-500/10' : 'border-surface-border bg-[#0f1117]'}`}>
            <p className={`text-sm font-bold font-mono ${r.highlight ? 'text-brand-400' : 'text-slate-200'}`}>{r.val}</p>
            <p className="text-xs text-slate-500 mt-0.5">{r.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600">* 기본공제만 적용한 개략적 계산입니다. 실제 세금은 세무사 상담을 권장합니다.</p>
    </div>
  )
}

export default function Calculators() {
  const [tab, setTab] = useState<Tab>('loan')

  const TABS = [
    { key: 'loan', label: '대출 계산기' },
    { key: 'bmi', label: 'BMI 계산기' },
    { key: 'calorie', label: '칼로리 계산기' },
    { key: 'tax', label: '세금 계산기' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">계산기 모음</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          대출 월상환금 · BMI · 칼로리 · 소득세 계산기. 슬라이더로 즉시 계산.
        </p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`flex-1 py-2.5 text-xs font-medium transition-all ${tab === t.key ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5">
        {tab === 'loan' && <LoanCalc />}
        {tab === 'bmi' && <BMICalc />}
        {tab === 'calorie' && <CalorieCalc />}
        {tab === 'tax' && <TaxCalc />}
      </div>

      <ToolFooter
        toolName="계산기 모음"
        toolUrl="https://keyword-mixer.vercel.app/calculators"
        description="대출 월상환금·BMI·칼로리·소득세 계산기. 슬라이더로 즉시 계산."
        howToUse={[
          { step: '계산기 유형 선택', desc: '상단 탭에서 대출, BMI, 칼로리, 세금 계산기 중 원하는 것을 선택하세요.' },
          { step: '슬라이더 조절', desc: '각 수치를 슬라이더로 조절하면 결과가 실시간으로 업데이트됩니다.' },
          { step: '결과 확인', desc: '월 상환금, BMI 수치, 일일 권장칼로리, 세후 소득 등을 확인하세요.' },
          { step: '다른 계산기 활용', desc: '탭을 전환해 여러 계산기를 차례로 활용할 수 있습니다.' },
        ]}
        whyUse={[
          { title: '4가지 계산기 통합', desc: '자주 필요한 대출·BMI·칼로리·세금 계산기를 한 페이지에서 모두 사용하세요.' },
          { title: '슬라이더 방식', desc: '숫자를 직접 입력하지 않아도 슬라이더로 직관적으로 조절할 수 있습니다.' },
          { title: '실시간 계산', desc: '슬라이더를 움직이는 즉시 결과가 업데이트되어 빠른 비교가 가능합니다.' },
          { title: '한국형 세금 계산', desc: '한국 소득세율 구간을 반영한 정확한 세금 계산을 제공합니다.' },
        ]}
        faqs={[
          { q: '대출 계산기는 어떤 방식으로 계산하나요?', a: '원리금 균등상환 방식으로 계산합니다. 실제 대출 조건(우대금리, 중도상환수수료 등)에 따라 다를 수 있으니 참고용으로만 사용하세요.' },
          { q: 'BMI 정상 범위는?', a: '한국 기준으로 BMI 18.5~22.9가 정상 범위입니다. 23~24.9는 과체중, 25 이상은 비만으로 분류됩니다.' },
          { q: '칼로리 계산 공식은?', a: 'Mifflin-St Jeor 방정식을 사용합니다. 기초대사량(BMR)에 활동 수준을 곱해 일일 권장칼로리(TDEE)를 계산합니다.' },
          { q: '세금 계산기는 얼마나 정확한가요?', a: '기본공제만 적용한 개략적인 계산입니다. 정확한 세금 신고는 국세청 홈택스나 세무사를 이용하세요.' },
        ]}
        keywords="대출 계산기 · 월상환금 · BMI 계산기 · 체질량지수 · 칼로리 계산기 · 기초대사량 · 소득세 계산기 · 세금 계산 · loan calculator · BMI calculator · calorie calculator · tax calculator Korea · TDEE calculator"
      />
    </div>
  )
}
