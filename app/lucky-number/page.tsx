import type { Metadata } from 'next'
import LuckyNumber from '@/components/LuckyNumber'
export const metadata: Metadata = {
  title: '행운 번호 생성기 — 수비학 인생번호 운명번호 | Lucky Number',
  description: '무료 행운 번호 생성기. 수비학으로 인생·운명·오늘의 행운 번호 계산. Free numerology lucky number generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/lucky-number' },
}
export default function Page() { return <LuckyNumber /> }
