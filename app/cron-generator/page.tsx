import type { Metadata } from 'next'
import CronGenerator from '@/components/CronGenerator'
export const metadata: Metadata = {
  title: 'Cron 표현식 생성기 — 스케줄 자동화 | Cron Generator',
  description: '무료 Cron 표현식 생성기. 한국어 의미 설명, 10가지 프리셋. Free Cron expression generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/cron-generator' },
}
export default function Page() { return <CronGenerator /> }
