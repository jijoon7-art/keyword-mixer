import type { Metadata } from 'next'
import ReadingSpeed from '@/components/ReadingSpeed'
export const metadata: Metadata = {
  title: '독서 속도 완독 시간 계산기 — WPM 책 읽기 시간 | Reading Speed',
  description: '무료 독서 속도 계산기. WPM으로 완독 예상 시간과 하루 독서 계획 계산. Free reading speed and book completion time calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/reading-speed' },
}
export default function Page() { return <ReadingSpeed /> }
