import type { Metadata } from 'next'
import InvoiceGenerator from '@/components/InvoiceGenerator'
export const metadata: Metadata = {
  title: '견적서·영수증 생성기 — 무료 견적서 만들기 | Quote Generator',
  description: '무료 견적서·영수증 생성기. 부가세 자동계산, 인쇄/PDF 저장. Free quote and receipt generator with auto VAT calculation.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/invoice-generator' },
}
export default function Page() { return <InvoiceGenerator /> }
