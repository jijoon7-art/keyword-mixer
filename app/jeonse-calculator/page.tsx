import type { Metadata } from 'next'
import JeonseCalculator from '@/components/JeonseCalculator'
export const metadata: Metadata = {
  title: '전월세 계산기 — 전세 월세 변환 | Jeonse Calculator',
  description: '무료 전월세 계산기. 전세↔월세 변환, 전세자금대출 이자 계산. Free Korean Jeonse to monthly rent converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/jeonse-calculator' },
}
export default function Page() { return <JeonseCalculator /> }
