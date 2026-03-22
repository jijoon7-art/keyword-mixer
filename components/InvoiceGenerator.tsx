'use client'
import { useState, useRef } from 'react'
import { Copy, CheckCheck, Download, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '견적서 / 영수증 생성기',
    desc: '견적서·영수증·세금계산서를 무료로 즉시 생성. 부가세 자동계산, 인쇄/복사 지원.',
    tabs: ['견적서', '영수증'],
    from: '발급자', to: '수신자', docNo: '문서번호', date: '날짜',
    item: '품목', qty: '수량', unitPrice: '단가', subtotal: '금액',
    addItem: '품목 추가', memo: '비고',
    subtotalLabel: '공급가액', vatLabel: '부가세 (10%)', totalLabel: '합계',
    includeVat: '부가세 포함', print: '인쇄/저장', copyText: '텍스트 복사',
    validUntil: '유효기간',
  },
  en: {
    title: 'Quote / Receipt Generator',
    desc: 'Generate quotes and receipts instantly for free. Auto VAT calculation, print and copy support.',
    tabs: ['Quote', 'Receipt'],
    from: 'From', to: 'To', docNo: 'Doc No.', date: 'Date',
    item: 'Item', qty: 'Qty', unitPrice: 'Unit Price', subtotal: 'Amount',
    addItem: 'Add Item', memo: 'Memo',
    subtotalLabel: 'Subtotal', vatLabel: 'VAT (10%)', totalLabel: 'Total',
    includeVat: 'Include VAT', print: 'Print/Save', copyText: 'Copy Text',
    validUntil: 'Valid Until',
  }
}

