import type { Metadata } from 'next'
import TaxCalculator from '@/components/TaxCalculator'
export const metadata: Metadata = {
  title: '세금 계산기 — 부가세·소득세·4대보험 계산 | Tax Calculator',
  description: '무료 세금 계산기. 부가세·소득세·종합소득세·4대보험 한번에 계산. 2024년 최신 세율. Free Korean tax calculator - VAT, income tax, social insurance.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/tax-calculator' },
}
export default function Page() { return <TaxCalculator /> }
