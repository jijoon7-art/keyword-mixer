import type { Metadata } from 'next'
import TimerStopwatch from '@/components/TimerStopwatch'
export const metadata: Metadata = {
  title: '타이머 · 스톱워치 — 무료 온라인 카운트다운 · 포모도로',
  description: '무료 온라인 타이머·스톱워치·포모도로 타이머. 랩 기록, 프리셋 지원. 공부·요리·운동 타이머로 활용.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/timer' },
}
export default function Page() { return <TimerStopwatch /> }
