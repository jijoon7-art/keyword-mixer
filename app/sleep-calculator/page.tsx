import type { Metadata } from 'next'
import SleepCalculator from '@/components/SleepCalculator'
export const metadata: Metadata = {
  title: '수면 계산기 — 취침 기상 최적 시간 계산 | Sleep Calculator',
  description: '무료 수면 계산기. 90분 수면 사이클 기반 최적 기상 시간 추천. Free sleep cycle calculator for optimal wake times.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/sleep-calculator' },
}
export default function Page() { return <SleepCalculator /> }
