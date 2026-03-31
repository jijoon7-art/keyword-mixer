
'use client'
import { useState } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '영양 점수 계산기', desc: '식품의 영양성분으로 건강 점수를 계산. 당류·나트륨·포화지방 초과 여부와 단백질·식이섬유 충족 여부를 분석.' },
  en: { title: 'Nutrition Score Calculator', desc: 'Calculate health score from nutritional info. Analyzes sugar, sodium, saturated fat excess and protein, fiber sufficiency.' }
}

export default function NutritionScore() {
  const { lang } = useLang()
  const tx = T[lang]
  const [calories, setCalories] = useState(250)
  const [sugar, setSugar] = useState(12)
  const [sodium, setSodium] = useState(450)
  const [satFat, setSatFat] = useState(3)
  const [protein, setProtein] = useState(8)
  const [fiber, setFiber] = useState(2)
  const [servingSize, setServingSize] = useState(100)

  // 점수 계산 (100점 만점)
  let score = 100
  const issues: string[] = []
  const goods: string[] = []

  // 당류: 100g당 10g 이하 권장
  if (sugar > 15) { score -= 25; issues.push(lang==='ko'?`당류 과다 (${sugar}g/100g)`:`High sugar (${sugar}g/100g)`) }
  else if (sugar > 10) { score -= 10; issues.push(lang==='ko'?`당류 주의 (${sugar}g)`:`Moderate sugar (${sugar}g)`) }
  else { goods.push(lang==='ko'?`당류 양호 (${sugar}g)`:`Sugar OK (${sugar}g)`) }

  // 나트륨: 100g당 300mg 이하 권장
  if (sodium > 600) { score -= 25; issues.push(lang==='ko'?`나트륨 과다 (${sodium}mg)`:`High sodium (${sodium}mg)`) }
  else if (sodium > 300) { score -= 10; issues.push(lang==='ko'?`나트륨 주의 (${sodium}mg)`:`Moderate sodium (${sodium}mg)`) }
  else { goods.push(lang==='ko'?`나트륨 양호 (${sodium}mg)`:`Sodium OK (${sodium}mg)`) }

  // 포화지방: 100g당 5g 이하 권장
  if (satFat > 8) { score -= 20; issues.push(lang==='ko'?`포화지방 과다 (${satFat}g)`:`High sat. fat (${satFat}g)`) }
  else if (satFat > 5) { score -= 10; issues.push(lang==='ko'?`포화지방 주의 (${satFat}g)`:`Moderate sat. fat (${satFat}g)`) }
  else { goods.push(lang==='ko'?`포화지방 양호 (${satFat}g)`:`Sat. fat OK (${satFat}g)`) }

  // 단백질: 100g당 5g 이상 권장
  if (protein >= 10) { score += 10; goods.push(lang==='ko'?`단백질 우수 (${protein}g)`:`High protein (${protein}g)`) }
  else if (protein >= 5) { goods.push(lang==='ko'?`단백질 양호 (${protein}g)`:`Protein OK (${protein}g)`) }
  else { score -= 5; issues.push(lang==='ko'?`단백질 부족 (${protein}g)`:`Low protein (${protein}g)`) }

  // 식이섬유: 100g당 3g 이상 권장
  if (fiber >= 5) { score += 10; goods.push(lang==='ko'?`식이섬유 우수 (${fiber}g)`:`High fiber (${fiber}g)`) }
  else if (fiber >= 3) { goods.push(lang==='ko'?`식이섬유 양호 (${fiber}g)`:`Fiber OK (${fiber}g)`) }
  else { score -= 5; issues.push(lang==='ko'?`식이섬유 부족 (${fiber}g)`:`Low fiber (${fiber}g)`) }

  score = Math.max(0, Math.min(100, score))

  const getGrade = () => {
    if (score >= 85) return { grade: 'A', label: lang==='ko'?'매우 건강':'Very Healthy', color: 'text-brand-400', bg: 'border-brand-500/30 bg-brand-500/10' }
    if (score >= 70) return { grade: 'B', label: lang==='ko'?'건강':'Healthy', color: 'text-blue-400', bg: 'border-blue-500/30 bg-blue-500/10' }
    if (score >= 55) return { grade: 'C', label: lang==='ko'?'보통':'Average', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/10' }
    if (score >= 40) return { grade: 'D', label: lang==='ko'?'주의':'Caution', color: 'text-orange-400', bg: 'border-orange-500/30 bg-orange-500/10' }
    return { grade: 'F', label: lang==='ko'?'불량':'Poor', color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' }
  }
  const g = getGrade()

  const FIELDS = [
    [lang==='ko'?'열량 (kcal)':'Calories (kcal)', calories, setCalories, 0, 1000, 10],
    [lang==='ko'?'당류 (g)':'Sugar (g)', sugar, setSugar, 0, 100, 0.5],
    [lang==='ko'?'나트륨 (mg)':'Sodium (mg)', sodium, setSodium, 0, 5000, 10],
    [lang==='ko'?'포화지방 (g)':'Sat. Fat (g)', satFat, setSatFat, 0, 50, 0.5],
    [lang==='ko'?'단백질 (g)':'Protein (g)', protein, setProtein, 0, 100, 0.5],
    [lang==='ko'?'식이섬유 (g)':'Fiber (g)', fiber, setFiber, 0, 50, 0.5],
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
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs text-slate-400 font-medium">{lang==='ko'?'영양 성분 입력 (1회 제공량 기준)':'Nutrition Info (per serving)'}</p>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">{lang==='ko'?'1회 제공량:':'Serving:'}</label>
            <input type="number" value={servingSize} onChange={e => setServingSize(+e.target.value)} className="w-20 bg-[#0f1117] border border-surface-border rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none" />
            <span className="text-xs text-slate-500">g</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(([l, v, s, mn, mx, step]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-1 block">{l as string}</label>
              <input type="number" min={mn as number} max={mx as number} step={step as number} value={v as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className={`rounded-xl border p-5 text-center col-span-1 ${g.bg}`}>
          <p className="text-xs text-slate-400 mb-1">{lang==='ko'?'영양 등급':'Grade'}</p>
          <p className={`text-6xl font-extrabold ${g.color}`}>{g.grade}</p>
          <p className={`text-sm font-bold mt-1 ${g.color}`}>{g.label}</p>
          <p className="text-xs text-slate-500 mt-1">{score}/100점</p>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          {issues.length > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-400 font-bold mb-1">⚠️ {lang==='ko'?'주의 항목':'Issues'}</p>
              {issues.map(i => <p key={i} className="text-xs text-slate-300">{i}</p>)}
            </div>
          )}
          {goods.length > 0 && (
            <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3">
              <p className="text-xs text-brand-400 font-bold mb-1">✅ {lang==='ko'?'양호 항목':'Good Points'}</p>
              {goods.map(g => <p key={g} className="text-xs text-slate-300">{g}</p>)}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'📊 1일 영양 기준치 대비 (성인 2000kcal 기준)':'📊 vs Daily Reference Values'}</p>
        {[
          [lang==='ko'?'당류 (기준: 100g/일)':'Sugar (ref: 100g/d)', sugar/servingSize*100, 100, 'bg-orange-500'],
          [lang==='ko'?'나트륨 (기준: 2000mg/일)':'Sodium (ref: 2000mg/d)', (sodium/servingSize*100)/2000*100, 2000, 'bg-yellow-500'],
          [lang==='ko'?'포화지방 (기준: 15g/일)':'Sat.Fat (ref: 15g/d)', satFat/servingSize*100, 15, 'bg-red-500'],
          [lang==='ko'?'단백질 (기준: 55g/일)':'Protein (ref: 55g/d)', protein/servingSize*100, 55, 'bg-brand-500'],
          [lang==='ko'?'식이섬유 (기준: 25g/일)':'Fiber (ref: 25g/d)', fiber/servingSize*100, 25, 'bg-blue-500'],
        ].map(([l, v, ref, c]) => (
          <div key={l as string} className="mb-1.5">
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-slate-400">{l as string}</span>
              <span className="text-slate-300">{((v as number)/(ref as number)*100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-surface-border rounded-full overflow-hidden">
              <div className={`h-full ${c} rounded-full`} style={{width:`${Math.min(100,(v as number)/(ref as number)*100)}%`}} />
            </div>
          </div>
        ))}
      </div>

      <ToolFooter
        toolName={lang==='ko'?'영양 점수 계산기':'Nutrition Score Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/nutrition-score"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'영양 성분 입력',desc:'식품 포장지의 영양 성분표 정보를 입력하세요.'},{step:'1회 제공량 설정',desc:'1회 제공량(g)을 설정해 더 정확한 점수를 받으세요.'},{step:'등급 확인',desc:'A~F 영양 등급과 주의/양호 항목을 확인하세요.'},{step:'일일 기준 비교',desc:'1일 영양 권장량 대비 비율을 확인하세요.'}]:[{step:'Enter nutrition info',desc:'Input nutritional information from food packaging.'},{step:'Set serving size',desc:'Set serving size (g) for more accurate scoring.'},{step:'View grade',desc:'See A-F nutrition grade and issue/good points.'},{step:'Daily comparison',desc:'See percentage of daily reference values.'}]}
        whyUse={lang==='ko'?[{title:'6항목 종합 평가',desc:'열량·당류·나트륨·포화지방·단백질·식이섬유를 종합 분석합니다.'},{title:'등급 시스템',desc:'A~F 등급으로 한눈에 식품의 영양 품질을 파악합니다.'},{title:'1일 기준 대비',desc:'성인 기준 1일 영양 권장량 대비 비율을 시각화합니다.'},{title:'주의·양호 항목',desc:'어떤 항목이 문제이고 어떤 항목이 좋은지 명확히 알려줍니다.'}]:[{title:'6-item analysis',desc:'Comprehensive analysis of calories, sugar, sodium, sat. fat, protein, fiber.'},{title:'Grade system',desc:'A-F grade for quick assessment of nutritional quality.'},{title:'Daily reference',desc:'Visualizes percentage against adult daily recommended values.'},{title:'Issues & goods',desc:'Clearly shows which items are problematic and which are good.'}]}
        faqs={lang==='ko'?[{q:'식품의 영양 정보는 어디서 확인하나요?',a:'식품 포장지 뒷면의 영양 성분표를 확인하거나, 식품의약품안전처 식품안전나라(foodsafetykorea.go.kr)에서 검색할 수 있습니다.'},{q:'당류와 탄수화물의 차이는?',a:'탄수화물에는 당류, 식이섬유, 전분 등이 포함됩니다. 당류는 탄수화물의 일부로, 단순당(설탕, 과당 등)이 해당합니다.'},{q:'나트륨 기준이 왜 낮게 설정되어 있나요?',a:'WHO와 한국 보건복지부의 권고 기준(1일 2000mg 이하)을 적용했습니다. 한국인은 평균 나트륨 섭취량이 권고량을 초과하는 경우가 많습니다.'},{q:'이 점수가 절대적인 기준인가요?',a:'아니요. 참고용 점수입니다. 개인의 건강 상태, 질환, 나이에 따라 필요한 영양소가 다릅니다. 건강한 식습관은 의사·영양사와 상담하세요.'}]:[{q:'Where to find nutrition info?',a:'Check food packaging nutrition label or search on Korea MFDS food safety database (foodsafetykorea.go.kr).'},{q:'Sugar vs carbohydrates?',a:'Carbohydrates include sugar, dietary fiber, and starch. Sugar refers to simple sugars (sucrose, fructose, etc.).'},{q:'Why is sodium standard low?',a:'Based on WHO and Korean Ministry of Health guidelines (under 2000mg/day). Koreans often exceed this recommendation.'},{q:'Is this score absolute?',a:'No, it is for reference only. Nutritional needs vary by health condition, age, and individual factors. Consult a doctor or dietitian.'}]}
        keywords="영양 점수 계산기 · 식품 영양 평가 · 영양 등급 · 나트륨 당류 계산 · 식품 건강 점수 · nutrition score calculator · food health score · nutritional grade"
      />
    </div>
  )
}
