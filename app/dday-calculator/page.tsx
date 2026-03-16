import type { Metadata } from 'next'
import DdayCalculator from '@/components/DdayCalculator'
export const metadata: Metadata = {
  title: 'D-day 계산기 — 디데이 계산 · Date Countdown Calculator',
  description: '무료 D-day 계산기. Free D-day counter and date difference calculator. Count days until any event - exam, birthday, anniversary, vacation.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/dday-calculator' },
}
export default function Page() { return <DdayCalculator /> }
