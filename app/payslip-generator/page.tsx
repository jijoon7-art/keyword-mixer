import type { Metadata } from 'next'
import PayslipGenerator from '@/components/PayslipGenerator'
export const metadata: Metadata = {
  title: '급여명세서 생성기 — 무료 임금명세서 만들기 | Pay Slip Generator',
  description: '무료 급여명세서 생성기. 4대보험·소득세 자동계산, 인쇄/복사 지원. Free pay slip generator with auto social insurance calculation.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/payslip-generator' },
}
export default function Page() { return <PayslipGenerator /> }
