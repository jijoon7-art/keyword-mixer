import type { Metadata } from 'next'
import ChildbirthSubsidy from '@/components/ChildbirthSubsidy'
export const metadata: Metadata = {
  title: '출산 육아 지원금 계산기 — 2025 부모급여 아동수당 | Baby Subsidy',
  description: '무료 2025 출산·육아 지원금 계산기. 부모급여·아동수당·첫만남이용권·육아휴직급여 총액. Free childbirth subsidy calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/childbirth-subsidy' },
}
export default function Page() { return <ChildbirthSubsidy /> }
