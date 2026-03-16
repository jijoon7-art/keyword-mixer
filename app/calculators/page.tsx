import type { Metadata } from 'next'
import Calculators from '@/components/Calculators'
export const metadata: Metadata = {
  title: '계산기 모음 — 무료 대출·BMI·칼로리·세금 계산기',
  description: '무료 계산기 모음. 대출 월상환금, BMI 체질량지수, 일일 칼로리(기초대사량), 소득세 계산. 슬라이더로 즉시 계산.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/calculators' },
}
export default function Page() { return <Calculators /> }
