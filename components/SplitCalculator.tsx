
'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'비율 분할 계산기', desc:'금액을 비율 또는 인원수로 나누기. 공동 사업 수익 배분, 경비 분담에 활용.' }, en:{ title:'Split Calculator', desc:'Divide amounts by ratio or headcount. For profit sharing, expense splitting, and cost allocation.' } }
function comma(n:number){return Math.round(n).toLocaleString('ko-KR')}
interface Person{id:number;name:string;ratio:number}
export default function SplitCalculator() {
  const { lang } = useLang(); const tx = T[lang]
  const [total,setTotal]=useState(1000000); const [mode,setMode]=useState<'equal'|'ratio'>('equal')
  const [people,setPeople]=useState<Person[]>([{id:1,name:lang==='ko'?'홍길동':'Alice',ratio:3},{id:2,name:lang==='ko'?'김철수':'Bob',ratio:2},{id:3,name:lang==='ko'?'이영희':'Carol',ratio:1}])
  const [copied,setCopied]=useState<string|null>(null)
  const copy=async(t:string,k:string)=>{await navigator.clipboard.writeText(t);setCopied(k);setTimeout(()=>setCopied(null),1500)}
  const add=()=>setPeople(p=>[...p,{id:Date.now(),name:`${lang==='ko'?'참여자':'Person'} ${p.length+1}`,ratio:1}])
  const remove=(id:number)=>setPeople(p=>p.filter(x=>x.id!==id))
  const update=(id:number,k:keyof Person,v:string|number)=>setPeople(p=>p.map(x=>x.id===id?{...x,[k]:v}:x))
  const totalRatio=people.reduce((s,p)=>s+p.ratio,0)
  const results=people.map(p=>({...p,share:mode==='equal'?Math.round(total/people.length):Math.round(total*(p.ratio/totalRatio)),pct:mode==='equal'?(100/people.length).toFixed(1):((p.ratio/totalRatio)*100).toFixed(1)}))
  const checkSum=results.reduce((s,r)=>s+r.share,0); const diff=total-checkSum
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'총 금액 (원)':'Total Amount (₩)'}</label>
          <input type="number" value={total} step={10000} onChange={e=>setTotal(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">{[100000,500000,1000000,5000000,10000000].map(v=><button key={v} onClick={()=>setTotal(v)} className={`text-xs px-2 py-1 rounded border transition-all ${total===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{v>=10000000?'1000만':`${v/10000}만`}</button>)}</div>
        </div>
        <div className="flex gap-2 mb-4">{[['equal',lang==='ko'?'균등 분할':'Equal Split'],['ratio',lang==='ko'?'비율 분할':'Ratio Split']].map(([v,l])=><button key={v} onClick={()=>setMode(v as 'equal'|'ratio')} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${mode===v?'bg-brand-500 border-brand-500 text-white font-bold':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{l}</button>)}</div>
        {people.map(p=>(
          <div key={p.id} className="flex gap-2 mb-2 items-center">
            <input value={p.name} onChange={e=>update(p.id,'name',e.target.value)} className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-brand-500/50 transition-all" />
            {mode==='ratio'&&<input type="number" min={0} value={p.ratio} onChange={e=>update(p.id,'ratio',+e.target.value)} className="w-16 bg-[#0f1117] border border-surface-border rounded-lg px-2 py-2 text-slate-200 text-sm font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />}
            {people.length>1&&<button onClick={()=>remove(p.id)} className="text-slate-600 hover:text-red-400 transition-all"><Trash2 size={14}/></button>}
          </div>
        ))}
        <button onClick={add} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-2 transition-all"><Plus size={12}/>{lang==='ko'?'참여자 추가':'Add Person'}</button>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]"><p className="text-sm font-semibold text-slate-200">{lang==='ko'?'분할 결과':'Split Results'}</p></div>
        <div className="divide-y divide-surface-border">
          {results.map(r=>(
            <div key={r.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200">{r.name}</p>
                {mode==='ratio'&&<p className="text-xs text-slate-500">{lang==='ko'?`비율 ${r.ratio} (${r.pct}%)`:`Ratio ${r.ratio} (${r.pct}%)`}</p>}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-brand-400 font-mono">₩{comma(r.share)}</p>
                <button onClick={()=>copy(String(r.share),`r${r.id}`)} className={`p-1.5 rounded border transition-all ${copied===`r${r.id}`?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-600 hover:text-brand-400'}`}>{copied===`r${r.id}`?<CheckCheck size={12}/>:<Copy size={12}/>}</button>
              </div>
            </div>
          ))}
          {diff!==0&&<div className="px-4 py-2 text-xs text-yellow-400 bg-yellow-500/5">{lang==='ko'?`* 반올림 차액 ₩${comma(Math.abs(diff))} 처리 필요`:`* Rounding diff ₩${comma(Math.abs(diff))} needs adjustment`}</div>}
        </div>
      </div>
      <ToolFooter toolName={lang==='ko'?'비율 분할 계산기':'Split Calculator'} toolUrl="https://keyword-mixer.vercel.app/split-calculator" description={tx.desc}
        howToUse={lang==='ko'?[{step:'총 금액 입력',desc:'나눌 총 금액을 입력하세요.'},{step:'분할 방식 선택',desc:'균등 또는 비율 분할을 선택하세요.'},{step:'참여자 입력',desc:'이름과 비율을 입력하세요.'},{step:'결과 확인',desc:'각 참여자 금액이 자동 계산됩니다.'}]:[{step:'Enter total',desc:'Input the total amount to split.'},{step:'Select method',desc:'Choose equal or ratio split.'},{step:'Add participants',desc:'Enter names and ratios.'},{step:'View results',desc:'Each person share is calculated.'}]}
        whyUse={lang==='ko'?[{title:'균등/비율 분할',desc:'동일 분할과 비율 기반 분할을 모두 지원합니다.'},{title:'반올림 차액 안내',desc:'반올림으로 생긴 차액을 명확히 표시합니다.'},{title:'개인별 복사',desc:'각 참여자 금액을 개별 복사할 수 있습니다.'},{title:'공동사업 활용',desc:'수익 배분, 경비 분담에 활용하세요.'}]:[{title:'Equal/ratio split',desc:'Supports both equal and ratio-based splitting.'},{title:'Rounding notice',desc:'Clearly shows rounding differences.'},{title:'Per-person copy',desc:'Copy each person amount individually.'},{title:'Business use',desc:'Profit sharing and expense allocation.'}]}
        faqs={lang==='ko'?[{q:'비율 분할이란?',a:'3:2:1 비율 → 합계 6, 각각 50%/33%/17% 배분.'},{q:'반올림 차액 처리?',a:'가장 큰 금액 받는 사람에게 차액 추가가 일반적.'},{q:'공동사업 수익 배분?',a:'투자 비율 또는 기여도 비율로 배분. 계약서에 명시 권장.'},{q:'세금은?',a:'소득 유형에 따라 세율 다름. 세무사 상담 권장.'}]:[{q:'Ratio splitting?',a:'3:2:1 = 6 parts total, each gets 50%/33%/17%.'},{q:'Rounding difference?',a:'Add to largest share or distribute ₩1 sequentially.'},{q:'Business profit sharing?',a:'By investment or contribution ratio. Document in agreement.'},{q:'Taxes?',a:'Varies by income type. Consult a tax professional.'}]}
        keywords="비율 분할 계산기 · 금액 나누기 · 수익 배분 · 공동사업 배분 · split calculator · profit sharing · expense splitting · ratio calculator" />
    </div>
  )
}
