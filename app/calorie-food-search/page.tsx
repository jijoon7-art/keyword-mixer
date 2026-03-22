import type { Metadata } from 'next'
import CalorieFoodSearch from '@/components/CalorieFoodSearch'
export const metadata: Metadata = {
  title: '음식 칼로리 검색기 — 한국 음식 칼로리 표 | Calorie Search',
  description: '무료 음식 칼로리 검색기. 30가지 한국 음식 칼로리 즉시 검색. 일일 칼로리 합산 계산. Free Korean food calorie search and daily tracker.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/calorie-food-search' },
}
export default function Page() { return <CalorieFoodSearch /> }
