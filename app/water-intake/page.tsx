import type { Metadata } from 'next'
import WaterIntake from '@/components/WaterIntake'
export const metadata: Metadata = {
  title: '물 섭취량 계산기 — 하루 물 권장량 체중별 | Water Intake',
  description: '무료 물 섭취량 계산기. 체중·활동량·날씨로 하루 권장 물 섭취량 계산. Free daily water intake calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/water-intake' },
}
export default function Page() { return <WaterIntake /> }
