'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '키 성장 예측기', desc: '부모 키로 자녀 예상 키 계산. 현재 나이와 키로 성장 잠재력 분석.', male: '남아', female: '여아' },
  en: { title: 'Height Growth Predictor', desc: 'Predict child\'s adult height from parents\' heights. Analyze growth potential from current age and height.', male: 'Boy', female: 'Girl' }
}

function comma(n: number) { return n.toFixed(1) }

export default function HeightPredictor() {
  const { lang } = useLang()
  const tx = T[lang]
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [fatherH, setFatherH] = useState(175)
  const [motherH, setMotherH] = useState(162)
  const [childAge, setChildAge] = useState(10)
  const [childH, setChildH] = useState(140)
  const [childW, setChildW] = useState(35)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (text: string, key: string) => { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500) }

  // 중간 부모 키 (Mid-Parental Height)
  const mph = gender === 'male'
    ? (fatherH + motherH + 13) / 2
    : (fatherH + motherH - 13) / 2
  const predictedMin = mph - 8.5
  const predictedMax = mph + 8.5

  // 현재 성장 백분위 추정 (한국 소아청소년 성장도표 기반 간략 버전)
  const avgHeightByAge: Record<string, Record<number, number>> = {
    male: { 5: 110, 6: 116, 7: 122, 8: 128, 9: 133, 10: 138, 11: 144, 12: 151, 13: 158, 14: 165, 15: 169, 16: 171, 17: 172, 18: 174 },
    female: { 5: 109, 6: 115, 7: 121, 8: 127, 9: 133, 10: 139, 11: 145, 12: 151, 13: 155, 14: 157, 15: 158, 16: 159, 17: 160, 18: 160 }
  }
  const avgH = avgHeightByAge[gender][childAge] ?? 150
  const diffFromAvg = childH - avgH
  const percentileApprox = Math.min(97, Math.max(3, 50 + diffFromAvg * 3))

  // 성인키 예측 (Khamis-Roche 간략 버전 - 현재키 기반)
  const growthLeft = gender === 'male'
    ? Math.max(0, mph - childH + (18 - childAge) * 2)
    : Math.max(0, mph - childH + (18 - childAge) * 1.5)
  const predictedAdult = Math.min(mph + 8.5, Math.max(mph - 8.5, childH + growthLeft * 0.5))

  // BMI
  const bmi = childW / ((childH / 100) ** 2)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex gap-2 mb-4">
          {[['male', tx.male], ['female', tx.female]].map(([v, l]) => (
            <button key={v} onClick={() => setGender(v as 'male'|'female')}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: lang === 'ko' ? '아버지 키 (cm)' : 'Father\'s Height', val: fatherH, set: setFatherH },
            { label: lang === 'ko' ? '어머니 키 (cm)' : 'Mother\'s Height', val: motherH, set: setMotherH },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <div className="flex items-center gap-2">
                <input type="range" min={140} max={220} value={f.val} onChange={e => f.set(+e.target.value)} className="flex-1 accent-green-500" />
                <span className="text-brand-400 font-mono text-sm font-bold w-12 text-right">{f.val}cm</span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: lang === 'ko' ? '현재 나이' : 'Current Age', val: childAge, set: setChildAge, min: 3, max: 18 },
            { label: lang === 'ko' ? '현재 키 (cm)' : 'Current Height', val: childH, set: setChildH, min: 80, max: 200 },
            { label: lang === 'ko' ? '현재 몸무게 (kg)' : 'Current Weight', val: childW, set: setChildW, min: 10, max: 100 },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
              <input type="number" min={f.min} max={f.max} value={f.val} onChange={e => f.set(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '예상 성인 키 범위' : 'Predicted Adult Height'}</p>
          <p className="text-2xl font-extrabold text-brand-400 font-mono">{comma(predictedMin)}~{comma(predictedMax)}cm</p>
          <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? `중간값: ${comma(mph)}cm` : `Midpoint: ${comma(mph)}cm`}</p>
          <button onClick={() => copy(`${comma(predictedMin)}~${comma(predictedMax)}cm`, 'range')} className={`mt-2 p-1.5 rounded border transition-all ${copied === 'range' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
            {copied === 'range' ? <CheckCheck size={12}/> : <Copy size={12}/>}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: lang === 'ko' ? '동연령 평균 키' : 'Average for Age', val: `${avgH}cm`, highlight: false },
            { label: lang === 'ko' ? '현재 키 차이' : 'Diff from Average', val: `${diffFromAvg > 0 ? '+' : ''}${diffFromAvg}cm`, highlight: false },
            { label: 'BMI', val: `${bmi.toFixed(1)}`, highlight: false },
          ].map(r => (
            <div key={r.label} className="rounded-lg border border-surface-border bg-[#1a1d27] px-3 py-2 flex justify-between items-center">
              <span className="text-xs text-slate-400">{r.label}</span>
              <span className="text-sm font-bold text-slate-200 font-mono">{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 text-xs text-slate-400">
        <p className="font-medium text-slate-200 mb-1">📏 {lang === 'ko' ? '성장 팁' : 'Growth Tips'}</p>
        <ul className="space-y-1 list-disc list-inside">
          {(lang === 'ko' ? [
            '충분한 수면 (성장호르몬은 주로 수면 중 분비)',
            '규칙적인 운동 (줄넘기, 수영, 농구 등)',
            '균형 잡힌 식단 (단백질, 칼슘, 비타민D)',
            '올바른 자세 유지',
          ] : [
            'Adequate sleep (growth hormone released during sleep)',
            'Regular exercise (jump rope, swimming, basketball)',
            'Balanced diet (protein, calcium, vitamin D)',
            'Maintain good posture',
          ]).map(tip => <li key={tip}>{tip}</li>)}
        </ul>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '키 성장 예측기' : 'Height Growth Predictor'}
        toolUrl="https://keyword-mixer.vercel.app/height-predictor"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '성별 선택', desc: '자녀의 성별을 선택하세요.' },
          { step: '부모 키 입력', desc: '아버지와 어머니의 키를 슬라이더로 설정하세요.' },
          { step: '현재 나이·키·몸무게 입력', desc: '자녀의 현재 신체 정보를 입력하세요.' },
          { step: '예측 키 확인', desc: '예상 성인 키 범위와 동연령 평균과의 비교를 확인하세요.' },
        ] : [
          { step: 'Select gender', desc: 'Choose the child\'s gender.' },
          { step: 'Enter parents\' heights', desc: 'Set father\'s and mother\'s heights with sliders.' },
          { step: 'Enter child\'s info', desc: 'Input current age, height, and weight.' },
          { step: 'View prediction', desc: 'See predicted adult height range and comparison with peers.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: 'Mid-Parental Height 공식', desc: '세계적으로 사용되는 부모 키 기반 예측 공식을 적용합니다.' },
          { title: '동연령 비교', desc: '한국 소아청소년 성장도표 기반의 동연령 평균과 비교합니다.' },
          { title: '성장 팁 제공', desc: '키 성장을 도울 수 있는 생활 습관과 운동 정보를 제공합니다.' },
          { title: 'BMI 계산', desc: '현재 체중이 신장 대비 정상인지 BMI로 확인할 수 있습니다.' },
        ] : [
          { title: 'Mid-Parental Height formula', desc: 'Uses globally recognized parental height-based prediction formula.' },
          { title: 'Age-group comparison', desc: 'Compares with Korean national child growth chart averages.' },
          { title: 'Growth tips', desc: 'Practical lifestyle and exercise tips to support growth.' },
          { title: 'BMI calculation', desc: 'Check if current weight is appropriate for height.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '키 예측이 정확한가요?', a: 'Mid-Parental Height 공식은 ±8.5cm 범위의 추정치입니다. 실제 성인키는 영양, 건강, 운동, 수면 등 환경적 요인에 따라 달라질 수 있습니다.' },
          { q: '성장이 멈추는 시기는?', a: '여아는 초경 후 2~3년, 보통 만 14~16세에 성장이 거의 멈춥니다. 남아는 만 16~18세에 성장이 완료됩니다.' },
          { q: '성장호르몬 치료가 효과적인가요?', a: '성장호르몬 결핍이 진단된 경우에만 효과적입니다. 전문의와의 상담이 필수이며, 임의로 사용하면 부작용이 있을 수 있습니다.' },
          { q: '키 성장에 가장 중요한 요소는?', a: '유전적 요인이 60~80%를 차지합니다. 나머지는 영양(특히 단백질·칼슘), 수면(성장호르몬 분비), 운동이 중요합니다.' },
        ] : [
          { q: 'Is the height prediction accurate?', a: 'Mid-Parental Height gives ±8.5cm estimate. Actual adult height varies based on nutrition, health, exercise, and sleep.' },
          { q: 'When does growth stop?', a: 'Girls typically stop around 14-16 (2-3 years after first period). Boys finish around 16-18.' },
          { q: 'Is growth hormone treatment effective?', a: 'Only effective for diagnosed growth hormone deficiency. Professional consultation is essential before any treatment.' },
          { q: 'What matters most for height growth?', a: 'Genetics accounts for 60-80%. The rest depends on nutrition (protein, calcium), sleep (growth hormone), and exercise.' },
        ]}
        keywords="키 성장 예측기 · 아이 키 예측 · 성인 키 계산 · 부모 키로 자녀 키 계산 · 성장 예측 · height predictor · child height calculator · adult height prediction · genetic height calculator · Mid-Parental Height"
      />
    </div>
  )
}
