import type { Metadata } from 'next'
import AgeCalculator from '@/components/AgeCalculator'
export const metadata: Metadata = {
  title: '나이 계산기 — 만 나이·한국 나이 계산 | Age Calculator',
  description: '무료 나이 계산기. 만 나이·한국 나이 즉시 계산. Free age calculator - calculate your exact age, Korean age, zodiac sign, and next birthday countdown.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/age-calculator' },
}
export default function Page() { return <AgeCalculator /> }
