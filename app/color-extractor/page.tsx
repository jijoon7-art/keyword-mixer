import type { Metadata } from 'next'
import ColorExtractor from '@/components/ColorExtractor'
export const metadata: Metadata = {
  title: '이미지 색상 추출기 — 사진에서 팔레트 추출 | Color Extractor',
  description: '무료 이미지 색상 추출기. 이미지에서 주요 색상 자동 추출. HEX·RGB·HSL 코드 복사. Free image color extractor and palette generator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/color-extractor' },
}
export default function Page() { return <ColorExtractor /> }
