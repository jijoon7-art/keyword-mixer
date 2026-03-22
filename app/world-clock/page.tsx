import type { Metadata } from 'next'
import WorldClock from '@/components/WorldClock'
export const metadata: Metadata = {
  title: '세계 시계 — 세계 시간 확인 타임존 비교 | World Clock',
  description: '무료 세계 시계. 전 세계 주요 도시 현재 시각 실시간 확인. 업무시간 비교. Free live world clock with business hours comparison.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/world-clock' },
}
export default function Page() { return <WorldClock /> }
