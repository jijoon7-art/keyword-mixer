import type { Metadata } from 'next'
import SavingsCalculator from '@/components/SavingsCalculator'
export const metadata: Metadata = {
  title: '적금 만기금액 계산기 — 적금 이자 계산 | Savings Calculator',
  description: '무료 적금 만기금액 계산기. 단리/복리 비교, 세후 이자 계산. Free savings maturity calculator with simple vs compound comparison.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/savings-calculator' },
}
export default function Page() { return <SavingsCalculator /> }
