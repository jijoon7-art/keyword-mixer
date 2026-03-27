import type { Metadata } from 'next'
import BmiCalculatorPro from '@/components/BmiCalculatorPro'
export const metadata: Metadata = {
  title: 'BMI 계산기 Pro — 체지방률 BMR TDEE 체성분 분석 | BMI Pro',
  description: '무료 BMI 계산기 Pro. BMI·체지방률·기초대사량·일일 칼로리를 한번에 계산. Free BMI calculator with body fat BMR TDEE.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/bmi-calculator-pro' },
}
export default function Page() { return <BmiCalculatorPro /> }
