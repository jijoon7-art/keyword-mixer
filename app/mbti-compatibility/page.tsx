import type { Metadata } from 'next'
import MbtiCompatibility from '@/components/MbtiCompatibility'
export const metadata: Metadata = {
  title: 'MBTI 궁합 계산기 — 황금 궁합 유형 분석 | MBTI Compatibility',
  description: '무료 MBTI 궁합 계산기. 16가지 유형별 궁합 점수와 황금 궁합 분석. Free MBTI compatibility calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/mbti-compatibility' },
}
export default function Page() { return <MbtiCompatibility /> }
