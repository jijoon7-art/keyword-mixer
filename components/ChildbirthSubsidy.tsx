'use client'
import { useState } from 'react'
import { Copy, CheckCheck } from 'lucide-react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'

const T = {
  ko: {
    title: '출산·육아 지원금 계산기',
    desc: '2025년 출산지원금, 아동수당, 부모급여, 육아휴직급여를 한눈에 확인. 내가 받을 수 있는 지원금 총액 계산.',
  },
  en: {
    title: 'Korean Childbirth Subsidy Calculator',
    desc: 'Check 2025 Korean childbirth and childcare subsidies: baby bonus, child allowance, parent pay, parental leave benefits.',
  }
}

interface SubsidyItem { name_ko: string; name_en: string; amount: number; period_ko: string; period_en: string; condition_ko: string; condition_en: string }

const SUBSIDIES_FIRST_CHILD: SubsidyItem[] = [
  { name_ko: '첫만남이용권', name_en: 'Baby Welcome Package', amount: 2000000, period_ko: '출생 시 일시금', period_en: 'One-time at birth', condition_ko: '출생아 1인당 200만원 바우처', condition_en: '₩2M voucher per newborn' },
  { name_ko: '부모급여 (0세)', name_en: 'Parent Pay (Age 0)', amount: 1000000, period_ko: '월 100만원 × 12개월', period_en: '₩1M/month × 12 months', condition_ko: '생후 0~11개월 (2025년 기준)', condition_en: 'Age 0-11 months (2025)' },
  { name_ko: '부모급여 (1세)', name_en: 'Parent Pay (Age 1)', amount: 500000, period_ko: '월 50만원 × 12개월', period_en: '₩500K/month × 12 months', condition_ko: '생후 12~23개월', condition_en: 'Age 12-23 months' },
  { name_ko: '아동수당', name_en: 'Child Allowance', amount: 100000, period_ko: '월 10만원 × 96개월', period_en: '₩100K/month × 8 years', condition_ko: '만 8세 미만 (96개월간)', condition_en: 'Under age 8 (96 months)' },
  { name_ko: '출산지원금 (지자체)', name_en: 'Local Birth Grant', amount: 1000000, period_ko: '지자체별 상이', period_en: 'Varies by municipality', condition_ko: '지역별로 50만원~수백만원까지 다양', condition_en: '₩500K to several million by region' },
]

const SUBSIDIES_SECOND: SubsidyItem[] = [
  { name_ko: '첫만남이용권 (둘째)', name_en: 'Welcome Package (2nd)', amount: 3000000, period_ko: '출생 시 일시금', period_en: 'One-time at birth', condition_ko: '둘째 이후 300만원 바우처', condition_en: '₩3M voucher from 2nd child' },
]

function comma(n: number) { return Math.round(n).toLocaleString('ko-KR') }

