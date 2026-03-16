import type { Metadata } from 'next'
import ExchangeRate from '@/components/ExchangeRate'
export const metadata: Metadata = {
  title: '환율 계산기 — 실시간 달러·엔·유로·위안 환율 변환',
  description: '무료 실시간 환율 계산기. 달러·엔·유로·위안 등 15개 통화 즉시 변환. 오늘 환율 조회, 주요 통화 환율표 제공.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/exchange-rate' },
}
export default function Page() { return <ExchangeRate /> }
