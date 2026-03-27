import type { Metadata } from 'next'
import AlcoholCalculator from '@/components/AlcoholCalculator'
export const metadata: Metadata = {
  title: '음주 계산기 혈중알코올농도 BAC — 음주운전 기준 | BAC Calculator',
  description: '무료 음주 계산기. BAC 혈중알코올농도 추정, 음주운전 판단, 술 깨는 시간 계산. Free blood alcohol content calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/alcohol-calculator' },
}
export default function Page() { return <AlcoholCalculator /> }
