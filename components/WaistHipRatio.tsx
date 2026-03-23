
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '허리 엉덩이 비율 (WHR) 계산기', desc: '허리와 엉덩이 둘레로 복부 비만 위험도 판정. WHO 기준 허리 엉덩이 비율(WHR) 계산.' },
  en: { title: 'Waist-Hip Ratio (WHR) Calculator', desc: 'Assess abdominal obesity risk from waist and hip measurements. WHO standard WHR calculation.' }
}

export default function WaistHipRatio() {
  const { lang } = useLang()
  const tx = T[lang]
  const [waist, setWaist] = useState(80)
  const [hip, setHip] = useState(95)
  const [gender, setGender] = useState<'male'|'female'>('male')
  const [height, setHeight] = useState(170)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const whr = (waist / hip)
  const whr_fmt = whr.toFixed(2)

  // WHO 기준 위험도
  function getWhrCategory() {
    if (gender === 'male') {
      if (whr < 0.9) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10', risk: lang === 'ko' ? '낮음' : 'Low' }
      if (whr < 1.0) return { label: lang === 'ko' ? '과체중' : 'Overweight', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10', risk: lang === 'ko' ? '보통' : 'Moderate' }
      return { label: lang === 'ko' ? '비만' : 'Obese', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10', risk: lang === 'ko' ? '높음' : 'High' }
    } else {
      if (whr < 0.8) return { label: lang === 'ko' ? '정상' : 'Normal', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10', risk: lang === 'ko' ? '낮음' : 'Low' }
      if (whr < 0.85) return { label: lang === 'ko' ? '과체중' : 'Overweight', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10', risk: lang === 'ko' ? '보통' : 'Moderate' }
      return { label: lang === 'ko' ? '비만' : 'Obese', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10', risk: lang === 'ko' ? '높음' : 'High' }
    }
  }
  const cat = getWhrCategory()

  // 허리-신장 비율 (WHtR)
  const whtr = (waist / height).toFixed(2)
  const isWhtrHealthy = parseFloat(whtr) < 0.5

  // 복부비만 기준 (허리 둘레)
  const abdominalLimit = gender === 'male' ? 90 : 85
  const isAbdominal = waist >= abdominalLimit

  // 체형 분류
  function getBodyShape() {
    if (whr < 0.75) return { shape: lang === 'ko' ? '🍐 배 체형 (Pear)' : '🍐 Pear Shape', desc: lang === 'ko' ? '엉덩이/허벅지에 지방 집중. 심장 질환 위험 낮음.' : 'Fat in hips/thighs. Lower heart disease risk.' }
    if (whr < 0.85) return { shape: lang === 'ko' ? '⌛ 모래시계 체형' : '⌛ Hourglass', desc: lang === 'ko' ? '균형잡힌 체형.' : 'Balanced body shape.' }
    return { shape: lang === 'ko' ? '🍎 사과 체형 (Apple)' : '🍎 Apple Shape', desc: lang === 'ko' ? '복부에 지방 집중. 심장 질환·당뇨 위험 높음.' : 'Central fat. Higher heart disease and diabetes risk.' }
  }
  const bodyShape = getBodyShape()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Health Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="flex gap-2 mb-4">
          {[['male', lang === 'ko' ? '남성' : 'Male'], ['female', lang === 'ko' ? '여성' : 'Female']].map(([v, l]) => (
            <button key={v} onClick={() => setGender(v as 'male'|'female')} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === v ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [lang === 'ko' ? '허리 둘레 (cm)' : 'Waist (cm)', waist, setWaist],
            [lang === 'ko' ? '엉덩이 둘레 (cm)' : 'Hip (cm)', hip, setHip],
            [lang === 'ko' ? '키 (cm)' : 'Height (cm)', height, setHeight],
          ].map(([l, v, s]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1.5 block">{l as string}</label>
              <input type="number" min={40} max={200} value={v as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`rounded-xl border p-5 text-center ${cat.bg}`}>
          <p className="text-xs text-slate-400 mb-1">WHR</p>
          <p className={`text-5xl font-extrabold font-mono ${cat.color}`}>{whr_fmt}</p>
          <p className={`text-sm font-bold mt-1 ${cat.color}`}>{cat.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{lang === 'ko' ? `심혈관 위험: ${cat.risk}` : `CV Risk: ${cat.risk}`}</p>
          <button onClick={() => copy(whr_fmt, 'whr')} className={`mt-2 p-1.5 rounded border transition-all ${copied === 'whr' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-500 hover:text-brand-400'}`}>
            {copied === 'whr' ? <CheckCheck size={12}/> : <Copy size={12}/>}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className={`rounded-xl border p-3 ${isWhtrHealthy ? 'border-brand-500/30 bg-brand-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
            <p className="text-xs text-slate-400">{lang === 'ko' ? '허리-신장 비율 (WHtR)' : 'Waist-Height Ratio'}</p>
            <p className={`text-xl font-bold font-mono ${isWhtrHealthy ? 'text-brand-400' : 'text-red-400'}`}>{whtr}</p>
            <p className="text-xs text-slate-500">{lang === 'ko' ? '기준: 0.5 미만 건강' : 'Healthy: below 0.5'}</p>
          </div>
          <div className={`rounded-xl border p-3 ${!isAbdominal ? 'border-brand-500/30 bg-brand-500/10' : 'border-orange-500/30 bg-orange-500/10'}`}>
            <p className="text-xs text-slate-400">{lang === 'ko' ? '복부비만 여부' : 'Abdominal Obesity'}</p>
            <p className={`text-sm font-bold ${!isAbdominal ? 'text-brand-400' : 'text-orange-400'}`}>
              {!isAbdominal ? (lang === 'ko' ? '✓ 정상' : '✓ Normal') : (lang === 'ko' ? '⚠️ 복부비만 주의' : '⚠️ At risk')}
            </p>
            <p className="text-xs text-slate-500">{lang === 'ko' ? `기준: ${abdominalLimit}cm 이상` : `Limit: ≥${abdominalLimit}cm`}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-1 font-medium">{lang === 'ko' ? '체형 분석' : 'Body Shape Analysis'}</p>
        <p className="text-lg font-bold text-slate-200">{bodyShape.shape}</p>
        <p className="text-xs text-slate-400 mt-1">{bodyShape.desc}</p>
        <div className="mt-3 text-xs text-slate-500">
          <p>{lang === 'ko' ? `WHO 정상 기준: 남성 0.9 미만 / 여성 0.8 미만` : `WHO Normal: Male <0.9 / Female <0.8`}</p>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '허리 엉덩이 비율 계산기' : 'WHR Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/waist-hip-ratio"
        description={tx.desc}
        howToUse={lang === 'ko' ? [{step:'성별 선택',desc:'남성 또는 여성을 선택하세요.'},{step:'측정값 입력',desc:'허리 둘레, 엉덩이 둘레, 키를 입력하세요.'},{step:'WHR 확인',desc:'WHO 기준 비만 위험도가 계산됩니다.'},{step:'체형 분석',desc:'사과/배/모래시계 체형 분류를 확인하세요.'}] : [{step:'Select gender',desc:'Choose male or female.'},{step:'Enter measurements',desc:'Input waist, hip, and height measurements.'},{step:'View WHR',desc:'WHO-standard obesity risk assessment.'},{step:'Body shape',desc:'See apple, pear, or hourglass classification.'}]}
        whyUse={lang === 'ko' ? [{title:'WHO 기준 정확한 판정',desc:'세계보건기구 기준으로 복부 비만 위험도를 정확히 판정합니다.'},{title:'3가지 지표 동시 계산',desc:'WHR, WHtR, 복부비만 여부를 한번에 계산합니다.'},{title:'체형 분류',desc:'사과·배·모래시계 체형을 분류해 건강 위험을 설명합니다.'},{title:'심혈관 위험도 안내',desc:'체형별 심혈관 및 당뇨 위험 정보를 제공합니다.'}] : [{title:'WHO standard',desc:'Accurate obesity risk assessment using WHO criteria.'},{title:'3 metrics at once',desc:'WHR, WHtR, and abdominal obesity all calculated.'},{title:'Body shape',desc:'Apple, pear, hourglass classification with health risks.'},{title:'Cardiovascular risk',desc:'Health risk information based on body shape.'}]}
        faqs={lang === 'ko' ? [{q:'WHR이 BMI보다 정확한가요?',a:'WHR은 체지방 분포를 반영해 심혈관 위험을 예측하는 데 BMI보다 유용할 수 있습니다. 특히 복부 비만 여부를 더 잘 반영합니다.'},{q:'허리 둘레는 어디서 측정하나요?',a:'배꼽 위쪽, 갈비뼈 아래쪽의 가장 가는 부분을 측정합니다. 숨을 내쉰 상태에서 줄자를 수평으로 대고 측정하세요.'},{q:'엉덩이 둘레는?',a:'엉덩이의 가장 넓은 부분(보통 대퇴골 대전자 높이)에서 측정합니다.'},{q:'복부비만 기준은?',a:'대한비만학회 기준: 남성 90cm 이상, 여성 85cm 이상 시 복부비만으로 진단합니다.'}] : [{q:'Is WHR more accurate than BMI?',a:'WHR can be more useful than BMI for predicting cardiovascular risk as it reflects fat distribution, especially abdominal fat.'},{q:'Where to measure waist?',a:'At the narrowest point between the bottom of the rib cage and the navel. Measure while exhaling with tape horizontal.'},{q:'Where to measure hips?',a:'At the widest point of the buttocks, usually at the level of the greater trochanter.'},{q:'Abdominal obesity criteria?',a:'Korean Society for the Study of Obesity: males ≥90cm, females ≥85cm indicates abdominal obesity.'}]}
        keywords="허리 엉덩이 비율 · WHR 계산기 · 복부비만 · 허리둘레 · 체형 분류 · waist hip ratio · WHR calculator · abdominal obesity · body shape calculator · waist circumference"
      />
    </div>
  )
}
