import type { Metadata } from 'next'
import TypingSpeed from '@/components/TypingSpeed'
export const metadata: Metadata = {
  title: '타이핑 속도 측정기 — WPM 타자 속도 테스트 | Typing Speed Test',
  description: '무료 타이핑 속도 측정. WPM·정확도·CPM 실시간 측정. 한국어·영어 지원. Free online typing speed test with WPM counter. Korean and English supported.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/typing-speed' },
}
export default function Page() { return <TypingSpeed /> }
