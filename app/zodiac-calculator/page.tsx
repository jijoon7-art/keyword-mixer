import type { Metadata } from 'next'
import ZodiacCalculator from '@/components/ZodiacCalculator'
export const metadata: Metadata = {
  title: '띠 별자리 계산기 — 생년월일 띠 운세 | Zodiac Star Sign',
  description: '무료 띠·별자리 계산기. 생년월일로 12간지 띠·별자리·사주연주·오행 즉시 계산. Free zodiac and star sign calculator.',
  alternates: { canonical: 'https://keyword-mixer.vercel.app/zodiac-calculator' },
}
export default function Page() { return <ZodiacCalculator /> }
