
'use client'
import { useState } from 'react'
import { Copy, CheckCheck, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '프리랜서 견적서 계산기', desc: '시간 단가 또는 항목별로 프리랜서 견적을 계산. 부가세 포함·미포함, 원천징수 3.3% 자동 계산.' },
  en: { title: 'Freelancer Invoice Calculator', desc: 'Calculate freelance quotes by hourly rate or line items. Auto-calculates VAT and 3.3% withholding tax.' }
}

interface LineItem { id: number; desc: string; qty: number; rate: number }
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function InvoiceCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, desc: lang==='ko'?'웹사이트 디자인':'Web Design', qty: 1, rate: 3000000 },
    { id: 2, desc: lang==='ko'?'개발 작업 (40시간)':'Development (40hrs)', qty: 40, rate: 50000 },
  ])
  const [includeVat, setIncludeVat] = useState(false)
  const [withholding, setWithholding] = useState(true)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const addItem = () => setItems(p => [...p, { id: Date.now(), desc: lang==='ko'?'항목':'Item', qty: 1, rate: 100000 }])
  const removeItem = (id: number) => setItems(p => p.filter(x => x.id !== id))
  const update = (id: number, k: keyof LineItem, v: string|number) => setItems(p => p.map(x => x.id === id ? {...x,[k]:v} : x))

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0)
  const vat = includeVat ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + vat
  const withholdingAmt = withholding ? Math.round(subtotal * 0.033) : 0
  const actualReceive = total - withholdingAmt

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Business Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        <div className="grid grid-cols-12 gap-0 px-4 py-2.5 bg-[#0f1117] border-b border-surface-border text-xs text-slate-500 font-medium">
          <span className="col-span-5">{lang==='ko'?'항목':'Description'}</span>
          <span className="col-span-2 text-center">{lang==='ko'?'수량':'Qty'}</span>
          <span className="col-span-3 text-center">{lang==='ko'?'단가 (원)':'Rate (₩)'}</span>
          <span className="col-span-2 text-right">{lang==='ko'?'금액':'Amount'}</span>
        </div>
        {items.map(item => (
          <div key={item.id} className="grid grid-cols-12 gap-0 px-3 py-2 border-b border-surface-border items-center hover:bg-surface-hover/5">
            <div className="col-span-5 pr-2 flex items-center gap-1">
              <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400 transition-all flex-shrink-0"><Trash2 size={12}/></button>
              <input value={item.desc} onChange={e => update(item.id,'desc',e.target.value)} className="w-full bg-transparent text-xs text-slate-200 focus:outline-none" />
            </div>
            <div className="col-span-2 px-1">
              <input type="number" min={1} value={item.qty} onChange={e => update(item.id,'qty',+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1 text-slate-200 text-xs font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div className="col-span-3 px-1">
              <input type="number" value={item.rate} step={10000} onChange={e => update(item.id,'rate',+e.target.value)} className="w-full bg-[#0f1117] border border-surface-border rounded px-1 py-1 text-slate-200 text-xs font-mono text-center focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
            <div className="col-span-2 text-right text-xs font-mono text-brand-400">₩{comma(item.qty*item.rate)}</div>
          </div>
        ))}
        <button onClick={addItem} className="w-full py-2 text-xs text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 transition-all">
          <Plus size={12}/> {lang==='ko'?'항목 추가':'Add Item'}
        </button>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <div className="flex gap-4 mb-3">
          {[[includeVat, setIncludeVat, lang==='ko'?'부가세(10%) 포함':'Include VAT (10%)'],
            [withholding, setWithholding, lang==='ko'?'원천징수(3.3%) 공제':'Withholding Tax (3.3%)']].map(([v,s,l]) => (
            <label key={l as string} className="flex items-center gap-2 cursor-pointer">
              <div onClick={() => (s as Function)(!(v as boolean))} className={`w-9 h-5 rounded-full relative transition-all ${v?'bg-brand-500':'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${v?'left-4':'left-0.5'}`}/>
              </div>
              <span className="text-xs text-slate-300">{l as string}</span>
            </label>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 text-sm">
          {[
            [lang==='ko'?'소계':'Subtotal', subtotal, 'st', false],
            ...(includeVat ? [[lang==='ko'?'부가세 (10%)':'VAT (10%)', vat, 'vt', false]] as [string,number,string,boolean][] : []),
            [lang==='ko'?'합계':'Total', total, 'tot', false],
            ...(withholding ? [[lang==='ko'?'원천징수 (3.3%)':'Withholding (3.3%)', -withholdingAmt, 'wh', false]] as [string,number,string,boolean][] : []),
          ].map(([l,v,k,b]) => (
            <div key={k as string} className="flex justify-between">
              <span className="text-slate-400">{l as string}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-200 font-mono">{(v as number) < 0 ? '-' : ''}₩{comma(Math.abs(v as number))}</span>
                <button onClick={() => copy(String(Math.abs(v as number)), k as string)} className={`p-0.5 rounded border transition-all ${copied===k?'text-brand-400 border-brand-500/30':'text-slate-600 border-surface-border hover:text-brand-400'}`}>
                  {copied===k?<CheckCheck size={10}/>:<Copy size={10}/>}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-surface-border mt-1">
            <span className="font-bold text-slate-200">{lang==='ko'?'실수령액':'Net Receivable'}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-brand-400 text-xl font-mono">₩{comma(actualReceive)}</span>
              <button onClick={() => copy(String(actualReceive),'ar')} className={`p-1.5 rounded border transition-all ${copied==='ar'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                {copied==='ar'?<CheckCheck size={13}/>:<Copy size={13}/>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang==='ko'?'프리랜서 견적서 계산기':'Freelancer Invoice Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/invoice-calculator"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'항목 입력',desc:'견적 항목, 수량, 단가를 입력하세요.'},{step:'부가세 설정',desc:'부가세 포함 여부를 선택하세요.'},{step:'원천징수 설정',desc:'원천징수 3.3% 공제 여부를 선택하세요.'},{step:'실수령액 확인',desc:'최종 실수령액을 확인하고 복사하세요.'}]:[{step:'Enter items',desc:'Add line items with description, quantity, and rate.'},{step:'VAT setting',desc:'Toggle whether to include 10% VAT.'},{step:'Withholding setting',desc:'Toggle 3.3% withholding tax deduction.'},{step:'View net amount',desc:'Check and copy final net receivable amount.'}]}
        whyUse={lang==='ko'?[{title:'부가세 자동 계산',desc:'부가세 포함/미포함 전환으로 견적 금액을 즉시 계산합니다.'},{title:'원천징수 자동 공제',desc:'프리랜서 원천징수 3.3%를 자동으로 계산해 실수령액을 보여줍니다.'},{title:'다중 항목 지원',desc:'여러 작업 항목을 추가해 복잡한 견적도 쉽게 계산합니다.'},{title:'금액 복사',desc:'각 금액을 클릭 한 번으로 복사할 수 있습니다.'}]:[{title:'Auto VAT calculation',desc:'Instantly calculates quote with or without 10% VAT.'},{title:'Withholding tax',desc:'Auto-calculates 3.3% withholding to show net receivable.'},{title:'Multiple line items',desc:'Add multiple work items for complex quotes.'},{title:'Amount copy',desc:'Copy any amount with a single click.'}]}
        faqs={lang==='ko'?[{q:'원천징수 3.3%란?',a:'사업소득에 대해 사업주가 원천징수하는 세금입니다. 소득세 3% + 지방소득세 0.3% = 3.3%. 종합소득세 신고 시 기납부세액으로 처리됩니다.'},{q:'부가세는 언제 포함시키나요?',a:'일반과세사업자는 부가세를 별도로 청구합니다. 면세사업자나 간이과세자는 부가세를 청구하지 않습니다.'},{q:'견적서와 청구서 차이는?',a:'견적서는 작업 시작 전 예상 금액 안내, 청구서는 작업 완료 후 대금 청구 문서입니다. 금액은 동일하게 사용하는 경우가 많습니다.'},{q:'프리랜서도 세금계산서 발급이 가능한가요?',a:'사업자등록을 한 프리랜서(개인사업자)는 세금계산서 발급이 가능합니다. 미등록 프리랜서는 거래명세서나 청구서를 사용합니다.'}]:[{q:'What is 3.3% withholding?',a:'Tax withheld by businesses on freelance income. 3% income tax + 0.3% local tax = 3.3%. Applied as prepaid tax in annual filing.'},{q:'When to include VAT?',a:'General taxpayers charge VAT separately. Tax-exempt and simplified taxpayers do not charge VAT.'},{q:'Quote vs invoice?',a:'Quote is an upfront estimate before work begins. Invoice is a payment request after completion. Amounts are often the same.'},{q:'Can freelancers issue tax invoices?',a:'Freelancers registered as sole proprietors can issue tax invoices. Unregistered freelancers use transaction statements or invoices.'}]}
        keywords="프리랜서 견적서 계산기 · 원천징수 계산 · 부가세 견적 · 프리랜서 실수령액 · 견적서 만들기 · freelancer invoice calculator · withholding tax calculator · freelance quote"
      />
    </div>
  )
}
