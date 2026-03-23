import type { Metadata } from 'next'
import LoveCalculator from '@/components/LoveCalculator'
export const metadata: Metadata = {
  title: '궁합 계산기 커플 테스트 — 이름 생년월일 궁합 | Love Calculator',
  description: '무료 궁합 계산기. 이름·생년월일·혈액형으로 궁합 점수 계산. Free love compatibility calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/love-calculator' },
}
export default function Page() { return <LoveCalculator /> }
