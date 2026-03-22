import type { Metadata } from 'next'
import CompoundInterest from '@/components/CompoundInterest'
export const metadata: Metadata = {
  title: '복리 계산기 — 투자 수익 시뮬레이션 | Compound Interest',
  description: '무료 복리 계산기. 복리 투자 수익 시뮬레이션. 단리 vs 복리 비교, 연도별 자산 성장 그래프. Free compound interest investment calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/compound-interest' },
}
export default function Page() { return <CompoundInterest /> }
