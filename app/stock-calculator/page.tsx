import type { Metadata } from 'next'
import StockCalculator from '@/components/StockCalculator'
export const metadata: Metadata = {
  title: '주식 수익률 계산기 — 매수 매도 수익 계산 | Stock Calculator',
  description: '무료 주식 수익률 계산기. 증권거래세·수수료 포함 실제 수익 계산. Free stock return calculator with tax and fees.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/stock-calculator' },
}
export default function Page() { return <StockCalculator /> }
