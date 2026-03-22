import type { Metadata } from 'next'
import MorseCode from '@/components/MorseCode'
export const metadata: Metadata = {
  title: '모스부호 변환기 — 텍스트 모스코드 변환 소리 재생 | Morse Code',
  description: '무료 모스부호 변환기. 텍스트↔모스부호 변환, 소리 재생. Free Morse code converter with audio playback.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/morse-code' },
}
export default function Page() { return <MorseCode /> }
