import type { Metadata } from 'next'
import Biorhythm from '@/components/Biorhythm'
export const metadata: Metadata = {
  title: '바이오리듬 계산기 — 신체 감성 지성 오늘 바이오리듬 | Biorhythm',
  description: '무료 바이오리듬 계산기. 생년월일로 신체·감성·지성·직관 바이오리듬 계산. Free biorhythm calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/biorhythm' },
}
export default function Page() { return <Biorhythm /> }
