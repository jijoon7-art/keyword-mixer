import type { Metadata } from 'next'
import MinimumWage from '@/components/MinimumWage'
export const metadata: Metadata = {
  title: '최저임금 계산기 — 2025 최저시급 주휴수당 월급 | Minimum Wage',
  description: '무료 최저임금 계산기. 2025 최저시급 10,030원 기준 주급·월급·연봉·주휴수당 계산. Free Korean minimum wage calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/minimum-wage' },
}
export default function Page() { return <MinimumWage /> }
