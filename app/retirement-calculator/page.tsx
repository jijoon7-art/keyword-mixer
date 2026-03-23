import type { Metadata } from 'next'
import RetirementCalculator from '@/components/RetirementCalculator'
export const metadata: Metadata = {
  title: '은퇴 계획 계산기 — 노후 자금 은퇴 준비도 | Retirement',
  description: '무료 은퇴 계획 계산기. 은퇴 목표 자산, 국민연금 반영, 준비도 계산. Free retirement planning calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/retirement-calculator' },
}
export default function Page() { return <RetirementCalculator /> }
