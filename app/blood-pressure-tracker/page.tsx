import type { Metadata } from 'next'
import BloodPressureTracker from '@/components/BloodPressureTracker'
export const metadata: Metadata = {
  title: '혈압 기록/분석기 — 혈압 정상 범위 확인 | Blood Pressure',
  description: '무료 혈압 기록 분석기. WHO 기준 혈압 상태 즉시 판정. 평균 혈압 계산. Free blood pressure tracker with WHO classification.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/blood-pressure-tracker' },
}
export default function Page() { return <BloodPressureTracker /> }
