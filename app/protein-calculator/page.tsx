import type { Metadata } from 'next'
import ProteinCalculator from '@/components/ProteinCalculator'
export const metadata: Metadata = {
  title: '단백질 섭취량 계산기 — 하루 단백질 권장량 | Protein Calculator',
  description: '무료 단백질 섭취량 계산기. 체중·목표별 하루 권장 단백질. Free daily protein intake calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/protein-calculator' },
}
export default function Page() { return <ProteinCalculator /> }
