import type { Metadata } from 'next'
import AspectRatio from '@/components/AspectRatio'
export const metadata: Metadata = {
  title: '화면 비율 계산기 — 해상도 비율 변환 16:9 | Aspect Ratio',
  description: '무료 화면 비율 계산기. 해상도↔비율 변환, 16:9 4:3 계산. Free aspect ratio calculator with resolution converter.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/aspect-ratio' },
}
export default function Page() { return <AspectRatio /> }
