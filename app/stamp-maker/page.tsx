import type { Metadata } from 'next'
import StampMaker from '@/components/StampMaker'
export const metadata: Metadata = {
  title: '도장 만들기 온라인 무료 — 인감 도장 생성기 PNG | Stamp Maker',
  description: '무료 온라인 도장 만들기. 원형·사각·타원 도장을 PNG로 즉시 다운로드. 한글 이름 최적화. Free Korean stamp maker online.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/stamp-maker' },
}
export default function Page() { return <StampMaker /> }
