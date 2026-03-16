import type { Metadata } from 'next'
import TimezoneConverter from '@/components/TimezoneConverter'
export const metadata: Metadata = {
  title: '타임존 변환기 — 무료 세계 시간 변환 · 세계시계',
  description: '무료 타임존 변환기. 서울·뉴욕·런던·도쿄 등 세계 주요 도시 시간을 한눈에 비교. 특정 시간을 여러 타임존으로 즉시 변환.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/timezone-converter' },
}
export default function Page() { return <TimezoneConverter /> }
