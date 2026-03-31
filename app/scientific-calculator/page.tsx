import type { Metadata } from 'next'
import ScientificCalculator from '@/components/ScientificCalculator'
export const metadata: Metadata = {
  title: '공학용 계산기 — 삼각함수 로그 지수 온라인 | Scientific',
  description: '무료 온라인 공학용 계산기. sin·cos·tan·log·ln·팩토리얼 지원. Free online scientific calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/scientific-calculator' },
}
export default function Page() { return <ScientificCalculator /> }
