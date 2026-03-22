import type { Metadata } from 'next'
import BloodSugarTracker from '@/components/BloodSugarTracker'
export const metadata: Metadata = {
  title: '혈당 기록/분석기 — 공복혈당 정상범위 | Blood Sugar',
  description: '무료 혈당 기록 분석기. 공복·식후혈당 WHO 기준 즉시 판정. Free blood sugar tracker with WHO glucose standards.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/blood-sugar-tracker' },
}
export default function Page() { return <BloodSugarTracker /> }
