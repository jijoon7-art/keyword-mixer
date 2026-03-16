import type { Metadata } from 'next'
import Calculators from '@/components/Calculators'
export const metadata: Metadata = {
  title: '계산기 모음 — 대출·BMI·칼로리·세금 | Calculator Suite',
  description: '무료 계산기 모음. Free online calculators - loan payment, BMI, daily calorie needs (TDEE), and income tax calculator for Korea.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/calculators' },
}
export default function Page() { return <Calculators /> }
