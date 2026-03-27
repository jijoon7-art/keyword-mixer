import type { Metadata } from 'next'
import InvestmentReturn from '@/components/InvestmentReturn'
export const metadata: Metadata = {
  title: '투자 수익률 계산기 — 복리 CAGR 72의법칙 | Investment Return',
  description: '무료 투자 수익률 계산기. 복리·CAGR·72의 법칙·물가상승률 반영 실질 수익률. Free compound interest and CAGR calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/investment-return' },
}
export default function Page() { return <InvestmentReturn /> }
