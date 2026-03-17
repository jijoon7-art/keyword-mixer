import type { Metadata } from 'next'
import InterestCalculator from '@/components/InterestCalculator'
export const metadata: Metadata = {
  title: '이자 계산기 — 예금·적금·대출 이자 계산 | Interest Calculator',
  description: '무료 이자 계산기. 예금·적금·대출 이자 즉시 계산. 세후 수익, 복리 계산. Free savings and loan interest calculator with Korean tax calculation.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/interest-calculator' },
}
export default function Page() { return <InterestCalculator /> }
