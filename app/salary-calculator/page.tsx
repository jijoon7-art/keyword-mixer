import type { Metadata } from 'next'
import SalaryCalculator from '@/components/SalaryCalculator'
export const metadata: Metadata = {
  title: '월급 실수령액 계산기 — 연봉 세후 금액 | Net Salary',
  description: '무료 월급 실수령액 계산기. 연봉·월급에서 4대보험·소득세 공제 후 실수령액 즉시 계산. Free Korean net salary calculator after tax deductions.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/salary-calculator' },
}
export default function Page() { return <SalaryCalculator /> }
