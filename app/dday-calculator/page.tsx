import type { Metadata } from 'next'
import DdayCalculator from '@/components/DdayCalculator'
export const metadata: Metadata = {
  title: 'D-day 계산기 — 디데이 계산기 · 날짜 차이 계산 · 무료',
  description: '무료 D-day 계산기. 중요한 날까지 남은 날수 계산. 여러 D-day 동시 관리, 두 날짜 사이 계산, 수능·생일·기념일 디데이.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/dday-calculator' },
}
export default function Page() { return <DdayCalculator /> }
