import type { Metadata } from 'next'
import SplitCalculator from '@/components/SplitCalculator'
export const metadata: Metadata = {
  title: '비율 분할 계산기 — 금액 나누기 수익 배분 | Split Calculator',
  description: '무료 비율 분할 계산기. 균등 분할·비율 분할. 공동사업 수익 배분. Free money split calculator for profit sharing.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/split-calculator' },
}
export default function Page() { return <SplitCalculator /> }
