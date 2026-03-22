'use client'
import { useState, useRef } from 'react'
import { Copy, CheckCheck, Download, Plus, Trash2 } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '급여명세서 생성기',
    desc: '급여명세서를 무료로 즉시 생성. 4대보험·소득세 자동계산, 인쇄/복사 지원.',
    company: '회사명', employee: '직원명', dept: '부서', position: '직급',
    period: '급여 기간', payDate: '지급일', baseSalary: '기본급',
    allowances: '수당', deductions: '공제', name: '항목명', amount: '금액',
    addItem: '항목 추가', generate: '명세서 생성', print: '인쇄',
    copyText: '텍스트 복사', grossPay: '지급 합계', totalDeduct: '공제 합계', netPay: '실지급액',
    autoCalc: '4대보험 자동계산', autoCalcDesc: '기본급 기준으로 4대보험·소득세 자동 계산',
  },
  en: {
    title: 'Pay Slip Generator',
    desc: 'Generate pay slips instantly for free. Auto-calculates social insurance and income tax.',
    company: 'Company', employee: 'Employee', dept: 'Department', position: 'Position',
    period: 'Pay Period', payDate: 'Pay Date', baseSalary: 'Base Salary',
    allowances: 'Allowances', deductions: 'Deductions', name: 'Item', amount: 'Amount',
    addItem: 'Add Item', generate: 'Generate', print: 'Print',
    copyText: 'Copy Text', grossPay: 'Gross Pay', totalDeduct: 'Total Deductions', netPay: 'Net Pay',
    autoCalc: 'Auto Social Insurance', autoCalcDesc: 'Auto-calculate social insurance & income tax',
  }
}

