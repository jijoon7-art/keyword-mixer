import type { Metadata } from 'next'
import UnitPriceCalculator from '@/components/UnitPriceCalculator'
export const metadata: Metadata = {
  title: '단가 계산기 가성비 비교 — 단위당 가격 최저가 | Unit Price',
  description: '무료 단가 계산기. 여러 상품의 단위당 가격 비교해 최저가 찾기. Free unit price calculator for grocery comparison.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/unit-price-calculator' },
}
export default function Page() { return <UnitPriceCalculator /> }
