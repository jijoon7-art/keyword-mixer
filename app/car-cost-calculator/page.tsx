import type { Metadata } from 'next'
import CarCostCalculator from '@/components/CarCostCalculator'
export const metadata: Metadata = {
  title: '자동차 유지비 계산기 — 월 차량 유지비 | Car Cost Calculator',
  description: '무료 자동차 유지비 계산기. 유류비·보험·주차·감가상각 포함 월 총비용. Free car ownership cost calculator with all expenses.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/car-cost-calculator' },
}
export default function Page() { return <CarCostCalculator /> }
