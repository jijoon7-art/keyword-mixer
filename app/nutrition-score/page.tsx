import type { Metadata } from 'next'
import NutritionScore from '@/components/NutritionScore'
export const metadata: Metadata = {
  title: '영양 점수 계산기 — 식품 영양 등급 건강 점수 | Nutrition Score',
  description: '무료 영양 점수 계산기. 당류·나트륨·단백질로 식품 건강 등급 A~F 평가. Free food nutrition score calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/nutrition-score' },
}
export default function Page() { return <NutritionScore /> }
