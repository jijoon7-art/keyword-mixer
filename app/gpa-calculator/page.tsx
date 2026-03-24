import type { Metadata } from 'next'
import GpaCalculator from '@/components/GpaCalculator'
export const metadata: Metadata = {
  title: '학점 계산기 GPA — 대학교 성적 평균 계산 | GPA Calculator',
  description: '무료 학점 계산기. 4.5/4.3/4.0 만점 GPA 자동계산. 목표 학점 시뮬레이터 포함. Free GPA calculator with target GPA simulator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/gpa-calculator' },
}
export default function Page() { return <GpaCalculator /> }
