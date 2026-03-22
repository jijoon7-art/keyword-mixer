import type { Metadata } from 'next'
import NutritionCalculator from '@/components/NutritionCalculator'
export const metadata: Metadata = {
  title: '영양소 계산기 — 탄단지 계산 · 다이어트 식단 | Nutrition',
  description: '무료 영양소 계산기. 목표 칼로리에 맞는 탄단지 계산. 다이어트·근성장 맞춤. Free macro and nutrition calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/nutrition-calculator' },
}
export default function Page() { return <NutritionCalculator /> }
