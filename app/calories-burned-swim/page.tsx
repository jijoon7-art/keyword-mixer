import type { Metadata } from 'next'
import CaloriesBurnedSwim from '@/components/CaloriesBurnedSwim'
export const metadata: Metadata = {
  title: '수영 칼로리 소모 계산기 — 자유형 평영 접영 | Swimming Calories',
  description: '무료 수영 칼로리 계산기. 영법별 소모 칼로리와 다른 운동 비교. Free swimming calorie burn calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/calories-burned-swim' },
}
export default function Page() { return <CaloriesBurnedSwim /> }
