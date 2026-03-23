import type { Metadata } from 'next'
import RealEstateTax from '@/components/RealEstateTax'
export const metadata: Metadata = {
  title: '부동산 취득세 계산기 — 아파트 취득세 중과세 | Acquisition Tax',
  description: '무료 부동산 취득세 계산기. 주택 수별 세율, 조정지역 중과세 자동 적용. Free Korean real estate acquisition tax calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/real-estate-tax' },
}
export default function Page() { return <RealEstateTax /> }
