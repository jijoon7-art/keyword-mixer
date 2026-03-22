import type { Metadata } from 'next'
import StatisticsCalculator from '@/components/StatisticsCalculator'
export const metadata: Metadata = {
  title: '통계 계산기 — 평균·표준편차·중앙값 계산 | Statistics',
  description: '무료 통계 계산기. 평균·중앙값·표준편차·사분위수 등 15가지 통계값 즉시 계산. Free statistics calculator with mean, median, std deviation.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/statistics-calculator' },
}
export default function Page() { return <StatisticsCalculator /> }
