import type { Metadata } from 'next'
import LoanRepaymentTable from '@/components/LoanRepaymentTable'
export const metadata: Metadata = {
  title: '대출 상환표 생성기 — 원리금균등·원금균등 계산 | Loan Schedule',
  description: '무료 대출 상환표 생성기. 원리금균등·원금균등·만기일시 월별 상환 일정 자동 생성. Free loan amortization table generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/loan-repayment-table' },
}
export default function Page() { return <LoanRepaymentTable /> }
