import type { Metadata } from 'next'
import TimezoneMeeting from '@/components/TimezoneMeeting'
export const metadata: Metadata = {
  title: '국제 미팅 시간 조율기 — 세계 시간대 화상회의 | Meeting Time',
  description: '무료 국제 미팅 시간 조율기. 여러 나라 업무시간 겹치는 최적 시간 자동 계산. Free international meeting time finder.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/timezone-meeting' },
}
export default function Page() { return <TimezoneMeeting /> }
