import type { Metadata } from 'next'
import FuelCost from '@/components/FuelCost'
export const metadata: Metadata = {
  title: '연료비 계산기 — 기름값 유류비 전기차 비교 | Fuel Cost',
  description: '무료 연료비 계산기. 휘발유·경유·LPG·전기차 비용 비교. 주유 예산 계획. Free fuel cost calculator with EV comparison.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/fuel-cost' },
}
export default function Page() { return <FuelCost /> }
