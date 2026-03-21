import type { Metadata } from 'next'
import DateCalculator from '@/components/DateCalculator'
export const metadata: Metadata = {
  title: '날짜 계산기 — 두 날짜 사이 일수 · 날짜 더하기 | Date Calculator',
  description: '무료 날짜 계산기. 두 날짜 사이 일수 계산, 날짜 더하기/빼기. Free date calculator - days between dates, add subtract days.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/date-calculator' },
}
export default function Page() { return <DateCalculator /> }
