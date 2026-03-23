
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'단백질 섭취량 계산기', desc:'체중·목표·운동량에 맞는 하루 단백질 권장량 계산. 고단백 음식 목록과 식단 가이드 제공.' }, en:{ title:'Protein Intake Calculator', desc:'Calculate daily protein needs based on weight, goal, and activity. High-protein food list and diet guide.' } }
const GOALS = [['lose','체중감량/Weight Loss',0.8],['maintain','유지/Maintain',1.0],['muscle','근성장/Muscle Gain',1.6],['athlete','운동선수/Athlete',2.2]]
const FOODS_KO = [['닭가슴살 100g','23g'],['달걀 1개','6g'],['두부 100g','8g'],['참치캔 100g','26g'],['그릭요거트 100g','10g'],['소고기 100g','26g'],['연어 100g','20g'],['우유 200ml','7g'],['콩류 100g','9g'],['아몬드 30g','6g']]
const FOODS_EN = [['Chicken breast 100g','23g'],['Egg 1 large','6g'],['Tofu 100g','8g'],['Canned tuna 100g','26g'],['Greek yogurt 100g','10g'],['Beef 100g','26g'],['Salmon 100g','20g'],['Milk 200ml','7g'],['Legumes 100g','9g'],['Almonds 30g','6g']]
function comma(n:number){return n.toFixed(0)}
export default function ProteinCalculator() {
  const { lang } = useLang(); const tx = T[lang]
  const [weight,setWeight]=useState(70); const [goal,setGoal]=useState(2)
  const [activity,setActivity]=useState(1.0); const [copied,setCopied]=useState<string|null>(null)
  const copy = async (t:string,k:string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(()=>setCopied(null),1500) }
  const multiplier = parseFloat(GOALS[goal][2] as string) * activity
  const dailyProtein = Math.round(weight * multiplier)
  const minProtein = Math.round(weight * 0.8)
  const maxProtein = Math.round(weight * 2.5)
  const perMeal3 = Math.round(dailyProtein / 3)
  const perMeal4 = Math.round(dailyProtein / 4)
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>Free Health Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'체중 (kg)':'Weight (kg)'}</label>
            <input type="number" value={weight} min={30} max={200} onChange={e=>setWeight(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all"/></div>
          <div><label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'활동 보정':'Activity Factor'}</label>
            <div className="flex flex-col gap-1">{[[0.8,lang==='ko'?'낮음':'Low'],[1.0,lang==='ko'?'보통':'Moderate'],[1.2,lang==='ko'?'높음':'High']].map(([v,l])=><button key={v as number} onClick={()=>setActivity(v as number)} className={`py-1.5 rounded border text-xs transition-all ${activity===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>)}</div>
          </div>
        </div>
        <div><label className="text-xs text-slate-400 mb-2 block">{lang==='ko'?'목표':'Goal'}</label>
          <div className="grid grid-cols-2 gap-1.5">{GOALS.map(([k,l],i)=><button key={k as string} onClick={()=>setGoal(i)} className={`py-2 rounded-lg border text-xs font-medium transition-all ${goal===i?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{(l as string).split('/')[lang==='ko'?0:1]}</button>)}</div>
        </div>
      </div>
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div><p className="text-xs text-slate-400">{lang==='ko'?'하루 권장 단백질':'Daily Protein Goal'}</p><p className="text-5xl font-extrabold text-brand-400 font-mono">{dailyProtein}<span className="text-2xl">g</span></p></div>
          <button onClick={()=>copy(String(dailyProtein),'p')} className={`p-2.5 rounded-xl border transition-all ${copied==='p'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>{copied==='p'?<CheckCheck size={16}/>:<Copy size={16}/>}</button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs mt-3">{[
          [lang==='ko'?'3끼 분할':'Per meal (3x)', perMeal3+'g','pm3'],
          [lang==='ko'?'4끼 분할':'Per meal (4x)', perMeal4+'g','pm4'],
          [lang==='ko'?'체중 kg당':'Per kg', (dailyProtein/weight).toFixed(1)+'g/kg','pk'],
        ].map(([l,v,k])=><div key={k as string} className="rounded-lg border border-surface-border bg-[#1a1d27] p-2 text-center"><p className="text-slate-400 mb-0.5">{l}</p><p className="font-bold text-slate-200">{v}</p><button onClick={()=>copy(v as string,k as string)} className={`mt-1 p-0.5 rounded transition-all ${copied===k?'text-brand-400':'text-slate-600 hover:text-brand-400'}`}>{copied===k?<CheckCheck size={10}/>:<Copy size={10}/>}</button></div>)}</div>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'고단백 식품 목록':'High-Protein Foods'}</p>
        <div className="grid grid-cols-2 gap-1.5">{(lang==='ko'?FOODS_KO:FOODS_EN).map(([f,p])=><div key={f} className="flex justify-between text-xs px-2 py-1.5 rounded bg-[#0f1117] border border-surface-border"><span className="text-slate-300">{f}</span><span className="text-brand-400 font-bold">{p}</span></div>)}</div>
      </div>
      <ToolFooter toolName={lang==='ko'?'단백질 섭취량 계산기':'Protein Calculator'} toolUrl="https://keyword-mixer.vercel.app/protein-calculator" description={tx.desc}
        howToUse={lang==='ko'?[{step:'체중 입력',desc:'현재 체중을 입력하세요.'},{step:'활동량 설정',desc:'평소 활동 수준을 선택하세요.'},{step:'목표 선택',desc:'체중감량·유지·근성장·운동선수 중 선택하세요.'},{step:'권장량 확인',desc:'하루 단백질 권장량과 끼니별 목표가 계산됩니다.'}]:[{step:'Enter weight',desc:'Input your current weight.'},{step:'Set activity',desc:'Choose your typical activity level.'},{step:'Select goal',desc:'Choose weight loss, maintain, muscle gain, or athlete.'},{step:'View recommendation',desc:'Daily protein goal and per-meal targets calculated.'}]}
        whyUse={lang==='ko'?[{title:'목표별 맞춤 권장량',desc:'체중감량·유지·근성장·운동선수 별 최적 단백질 비율.'},{title:'끼니별 분할',desc:'하루 섭취량을 3끼·4끼로 나눈 목표를 제시합니다.'},{title:'고단백 식품 목록',desc:'단백질이 풍부한 식품 10가지 정보를 제공합니다.'},{title:'활동량 보정',desc:'활동 수준에 따라 단백질 권장량을 보정합니다.'}]:[{title:'Goal-based recommendations',desc:'Optimal protein ratios for weight loss, maintenance, muscle gain, athlete.'},{title:'Meal distribution',desc:'Divides daily goal into 3 or 4 meal targets.'},{title:'High-protein food list',desc:'Top 10 high-protein foods for reference.'},{title:'Activity adjustment',desc:'Adjusts protein needs based on activity level.'}]}
        faqs={lang==='ko'?[{q:'단백질은 하루 몇 g이 적당한가요?',a:'일반인은 체중 kg당 0.8~1g, 운동하는 분은 1.2~2g, 근성장 목적은 1.6~2.2g이 권장됩니다.'},{q:'단백질을 많이 먹으면 근육이 늘까요?',a:'단백질 섭취는 근성장의 필수 조건이지만, 운동 없이는 근육이 늘지 않습니다. 저항 운동과 충분한 수면도 함께 필요합니다.'},{q:'단백질 과잉 섭취 부작용은?',a:'신장 기능이 정상인 건강한 사람은 일반적으로 과잉 섭취 부작용이 적습니다. 단, 신장 질환이 있다면 의사와 상담 후 섭취량을 조절하세요.'},{q:'식물성 단백질과 동물성 단백질 차이는?',a:'동물성 단백질은 필수 아미노산이 완전히 포함된 완전 단백질입니다. 식물성도 다양하게 조합하면 모든 필수 아미노산을 충족할 수 있습니다.'}]:[{q:'Daily protein recommendation?',a:'General: 0.8-1g/kg. Active: 1.2-2g/kg. Muscle building: 1.6-2.2g/kg.'},{q:'Does more protein mean more muscle?',a:'Protein is essential but not sufficient alone. Resistance training and adequate sleep are also required for muscle growth.'},{q:'Protein overconsumption side effects?',a:'Healthy individuals generally tolerate higher intakes well. Those with kidney disease should consult a doctor before increasing protein.'},{q:'Plant vs animal protein?',a:'Animal protein contains all essential amino acids. Plant proteins can provide all essentials when eaten in varied combinations.'}]}
        keywords="단백질 섭취량 · 하루 단백질 권장량 · 근성장 단백질 · 체중별 단백질 · protein calculator · daily protein intake · protein needs · muscle building protein · protein per kg"
      />
    </div>
  )
}
