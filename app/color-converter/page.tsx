import type { Metadata } from 'next'
import ColorConverter from '@/components/ColorConverter'
export const metadata: Metadata = {
  title: '색상 코드 변환기 — 무료 HEX RGB HSL 색상 변환 도구',
  description: '무료 색상 코드 변환기. HEX·RGB·HSL·RGBA 즉시 변환. CSS 변수, Tailwind 형식 지원. 컬러 피커, RGB 슬라이더, 프리셋 색상 제공.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/color-converter' },
}
export default function Page() { return <ColorConverter /> }
