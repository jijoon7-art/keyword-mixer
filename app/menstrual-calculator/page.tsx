import type { Metadata } from 'next'
import MenstrualCalculator from '@/components/MenstrualCalculator'
export const metadata: Metadata = {
  title: '생리주기 계산기 — 다음 생리일 배란일 계산 | Period Calculator',
  description: '무료 생리주기 계산기. 다음 생리일·배란일·가임기 자동 계산. 3개월 예측. Free menstrual cycle calculator with ovulation and fertile window.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/menstrual-calculator' },
}
export default function Page() { return <MenstrualCalculator /> }
