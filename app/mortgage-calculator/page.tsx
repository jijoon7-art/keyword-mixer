import type { Metadata } from 'next'
import MortgageCalculator from '@/components/MortgageCalculator'
export const metadata: Metadata = {
  title: '주택담보대출 계산기 — 월 상환액 LTV DSR 대출한도 | Mortgage',
  description: '무료 주택담보대출 계산기. 월 상환액·총 이자·LTV 한도·DSR 40% 계산. Free Korean mortgage calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/mortgage-calculator' },
}
export default function Page() { return <MortgageCalculator /> }
