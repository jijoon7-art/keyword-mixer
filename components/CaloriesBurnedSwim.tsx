
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'수영 칼로리 소모 계산기', desc:'수영 영법·강도·시간으로 소모 칼로리 계산. 수영이 다른 운동과 얼마나 다른지 비교.' }, en:{ title:'Swimming Calorie Calculator', desc:'Calculate calories burned by swimming stroke, intensity, and duration. Compare swimming with other exercises.' } }
const STROKES = [
  {ko:'자유형 (보통)',en:'Freestyle (moderate)',met:8.3},{ko:'자유형 (빠름)',en:'Freestyle (fast)',met:11.0},
  {ko:'배영',en:'Backstroke',met:7.0},{ko:'평영',en:'Breaststroke',met:10.3},
  {ko:'접영',en:'Butterfly',met:13.8},{ko:'물속 걷기',en:'Water walking',met:4.5},
  {ko:'아쿠아에어로빅',en:'Aqua aerobics',met:5.5},{ko:'다이빙 연습',en:'Diving practice',met:6.0},
]
function comma(n:number){return Math.round(n).toLocaleString('ko-KR')}
export default function CaloriesBurnedSwim() {
  const { lang } = useLang(); const tx = T[lang]
  const [weight,setWeight]=useState(65); const [minutes,setMinutes]=useState(30); const [stroke,setStroke]=useState(0)
  const [copied,setCopied]=useState<string|null>(null)
  const copy=async(t:string,k:string)=>{await navigator.clipboard.writeText(t);setCopied(k);setTimeout(()=>setCopied(null),1500)}
  const cal = Math.round(STROKES[stroke].met * weight * (minutes/60))
  const fatG = (cal/7700*1000).toFixed(1)
  const COMPARE = [
    {ko:'달리기 (8km/h)',en:'Running (8km/h)',met:8.0},
    {ko:'자전거 (보통)',en:'Cycling (mod.)',met:6.0},
    {ko:'에어로빅',en:'Aerobics',met:6.5},
    {ko:'걷기 (빠름)',en:'Brisk walk',met:4.5},
  ]
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
            <input type="number" value={weight} min={30} max={200} onChange={e=>setWeight(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-2.5 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all"/></div>
          <div><label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'수영 시간 (분)':'Duration (min)'}</label>
            <input type="number" value={minutes} min={5} max={300} step={5} onChange={e=>setMinutes(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-3 py-2.5 text-slate-200 text-lg font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all"/>
            <div className="flex gap-1 mt-1.5">{[20,30,45,60].map(m=><button key={m} onClick={()=>setMinutes(m)} className={`flex-1 py-1 rounded text-xs border transition-all ${minutes===m?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-500 bg-[#0f1117]'}`}>{m}</button>)}</div>
          </div>
        </div>
        <div><label className="text-xs text-slate-400 mb-2 block">{lang==='ko'?'영법 선택':'Swimming Stroke'}</label>
          <div className="grid grid-cols-2 gap-1.5">{STROKES.map((s,i)=><button key={i} onClick={()=>setStroke(i)} className={`py-2 rounded-lg border text-xs font-medium transition-all ${stroke===i?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{lang==='ko'?s.ko:s.en}</button>)}</div>
        </div>
      </div>
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 mb-4">
        <div className="flex justify-between items-center">
          <div><p className="text-xs text-slate-400">{lang==='ko'?`${minutes}분 수영 소모 칼로리`:`${minutes}min swimming`}</p>
            <p className="text-4xl font-extrabold text-blue-400 font-mono">{comma(cal)} <span className="text-xl">kcal</span></p>
            <p className="text-xs text-slate-500 mt-1">{lang==='ko'?`체지방 ${fatG}g 소모 · MET ${STROKES[stroke].met}`:`Fat burned: ${fatG}g · MET ${STROKES[stroke].met}`}</p>
          </div>
          <button onClick={()=>copy(String(cal),'c')} className={`p-2.5 rounded-xl border transition-all ${copied==='c'?'bg-blue-500/20 border-blue-500/40 text-blue-400':'border-surface-border text-slate-400 hover:text-blue-400'}`}>{copied==='c'?<CheckCheck size={16}/>:<Copy size={16}/>}</button>
        </div>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-3">{lang==='ko'?`🏃 다른 운동과 비교 (${minutes}분, ${weight}kg 기준)`:`🏃 vs Other Exercises (${minutes}min, ${weight}kg)`}</p>
        <div className="flex flex-col gap-2">{COMPARE.map(c=>{
          const cc=Math.round(c.met*weight*(minutes/60)); const maxCal=Math.max(cal,...COMPARE.map(x=>Math.round(x.met*weight*(minutes/60))))
          return <div key={c.ko} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-28 flex-shrink-0">{lang==='ko'?c.ko:c.en}</span>
            <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden"><div className="h-full bg-orange-500/50 rounded-full" style={{width:`${(cc/maxCal)*100}%`}}/></div>
            <span className="text-xs font-mono text-slate-300 w-16 text-right">{comma(cc)}kcal</span>
          </div>
        })}
        <div className="flex items-center gap-3 border-t border-surface-border pt-2 mt-1">
          <span className="text-xs text-blue-400 font-bold w-28">🏊 {lang==='ko'?'수영 (선택)':'Swimming'}</span>
          <div className="flex-1 h-2 bg-surface-border rounded-full overflow-hidden"><div className="h-full bg-blue-500/70 rounded-full" style={{width:`${(cal/Math.max(cal,...COMPARE.map(c=>Math.round(c.met*weight*(minutes/60)))))*100}%`}}/></div>
          <span className="text-xs font-mono text-blue-400 font-bold w-16 text-right">{comma(cal)}kcal</span>
        </div>
        </div>
      </div>
      <ToolFooter toolName={lang==='ko'?'수영 칼로리 소모 계산기':'Swimming Calorie Calculator'} toolUrl="https://keyword-mixer.vercel.app/calories-burned-swim" description={tx.desc}
        howToUse={lang==='ko'?[{step:'체중과 시간 입력',desc:'체중과 수영 시간을 입력하세요.'},{step:'영법 선택',desc:'자유형, 평영, 배영 등 영법을 선택하세요.'},{step:'칼로리 확인',desc:'MET 기반 소모 칼로리가 계산됩니다.'},{step:'비교 확인',desc:'다른 운동과 칼로리 소모량을 비교해보세요.'}]:[{step:'Enter weight and time',desc:'Input your weight and swimming duration.'},{step:'Select stroke',desc:'Choose freestyle, breaststroke, backstroke, etc.'},{step:'View calories',desc:'MET-based calorie burn is calculated.'},{step:'Compare',desc:'Compare with calories burned in other exercises.'}]}
        whyUse={lang==='ko'?[{title:'8가지 영법 지원',desc:'자유형·배영·평영·접영·아쿠아에어로빅 등 8가지.'},{title:'다른 운동과 비교',desc:'달리기·자전거·에어로빅과 칼로리 소모를 비교합니다.'},{title:'체지방 소모량',desc:'칼로리를 체지방 그램으로 환산해 표시합니다.'},{title:'MET 기반 정확도',desc:'검증된 MET 값으로 정확한 칼로리를 계산합니다.'}]:[{title:'8 swimming strokes',desc:'Freestyle, backstroke, breaststroke, butterfly, aqua aerobics and more.'},{title:'Exercise comparison',desc:'Compare with running, cycling, aerobics calorie burn.'},{title:'Fat burn display',desc:'Converts calories to grams of fat burned.'},{title:'MET-based accuracy',desc:'Accurate calorie calculation using validated MET values.'}]}
        faqs={lang==='ko'?[{q:'수영이 칼로리 소모가 큰가요?',a:'접영 기준 약 13.8 MET로 상당히 높습니다. 자유형(빠름)도 11 MET로 달리기와 유사하거나 높습니다.'},{q:'수영이 체중 감량에 효과적인가요?',a:'전신 근육을 사용하고 관절 부담이 적어 체중 감량과 체형 관리에 효과적입니다. 특히 무릎 통증이 있는 분께 좋습니다.'},{q:'수영 후 식욕이 늘어나는 이유는?',a:'수영은 물속에서 체온을 유지하기 위해 추가 에너지를 사용합니다. 또한 물에서 나오면 배고픔을 느끼는 심리적 요인도 있습니다.'},{q:'수영 vs 달리기 칼로리 비교?',a:'같은 시간과 강도라면 수영이 달리기만큼 또는 더 많은 칼로리를 소모합니다. 특히 평영과 접영의 칼로리 소모가 큽니다.'}]:[{q:'Is swimming a high calorie burner?',a:'Butterfly at ~13.8 MET is very high. Fast freestyle at 11 MET is similar to or exceeds running.'},{q:'Effective for weight loss?',a:'Uses all major muscle groups with low joint impact - ideal for weight loss. Especially good for those with knee pain.'},{q:'Why hungry after swimming?',a:'Swimming uses extra energy to maintain body temperature in water. There is also a psychological factor of increased appetite after aquatic exercise.'},{q:'Swimming vs running calories?',a:'Swimming burns comparable or more calories than running at the same intensity. Breaststroke and butterfly are particularly high calorie burners.'}]}
        keywords="수영 칼로리 · 수영 칼로리 소모 · 자유형 칼로리 · 평영 칼로리 · swimming calorie calculator · calories burned swimming · freestyle calories · breaststroke calories"
      />
    </div>
  )
}
