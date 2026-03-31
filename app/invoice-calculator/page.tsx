import type { Metadata } from 'next'
import InvoiceCalculator from '@/components/InvoiceCalculator'
export const metadata: Metadata = {
  title: '프리랜서 견적서 계산기 — 원천징수 부가세 실수령액 | Invoice',
  description: '무료 프리랜서 견적서 계산기. 원천징수 3.3%·부가세 10% 자동 계산. Free freelancer invoice calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/invoice-calculator' },
}
export default function Page() { return <InvoiceCalculator /> }
