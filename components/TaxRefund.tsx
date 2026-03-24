
'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: { title: '연말정산 환급액 계산기', desc: '연봉·공제 항목으로 예상 환급액 또는 추가 납부액을 계산. 세액공제 최적화 가이드 포함.' },
  en: { title: 'Year-End Tax Settlement Calculator', desc: 'Estimate tax refund or additional payment from salary and deductions. Includes tax credit optimization guide.' }
}
function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

const BRACKETS = [
  {limit:14000000,rate:0.06,ded:0},
  {limit:50000000,rate:0.15,ded:1260000},
  {limit:88000000,rate:0.24,ded:5760000},
  {limit:150000000,rate:0.35,ded:15440000},
  {limit:Infinity,rate:0.38,ded:19940000},
]
function calcIncomeTax(income: number): number {
  for (const b of BRACKETS) {
    if (income <= b.limit) return Math.max(0, income * b.rate - b.ded)
  }
  return 0
}

export default function TaxRefund() {
  const { lang } = useLang()
  const tx = T[lang]
  const [salary, setSalary] = useState(50000000)
  const [insurance, setInsurance] = useState(2000000)
  const [education, setEducation] = useState(0)
  const [medical, setMedical] = useState(500000)
  const [donation, setDonation] = useState(0)
  const [pension, setPension] = useState(1800000)
  const [dependents, setDependents] = useState(1)
  const [paid, setPaid] = useState(2500000)
  const [copied, setCopied] = useState<string|null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  // 근로소득공제
  let earnDeduct = 0
  if (salary <= 5000000) earnDeduct = salary * 0.7
  else if (salary <= 15000000) earnDeduct = 3500000 + (salary - 5000000) * 0.4
  else if (salary <= 45000000) earnDeduct = 7500000 + (salary - 15000000) * 0.15
  else if (salary <= 100000000) earnDeduct = 12000000 + (salary - 45000000) * 0.05
  else earnDeduct = 14750000

  // 인적공제
  const personalDeduct = 1500000 * dependents + 1500000
  // 4대보험 공제 (근로자분)
  const socialInsDeduct = Math.round(salary * (0.045 + 0.03545 + 0.009))
  // 연금저축 세액공제
  const pensionCredit = Math.min(pension, 4000000) * 0.15

  const totalDeduct = earnDeduct + personalDeduct + socialInsDeduct + insurance + education + medical + donation
  const taxableIncome = Math.max(0, salary - totalDeduct)
  const calculatedTax = calcIncomeTax(taxableIncome)
  const localTax = Math.round(calculatedTax * 0.1)
  const totalTax = calculatedTax + localTax - pensionCredit
  const refund = paid - Math.max(0, totalTax)
  const isRefund = refund >= 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex flex-col gap-2.5">
          <p className="text-xs text-slate-400 font-medium">{lang==='ko'?'소득 및 납부 정보':'Income & Withholding'}</p>
          {[
            [lang==='ko'?'연간 급여 (원)':'Annual Salary', salary, setSalary, 1000000],
            [lang==='ko'?'부양가족 수 (본인 포함)':'Dependents (incl. self)', dependents, setDependents, 1],
            [lang==='ko'?'기납부 세액 (원)':'Already Paid Tax', paid, setPaid, 100000],
          ].map(([l,v,s,step]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-0.5 block">{l as string}</label>
              <input type="number" value={v as number} step={step as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 flex flex-col gap-2.5">
          <p className="text-xs text-slate-400 font-medium">{lang==='ko'?'세액공제 항목':'Tax Credits & Deductions'}</p>
          {[
            [lang==='ko'?'보험료 납입액':'Insurance Premium', insurance, setInsurance, 100000],
            [lang==='ko'?'교육비 지출':'Education Expense', education, setEducation, 100000],
            [lang==='ko'?'의료비 지출':'Medical Expense', medical, setMedical, 100000],
            [lang==='ko'?'기부금':'Donations', donation, setDonation, 100000],
            [lang==='ko'?'연금저축 납입':'Pension Savings', pension, setPension, 100000],
          ].map(([l,v,s,step]) => (
            <div key={l as string}>
              <label className="text-xs text-slate-400 mb-0.5 block">{l as string}</label>
              <input type="number" value={v as number} step={step as number} onChange={e => (s as Function)(+e.target.value)}
                className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-xl border p-5 mb-4 flex items-center justify-between ${isRefund?'border-brand-500/40 bg-brand-500/10':'border-red-500/40 bg-red-500/10'}`}>
        <div>
          <p className="text-xs text-slate-400">{isRefund?(lang==='ko'?'예상 환급액':'Expected Refund'):(lang==='ko'?'추가 납부 예상':'Expected Additional Payment')}</p>
          <p className={`text-4xl font-extrabold font-mono ${isRefund?'text-brand-400':'text-red-400'}`}>
            {isRefund?'+':'-'}₩{comma(Math.abs(refund))}
          </p>
          <p className="text-xs text-slate-500 mt-1">{lang==='ko'?`산출세액 ₩${comma(Math.max(0,totalTax))} | 기납부 ₩${comma(paid)}`:`Calc tax ₩${comma(Math.max(0,totalTax))} | Paid ₩${comma(paid)}`}</p>
        </div>
        <button onClick={() => copy(String(Math.abs(refund)),'r')} className={`p-2.5 rounded-xl border transition-all ${copied==='r'?'bg-brand-500/20 border-brand-500/40 text-brand-400':'border-surface-border text-slate-400 hover:text-brand-400'}`}>
          {copied==='r'?<CheckCheck size={16}/>:<Copy size={16}/>}
        </button>
      </div>
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">{lang==='ko'?'💡 세금 상세 계산':'💡 Tax Calculation Detail'}</p>
        <div className="flex flex-col gap-1 text-xs">{[
          [lang==='ko'?'과세표준':'Taxable Income', `₩${comma(taxableIncome)}`],
          [lang==='ko'?'산출세액 (소득세)':'Income Tax', `₩${comma(calculatedTax)}`],
          [lang==='ko'?'지방소득세 (10%)':'Local Tax', `₩${comma(localTax)}`],
          [lang==='ko'?'연금저축 세액공제':'Pension Credit', `-₩${comma(Math.round(pensionCredit))}`],
          [lang==='ko'?'결정세액':'Final Tax', `₩${comma(Math.max(0,totalTax))}`],
        ].map(([l,v]) => (
          <div key={l as string} className="flex justify-between py-1 border-b border-surface-border last:border-0">
            <span className="text-slate-400">{l as string}</span>
            <span className="text-slate-200 font-mono">{v as string}</span>
          </div>
        ))}</div>
      </div>
      <ToolFooter
        toolName={lang==='ko'?'연말정산 환급액 계산기':'Year-End Tax Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/tax-refund"
        description={tx.desc}
        howToUse={lang==='ko'?[
          {step:'급여 입력', desc:'연간 총급여를 입력하세요.'},
          {step:'공제 항목 입력', desc:'보험료, 교육비, 의료비, 기부금, 연금저축을 입력하세요.'},
          {step:'기납부 세액 입력', desc:'원천징수로 이미 납부한 세금 총액을 입력하세요.'},
          {step:'환급액 확인', desc:'예상 환급액 또는 추가 납부액이 계산됩니다.'},
        ]:[
          {step:'Enter salary', desc:'Input annual total salary.'},
          {step:'Enter deductions', desc:'Add insurance, education, medical, donations, pension.'},
          {step:'Enter withheld tax', desc:'Input total tax already withheld from payroll.'},
          {step:'View result', desc:'Expected refund or additional payment is calculated.'},
        ]}
        whyUse={lang==='ko'?[
          {title:'근로소득공제 자동 계산', desc:'소득 구간별 근로소득공제를 자동으로 계산합니다.'},
          {title:'연금저축 세액공제', desc:'연금저축 납입액의 15% 세액공제를 자동 반영합니다.'},
          {title:'세금 상세 내역', desc:'과세표준·소득세·지방세·결정세액을 단계별로 표시합니다.'},
          {title:'환급/추가납부 구분', desc:'결과가 환급인지 추가 납부인지 색상으로 명확히 구분합니다.'},
        ]:[
          {title:'Auto employment deduction', desc:'Automatically calculates employment income deduction by bracket.'},
          {title:'Pension savings credit', desc:'Auto-applies 15% tax credit for pension savings contributions.'},
          {title:'Detailed breakdown', desc:'Shows taxable income, income tax, local tax, and final tax step by step.'},
          {title:'Refund vs payment', desc:'Clearly distinguishes refund vs additional payment with color coding.'},
        ]}
        faqs={lang==='ko'?[
          {q:'연말정산 신고 기간은?', a:'매년 1~2월에 회사에서 진행합니다. 2월 급여에 환급액이 지급되거나 추가 납부 금액이 차감됩니다.'},
          {q:'기납부 세액은 어디서 확인하나요?', a:'급여명세서의 소득세 항목을 12개월 합산하면 됩니다. 또는 홈택스에서 근로소득 원천징수 내역을 확인하세요.'},
          {q:'연금저축 최대 혜택은?', a:'연금저축 + IRP 합산 최대 700만원까지 세액공제(15% 또는 12%)를 받을 수 있습니다.'},
          {q:'이 계산기가 정확한가요?', a:'개략적인 추정값입니다. 실제 결정세액은 국세청 홈택스에서 정확히 확인할 수 있습니다.'},
        ]:[
          {q:'When is year-end settlement?', a:'Conducted by employers January-February. Refunds are paid or additional amounts deducted from February salary.'},
          {q:'Where to find withheld tax?', a:'Sum the income tax line from 12 monthly payslips, or check withholding details on NTS Hometax.'},
          {q:'Max pension savings benefit?', a:'Pension savings + IRP combined: up to ₩7M qualifies for 15% or 12% tax credit.'},
          {q:'Is this calculator accurate?', a:'This is an estimate. Get exact figures from NTS Hometax after actual settlement.'},
        ]}
        keywords="연말정산 계산기 · 환급액 계산 · 연말정산 환급 · 세금 환급 · 연금저축 세액공제 · year-end tax settlement · tax refund calculator Korea · 연말정산 환급액"
      />
    </div>
  )
}
