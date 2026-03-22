import type { Metadata } from 'next'
import CurrencyPremium from '@/components/CurrencyPremium'
export const metadata: Metadata = {
  title: '환전 우대율 계산기 — 실제 환전 금액 계산 | Exchange Calculator',
  description: '무료 환전 우대율 계산기. 은행·인터넷뱅킹·공항 우대율 비교. Free currency exchange discount calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/currency-premium' },
}
export default function Page() { return <CurrencyPremium /> }
