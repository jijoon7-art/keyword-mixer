import type { Metadata } from 'next'
import TimeCalculator from '@/components/TimeCalculator'
export const metadata: Metadata = {
  title: '시간 계산기 — 근무시간·시급·초과근무 계산 | Time Calculator',
  description: '무료 시간 계산기. 근무시간·시급·초과근무 자동 계산. 시간 더하기/빼기. Free work hours and time difference calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/time-calculator' },
}
export default function Page() { return <TimeCalculator /> }
