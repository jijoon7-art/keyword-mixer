import type { Metadata } from 'next'
import BabyDevelopment from '@/components/BabyDevelopment'
export const metadata: Metadata = {
  title: '태아 발달 주수 계산기 — 임신 주수 출산 예정일 | Pregnancy Calculator',
  description: '무료 태아 발달 주수 계산기. 임신 주수·예정일·주차별 태아 크기. Free pregnancy week and fetal development calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/baby-development' },
}
export default function Page() { return <BabyDevelopment /> }
