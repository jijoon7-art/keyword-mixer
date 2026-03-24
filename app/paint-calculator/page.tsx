import type { Metadata } from 'next'
import PaintCalculator from '@/components/PaintCalculator'
export const metadata: Metadata = {
  title: '페인트 도배 계산기 — 필요 페인트 양 도배지 롤 수 | Paint Calculator',
  description: '무료 페인트/도배 계산기. 방 크기로 필요한 페인트 양과 도배지 롤 수 계산. Free paint and wallpaper calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/paint-calculator' },
}
export default function Page() { return <PaintCalculator /> }
