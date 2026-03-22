import type { Metadata } from 'next'
import CountdownCreator from '@/components/CountdownCreator'
export const metadata: Metadata = {
  title: '카운트다운 D-day 생성기 — 날짜 카운터 | Countdown Creator',
  description: '무료 카운트다운 생성기. 여러 D-day를 동시에 관리. 실시간 카운트다운. Free countdown and D-day creator with multiple events.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/countdown-creator' },
}
export default function Page() { return <CountdownCreator /> }
