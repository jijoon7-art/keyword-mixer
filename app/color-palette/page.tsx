import type { Metadata } from 'next'
import ColorPalette from '@/components/ColorPalette'
export const metadata: Metadata = {
  title: '색상 팔레트 생성기 — 컬러 조합 추천 | Color Palette Generator',
  description: '무료 색상 팔레트 생성기. 유사색·보색·모노크롬 등 8가지 조화 방식. CSS 내보내기 지원. Free color palette generator with 8 harmony modes.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/color-palette' },
}
export default function Page() { return <ColorPalette /> }