interface Item { name: string; qty: number; unitPrice: number }
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function InvoiceGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const printRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState(0)
  const [includeVat, setIncludeVat] = useState(true)
  const [copied, setCopied] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const [info, setInfo] = useState({
    from: lang === 'ko' ? '(주)키워드믹서' : 'Keyword Mixer Inc.',
    fromDetail: lang === 'ko' ? '서울시 강남구 | TEL: 02-1234-5678' : 'Seoul, Korea | TEL: 02-1234-5678',
    to: lang === 'ko' ? '거래처명' : 'Client Name',
    toDetail: '',
    docNo: `${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}001`,
    date: today,
    validUntil: new Date(Date.now() + 30*86400000).toISOString().slice(0,10),
    memo: '',
  })
  const [items, setItems] = useState<Item[]>([
    { name: lang === 'ko' ? '웹 개발 서비스' : 'Web Development', qty: 1, unitPrice: 1000000 },
    { name: lang === 'ko' ? '유지보수' : 'Maintenance', qty: 3, unitPrice: 200000 },
  ])

  const setField = (k: string, v: string) => setInfo(p => ({ ...p, [k]: v }))
  const addItem = () => setItems(p => [...p, { name: '', qty: 1, unitPrice: 0 }])
  const removeItem = (i: number) => setItems(p => p.filter((_, j) => j !== i))
  const updateItem = (i: number, k: keyof Item, v: string | number) =>
    setItems(p => p.map((item, j) => j === i ? { ...item, [k]: v } : item))

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const vat = includeVat ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + vat

  const docTitle = tab === 0
    ? (lang === 'ko' ? '견 적 서' : 'QUOTATION')
    : (lang === 'ko' ? '영 수 증' : 'RECEIPT')

  const handlePrint = () => {
    const content = printRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>${docTitle}</title>
      <style>
        body{font-family:'Malgun Gothic',sans-serif;padding:24px;color:#000;max-width:700px;margin:0 auto}
        table{width:100%;border-collapse:collapse;margin:8px 0;font-size:13px}
        th,td{border:1px solid #999;padding:7px 10px}
        th{background:#f0f0f0;text-align:left}
        .right{text-align:right}.center{text-align:center}
        .title{text-align:center;font-size:22px;font-weight:bold;margin:0 0 16px;border-bottom:2px solid #000;padding-bottom:8px}
        .total{font-size:16px;font-weight:bold;color:#16a34a}
        @media print{button{display:none}}
      </style></head>
      <body>${content}<br><button onclick="window.print()">🖨 인쇄</button></body></html>
    `)
    win.document.close()
  }

  const copyText = async () => {
    const lines = [
      `=== ${docTitle} ===`,
      `문서번호: ${info.docNo} | 날짜: ${info.date}`,
      `발급: ${info.from} | 수신: ${info.to}`,
      ``,
      `[품목]`,
      ...items.map(i => `${i.name} × ${i.qty} × ₩${comma(i.unitPrice)} = ₩${comma(i.qty * i.unitPrice)}`),
      ``,
      `공급가액: ₩${comma(subtotal)}`,
      ...(includeVat ? [`부가세: ₩${comma(vat)}`] : []),
      `합계: ₩${comma(total)}`,
      ...(info.memo ? [`비고: ${info.memo}`] : []),
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="flex rounded-xl border border-surface-border overflow-hidden mb-5 w-48">
        {tx.tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex-1 py-2 text-sm font-medium transition-all ${tab === i ? 'bg-brand-500 text-white font-bold' : 'bg-[#1a1d27] text-slate-300'}`}>{t}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-5 gap-5 mb-5">
        {/* 입력 폼 */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '문서 정보' : 'Document Info'}</p>
            {[
              { key: 'from', label: tx.from }, { key: 'fromDetail', label: lang === 'ko' ? '발급자 상세' : 'From Detail' },
              { key: 'to', label: tx.to }, { key: 'toDetail', label: lang === 'ko' ? '수신자 상세' : 'To Detail' },
              { key: 'docNo', label: tx.docNo }, { key: 'date', label: tx.date, type: 'date' },
              ...(tab === 0 ? [{ key: 'validUntil', label: tx.validUntil, type: 'date' }] : []),
            ].map(f => (
              <div key={f.key} className="mb-2">
                <label className="text-xs text-slate-500 mb-0.5 block">{f.label}</label>
                <input type={f.type ?? 'text'} value={(info as any)[f.key] ?? ''} onChange={e => setField(f.key, e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '옵션' : 'Options'}</p>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <div onClick={() => setIncludeVat(!includeVat)} className={`w-9 h-5 rounded-full relative transition-all ${includeVat ? 'bg-brand-500' : 'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${includeVat ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-xs text-slate-200">{tx.includeVat}</span>
            </label>
            <div>
              <label className="text-xs text-slate-500 mb-0.5 block">{tx.memo}</label>
              <textarea value={info.memo} onChange={e => setField('memo', e.target.value)} rows={2}
                className="w-full bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 resize-none transition-all" />
            </div>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="md:col-span-3">
          <div ref={printRef} className="rounded-xl border border-gray-300 bg-white text-gray-900 p-5 text-xs">
            <p className="text-center text-xl font-bold border-b-2 border-gray-800 pb-2 mb-4">{docTitle}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-xs">
              {[
                [tx.docNo, info.docNo], [tx.date, info.date],
                [tx.from, `${info.from} ${info.fromDetail}`],
                [tx.to, `${info.to} ${info.toDetail}`],
                ...(tab === 0 ? [[tx.validUntil, info.validUntil]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 border-b border-gray-200 pb-0.5">
                  <span className="text-gray-500 w-16 flex-shrink-0">{k}</span>
                  <span className="text-gray-800 font-medium">{v}</span>
                </div>
              ))}
            </div>
            <table className="w-full border-collapse text-xs mb-3">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1.5 text-left">{tx.item}</th>
                  <th className="border border-gray-300 px-2 py-1.5 text-right w-12">{tx.qty}</th>
                  <th className="border border-gray-300 px-2 py-1.5 text-right w-24">{tx.unitPrice}</th>
                  <th className="border border-gray-300 px-2 py-1.5 text-right w-24">{tx.subtotal}</th>
                  <th className="border border-gray-300 px-1 py-1.5 w-6 no-print"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-2 py-1">
                      <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder={tx.item}
                        className="w-full bg-transparent text-gray-800 focus:outline-none text-xs" />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', +e.target.value)}
                        className="w-full bg-transparent text-gray-800 focus:outline-none text-xs text-right" />
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input type="number" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', +e.target.value)}
                        className="w-full bg-transparent text-gray-800 focus:outline-none text-xs text-right" />
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-right font-mono">{comma(item.qty * item.unitPrice)}</td>
                    <td className="border-0 px-1 py-1 no-print">
                      <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={11} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="text-xs text-blue-600 hover:text-blue-800 mb-3 no-print flex items-center gap-1">
              <Plus size={11} /> {tx.addItem}
            </button>
            <div className="flex flex-col items-end gap-1 text-xs border-t border-gray-300 pt-2">
              <div className="flex gap-8"><span className="text-gray-600">{tx.subtotalLabel}</span><span className="font-mono w-24 text-right">₩{comma(subtotal)}</span></div>
              {includeVat && <div className="flex gap-8"><span className="text-gray-600">{tx.vatLabel}</span><span className="font-mono w-24 text-right">₩{comma(vat)}</span></div>}
              <div className="flex gap-8 font-bold text-sm border-t border-gray-400 pt-1 mt-1">
                <span>{tx.totalLabel}</span><span className="font-mono w-24 text-right text-green-700">₩{comma(total)}</span>
              </div>
            </div>
            {info.memo && <p className="text-xs text-gray-600 mt-3 border-t border-gray-200 pt-2">{tx.memo}: {info.memo}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handlePrint} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
          <Download size={15} /> {tx.print}
        </button>
        <button onClick={copyText} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${copied ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40 bg-[#1a1d27]'}`}>
          {copied ? <CheckCheck size={15} /> : <Copy size={15} />} {copied ? (lang === 'ko' ? '복사됨!' : 'Copied!') : tx.copyText}
        </button>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '견적서/영수증 생성기' : 'Quote/Receipt Generator'}
        toolUrl="https://keyword-mixer.vercel.app/invoice-generator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '문서 유형 선택', desc: '견적서 또는 영수증 탭을 선택하세요.' },
          { step: '기본 정보 입력', desc: '발급자, 수신자, 날짜를 입력하세요.' },
          { step: '품목 입력', desc: '미리보기 표에서 직접 품목명, 수량, 단가를 입력하세요.' },
          { step: '인쇄 또는 복사', desc: '인쇄 버튼으로 PDF 저장하거나 텍스트로 복사하세요.' },
        ] : [
          { step: 'Select document type', desc: 'Choose Quote or Receipt tab.' },
          { step: 'Enter basic info', desc: 'Fill in from, to, and date fields.' },
          { step: 'Add items', desc: 'Enter item names, quantities, and unit prices directly in the preview table.' },
          { step: 'Print or copy', desc: 'Print/save as PDF or copy as text.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '실시간 편집 가능', desc: '미리보기에서 직접 품목을 수정할 수 있어 즉각적인 확인이 가능합니다.' },
          { title: '부가세 자동 계산', desc: '부가세 포함 여부 선택 시 10% VAT를 자동으로 계산합니다.' },
          { title: '인쇄 최적화', desc: '인쇄 시 편집 버튼이 사라지는 깔끔한 출력 형식을 제공합니다.' },
          { title: '견적서·영수증 통합', desc: '하나의 도구에서 견적서와 영수증을 모두 만들 수 있습니다.' },
        ] : [
          { title: 'Live editing', desc: 'Edit items directly in the preview for instant visual feedback.' },
          { title: 'Auto VAT calculation', desc: 'Toggle VAT inclusion to auto-calculate 10% tax.' },
          { title: 'Print optimized', desc: 'Edit buttons hide automatically when printing.' },
          { title: 'Quote & receipt unified', desc: 'Create both quotes and receipts from one tool.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '견적서와 영수증의 차이는?', a: '견적서는 제공할 서비스/상품의 예상 금액을 미리 알려주는 문서입니다. 영수증은 실제 거래가 완료된 후 발급하는 증빙 문서입니다.' },
          { q: '세금계산서와 일반 영수증의 차이는?', a: '세금계산서는 부가세 납부 의무 사업자가 발급하는 공식 세금 증빙입니다. 일반 영수증은 간이과세자나 소비자에게 발급하는 간소화된 증빙입니다.' },
          { q: '견적서 유효기간을 넣어야 하나요?', a: '법적 의무는 아니지만 재료비·인건비 변동에 대비해 유효기간(보통 30일)을 명시하는 것이 좋습니다.' },
          { q: 'PDF로 저장하는 방법은?', a: '인쇄/저장 버튼 클릭 후 인쇄 다이얼로그에서 프린터 대신 "PDF로 저장"을 선택하면 PDF 파일로 저장됩니다.' },
        ] : [
          { q: 'Difference between quote and receipt?', a: 'A quote shows the estimated cost before work begins. A receipt is proof of completed payment/transaction.' },
          { q: 'Tax invoice vs regular receipt?', a: 'Tax invoices are official VAT documents for registered businesses. Regular receipts are simplified documents for consumers.' },
          { q: 'Should I add an expiry date to quotes?', a: 'Not legally required but recommended (usually 30 days) to account for material and labor cost changes.' },
          { q: 'How to save as PDF?', a: 'Click Print/Save, then in the print dialog select "Save as PDF" instead of a printer.' },
        ]}
        keywords="견적서 생성기 · 영수증 생성기 · 견적서 만들기 · 견적서 양식 · 무료 견적서 · 영수증 양식 · quote generator · receipt generator · invoice maker · free invoice template · 세금계산서"
      />
    </div>
  )
}
