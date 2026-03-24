import type { Metadata } from 'next'
import ConcreteCalculator from '@/components/ConcreteCalculator'
export const metadata: Metadata = {
  title: '콘크리트 시멘트 계산기 — 자재 양 계산 | Concrete Calculator',
  description: '무료 콘크리트 계산기. 면적·두께로 시멘트·모래·자갈 필요량 계산. Free concrete and cement material calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/concrete-calculator' },
}
export default function Page() { return <ConcreteCalculator /> }
