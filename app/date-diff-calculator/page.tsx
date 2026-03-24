import type { Metadata } from 'next'
import DateDiffCalculator from '@/components/DateDiffCalculator'
export const metadata: Metadata = {
  title: '날짜 계산기 Pro — 두 날짜 사이 일수 근무일 계산 | Date Calculator',
  description: '무료 날짜 계산기. 두 날짜 사이 일수, 근무일, 날짜 더하기/빼기. Free date difference and workday calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/date-diff-calculator' },
}
export default function Page() { return <DateDiffCalculator /> }
