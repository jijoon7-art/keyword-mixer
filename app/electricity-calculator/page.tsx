import type { Metadata } from 'next'
import ElectricityCalculator from '@/components/ElectricityCalculator'
export const metadata: Metadata = {
  title: '전기요금 계산기 — 누진세 포함 월 전기세 계산 | Electricity Bill',
  description: '무료 전기요금 계산기. 가전제품별 사용량으로 누진세 포함 월 전기요금 추정. Free electricity bill calculator with progressive rates.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/electricity-calculator' },
}
export default function Page() { return <ElectricityCalculator /> }
