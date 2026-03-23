
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
const T = { ko:{ title:'프리랜서 세금 계산기', desc:'프리랜서·개인사업자의 사업소득세·부가세·건강보험 계산. 종합소득세 신고 준비.' }, en:{ title:'Freelancer Tax Calculator', desc:'Calculate income tax, VAT, and health insurance for freelancers and sole proprietors.' } }
function comma(n:number){return Math.round(n).toLocaleString('ko-KR')}
const BRACKETS=[{limit:14000000,rate:0.06,ded:0},{limit:50000000,rate:0.15,ded:1260000},{limit:88000000,rate:0.24,ded:5760000},{limit:150000000,rate:0.35,ded:15440000},{limit:Infinity,rate:0.38,ded:19940000}]
function calcTax(income:number){for(const b of BRACKETS){if(income<=b.limit)return Math.max(0,income*b.rate-b.ded)}return 0}
export default function FreelancerTax() {
  const { lang } = useLang(); const tx = T[lang]
  const [revenue,setRevenue]=useState(50000000); const [expenses,setExpenses]=useState(5000000); const [isVat,setIsVat]=useState(false)
  const [copied,setCopied]=useState<string|null>(null)
  const copy=async(t:string,k:string)=>{await navigator.clipboard.writeText(t);setCopied(k);setTimeout(()=>setCopied(null),1500)}
  const netIncome=Math.max(0,revenue-expenses)
  const simpleExpDeduct=revenue<24000000?revenue*0.6:revenue<48000000?revenue*0.4:revenue*0.2
  const taxableIncome=Math.max(0,netIncome-simpleExpDeduct*0.5-1500000)
  const incomeTax=calcTax(taxableIncome); const localTax=Math.round(incomeTax*0.1)
  const healthIns=Math.round(netIncome*0.0709/12)*12
  const vat=isVat?Math.round(revenue*0.1):0
  const totalTax=incomeTax+localTax+healthIns+(isVat?vat:0)
  const afterTax=netIncome-incomeTax-localTax-healthIns
  const effectiveRate=((incomeTax+localTax)/netIncome*100).toFixed(1)
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool</div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div><label className="text-xs text-slate-400 mb-1 block">{lang==='ko'?'연간 수입 (원)':'Annual Revenue (₩)'}</label><input type="number" value={revenue} step={1000000} onChange={e=>setRevenue(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" /></div>
          <div><label className="text-xs text-slate-400 mb-1 block">{lang==='ko'?'사업 경비 (원)':'Business Expenses (₩)'}</label><input type="number" value={expenses} step={100000} onChange={e=>setExpenses(+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" /></div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer"><div onClick={()=>setIsVat(!isVat)} className={`w-9 h-5 rounded-full relative transition-all ${isVat?'bg-brand-500':'bg-surface-border'}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isVat?'left-4':'left-0.5'}`}/></div><span className="text-xs text-slate-300">{lang==='ko'?'부가세 과세사업자 (일반)':'VAT registered (general)'}</span></label>
      </div>
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4 mb-4 flex justify-between">
        <div><p className="text-xs text-slate-400">{lang==='ko'?'세후 순수입':'After-tax Net Income'}</p><p className="text-3xl font-extrabold text-brand-400 font-mono">₩{comma(afterTax)}</p><p className="text-xs text-slate-500 mt-1">{lang==='ko'?`실효세율 ${effectiveRate}%`:`Effective rate ${effectiveRate}%`}</p></div>
        <button onClick={()=>copy(String(afterTax),'at')} className={`p-2.5 rounded-xl border transition-all ${copied==='at'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>{copied==='at'?<CheckCheck size={16}/>:<Copy size={16}/>}</button>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]"><p className="text-xs font-medium text-slate-200">{lang==='ko'?'세금 상세':'Tax Breakdown'}</p></div>
        <div className="divide-y divide-surface-border">
          {[[lang==='ko'?'사업 순이익':'Net Business Income',netIncome,'ni'],[lang==='ko'?'과세표준 (추산)':'Taxable Income (est)',taxableIncome,'ti'],[lang==='ko'?'종합소득세':'Income Tax',incomeTax,'it'],[lang==='ko'?'지방소득세':'Local Tax',localTax,'lt'],[lang==='ko'?'건강보험료 (지역)':'Health Insurance',healthIns,'hi'],...(isVat?[[lang==='ko'?'부가세':'VAT',vat,'vat']] as [string,number,string][]:[]as [string,number,string][])].map(([l,v,k])=>(
            <div key={k as string} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-slate-400">{l}</span>
              <div className="flex items-center gap-1.5"><span className="text-sm font-mono text-slate-200">₩{comma(v as number)}</span><button onClick={()=>copy(String(v),k as string)} className={`p-1 rounded border transition-all ${copied===k?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-600 hover:text-brand-400'}`}>{copied===k?<CheckCheck size={11}/>:<Copy size={11}/>}</button></div>
            </div>
          ))}
        </div>
      </div>
      <ToolFooter toolName={lang==='ko'?'프리랜서 세금 계산기':'Freelancer Tax Calculator'} toolUrl="https://keyword-mixer.vercel.app/freelancer-tax" description={tx.desc}
        howToUse={lang==='ko'?[{step:'수입 입력',desc:'연간 총수입을 입력하세요.'},{step:'경비 입력',desc:'사업 관련 경비를 입력하세요.'},{step:'부가세 설정',desc:'일반 과세사업자라면 부가세 옵션을 켜세요.'},{step:'세금 확인',desc:'종합소득세·지방세·건강보험이 계산됩니다.'}]:[{step:'Enter revenue',desc:'Input annual total revenue.'},{step:'Enter expenses',desc:'Input business-related expenses.'},{step:'VAT setting',desc:'Toggle VAT if you are a general taxpayer.'},{step:'View taxes',desc:'Income tax, local tax, health insurance calculated.'}]}
        whyUse={lang==='ko'?[{title:'3가지 세금 통합',desc:'소득세·지방세·건강보험을 한번에 계산합니다.'},{title:'단순경비율 반영',desc:'소득 규모에 따른 단순경비율을 자동 적용합니다.'},{title:'부가세 계산',desc:'일반 과세사업자의 부가세도 계산합니다.'},{title:'세후 순수입',desc:'실제 수령할 순수입을 명확히 표시합니다.'}]:[{title:'3 taxes combined',desc:'Income tax, local tax, health insurance.'},{title:'Expense deduction',desc:'Auto-applies standard expense deduction rate.'},{title:'VAT calculation',desc:'Includes VAT for general taxpayers.'},{title:'Net income',desc:'Clearly shows actual take-home amount.'}]}
        faqs={lang==='ko'?[{q:'종합소득세 신고 기간은?',a:'매년 5월 1일~31일입니다. 소득 있는 다음해 5월에 신고합니다.'},{q:'단순경비율이란?',a:'장부 없이도 소득을 인정해주는 개략적 경비율입니다. 수입 규모에 따라 20~60%가 적용됩니다.'},{q:'부가세 신고 주기는?',a:'일반 과세자: 1·7월 각 25일, 연 2회. 간이 과세자: 1월 25일 연 1회.'},{q:'프리랜서 건강보험은?',a:'직장 가입자가 아닌 지역 가입자로 보험료를 납부합니다. 소득·재산 기준으로 산정됩니다.'}]:[{q:'Tax filing period?',a:'May 1-31 annually. File the following May after earning income.'},{q:'Standard expense deduction?',a:'Simplified deduction without bookkeeping. 20-60% depending on income scale.'},{q:'VAT filing schedule?',a:'General taxpayers: January 25 and July 25 (twice/year).'},{q:'Freelancer health insurance?',a:'Regional subscriber (not employee). Calculated based on income and assets.'}]}
        keywords="프리랜서 세금 · 개인사업자 세금 · 종합소득세 계산기 · 사업소득세 · 프리랜서 세후 수입 · freelancer tax calculator · self-employed tax · sole proprietor tax Korea" />
    </div>
  )
}