interface LineItem { name: string; amount: number }

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function PayslipGenerator() {
  const { lang } = useLang()
  const tx = T[lang]
  const printRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [autoCalc, setAutoCalc] = useState(true)

  const [info, setInfo] = useState({
    company: lang === 'ko' ? '(주)키워드믹서' : 'Keyword Mixer Inc.',
    employee: lang === 'ko' ? '홍길동' : 'John Doe',
    dept: lang === 'ko' ? '개발팀' : 'Development',
    position: lang === 'ko' ? '대리' : 'Associate',
    period: new Date().toISOString().slice(0, 7),
    payDate: new Date().toISOString().slice(0, 10),
    baseSalary: 3000000,
  })

  const [allowances, setAllowances] = useState<LineItem[]>([
    { name: lang === 'ko' ? '식대' : 'Meal Allowance', amount: 200000 },
    { name: lang === 'ko' ? '교통비' : 'Transportation', amount: 100000 },
  ])

  const [customDeductions, setCustomDeductions] = useState<LineItem[]>([])

  const setField = (k: string, v: string | number) => setInfo(p => ({ ...p, [k]: v }))

  const grossPay = info.baseSalary + allowances.reduce((s, a) => s + a.amount, 0)

  // 4대보험 자동계산 (기본급 기준)
  const autoDeductions: LineItem[] = autoCalc ? [
    { name: lang === 'ko' ? '국민연금 (4.5%)' : 'National Pension (4.5%)', amount: Math.round(info.baseSalary * 0.045) },
    { name: lang === 'ko' ? '건강보험 (3.545%)' : 'Health Insurance (3.545%)', amount: Math.round(info.baseSalary * 0.03545) },
    { name: lang === 'ko' ? '장기요양보험' : 'Long-term Care', amount: Math.round(info.baseSalary * 0.03545 * 0.1295) },
    { name: lang === 'ko' ? '고용보험 (0.9%)' : 'Employment Insurance (0.9%)', amount: Math.round(info.baseSalary * 0.009) },
    { name: lang === 'ko' ? '소득세 (간이세액)' : 'Income Tax (est.)', amount: Math.round(info.baseSalary * 0.02) },
    { name: lang === 'ko' ? '지방소득세' : 'Local Tax', amount: Math.round(info.baseSalary * 0.002) },
  ] : []

  const allDeductions = [...autoDeductions, ...customDeductions]
  const totalDeductions = allDeductions.reduce((s, d) => s + d.amount, 0)
  const netPay = grossPay - totalDeductions

  const addAllowance = () => setAllowances(p => [...p, { name: '', amount: 0 }])
  const removeAllowance = (i: number) => setAllowances(p => p.filter((_, j) => j !== i))
  const updateAllowance = (i: number, k: keyof LineItem, v: string | number) =>
    setAllowances(p => p.map((a, j) => j === i ? { ...a, [k]: v } : a))

  const addDeduction = () => setCustomDeductions(p => [...p, { name: '', amount: 0 }])
  const removeDeduction = (i: number) => setCustomDeductions(p => p.filter((_, j) => j !== i))
  const updateDeduction = (i: number, k: keyof LineItem, v: string | number) =>
    setCustomDeductions(p => p.map((d, j) => j === i ? { ...d, [k]: v } : d))

  const handlePrint = () => {
    const content = printRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>급여명세서</title>
      <style>
        body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; color: #000; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; font-size: 13px; }
        th { background: #f5f5f5; text-align: left; }
        .title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 16px; }
        .net { font-size: 18px; font-weight: bold; color: #16a34a; }
        @media print { button { display: none; } }
      </style></head>
      <body>${content}<br><button onclick="window.print()">🖨️ 인쇄</button></body></html>
    `)
    win.document.close()
  }

  const copyText = async () => {
    const lines = [
      `=== 급여명세서 ===`,
      `회사: ${info.company} | 직원: ${info.employee} (${info.dept} ${info.position})`,
      `급여기간: ${info.period} | 지급일: ${info.payDate}`,
      ``,
      `[지급 항목]`,
      `기본급: ₩${comma(info.baseSalary)}`,
      ...allowances.map(a => `${a.name}: ₩${comma(a.amount)}`),
      `지급합계: ₩${comma(grossPay)}`,
      ``,
      `[공제 항목]`,
      ...allDeductions.map(d => `${d.name}: ₩${comma(d.amount)}`),
      `공제합계: ₩${comma(totalDeductions)}`,
      ``,
      `실지급액: ₩${comma(netPay)}`,
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

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* 기본 정보 입력 */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
          <p className="text-xs text-slate-400 font-medium mb-3">{lang === 'ko' ? '기본 정보' : 'Basic Info'}</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'company', label: tx.company },
              { key: 'employee', label: tx.employee },
              { key: 'dept', label: tx.dept },
              { key: 'position', label: tx.position },
              { key: 'period', label: tx.period, type: 'month' },
              { key: 'payDate', label: tx.payDate, type: 'date' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                <input type={f.type ?? 'text'} value={(info as any)[f.key]} onChange={e => setField(f.key, e.target.value)}
                  className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs text-slate-500 mb-1 block">{tx.baseSalary}</label>
            <input type="number" value={info.baseSalary} onChange={e => setField('baseSalary', +e.target.value)}
              className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
          </div>
        </div>

        {/* 수당/공제 */}
        <div className="flex flex-col gap-3">
          {/* 수당 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{tx.allowances}</p>
            {allowances.map((a, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={a.name} onChange={e => updateAllowance(i, 'name', e.target.value)} placeholder={tx.name}
                  className="flex-1 bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
                <input type="number" value={a.amount} onChange={e => updateAllowance(i, 'amount', +e.target.value)}
                  className="w-28 bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
                <button onClick={() => removeAllowance(i)} className="text-slate-600 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
              </div>
            ))}
            <button onClick={addAllowance} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-1 transition-all">
              <Plus size={12} /> {tx.addItem}
            </button>
          </div>

          {/* 자동 4대보험 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <div onClick={() => setAutoCalc(!autoCalc)} className={`w-9 h-5 rounded-full relative transition-all ${autoCalc ? 'bg-brand-500' : 'bg-surface-border'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${autoCalc ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="text-xs text-slate-200 font-medium">{tx.autoCalc}</span>
            </label>
            <p className="text-xs text-slate-500">{tx.autoCalcDesc}</p>
          </div>

          {/* 추가 공제 */}
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">{lang === 'ko' ? '추가 공제' : 'Additional Deductions'}</p>
            {customDeductions.map((d, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={d.name} onChange={e => updateDeduction(i, 'name', e.target.value)} placeholder={tx.name}
                  className="flex-1 bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500/50 transition-all" />
                <input type="number" value={d.amount} onChange={e => updateDeduction(i, 'amount', +e.target.value)}
                  className="w-28 bg-[#0f1117] border border-surface-border rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
                <button onClick={() => removeDeduction(i)} className="text-slate-600 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
              </div>
            ))}
            <button onClick={addDeduction} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 mt-1 transition-all">
              <Plus size={12} /> {tx.addItem}
            </button>
          </div>
        </div>
      </div>

      {/* 미리보기 */}
      <div ref={printRef} className="rounded-xl border border-surface-border bg-white text-gray-900 p-6 mb-4">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">{lang === 'ko' ? '급 여 명 세 서' : 'PAY SLIP'}</h2>
        <div className="grid grid-cols-2 gap-1 text-xs mb-4">
          {[
            [tx.company, info.company], [tx.employee, info.employee],
            [tx.dept, info.dept], [tx.position, info.position],
            [tx.period, info.period], [tx.payDate, info.payDate],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2 border-b border-gray-200 pb-1">
              <span className="text-gray-500 w-20 flex-shrink-0">{k}</span>
              <span className="font-medium text-gray-800">{v}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-bold text-gray-700 mb-2 border-b border-gray-300 pb-1">{lang === 'ko' ? '지급 내역' : 'Earnings'}</p>
            <div className="flex justify-between mb-1"><span>{tx.baseSalary}</span><span className="font-mono">₩{comma(info.baseSalary)}</span></div>
            {allowances.map((a, i) => <div key={i} className="flex justify-between mb-1"><span>{a.name}</span><span className="font-mono">₩{comma(a.amount)}</span></div>)}
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1 mt-1">
              <span>{tx.grossPay}</span><span className="font-mono text-green-700">₩{comma(grossPay)}</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-700 mb-2 border-b border-gray-300 pb-1">{lang === 'ko' ? '공제 내역' : 'Deductions'}</p>
            {allDeductions.map((d, i) => <div key={i} className="flex justify-between mb-1"><span>{d.name}</span><span className="font-mono">₩{comma(d.amount)}</span></div>)}
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1 mt-1">
              <span>{tx.totalDeduct}</span><span className="font-mono text-red-600">₩{comma(totalDeductions)}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg flex justify-between items-center">
          <span className="font-bold text-gray-700">{tx.netPay}</span>
          <span className="text-2xl font-extrabold text-green-700">₩{comma(netPay)}</span>
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
        toolName={lang === 'ko' ? '급여명세서 생성기' : 'Pay Slip Generator'}
        toolUrl="https://keyword-mixer.vercel.app/payslip-generator"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '기본 정보 입력', desc: '회사명, 직원명, 부서, 직급, 급여기간을 입력하세요.' },
          { step: '기본급 입력', desc: '기본급을 입력하면 4대보험이 자동으로 계산됩니다.' },
          { step: '수당 추가', desc: '식대, 교통비 등 추가 수당을 입력하세요.' },
          { step: '인쇄 또는 복사', desc: '인쇄 버튼으로 출력하거나 텍스트로 복사해 활용하세요.' },
        ] : [
          { step: 'Enter basic info', desc: 'Fill in company, employee, department, position, and period.' },
          { step: 'Enter base salary', desc: 'Social insurance is auto-calculated from base salary.' },
          { step: 'Add allowances', desc: 'Add meal, transportation, or other allowances.' },
          { step: 'Print or copy', desc: 'Print the pay slip or copy as text.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '4대보험 자동 계산', desc: '기본급 입력 시 국민연금·건강보험·고용보험·소득세를 자동으로 계산합니다.' },
          { title: '인쇄 바로 가능', desc: '생성된 명세서를 인쇄하거나 PDF로 저장할 수 있습니다.' },
          { title: '항목 자유 추가', desc: '수당과 공제 항목을 자유롭게 추가/삭제할 수 있습니다.' },
          { title: '텍스트 복사', desc: '명세서 전체 내용을 텍스트로 복사해 이메일 등에 활용하세요.' },
        ] : [
          { title: 'Auto social insurance', desc: 'Pension, health, employment insurance auto-calculated from salary.' },
          { title: 'Print ready', desc: 'Print the generated pay slip or save as PDF.' },
          { title: 'Flexible items', desc: 'Add or remove allowances and deductions freely.' },
          { title: 'Text copy', desc: 'Copy full pay slip as text for emails or records.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '급여명세서 발급이 의무인가요?', a: '근로기준법 제48조에 따라 임금을 지급할 때 임금명세서를 교부하는 것이 의무입니다 (2021년 11월부터). 위반 시 500만원 이하 과태료가 부과될 수 있습니다.' },
          { q: '4대보험 요율이 정확한가요?', a: '2024년 기준 요율을 적용했습니다. 정확한 납부액은 4대사회보험포털(www.4insure.or.kr)에서 확인하세요.' },
          { q: '소득세 간이세액이란?', a: '국세청 간이세액표를 기반으로 한 월 원천징수 세액입니다. 연말정산에서 정확한 세액으로 정산됩니다.' },
          { q: '급여명세서에 반드시 포함되어야 할 항목은?', a: '성명, 임금 지급일, 임금 총액, 세부 항목별 금액, 공제 항목과 금액이 필수입니다.' },
        ] : [
          { q: 'Is issuing a pay slip mandatory?', a: 'Yes, per Korean Labor Standards Act Article 48, employers must provide pay slips since November 2021. Violation can result in fines up to ₩5M.' },
          { q: 'Are insurance rates accurate?', a: '2024 rates applied. Verify exact amounts at the Social Insurance Portal (www.4insure.or.kr).' },
          { q: 'What is simplified income tax?', a: 'Monthly withholding based on NTS simplified tax table. Final amount settled during year-end tax adjustment.' },
          { q: 'What must be included in a pay slip?', a: 'Name, payment date, total pay, itemized amounts, deductions and their amounts are required.' },
        ]}
        keywords="급여명세서 생성기 · 월급명세서 · 급여명세서 양식 · 임금명세서 · 급여명세서 만들기 · pay slip generator · payslip maker · salary slip · 4대보험 계산 · 급여명세서 발급"
      />
    </div>
  )
}
