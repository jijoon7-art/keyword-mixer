import type { Metadata } from 'next'
import AsciiArt from '@/components/AsciiArt'
export const metadata: Metadata = {
  title: 'ASCII 아트 생성기 — 텍스트 아트 변환 | ASCII Art Generator',
  description: '무료 ASCII 아트 생성기. 텍스트를 ASCII 아트로 즉시 변환. 4가지 스타일, 5가지 테두리. Free ASCII art generator with multiple font styles and border effects.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/ascii-art' },
}
export default function Page() { return <AsciiArt /> }
