import type { Metadata } from 'next'
import GasCalculator from '@/components/GasCalculator'
export const metadata: Metadata = {
  title: '가스요금 계산기 — 월 도시가스 요금 계산 | Gas Bill Calculator',
  description: '무료 가스요금 계산기. 월 사용량으로 주택용·업소용 가스요금 추정. Free Korean gas bill calculator with seasonal rates.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/gas-calculator' },
}
export default function Page() { return <GasCalculator /> }
