import type { Metadata } from 'next'
import LoanComparison from '@/components/LoanComparison'
export const metadata: Metadata = {
  title: '대출 비교 계산기 — 여러 대출 상품 금리 비교 | Loan Comparison',
  description: '무료 대출 비교 계산기. 최대 5개 상품 동시 비교. 원리금균등·원금균등·이자만 방식별 총이자 비교. Free loan comparison calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/loan-comparison' },
}
export default function Page() { return <LoanComparison /> }
