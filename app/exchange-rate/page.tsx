import type { Metadata } from 'next'
import ExchangeRate from '@/components/ExchangeRate'
export const metadata: Metadata = {
  title: '환율 계산기 — 실시간 환율 변환 | Currency Converter',
  description: '실시간 환율 계산기. Free real-time currency converter - USD, EUR, JPY, CNY to KRW. Live exchange rates for 15 major currencies.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/exchange-rate' },
}
export default function Page() { return <ExchangeRate /> }
