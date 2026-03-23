import type { Metadata } from 'next'
import MeetingCost from '@/components/MeetingCost'
export const metadata: Metadata = {
  title: '회의비용 계산기 — 실시간 회의 비용 타이머 | Meeting Cost',
  description: '무료 회의비용 계산기. 실시간으로 올라가는 회의 비용 시각화. Free real-time meeting cost calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/meeting-cost' },
}
export default function Page() { return <MeetingCost /> }
