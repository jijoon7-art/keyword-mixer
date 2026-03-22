import type { Metadata } from 'next'
import StepsCalorie from '@/components/StepsCalorie'
export const metadata: Metadata = {
  title: '만보기 / 걸음수 칼로리 계산기 — 만보 효과 | Steps Calorie',
  description: '무료 만보기 칼로리 계산기. 걸음수로 칼로리·거리·시간 계산. 일일 목표 달성률. Free steps calorie calculator with distance and goal tracking.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/steps-calorie' },
}
export default function Page() { return <StepsCalorie /> }