export default function ChildbirthSubsidy() {
  const { lang } = useLang()
  const tx = T[lang]
  const [childOrder, setChildOrder] = useState(1)
  const [hasDualIncome, setHasDualIncome] = useState(true)
  const [monthlySalary, setMonthlySalary] = useState(3000000)
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  // 육아휴직급여 계산
  const first3Monthly = Math.min(Math.round(monthlySalary * 0.8), 2500000) // 첫 3개월 80% (최대 250만)
  const rest9Monthly = Math.min(Math.round(monthlySalary * 0.5), 1500000) // 나머지 9개월 50% (최대 150만)
  const totalParentalLeave = first3Monthly * 3 + rest9Monthly * 9

  const baseSubsidies = childOrder === 1 ? SUBSIDIES_FIRST_CHILD : [...SUBSIDIES_SECOND, ...SUBSIDIES_FIRST_CHILD]

  // 총 수령 가능 금액 (부모급여 0세 + 1세 + 아동수당 96개월 + 첫만남이용권)
  const parentPay0 = 1000000 * 12
  const parentPay1 = 500000 * 12
  const childAllowance = 100000 * 96
  const welcomePkg = childOrder === 1 ? 2000000 : 3000000
  const totalGuaranteed = parentPay0 + parentPay1 + childAllowance + welcomePkg

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />2025 Updated
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto">{tx.desc}</p>
      </div>

      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <div className="flex gap-2 mb-3">
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setChildOrder(n)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${childOrder === n ? 'bg-brand-500 border-brand-500 text-white font-bold' : 'border-surface-border text-slate-300 bg-[#0f1117]'}`}>
              {lang === 'ko' ? `${n}째 아이` : `${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'rd'} Child`}
            </button>
          ))}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">{lang === 'ko' ? '육아휴직 전 월 소득 (원)' : 'Monthly Income Before Leave (₩)'}</label>
          <input type="number" value={monthlySalary} step={100000} onChange={e => setMonthlySalary(+e.target.value)}
            className="w-full bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-slate-200 text-base font-mono focus:outline-none focus:border-brand-500/50 transition-all" />
        </div>
      </div>

      {/* 총계 배너 */}
      <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 mb-1">{lang === 'ko' ? '8년간 받을 수 있는 정부 지원금 총액' : 'Total Government Subsidies (8 years)'}</p>
            <p className="text-4xl font-extrabold text-brand-400 font-mono">₩{comma(totalGuaranteed)}</p>
            <p className="text-xs text-slate-500 mt-1">{lang === 'ko' ? '부모급여 + 아동수당 + 첫만남이용권' : 'Parent pay + child allowance + welcome package'}</p>
          </div>
          <button onClick={() => copy(String(totalGuaranteed), 'total')} className={`p-2.5 rounded-xl border transition-all ${copied === 'total' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-400 hover:text-brand-400'}`}>
            {copied === 'total' ? <CheckCheck size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* 지원금 목록 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mb-5">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <p className="text-sm font-semibold text-slate-200">{lang === 'ko' ? '📋 지원금 상세 목록' : '📋 Subsidy Details'}</p>
        </div>
        <div className="divide-y divide-surface-border">
          {baseSubsidies.map((s, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-bold text-slate-200">{lang === 'ko' ? s.name_ko : s.name_en}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-brand-400 font-mono">₩{comma(s.amount)}</p>
                  <button onClick={() => copy(String(s.amount), `s${i}`)} className={`p-1 rounded border transition-all ${copied === `s${i}` ? 'text-brand-400 border-brand-500/40' : 'text-slate-600 border-surface-border hover:text-brand-400'}`}>
                    {copied === `s${i}` ? <CheckCheck size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">{lang === 'ko' ? s.period_ko : s.period_en}</p>
              <p className="text-xs text-slate-600">{lang === 'ko' ? s.condition_ko : s.condition_en}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 육아휴직급여 */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
        <p className="text-sm font-bold text-blue-400 mb-3">{lang === 'ko' ? '👶 육아휴직급여 (12개월 기준)' : '👶 Parental Leave Pay (12 months)'}</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border border-blue-500/20 bg-[#1a1d27] p-2.5 text-center">
            <p className="text-xs text-slate-400">{lang === 'ko' ? '첫 3개월 (월급의 80%)' : 'First 3 months (80%)'}</p>
            <p className="text-lg font-bold text-blue-400 font-mono">₩{comma(first3Monthly)}/mo</p>
            <p className="text-xs text-slate-500">{lang === 'ko' ? '최대 250만원' : 'Max ₩2.5M'}</p>
          </div>
          <div className="rounded-lg border border-blue-500/20 bg-[#1a1d27] p-2.5 text-center">
            <p className="text-xs text-slate-400">{lang === 'ko' ? '이후 9개월 (월급의 50%)' : 'Next 9 months (50%)'}</p>
            <p className="text-lg font-bold text-blue-400 font-mono">₩{comma(rest9Monthly)}/mo</p>
            <p className="text-xs text-slate-500">{lang === 'ko' ? '최대 150만원' : 'Max ₩1.5M'}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-300">{lang === 'ko' ? '12개월 총 육아휴직급여' : 'Total 12-month Leave Pay'}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-400 font-mono">₩{comma(totalParentalLeave)}</span>
            <button onClick={() => copy(String(totalParentalLeave), 'pl')} className={`p-1.5 rounded border transition-all ${copied === 'pl' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'border-surface-border text-slate-500 hover:text-blue-400'}`}>
              {copied === 'pl' ? <CheckCheck size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      <ToolFooter
        toolName={lang === 'ko' ? '출산·육아 지원금 계산기' : 'Childbirth Subsidy Calculator'}
        toolUrl="https://keyword-mixer.vercel.app/childbirth-subsidy"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '출생 순서 선택', desc: '첫째, 둘째, 셋째 아이에 따라 지원금이 달라집니다.' },
          { step: '소득 입력', desc: '육아휴직급여 계산을 위해 현재 월 소득을 입력하세요.' },
          { step: '지원금 목록 확인', desc: '받을 수 있는 모든 지원금 목록과 금액을 확인하세요.' },
          { step: '육아휴직급여 확인', desc: '월급 기준으로 12개월간 받을 육아휴직급여를 확인하세요.' },
        ] : [
          { step: 'Select child order', desc: 'Subsidies differ for 1st, 2nd, and 3rd+ children.' },
          { step: 'Enter income', desc: 'Input monthly income for parental leave benefit calculation.' },
          { step: 'View subsidy list', desc: 'See all available subsidies and amounts.' },
          { step: 'Check leave pay', desc: 'View 12-month parental leave benefits based on your salary.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '2025년 최신 기준', desc: '2025년 기준 최신 부모급여, 아동수당, 첫만남이용권 금액을 반영합니다.' },
          { title: '8년 총계 계산', desc: '출생부터 만 8세까지 받을 수 있는 지원금 총액을 계산합니다.' },
          { title: '육아휴직급여 계산', desc: '본인 소득 기준으로 12개월 육아휴직급여를 정확히 계산합니다.' },
          { title: '출생 순서별 차등', desc: '첫째와 둘째 이상의 다른 지원금 기준을 적용합니다.' },
        ] : [
          { title: '2025 updated', desc: 'Reflects latest 2025 parent pay, child allowance, welcome package amounts.' },
          { title: '8-year total', desc: 'Calculates total subsidies from birth to age 8.' },
          { title: 'Leave pay calculation', desc: 'Accurately calculates 12-month parental leave based on your income.' },
          { title: 'Child order difference', desc: 'Applies different amounts for 1st child vs 2nd+ children.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '첫만남이용권이란?', a: '출생아 1인당 지급되는 바우처로, 육아용품·의료비 등에 사용할 수 있습니다. 2025년 기준 첫째 200만원, 둘째 이상 300만원입니다.' },
          { q: '부모급여란?', a: '2023년 도입된 영아 대상 현금 지원입니다. 2025년 기준 만 0세(0~11개월) 월 100만원, 만 1세(12~23개월) 월 50만원 지급합니다.' },
          { q: '육아휴직급여 신청 방법은?', a: '출산 후 회사에 육아휴직을 신청하고 고용보험 홈페이지에서 급여를 신청합니다. 고용보험에 가입된 근로자만 해당합니다.' },
          { q: '자영업자도 육아휴직급여를 받나요?', a: '아니요. 육아휴직급여는 고용보험 가입자만 해당합니다. 자영업자는 자녀돌봄특례 등 별도 지원을 확인하세요.' },
        ] : [
          { q: 'What is the Welcome Package?', a: 'A voucher for each newborn. Can be used for baby products, medical expenses, etc. ₩2M for 1st child, ₩3M for 2nd+ in 2025.' },
          { q: 'What is Parent Pay?', a: 'Cash support for infants introduced in 2023. ₩1M/month ages 0-11 months, ₩500K/month ages 12-23 months in 2025.' },
          { q: 'How to apply for parental leave?', a: 'Apply for leave from your employer, then apply for benefits on the Employment Insurance website. Employment insurance enrollment required.' },
          { q: 'Do self-employed get parental leave pay?', a: 'No. Parental leave benefits require employment insurance enrollment. Self-employed should check separate child-rearing support programs.' },
        ]}
        keywords="출산 지원금 계산기 · 2025 부모급여 · 아동수당 계산 · 첫만남이용권 · 육아휴직급여 계산 · 출산 혜택 총정리 · Korean childbirth subsidy · parental leave pay · 2025 baby bonus Korea"
      />
    </div>
  )
}
