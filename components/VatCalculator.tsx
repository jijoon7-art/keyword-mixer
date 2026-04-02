
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '부가세 계산기', desc: '공급가액·부가세·합계금액을 즉시 계산. 세금계산서 발행에 필요한 금액을 역산 지원.' },
  en: { title: 'VAT Calculator', desc: 'Calculate supply price, VAT, and total amount instantly. Reverse calculation from total price supported.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function VatCalculator() {
  const { lang } = useLang()
  const tx = T[lang]
  const [mode, setMode] = useState<'add'|'extract'>('add')
  const [amount, setAmount] = useState(1000000)
  const [rate, setRate] = useState(10)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  const vat = mode === 'add'
    ? Math.round(amount * rate / 100)
    : Math.round(amount - amount / (1 + rate / 100))
  const supply = mode === 'add' ? amount : Math.round(amount / (1 + rate / 100))
  const total = mode === 'add' ? amount + vat : amount

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5">
        {[['add', lang==='ko'?'부가세 추가 (공급가 → 합계)':'Add VAT (Supply → Total)'],
          ['extract', lang==='ko'?'부가세 역산 (합계 → 공급가)':'Extract VAT (Total → Supply)']].map(([v,l]) => (
          <button key={v} onClick={() => setMode(v as 'add'|'extract')} className={`flex-1 py-2.5 text-xs font-medium transition-all ${mode===v?'bg-brand-500 text-white font-bold':'bg-[#1a1d27] text-slate-300'}`}>{l}</button>
        ))}
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">{mode==='add'?(lang==='ko'?'공급가액 (원)':'Supply Price (₩)'):(lang==='ko'?'합계금액 (원)':'Total Price (₩)')}</label>
            <input type="number" value={amount} step={10000} onChange={e => setAmount(+e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-xl px-4 py-3 text-slate-200 text-2xl font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">{lang==='ko'?'세율 (%)':'VAT Rate (%)'}</label>
            <div className="flex flex-col gap-1">
              {[10, 0].map(r => (
                <button key={r} onClick={() => setRate(r)} className={`py-1.5 rounded-lg border text-xs font-bold transition-all ${rate===r?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
                  {r}% {r===0?(lang==='ko'?'(면세)':'(Exempt)'):''}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[100000,500000,1000000,3000000,5000000,10000000].map(v => (
            <button key={v} onClick={() => setAmount(v)} className={`text-xs px-2.5 py-1 rounded border transition-all ${amount===v?'bg-brand-500 border-brand-500 text-white':'border-surface-border text-slate-400 bg-[#0f1117]'}`}>
              {v>=10000000?`${v/10000000}천만`:`${v/10000}만`}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-5 mb-4">
        <div className="flex flex-col gap-3">{[
          {label:lang==='ko'?'공급가액':'Supply Price', val:`₩${comma(supply)}`, key:'s', large:false},
          {label:lang==='ko'?`부가세 (${rate}%)`:`VAT (${rate}%)`, val:`₩${comma(vat)}`, key:'v', large:false},
          {label:lang==='ko'?'합계금액 (세금계산서)':'Total Amount', val:`₩${comma(total)}`, key:'t', large:true},
        ].map(r => (
          <div key={r.key} className={`flex justify-between items-center ${r.large?'pt-2 border-t border-brand-500/30':''}`}>
            <span className={`text-sm ${r.large?'font-bold text-slate-200':'text-slate-400'}`}>{r.label}</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold ${r.large?'text-2xl text-brand-400':'text-base text-slate-200'}`}>{r.val}</span>
              <button onClick={() => copy(String(r.key==='s'?supply:r.key==='v'?vat:total), r.key)} className={`p-1.5 rounded border transition-all ${copied===r.key?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-500 hover:text-brand-400'}`}>
                {copied===r.key?<CheckCheck size={12}/>:<Copy size={12}/>}
              </button>
            </div>
          </div>
        ))}</div>
      </div>
      <ToolFooter
        toolName={lang==='ko'?'부가세 계산기':'VAT Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/vat-calculator"
        description={tx.desc}
        howToUse={lang==='ko'?[{step:'모드 선택', desc:'부가세 추가 또는 역산 중 선택하세요.'},{step:'금액 입력', desc:'공급가액 또는 합계금액을 입력하세요.'},{step:'세율 선택', desc:'10% 또는 0% (면세)를 선택하세요.'},{step:'결과 확인', desc:'공급가액·부가세·합계가 자동 계산됩니다.'}]:[{step:'Select mode',desc:'Choose add VAT or extract VAT.'},{step:'Enter amount',desc:'Input supply price or total amount.'},{step:'Select rate',desc:'Choose 10% or 0% (exempt).'},{step:'View results',desc:'Supply price, VAT, and total auto-calculated.'}]}
        whyUse={lang==='ko'?[{title:'정방향·역방향 계산',desc:'공급가→합계, 합계→공급가 양방향 계산을 지원합니다.'},{title:'세금계산서 활용',desc:'세금계산서 발행 시 필요한 공급가액·세액·합계를 정확히 계산합니다.'},{title:'면세 지원',desc:'0% 면세 상품의 경우도 계산 가능합니다.'},{title:'1클릭 복사',desc:'공급가·부가세·합계를 각각 개별 복사할 수 있습니다.'}]:[{title:'Two-way calculation',desc:'Supports adding VAT to supply price and extracting from total.'},{title:'Tax invoice use',desc:'Accurately calculates supply, tax, and total for tax invoices.'},{title:'Exempt support',desc:'Handles 0% VAT-exempt products too.'},{title:'One-click copy',desc:'Copy supply, VAT, and total individually.'}]}
        faqs={lang==='ko'?[{q:'부가세율 10%가 기본인 이유는?',a:'대한민국 표준 부가가치세율은 10%입니다. 일부 품목(식료품, 의료서비스 등)은 면세 0%가 적용됩니다.'},{q:'역산이란?',a:'합계금액(VAT 포함)에서 공급가액과 부가세를 분리하는 계산입니다. 예: 110만원(합계) = 100만원(공급가) + 10만원(부가세).'},{q:'세금계산서 발행 기준은?',a:'사업자 간 거래에서 공급가액 1만원 이상 시 세금계산서 발행 의무가 있습니다. 간이과세자는 영수증으로 대체 가능합니다.'},{q:'간이과세자 세율은?',a:'간이과세자는 업종별로 1.5%~4%의 부가가치율이 적용됩니다. 이 계산기는 일반과세자 기준 10%입니다.'}]:[{q:'Why is 10% the default?',a:'Korea standard VAT rate is 10%. Some items (food, medical services) are exempt at 0%.'},{q:'What is reverse calculation?',a:'Separates supply price and VAT from a total (VAT-inclusive) amount. E.g., ₩1.1M total = ₩1M supply + ₩100K VAT.'},{q:'When must I issue a tax invoice?',a:'Required for B2B transactions over ₩10,000 supply value. Simple taxpayers may use receipts instead.'},{q:'Simplified taxpayer rate?',a:'Simplified taxpayers use industry-specific rates of 1.5-4%. This calculator uses standard 10%.'}]}
        keywords="부가세 계산기 · 부가가치세 계산 · VAT 계산기 · 세금계산서 금액 계산 · 공급가액 계산 · 부가세 역산 · VAT calculator · Korean VAT · tax invoice calculator"
      />
    </div>
  )
}
