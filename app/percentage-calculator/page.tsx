import type { Metadata } from 'next'
import PercentageCalculator from '@/components/PercentageCalculator'
export const metadata: Metadata = {
  title: '퍼센트 계산기 — 할인율·변화율·비율 계산 | Percentage Calculator',
  description: '무료 퍼센트 계산기. X의 Y%, 변화율, 할인가 4가지 모드. Free percentage calculator with discount, ratio, and percent change.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/percentage-calculator' },
}
export default function Page() { return <PercentageCalculator /> }
