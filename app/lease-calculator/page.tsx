import type { Metadata } from 'next'
import LeaseCalculator from '@/components/LeaseCalculator'
export const metadata: Metadata = {
  title: '전세자금대출 계산기 — 전세 이자 HUG HF 보증한도 | Jeonse',
  description: '무료 전세자금대출 계산기. 월 이자·총 이자·HUG/HF 보증 한도 계산. Free Korean jeonse loan calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/lease-calculator' },
}
export default function Page() { return <LeaseCalculator /> }
