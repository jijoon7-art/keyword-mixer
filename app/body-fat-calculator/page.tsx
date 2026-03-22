import type { Metadata } from 'next'
import BodyFatCalculator from '@/components/BodyFatCalculator'
export const metadata: Metadata = {
  title: '체지방률 계산기 — BMI·기초대사량·인바디 추정 | Body Fat',
  description: '무료 체지방률 계산기. 키·몸무게·나이로 체지방률·BMI·TDEE 즉시 계산. Free body fat percentage calculator with BMI and BMR.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/body-fat-calculator' },
}
export default function Page() { return <BodyFatCalculator /> }
