import type { Metadata } from 'next'
import SubscriptionCalculator from '@/components/SubscriptionCalculator'
export const metadata: Metadata = {
  title: '청약 가점 계산기 — 아파트 청약 점수 계산 | Subscription Score',
  description: '무료 청약 가점 계산기. 무주택기간·부양가족·청약통장 점수 자동계산. Free Korean apartment subscription score calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/subscription-calculator' },
}
export default function Page() { return <SubscriptionCalculator /> }
