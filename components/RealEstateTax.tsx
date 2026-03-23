
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'부동산 취득세 계산기', desc:'아파트·주택 매수 시 취득세·교육세·농특세 자동 계산. 주택 수에 따른 중과세율 적용.' }, en:{ title:'Real Estate Acquisition Tax', desc:'Calculate acquisition tax for Korean property. Includes education tax, heavy tax for multiple homeowners.' } }
function comma(n:number){return Math.round(n).toLocaleString('ko-KR')}
export default function RealEstateTax() {
  const { lang } = useLang(); const tx = T[lang]
  const [price,setPrice]=useState(500000000); const [homeCount,setHomeCount]=useState(1); const [isAdjusted,setIsAdjusted]=useState(false)
  const [copied,setCopied]=useState<string|null>(null)
  const copy=async(t:string,k:string)=>{await navigator.clipboard.writeText(t);setCopied(k);setTimeout(()=>setCopied(null),1500)}
  const getRate=()=>{
    if(homeCount===1){if(price<=600000000)return{acq:0.01,edu:0.001,farm:0};if(price<=900000000)return{acq:0.02,edu:0.002,farm:0};return{acq:0.03,edu:0.003,farm:0.002}}
    if(homeCount===2){if(isAdjusted)return{acq:0.08,edu:0.004,farm:0.006};return{acq:0.01,edu:0.001,farm:0}}
    return{acq:0.12,edu:0.006,farm:0.01}
  }
  const {acq,edu,farm}=getRate()
  const acqTax=Math.round(price*acq); const eduTax=Math.round(price*edu); const farmTax=Math.round(price*farm); const total=acqTax+eduTax+farmTax
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="mb-4">
          <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'매매 가격 (원)':'Purchase Price (₩)'}</label>
          <input type="number" value={price} step={10000000} onChange={e=>setPrice(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-xl font-mono focus:outline-none focus:border-brand-500/50 transition-all mb-2" />
          <div className="flex flex-wrap gap-1.5">{[200000000,300000000,500000000,700000000,1000000000,2000000000].map(v=><button key={v} onClick={()=>setPrice(v)} className={`text-xs px-2.5 py-1 rounded border transition-all ${price===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-400 bg-[#0f1117]'}`}>{v>=100000000?`${v/100000000}억`:`${v/10000}만`}</button>)}</div>
        </div>
        <div className="mb-3">
          <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'취득 후 주택 수':'Homes After Purchase'}</label>
          <div className="flex gap-1.5">{[1,2,3].map(n=><button key={n} onClick={()=>setHomeCount(n)} className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${homeCount===n?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>{n}{lang==='ko'?'주택':' home'}</button>)}</div>
        </div>
        {homeCount===2&&(<label className="flex items-center gap-2 cursor-pointer"><div onClick={()=>setIsAdjusted(!isAdjusted)} className={`w-9 h-5 rounded-full relative transition-all ${isAdjusted?'bg-brand-500':'bg-surface-border'}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isAdjusted?'left-4':'left-0.5'}`}/></div><span className="text-xs text-slate-300">{lang==='ko'?'조정대상지역 (중과세 적용)':'Regulated area (heavy tax)'}</span></label>)}
      </div>
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-xs text-slate-400">{lang==='ko'?'총 취득세':'Total Acquisition Tax'}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(total)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang==='ko'?`실효세율: ${((total/price)*100).toFixed(2)}%`:`Effective: ${((total/price)*100).toFixed(2)}%`}</p>
          </div>
          <button onClick={()=>copy(String(total),'t')} className={`p-2.5 rounded-xl border transition-all ${copied==='t'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>{copied==='t'?<CheckCheck size={16}/>:<Copy size={16}/>}</button>
        </div>
        <div className="flex flex-col gap-1.5 text-xs">{[[lang==='ko'?'취득세':'Acquisition Tax',acqTax,`${(acq*100).toFixed(0)}%`,'a'],[lang==='ko'?'교육세':'Education Tax',eduTax,`${(edu*100).toFixed(1)}%`,'e'],[lang==='ko'?'농어촌특별세':'Farm Special Tax',farmTax,`${(farm*100).toFixed(1)}%`,'f']].map(([l,v,r,k])=><div key={k as string} className="flex justify-between"><span className="text-slate-400">{l} ({r})</span><div className="flex items-center gap-1.5"><span className="text-slate-200 font-mono">₩{comma(v as number)}</span><button onClick={()=>copy(String(v),k as string)} className={`p-1 rounded border transition-all ${copied===k?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-600 hover:text-brand-400'}`}>{copied===k?<CheckCheck size={10}/>:<Copy size={10}/>}</button></div></div>)}</div>
      </div>
      <ToolFooter toolName={lang==='ko'?'부동산 취득세 계산기':'Real Estate Acquisition Tax'} toolUrl="https://keyword-mixer.vercel.app/real-estate-tax" description={tx.desc}
        howToUse={lang==='ko'?[{step:'가격 입력',desc:'매매 가격을 입력하거나 프리셋을 선택하세요.'},{step:'주택 수 선택',desc:'취득 후 보유 주택 수를 선택하세요.'},{step:'조정지역 설정',desc:'2주택자는 조정대상지역 여부를 설정하세요.'},{step:'세금 확인',desc:'취득세·교육세·농특세가 자동 계산됩니다.'}]:[{step:'Enter price',desc:'Input purchase price or use presets.'},{step:'Select home count',desc:'Choose homes owned after purchase.'},{step:'Regulated area',desc:'For 2nd homebuyers, set regulated area status.'},{step:'View taxes',desc:'Acquisition, education, farm taxes calculated.'}]}
        whyUse={lang==='ko'?[{title:'주택수별 세율',desc:'1/2/3주택 이상 각각 정확한 세율 적용.'},{title:'중과세 자동',desc:'조정지역 2주택 이상 중과세 자동 적용.'},{title:'3가지 세금 합산',desc:'취득세·교육세·농특세 모두 포함.'},{title:'실효세율',desc:'가격 대비 실제 세율 표시.'}]:[{title:'Home count rates',desc:'Accurate rates for 1st, 2nd, 3rd+ homes.'},{title:'Heavy tax auto',desc:'Auto-applies heavy tax for 2nd+ homes in regulated areas.'},{title:'All taxes combined',desc:'Acquisition, education, farm tax all included.'},{title:'Effective rate',desc:'Shows actual tax rate vs price.'}]}
        faqs={lang==='ko'?[{q:'취득세율은?',a:'1주택: 1~3%, 2주택 조정지역: 8%, 3주택 이상: 12% (2024년 기준).'},{q:'조정대상지역이란?',a:'서울 전역, 주요 수도권 등 투기 방지 지정 지역.'},{q:'취득세 외 비용?',a:'법무사 비용, 중개수수료(0.4~0.9%), 국민주택채권 매입.'},{q:'생애 최초 혜택?',a:'생애 최초 구입 시 취득세 감면 혜택. 관할 시군구 확인.'}]:[{q:'Tax rates?',a:'1st home: 1-3%, 2nd regulated: 8%, 3rd+: 12% (2024).'},{q:'Regulated area?',a:'Government-designated areas including all Seoul and major metro areas.'},{q:'Other costs?',a:'Legal fees, agent commission (0.4-0.9%), housing bond purchase.'},{q:'First-time buyer?',a:'Tax reduction available. Check income/price limits with local office.'}]}
        keywords="부동산 취득세 · 아파트 취득세 · 다주택 취득세 · 취득세 계산기 · real estate acquisition tax Korea · property tax calculator" />
    </div>
  )
}
