import type { Metadata } from 'next'
import TaxRefund from '@/components/TaxRefund'
export const metadata: Metadata = {
  title: '연말정산 환급액 계산기 — 세금 환급 계산 | Tax Refund',
  description: '무료 연말정산 계산기. 급여·공제 항목으로 예상 환급액 계산. Free Korean year-end tax settlement calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/tax-refund' },
}
export default function Page() { return <TaxRefund /> }
