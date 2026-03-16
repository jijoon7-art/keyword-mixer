import type { Metadata } from 'next'
import TimerStopwatch from '@/components/TimerStopwatch'
export const metadata: Metadata = {
  title: '타이머 · 스톱워치 — 포모도로 타이머 | Online Timer',
  description: '무료 온라인 타이머. Free online timer, stopwatch, and Pomodoro timer. Countdown timer with lap recording for study, cooking, and exercise.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/timer' },
}
export default function Page() { return <TimerStopwatch /> }
